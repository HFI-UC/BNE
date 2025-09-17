<?php

namespace App\Middleware;

use App\Services\AuditLogger;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

class AuditLoggingMiddleware implements MiddlewareInterface
{
    public function __construct(private readonly AuditLogger $auditLogger)
    {
    }

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $response = $handler->handle($request);

        $userId = $_SESSION['user_id'] ?? null;
        $this->auditLogger->logRequest(
            $userId,
            (string)($request->getAttribute('route')?->getName() ?? $request->getUri()->getPath()),
            [
                'method' => $request->getMethod(),
                'status' => $response->getStatusCode(),
                'ip' => $request->getServerParams()['REMOTE_ADDR'] ?? null,
                'user_agent' => $request->getHeaderLine('User-Agent'),
            ]
        );

        return $response;
    }
}
