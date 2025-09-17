<?php

namespace App\Controllers;

use App\Services\AuthService;
use App\Services\BookingService;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use RuntimeException;

class BookingController extends Controller
{
    public function __construct(
        private readonly BookingService $bookings,
        private readonly AuthService $authService
    ) {
    }

    public function mentors(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        return $this->json($response, ['mentors' => $this->bookings->listMentors()]);
    }

    public function create(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        $user = $this->authService->currentUser();
        if (!$user) {
            return $this->json($response, ['message' => 'Authentication required'], 401);
        }

        $data = (array)$request->getParsedBody();
        try {
            $bookingId = $this->bookings->createBooking($user['id'], $data);
        } catch (RuntimeException $exception) {
            return $this->json($response, ['message' => $exception->getMessage()], 400);
        }

        return $this->json($response, ['booking_id' => $bookingId], 201);
    }

    public function myBookings(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        $user = $this->authService->currentUser();
        if (!$user) {
            return $this->json($response, ['message' => 'Authentication required'], 401);
        }

        return $this->json($response, ['bookings' => $this->bookings->listForUser($user['id'])]);
    }

    public function all(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        return $this->json($response, ['bookings' => $this->bookings->listAll()]);
    }

    public function updateStatus(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $user = $this->authService->currentUser();
        if (!$user) {
            return $this->json($response, ['message' => 'Authentication required'], 401);
        }

        $bookingId = (int)$args['id'];
        $data = (array)$request->getParsedBody();
        $status = $data['status'] ?? 'pending';

        $this->bookings->updateStatus($bookingId, $status, $user['id']);

        return $this->json($response, ['message' => 'updated']);
    }
}
