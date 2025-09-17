<?php

namespace App\Services;

use App\Repositories\ResourceRepository;
use App\Services\AuditLogger;
use Psr\Http\Message\UploadedFileInterface;
use Qcloud\Cos\Client as CosClient;
use RuntimeException;
use Throwable;

class ResourceService
{
    public function __construct(
        private readonly ResourceRepository $resources,
        private readonly CosClient $cosClient,
        private readonly AuditLogger $auditLogger,
        private readonly array $cosSettings
    ) {
    }

    public function upload(int $userId, UploadedFileInterface $file, array $payload): int
    {
        if ($file->getError() !== UPLOAD_ERR_OK) {
            throw new RuntimeException('File upload failed');
        }

        $originalName = $file->getClientFilename() ?? 'upload.bin';
        $safeName = preg_replace('/[^A-Za-z0-9_\.-]/', '_', $originalName);
        $cosKey = sprintf('resources/%d/%d-%s', $userId, time(), $safeName);

        $stream = $file->getStream();
        $stream->rewind();
        $contents = $stream->getContents();
        $size = $file->getSize();

        try {
            $this->cosClient->putObject([
                'Bucket' => $this->cosSettings['bucket'],
                'Key' => $cosKey,
                'Body' => $contents,
                'ContentType' => $file->getClientMediaType() ?? 'application/octet-stream',
            ]);
        } catch (Throwable $exception) {
            $this->auditLogger->logAction($userId, 'resource.upload_failed', [
                'filename' => $originalName,
                'error' => $exception->getMessage(),
                'size' => $size,
            ], 'resource');
            throw new RuntimeException('Failed to store resource file');
        }

        $resourceId = $this->resources->create([
            'uploader_id' => $userId,
            'title' => $payload['title'] ?? $safeName,
            'description' => $payload['description'] ?? '',
            'cos_key' => $cosKey,
            'original_filename' => $originalName,
        ]);

        $this->auditLogger->logAction($userId, 'resource.uploaded', [
            'resource_id' => $resourceId,
            'filename' => $originalName,
            'size' => $size,
        ], 'resource', $resourceId);

        return $resourceId;
    }

    public function listPublic(): array
    {
        return $this->resources->listApproved();
    }

    public function listPending(): array
    {
        return $this->resources->listPending();
    }

    public function listForUser(int $userId): array
    {
        return $this->resources->listForUser($userId);
    }

    public function approve(int $resourceId, int $reviewerId): void
    {
        $resource = $this->resources->findById($resourceId);
        if (!$resource) {
            throw new RuntimeException('Resource not found');
        }

        if ($resource['status'] === 'approved') {
            return;
        }

        if (!$this->resources->updateStatus($resourceId, 'approved', $reviewerId)) {
            throw new RuntimeException('Failed to update resource');
        }

        $this->auditLogger->logAction($reviewerId, 'resource.approved', [
            'resource_id' => $resourceId,
            'previous_status' => $resource['status'],
            'uploader_id' => $resource['uploader_id'] ?? null,
        ], 'resource', $resourceId);
    }

    public function reject(int $resourceId, int $reviewerId): void
    {
        $resource = $this->resources->findById($resourceId);
        if (!$resource) {
            throw new RuntimeException('Resource not found');
        }

        if ($resource['status'] === 'rejected') {
            return;
        }

        if (!$this->resources->updateStatus($resourceId, 'rejected', $reviewerId)) {
            throw new RuntimeException('Failed to update resource');
        }

        $this->auditLogger->logAction($reviewerId, 'resource.rejected', [
            'resource_id' => $resourceId,
            'previous_status' => $resource['status'],
            'uploader_id' => $resource['uploader_id'] ?? null,
        ], 'resource', $resourceId);
    }

    public function getDownloadUrl(int $resourceId, ?int $userId = null, array $context = []): string
    {
        $resource = $this->resources->findById($resourceId);
        if (!$resource || $resource['status'] !== 'approved') {
            throw new RuntimeException('Resource not available');
        }

        try {
            $url = $this->cosClient->getObjectUrl(
                $this->cosSettings['bucket'],
                $resource['cos_key'],
                '+30 minutes'
            );
        } catch (Throwable $exception) {
            $this->auditLogger->logAction($userId, 'resource.download_link_failed', [
                'resource_id' => $resourceId,
                'filename' => $resource['original_filename'],
                'uploader_id' => $resource['uploader_id'] ?? null,
                'error' => $exception->getMessage(),
                'ip' => $context['ip'] ?? null,
                'user_agent' => $context['user_agent'] ?? null,
            ], 'resource', $resourceId);
            throw new RuntimeException('Unable to generate download link');
        }

        $this->auditLogger->logAction($userId, 'resource.download_link_issued', [
            'resource_id' => $resourceId,
            'filename' => $resource['original_filename'],
            'uploader_id' => $resource['uploader_id'] ?? null,
            'ip' => $context['ip'] ?? null,
            'user_agent' => $context['user_agent'] ?? null,
        ], 'resource', $resourceId);

        return $url;
    }
}
