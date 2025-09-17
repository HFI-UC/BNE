<?php

declare(strict_types=1);

namespace Tests\Repositories;

use App\Repositories\BookingRepository;
use Tests\TestCase;

final class BookingRepositoryTest extends TestCase
{
    public function testCreatePersistsBookingWithTimestamps(): void
    {
        $repository = new BookingRepository($this->pdo);
        $studentId = $this->createUser(['role' => 'student']);
        $mentorId = $this->createUser(['role' => 'mentor']);

        $bookingId = $repository->create([
            'user_id' => $studentId,
            'mentor_id' => $mentorId,
            'subject' => 'Physics',
            'location' => 'Library Room 2',
            'start_time' => '2024-10-01T09:00:00',
            'end_time' => '2024-10-01T10:00:00',
            'status' => 'pending',
        ]);

        $booking = $repository->findById($bookingId);
        self::assertNotNull($booking);
        self::assertSame('pending', $booking['status']);
        self::assertSame($studentId, (int)$booking['user_id']);
        self::assertSame($mentorId, (int)$booking['mentor_id']);
        self::assertNotNull($booking['created_at']);
    }
}
