<?php

namespace App\Repositories;

use PDO;

class ResourceRepository
{
    public function __construct(private readonly PDO $pdo)
    {
    }

    public function create(array $data): int
    {
        $stmt = $this->pdo->prepare(
            'INSERT INTO resources (uploader_id, title, description, cos_key, original_filename, status, created_at)
             VALUES (:uploader_id, :title, :description, :cos_key, :original_filename, :status, NOW())'
        );
        $stmt->execute([
            'uploader_id' => $data['uploader_id'],
            'title' => $data['title'],
            'description' => $data['description'] ?? '',
            'cos_key' => $data['cos_key'],
            'original_filename' => $data['original_filename'],
            'status' => $data['status'] ?? 'pending',
        ]);

        return (int)$this->pdo->lastInsertId();
    }

    public function findById(int $id): ?array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM resources WHERE id = :id');
        $stmt->execute(['id' => $id]);
        $resource = $stmt->fetch();
        return $resource ?: null;
    }

    public function listApproved(): array
    {
        $stmt = $this->pdo->prepare(
            'SELECT r.*, u.name AS uploader_name FROM resources r JOIN users u ON u.id = r.uploader_id WHERE r.status = :status ORDER BY r.created_at DESC'
        );
        $stmt->execute(['status' => 'approved']);
        return $stmt->fetchAll();
    }

    public function listPending(): array
    {
        $stmt = $this->pdo->prepare(
            'SELECT r.*, u.name AS uploader_name FROM resources r JOIN users u ON u.id = r.uploader_id WHERE r.status = :status ORDER BY r.created_at DESC'
        );
        $stmt->execute(['status' => 'pending']);
        return $stmt->fetchAll();
    }

    public function listForUser(int $userId): array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM resources WHERE uploader_id = :user_id ORDER BY created_at DESC');
        $stmt->execute(['user_id' => $userId]);
        return $stmt->fetchAll();
    }

    public function updateStatus(int $id, string $status, ?int $reviewerId = null): bool
    {
        $stmt = $this->pdo->prepare(
            'UPDATE resources
             SET status = :status,
                 approved_by = CASE WHEN :status_value = \'approved\' THEN :reviewer_id ELSE NULL END,
                 approved_at = CASE WHEN :status_value = \'approved\' THEN NOW() ELSE NULL END
             WHERE id = :id'
        );
        $stmt->execute([
            'status' => $status,
            'reviewer_id' => $reviewerId,
            'status_value' => $status,
            'id' => $id,
        ]);

        return $stmt->rowCount() > 0;
    }
}
