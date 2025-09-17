<?php

namespace App\Middleware;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

class SessionMiddleware implements MiddlewareInterface
{
    private array $settings;

    public function __construct(array $settings)
    {
        $this->settings = $settings;
    }

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $writeClose = false;
        if (session_status() === PHP_SESSION_NONE) {
            session_name($this->settings['name'] ?? 'hfi_session');
            session_set_cookie_params([
                'lifetime' => $this->settings['lifetime'] ?? 7200,
                'path' => '/',
                'domain' => $this->settings['domain'] ?? '',
                'secure' => $this->settings['secure'] ?? false,
                'httponly' => true,
                'samesite' => $this->settings['samesite'] ?? 'Lax',
            ]);
            session_start();
            $writeClose = true;
        }

        $response = $handler->handle($request);

        if ($writeClose && session_status() === PHP_SESSION_ACTIVE) {
            session_write_close();
        }

        return $response;
    }
}
