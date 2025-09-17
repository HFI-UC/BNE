<?php

namespace App\Services;

use App\Repositories\UserRepository;
use RuntimeException;

class AuthService
{
    private const SESSION_USER_KEY = 'user_id';

    public function __construct(
        private readonly UserRepository $users,
        private readonly AuditLogger $auditLogger,
        private readonly array $sessionSettings
    ) {
    }

    public function attemptLogin(string $email, string $password, array $context = []): array
    {
        $user = $this->users->findByEmail($email);
        $ip = $context['ip'] ?? null;
        $userAgent = $context['user_agent'] ?? null;
        if (!$user || !password_verify($password, $user['password_hash'])) {
            $this->auditLogger->logAction(null, 'auth.login_failed', [
                'email' => $email,
                'ip' => $ip,
                'user_agent' => $userAgent,
            ]);
            throw new RuntimeException('Invalid credentials');
        }

        $_SESSION[self::SESSION_USER_KEY] = $user['id'];
        $_SESSION['role'] = $user['role'];
        $_SESSION['name'] = $user['name'];
        $_SESSION['email'] = $user['email'];

        $this->auditLogger->logAction($user['id'], 'auth.login_success', [
            'ip' => $ip,
            'user_agent' => $userAgent,
            'email' => $user['email'],
        ]);

        return [
            'id' => $user['id'],
            'email' => $user['email'],
            'name' => $user['name'],
            'role' => $user['role'],
        ];
    }

    public function logout(array $context = []): void
    {
        $user = $this->currentUser();
        if ($user) {
            $this->auditLogger->logAction($user['id'], 'auth.logout', [
                'ip' => $context['ip'] ?? null,
                'user_agent' => $context['user_agent'] ?? null,
            ]);
        }

        $_SESSION = [];
        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
        }
        session_destroy();
    }

    public function currentUser(): ?array
    {
        $userId = $_SESSION[self::SESSION_USER_KEY] ?? null;
        if (!$userId) {
            return null;
        }

        $user = $this->users->findById((int)$userId);
        if (!$user) {
            return null;
        }

        return $user;
    }

    public function hasRole(string $role): bool
    {
        $currentRole = $_SESSION['role'] ?? 'guest';
        return $currentRole === $role;
    }

    public function authorize(array $allowedRoles): bool
    {
        $role = $_SESSION['role'] ?? 'guest';
        return in_array($role, $allowedRoles, true);
    }
}
