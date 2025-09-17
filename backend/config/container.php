<?php

use App\Logging\DatabaseErrorHandler;
use App\Services\AuditLogger;
use App\Services\AuthService;
use App\Services\ArticleService;
use App\Services\BookingService;
use App\Services\ResourceService;
use App\Repositories\UserRepository;
use App\Repositories\ArticleRepository;
use App\Repositories\BookingRepository;
use App\Repositories\ResourceRepository;
use App\Repositories\MentorRepository;
use App\Repositories\AuditLogRepository;
use App\Repositories\ErrorLogRepository;
use InvalidArgumentException;
use Monolog\Formatter\JsonFormatter;
use Monolog\Handler\RotatingFileHandler;
use Monolog\Logger;
use PDO;
use Psr\Container\ContainerInterface;
use Qcloud\Cos\Client as CosClient;

$settings = require __DIR__ . '/settings.php';

return [
    'settings' => $settings,

    PDO::class => function () use ($settings) {
        $db = $settings['db'];
        $driver = $db['driver'] ?? 'mysql';

        if ($driver === 'sqlite') {
            $database = $db['database'] ?? ':memory:';
            $dsn = $database === ':memory:' ? 'sqlite::memory:' : 'sqlite:' . $database;
            $pdo = new PDO($dsn, null, null, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]);
            $pdo->exec('PRAGMA foreign_keys = ON');
            return $pdo;
        }

        if ($driver !== 'mysql') {
            throw new InvalidArgumentException(sprintf('Unsupported database driver [%s]', $driver));
        }

        $dsn = sprintf(
            'mysql:host=%s;port=%d;dbname=%s;charset=%s',
            $db['host'],
            $db['port'],
            $db['database'],
            $db['charset']
        );

        $pdo = new PDO($dsn, $db['username'], $db['password'], [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);

        if (!empty($db['charset']) && !empty($db['collation'])) {
            $pdo->exec("SET NAMES '{$db['charset']}' COLLATE '{$db['collation']}'");
        }

        return $pdo;
    },

    'logger.error' => function (ContainerInterface $container) use ($settings) {
        $path = $settings['logging']['path'] . '/error.log';
        $handler = new RotatingFileHandler($path, 14, Logger::ERROR);
        $handler->setFormatter(new JsonFormatter());
        $logger = new Logger('error');
        $logger->pushHandler($handler);
        $logger->pushHandler(new DatabaseErrorHandler($container->get(ErrorLogRepository::class)));
        return $logger;
    },

    'logger.audit' => function () use ($settings) {
        $path = $settings['logging']['path'] . '/audit.log';
        $handler = new RotatingFileHandler($path, 30, Logger::INFO);
        $handler->setFormatter(new JsonFormatter());
        $logger = new Logger('audit');
        $logger->pushHandler($handler);
        return $logger;
    },

    CosClient::class => function () use ($settings) {
        $cos = $settings['cos'];
        return new CosClient([
            'region' => $cos['region'],
            'schema' => 'https',
            'credentials' => [
                'appId' => $cos['app_id'],
                'secretId' => $cos['secret_id'],
                'secretKey' => $cos['secret_key'],
            ],
        ]);
    },

    AuditLogger::class => function (ContainerInterface $container) {
        return new AuditLogger(
            $container->get('logger.audit'),
            $container->get(AuditLogRepository::class)
        );
    },

    AuthService::class => function (ContainerInterface $container) {
        return new AuthService(
            $container->get(UserRepository::class),
            $container->get(AuditLogger::class),
            $container->get('settings')['session']
        );
    },

    ArticleService::class => fn (ContainerInterface $c) => new ArticleService($c->get(ArticleRepository::class)),
    BookingService::class => fn (ContainerInterface $c) => new BookingService(
        $c->get(BookingRepository::class),
        $c->get(AuditLogger::class),
        $c->get(MentorRepository::class)
    ),
    ResourceService::class => fn (ContainerInterface $c) => new ResourceService(
        $c->get(ResourceRepository::class),
        $c->get(CosClient::class),
        $c->get(AuditLogger::class),
        $c->get('settings')['cos']
    ),
];
