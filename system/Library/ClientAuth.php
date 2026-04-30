<?php

declare(strict_types=1);

namespace NosfirQuotia\System\Library;

use NosfirQuotia\System\Engine\Session;

final class ClientAuth
{
    public function __construct(
        private readonly Session $session,
        private readonly Database $database
    ) {
    }

    public function attempt(string $email, string $password): bool
    {
        $email = strtolower(trim($email));
        $user = $this->database->fetch(
            'SELECT id, name, email, phone, password FROM client_users WHERE email = :email LIMIT 1',
            ['email' => $email]
        );

        if ($user === null || !password_verify($password, (string) $user['password'])) {
            return false;
        }

        $this->session->regenerate();
        $this->session->set('client_user', [
            'id' => (int) $user['id'],
            'name' => (string) $user['name'],
            'email' => (string) $user['email'],
            'phone' => (string) ($user['phone'] ?? ''),
        ]);

        return true;
    }

    public function register(string $name, string $email, string $phone, string $password): array
    {
        $email = strtolower(trim($email));
        $name = trim($name);
        $phoneDigits = preg_replace('/\D+/', '', $phone);
        $phone = is_string($phoneDigits) ? substr($phoneDigits, 0, 11) : '';

        if ($name === '' || $email === '' || $password === '') {
            return ['success' => false, 'error' => 'Preencha nome, email e senha.'];
        }

        if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
            return ['success' => false, 'error' => 'Email invalido.'];
        }

        if (strlen($password) < 6) {
            return ['success' => false, 'error' => 'A senha deve ter pelo menos 6 caracteres.'];
        }

        $existing = $this->database->fetch(
            'SELECT id FROM client_users WHERE email = :email LIMIT 1',
            ['email' => $email]
        );

        if ($existing !== null) {
            return ['success' => false, 'error' => 'Este email ja esta cadastrado.'];
        }

        $this->database->execute(
            'INSERT INTO client_users (name, email, phone, password)
             VALUES (:name, :email, :phone, :password)',
            [
                'name' => $name,
                'email' => $email,
                'phone' => $phone !== '' ? $phone : null,
                'password' => password_hash($password, PASSWORD_DEFAULT),
            ]
        );

        $this->session->regenerate();
        $this->session->set('client_user', [
            'id' => $this->database->lastInsertId(),
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
        ]);

        return ['success' => true, 'error' => null];
    }

    public function check(): bool
    {
        return $this->session->has('client_user');
    }

    public function user(): ?array
    {
        $user = $this->session->get('client_user');

        return is_array($user) ? $user : null;
    }

    public function userId(): ?int
    {
        $user = $this->user();

        return $user !== null ? (int) ($user['id'] ?? 0) : null;
    }

    public function logout(): void
    {
        $this->session->remove('client_user');
        $this->session->regenerate();
    }
}
