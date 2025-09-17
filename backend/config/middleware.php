<?php

use App\Middleware\AuditLoggingMiddleware;
use App\Middleware\SessionMiddleware;
use Psr\Log\LoggerInterface;
use Slim\App;
use Tuupola\Middleware\CorsMiddleware;

return static function (App $app): void {
    $container = $app->getContainer();
    $settings = $container->get('settings');

    $app->addBodyParsingMiddleware();

    $app->add(new CorsMiddleware([
        'origin' => ['*'],
        'methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        'headers.allow' => ['Content-Type', 'Authorization'],
        'headers.expose' => ['Content-Type'],
        'credentials' => true,
        'cache' => 0,
    ]));

    $app->add(new SessionMiddleware($settings['session']));
    $app->add(AuditLoggingMiddleware::class);

    /** @var LoggerInterface $errorLogger */
    $errorLogger = $container->get('logger.error');
    $app->addErrorMiddleware($settings['app']['debug'], true, true, $errorLogger);
};
