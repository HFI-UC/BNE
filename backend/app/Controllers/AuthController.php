<?php

namespace App\Controllers;

use App\Services\AuthService;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use RuntimeException;

class AuthController extends Controller
{
    public function __construct(private readonly AuthService $authService)
    {
    }

    public function login(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        $data = (array)$request->getParsedBody();
        try {
            $user = $this->authService->attemptLogin(
                $data['email'] ?? '',
                $data['password'] ?? '',
                [
                    'ip' => $request->getServerParams()['REMOTE_ADDR'] ?? null,
                    'user_agent' => $request->getHeaderLine('User-Agent'),
                ]
            );
        } catch (RuntimeException $exception) {
            return $this->json($response, ['message' => $exception->getMessage()], 401);
        }

        return $this->json($response, ['user' => $user]);
    }

    public function logout(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        $this->authService->logout([
            'ip' => $request->getServerParams()['REMOTE_ADDR'] ?? null,
            'user_agent' => $request->getHeaderLine('User-Agent'),
        ]);
        return $this->json($response, ['message' => 'logged out']);
    }

    public function me(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        $user = $this->authService->currentUser();
        if (!$user) {
            return $this->json($response, ['user' => null]);
        }

        return $this->json($response, ['user' => $user]);
    }
}
