<?php

use Dotenv\Dotenv;

$rootPath = dirname(__DIR__);
if (file_exists($rootPath . '/.env')) {
    Dotenv::createImmutable($rootPath)->safeLoad();
}

return [
    'app' => [
        'name' => $_ENV['APP_NAME'] ?? 'HFI Portal',
        'env' => $_ENV['APP_ENV'] ?? 'development',
        'debug' => filter_var($_ENV['APP_DEBUG'] ?? false, FILTER_VALIDATE_BOOL),
        'url' => $_ENV['APP_URL'] ?? 'http://localhost:5173',
    ],
    'db' => [
        'host' => $_ENV['DB_HOST'] ?? '127.0.0.1',
        'port' => (int)($_ENV['DB_PORT'] ?? 3306),
        'database' => $_ENV['DB_DATABASE'] ?? 'hfi_portal',
        'username' => $_ENV['DB_USERNAME'] ?? 'root',
        'password' => $_ENV['DB_PASSWORD'] ?? '',
        'charset' => 'utf8mb4',
        'collation' => 'utf8mb4_unicode_ci',
    ],
    'cos' => [
        'region' => $_ENV['COS_REGION'] ?? '',
        'app_id' => $_ENV['COS_APP_ID'] ?? '',
        'secret_id' => $_ENV['COS_SECRET_ID'] ?? '',
        'secret_key' => $_ENV['COS_SECRET_KEY'] ?? '',
        'bucket' => $_ENV['COS_BUCKET'] ?? '',
    ],
    'logging' => [
        'path' => $rootPath . '/logs',
    ],
    'session' => [
        'name' => $_ENV['SESSION_NAME'] ?? 'hfi_session',
        'lifetime' => (int)($_ENV['SESSION_LIFETIME'] ?? 7200),
    ],
];
