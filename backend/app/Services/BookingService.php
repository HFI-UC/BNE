<?php

namespace App\Services;

use App\Repositories\BookingRepository;
use App\Repositories\MentorRepository;
use DateTimeImmutable;
use Exception;
use RuntimeException;

class BookingService
{
    private const ALLOWED_STATUSES = ['pending', 'approved', 'rejected', 'cancelled'];

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
        $mentorId = (int)($data['mentor_id'] ?? 0);
        if ($mentorId <= 0) {
            throw new RuntimeException('Mentor is required');
        }

        $mentor = $this->mentors->findById($mentorId);
        if (!$mentor) {
            throw new RuntimeException('Selected mentor not found');
        }

        $subject = trim((string)($data['subject'] ?? ''));
        if ($subject === '') {
            throw new RuntimeException('Subject is required');
        }

        $location = trim((string)($data['location'] ?? ''));
        if ($location === '') {
            throw new RuntimeException('Location is required');
        }

        $startInput = $data['start_time'] ?? null;
        $endInput = $data['end_time'] ?? null;
        if (!$startInput || !$endInput) {
            throw new RuntimeException('Start and end time are required');
        }

        try {
            $start = new DateTimeImmutable($startInput);
            $end = new DateTimeImmutable($endInput);
        } catch (Exception) {
            throw new RuntimeException('Invalid booking time provided');
        }

        if ($end <= $start) {
            throw new RuntimeException('End time must be after start time');
        }

        $bookingId = $this->bookings->create([
            'user_id' => $userId,
            'mentor_id' => $mentorId,
            'subject' => $subject,
            'location' => $location,
            'start_time' => $start->format('Y-m-d H:i:s'),
            'end_time' => $end->format('Y-m-d H:i:s'),
        ]);

        $this->auditLogger->logAction($userId, 'booking.created', [
            'mentor_id' => $mentorId,
            'mentor_name' => $mentor['name'] ?? null,
            'subject' => $subject,
            'location' => $location,
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
        $normalizedStatus = strtolower(trim($status));
        if (!in_array($normalizedStatus, self::ALLOWED_STATUSES, true)) {
            throw new RuntimeException('Invalid booking status');
        }

        $booking = $this->bookings->findById($bookingId);
        if (!$booking) {
            throw new RuntimeException('Booking not found');
        }

        if ($booking['status'] === $normalizedStatus) {
            return;
        }

        if (!$this->bookings->updateStatus($bookingId, $normalizedStatus)) {
            throw new RuntimeException('Unable to update booking status');
        }

        $this->auditLogger->logAction($actorId, 'booking.status_changed', [
            'booking_id' => $bookingId,
            'from' => $booking['status'],
            'to' => $normalizedStatus,
            'subject' => $booking['subject'] ?? null,
        ], 'booking', $bookingId);
    }
}
