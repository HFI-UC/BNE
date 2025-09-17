<?php

use App\Controllers\ArticleController;
use App\Controllers\AuthController;
use App\Controllers\BookingController;
use App\Controllers\ResourceController;
use App\Middleware\AclMiddleware;
use App\Services\AuthService;
use Slim\App;
use Slim\Routing\RouteCollectorProxy;

return static function (App $app): void {
    $container = $app->getContainer();
    $authService = $container->get(AuthService::class);

    $app->group('/api', function (RouteCollectorProxy $group) use ($container, $authService) {
        $group->get('/articles', [ArticleController::class, 'homepage']);
        $group->get('/articles/archive', [ArticleController::class, 'archive']);
        $group->get('/articles/{slug}', [ArticleController::class, 'show']);

        $group->post('/auth/login', [AuthController::class, 'login']);
        $group->post('/auth/logout', [AuthController::class, 'logout']);
        $group->get('/auth/me', [AuthController::class, 'me']);

        $group->get('/mentors', [BookingController::class, 'mentors']);
        $group->post('/bookings', [BookingController::class, 'create'])
            ->add(new AclMiddleware(['student', 'mentor', 'admin'], $authService));
        $group->get('/bookings', [BookingController::class, 'myBookings'])
            ->add(new AclMiddleware(['student', 'mentor', 'admin'], $authService));

        $group->get('/resources', [ResourceController::class, 'list']);
        $group->get('/resources/mine', [ResourceController::class, 'mine'])
            ->add(new AclMiddleware(['student', 'mentor', 'admin'], $authService));
        $group->post('/resources', [ResourceController::class, 'upload'])
            ->add(new AclMiddleware(['student', 'mentor', 'admin'], $authService));
        $group->get('/resources/{id}/download', [ResourceController::class, 'download']);

        $group->group('/admin', function (RouteCollectorProxy $admin) use ($authService) {
            $admin->get('/bookings', [BookingController::class, 'all']);
            $admin->patch('/bookings/{id}', [BookingController::class, 'updateStatus']);
            $admin->get('/resources/pending', [ResourceController::class, 'listPending']);
            $admin->post('/resources/{id}/approve', [ResourceController::class, 'approve']);
            $admin->post('/resources/{id}/reject', [ResourceController::class, 'reject']);
        })->add(new AclMiddleware(['admin'], $authService));
    });
};
