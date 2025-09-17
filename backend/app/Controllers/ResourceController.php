<?php

namespace App\Controllers;

use App\Services\AuthService;
use App\Services\ResourceService;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use RuntimeException;

class ResourceController extends Controller
{
    public function __construct(
        private readonly ResourceService $resources,
        private readonly AuthService $authService
    ) {
    }

    public function list(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        return $this->json($response, ['resources' => $this->resources->listPublic()]);
    }

    public function listPending(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        return $this->json($response, ['resources' => $this->resources->listPending()]);
    }

    public function mine(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        $user = $this->authService->currentUser();
        if (!$user) {
            return $this->json($response, ['message' => 'Authentication required'], 401);
        }

        return $this->json($response, ['resources' => $this->resources->listForUser($user['id'])]);
    }

    public function upload(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        $user = $this->authService->currentUser();
        if (!$user) {
            return $this->json($response, ['message' => 'Authentication required'], 401);
        }

        $uploadedFiles = $request->getUploadedFiles();
        $file = $uploadedFiles['file'] ?? null;
        if (!$file) {
            return $this->json($response, ['message' => 'File is required'], 422);
        }

        try {
            $resourceId = $this->resources->upload($user['id'], $file, (array)$request->getParsedBody());
        } catch (RuntimeException $exception) {
            return $this->json($response, ['message' => $exception->getMessage()], 400);
        }

        return $this->json($response, ['resource_id' => $resourceId], 201);
    }

    public function approve(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $user = $this->authService->currentUser();
        if (!$user) {
            return $this->json($response, ['message' => 'Authentication required'], 401);
        }

        $resourceId = (int)$args['id'];
        $this->resources->approve($resourceId, $user['id']);
        return $this->json($response, ['message' => 'approved']);
    }

    public function reject(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $user = $this->authService->currentUser();
        if (!$user) {
            return $this->json($response, ['message' => 'Authentication required'], 401);
        }

        $resourceId = (int)$args['id'];
        $this->resources->reject($resourceId, $user['id']);
        return $this->json($response, ['message' => 'rejected']);
    }

    public function download(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        try {
            $url = $this->resources->getDownloadUrl((int)$args['id']);
        } catch (RuntimeException $exception) {
            return $this->json($response, ['message' => $exception->getMessage()], 404);
        }

        return $this->json($response, ['url' => $url]);
    }
}
