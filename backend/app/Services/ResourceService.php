<?php

namespace App\Services;

use App\Repositories\ResourceRepository;
use App\Services\AuditLogger;
use Psr\Http\Message\UploadedFileInterface;
use Qcloud\Cos\Client as CosClient;
use RuntimeException;

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

        $this->cosClient->putObject([
            'Bucket' => $this->cosSettings['bucket'],
            'Key' => $cosKey,
            'Body' => $stream->getContents(),
            'ContentType' => $file->getClientMediaType() ?? 'application/octet-stream',
        ]);

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
        $this->resources->updateStatus($resourceId, 'approved', $reviewerId);
        $this->auditLogger->logAction($reviewerId, 'resource.approved', ['resource_id' => $resourceId], 'resource', $resourceId);
    }

    public function reject(int $resourceId, int $reviewerId): void
    {
        $this->resources->updateStatus($resourceId, 'rejected', $reviewerId);
        $this->auditLogger->logAction($reviewerId, 'resource.rejected', ['resource_id' => $resourceId], 'resource', $resourceId);
    }

    public function getDownloadUrl(int $resourceId): string
    {
        $resource = $this->resources->findById($resourceId);
        if (!$resource || $resource['status'] !== 'approved') {
            throw new RuntimeException('Resource not available');
        }

        return $this->cosClient->getObjectUrl(
            $this->cosSettings['bucket'],
            $resource['cos_key'],
            '+30 minutes'
        );
    }
}
