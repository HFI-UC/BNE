<?php

declare(strict_types=1);

namespace Tests;

use PDO;
use PDOException;
use PHPUnit\Framework\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    protected PDO $pdo;

    protected function setUp(): void
    {
        parent::setUp();

        $this->pdo = new PDO('sqlite::memory:');
        $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $this->pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        $this->pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

        $schema = file_get_contents(__DIR__ . '/Fixtures/schema.sqlite.sql');
        if ($schema === false) {
            throw new PDOException('Failed to load schema for tests.');
        }

        $statements = array_filter(array_map('trim', preg_split('/;\s*(?:\n|$)/', $schema)));

        foreach ($statements as $statement) {
            if ($statement !== '') {
                $this->pdo->exec($statement);
            }
        }
    }

    protected function createUser(array $overrides = []): int
    {
        $defaults = [
            'email' => 'user' . uniqid('', true) . '@example.com',
            'password_hash' => password_hash('secret', PASSWORD_BCRYPT),
            'name' => '测试用户',
            'role' => 'student',
        ];

        $payload = array_merge($defaults, $overrides);

        $stmt = $this->pdo->prepare('INSERT INTO users (email, password_hash, name, role) VALUES (:email, :password_hash, :name, :role)');
        $stmt->execute([
            'email' => $payload['email'],
            'password_hash' => $payload['password_hash'],
            'name' => $payload['name'],
            'role' => $payload['role'],
        ]);

        return (int)$this->pdo->lastInsertId();
    }
}
