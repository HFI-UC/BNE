<?php

declare(strict_types=1);

namespace Tests\Repositories;

use App\Repositories\AuditLogRepository;
use Tests\TestCase;

final class AuditLogRepositoryTest extends TestCase
{
    public function testRecordPersistsAuditEntry(): void
    {
        $repository = new AuditLogRepository($this->pdo);
        $userId = $this->createUser();

        $repository->record([
            'user_id' => $userId,
            'action' => 'auth.login',
            'entity_type' => 'session',
            'entity_id' => 42,
            'metadata_json' => json_encode(['ip' => '127.0.0.1'], JSON_UNESCAPED_UNICODE),
            'ip_address' => '127.0.0.1',
            'user_agent' => 'PHPUnit',
        ]);

        $records = $this->pdo->query('SELECT * FROM audit_logs')->fetchAll();

        self::assertCount(1, $records);
        $record = $records[0];
        self::assertSame($userId, (int)$record['user_id']);
        self::assertSame('auth.login', $record['action']);
        self::assertSame('session', $record['entity_type']);
        self::assertSame(42, (int)$record['entity_id']);
        self::assertNotEmpty($record['metadata_json']);
        self::assertNotNull($record['created_at']);
    }
}
