<?php

namespace App\Repositories;

use PDO;

class ErrorLogRepository
{
    public function __construct(private readonly PDO $pdo)
    {
    }

    public function record(string $level, string $message, ?array $context = null): void
    {
        $stmt = $this->pdo->prepare(
            'INSERT INTO error_logs (level, message, context_json, created_at) VALUES (:level, :message, :context_json, CURRENT_TIMESTAMP)'
        );
        $stmt->execute([
            'level' => $level,
            'message' => $message,
            'context_json' => $context ? json_encode($context, JSON_UNESCAPED_UNICODE) : null,
        ]);
    }
}
