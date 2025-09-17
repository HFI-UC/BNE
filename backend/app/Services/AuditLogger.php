<?php

namespace App\Services;

use App\Repositories\AuditLogRepository;
use Monolog\Logger;

class AuditLogger
{
    public function __construct(
        private readonly Logger $logger,
        private readonly AuditLogRepository $repository
    ) {
    }

    public function logAction(?int $userId, string $action, array $metadata = [], ?string $entityType = null, ?int $entityId = null): void
    {
        $payload = [
            'user_id' => $userId,
            'action' => $action,
            'entity_type' => $entityType,
            'entity_id' => $entityId,
            'metadata_json' => $metadata ? json_encode($metadata, JSON_UNESCAPED_UNICODE) : null,
            'ip_address' => $metadata['ip'] ?? null,
            'user_agent' => $metadata['user_agent'] ?? null,
        ];

        $this->logger->info($action, $payload);
        $this->repository->record($payload);
    }

    public function logRequest(?int $userId, string $action, array $metadata = []): void
    {
        $this->logAction($userId, $action, $metadata);
    }
}
