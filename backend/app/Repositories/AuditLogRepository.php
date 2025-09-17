<?php

namespace App\Repositories;

use PDO;

class AuditLogRepository
{
    public function __construct(private readonly PDO $pdo)
    {
    }

    public function record(array $entry): void
    {
        $stmt = $this->pdo->prepare(
            'INSERT INTO audit_logs (user_id, action, entity_type, entity_id, metadata_json, ip_address, user_agent, created_at)
             VALUES (:user_id, :action, :entity_type, :entity_id, :metadata_json, :ip_address, :user_agent, NOW())'
        );
        $stmt->execute([
            'user_id' => $entry['user_id'],
            'action' => $entry['action'],
            'entity_type' => $entry['entity_type'] ?? null,
            'entity_id' => $entry['entity_id'] ?? null,
            'metadata_json' => $entry['metadata_json'] ?? null,
            'ip_address' => $entry['ip_address'] ?? null,
            'user_agent' => $entry['user_agent'] ?? null,
        ]);
    }
}
