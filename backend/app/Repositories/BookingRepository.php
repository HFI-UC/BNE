<?php

namespace App\Repositories;

use PDO;

class BookingRepository
{
    public function __construct(private readonly PDO $pdo)
    {
    }

    public function create(array $data): int
    {
        $stmt = $this->pdo->prepare(
            'INSERT INTO bookings (user_id, mentor_id, subject, location, start_time, end_time, status, created_at)
             VALUES (:user_id, :mentor_id, :subject, :location, :start_time, :end_time, :status, NOW())'
        );
        $stmt->execute([
            'user_id' => $data['user_id'],
            'mentor_id' => $data['mentor_id'],
            'subject' => $data['subject'],
            'location' => $data['location'],
            'start_time' => $data['start_time'],
            'end_time' => $data['end_time'],
            'status' => $data['status'] ?? 'pending',
        ]);

        return (int)$this->pdo->lastInsertId();
    }

    public function findById(int $id): ?array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM bookings WHERE id = :id');
        $stmt->execute(['id' => $id]);
        $booking = $stmt->fetch();
        return $booking ?: null;
    }

    public function listForUser(int $userId): array
    {
        $stmt = $this->pdo->prepare(
            'SELECT b.*, m.name AS mentor_name FROM bookings b JOIN users m ON m.id = b.mentor_id WHERE b.user_id = :user_id ORDER BY b.start_time DESC'
        );
        $stmt->execute(['user_id' => $userId]);
        return $stmt->fetchAll();
    }

    public function listAll(): array
    {
        $sql = 'SELECT b.*, u.name AS student_name, m.name AS mentor_name
                FROM bookings b
                JOIN users u ON u.id = b.user_id
                JOIN users m ON m.id = b.mentor_id
                ORDER BY b.start_time DESC';
        return $this->pdo->query($sql)->fetchAll();
    }

    public function updateStatus(int $bookingId, string $status): bool
    {
        $stmt = $this->pdo->prepare('UPDATE bookings SET status = :status WHERE id = :id');
        $stmt->execute([
            'status' => $status,
            'id' => $bookingId,
        ]);

        return $stmt->rowCount() > 0;
    }
}
