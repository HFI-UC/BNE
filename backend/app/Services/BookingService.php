<?php

namespace App\Services;

use App\Repositories\BookingRepository;
use App\Repositories\MentorRepository;
use DateTimeImmutable;
use RuntimeException;

class BookingService
{
    public function __construct(
        private readonly BookingRepository $bookings,
        private readonly AuditLogger $auditLogger,
        private readonly MentorRepository $mentors
    ) {
    }

    public function listMentors(): array
    {
        $mentors = $this->mentors->listAll();
        return array_map(static function (array $mentor): array {
            return [
                'id' => $mentor['id'],
                'name' => $mentor['name'],
                'bio' => $mentor['bio'],
                'subjects' => json_decode($mentor['subjects'] ?? '[]', true) ?: [],
                'locations' => json_decode($mentor['locations'] ?? '[]', true) ?: [],
                'availability' => json_decode($mentor['availability_json'] ?? '[]', true) ?: [],
            ];
        }, $mentors);
    }

    public function createBooking(int $userId, array $data): int
    {
        $start = new DateTimeImmutable($data['start_time'] ?? throw new RuntimeException('Missing start time'));
        $end = new DateTimeImmutable($data['end_time'] ?? throw new RuntimeException('Missing end time'));

        if ($end <= $start) {
            throw new RuntimeException('End time must be after start time');
        }

        $bookingId = $this->bookings->create([
            'user_id' => $userId,
            'mentor_id' => (int)$data['mentor_id'],
            'subject' => $data['subject'],
            'location' => $data['location'],
            'start_time' => $start->format('Y-m-d H:i:s'),
            'end_time' => $end->format('Y-m-d H:i:s'),
        ]);

        $this->auditLogger->logAction($userId, 'booking.created', [
            'mentor_id' => $data['mentor_id'],
            'subject' => $data['subject'],
            'start_time' => $start->format(DATE_ATOM),
        ], 'booking', $bookingId);

        return $bookingId;
    }

    public function listForUser(int $userId): array
    {
        return $this->bookings->listForUser($userId);
    }

    public function listAll(): array
    {
        return $this->bookings->listAll();
    }

    public function updateStatus(int $bookingId, string $status, int $actorId): void
    {
        $this->bookings->updateStatus($bookingId, $status);
        $this->auditLogger->logAction($actorId, 'booking.status_changed', [
            'booking_id' => $bookingId,
            'status' => $status,
        ], 'booking', $bookingId);
    }
}
