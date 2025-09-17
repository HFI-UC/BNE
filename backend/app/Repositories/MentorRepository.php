<?php

namespace App\Repositories;

use PDO;

class MentorRepository
{
    public function __construct(private readonly PDO $pdo)
    {
    }

    public function listAll(): array
    {
        $sql = 'SELECT m.id, u.name, u.email, m.bio, m.subjects, m.locations, m.availability_json
                FROM mentors m
                JOIN users u ON u.id = m.user_id
                ORDER BY u.name ASC';
        return $this->pdo->query($sql)->fetchAll();
    }

    public function findById(int $id): ?array
    {
        $stmt = $this->pdo->prepare(
            'SELECT m.id, u.name, u.email, m.bio, m.subjects, m.locations, m.availability_json
             FROM mentors m
             JOIN users u ON u.id = m.user_id
             WHERE m.id = :id'
        );
        $stmt->execute(['id' => $id]);
        $mentor = $stmt->fetch();

        return $mentor ?: null;
    }
}
