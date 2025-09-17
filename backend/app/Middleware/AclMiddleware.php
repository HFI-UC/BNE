<?php

namespace App\Middleware;

use App\Services\AuthService;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Slim\Psr7\Response;

class AclMiddleware implements MiddlewareInterface
{
    public function __construct(private readonly array $allowedRoles, private readonly AuthService $authService)
    {
    }

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $user = $this->authService->currentUser();
        $role = $user['role'] ?? 'guest';
        if (!in_array($role, $this->allowedRoles, true)) {
            $response = new Response(403);
            $response->getBody()->write(json_encode(['message' => 'Forbidden'], JSON_UNESCAPED_UNICODE));
            return $response->withHeader('Content-Type', 'application/json');
        }

        return $handler->handle($request);
    }
}
