<?php

namespace App\Repositories;

use PDO;

class ArticleRepository
{
    public function __construct(private readonly PDO $pdo)
    {
    }

    public function getFeatured(int $limit = 3): array
    {
        $stmt = $this->pdo->prepare('SELECT id, title, slug, hero_image_url, summary, published_at FROM articles WHERE is_featured = 1 ORDER BY published_at DESC LIMIT :limit');
        $stmt->bindValue('limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function getLatest(int $limit = 6): array
    {
        $stmt = $this->pdo->prepare('SELECT id, title, slug, summary, published_at FROM articles ORDER BY published_at DESC LIMIT :limit');
        $stmt->bindValue('limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function getAnnouncements(int $limit = 5): array
    {
        $stmt = $this->pdo->prepare('SELECT id, title, content, published_at FROM announcements ORDER BY published_at DESC LIMIT :limit');
        $stmt->bindValue('limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function getArchive(int $page = 1, int $perPage = 10): array
    {
        $offset = ($page - 1) * $perPage;
        $stmt = $this->pdo->prepare('SELECT id, title, slug, summary, published_at FROM articles ORDER BY published_at DESC LIMIT :limit OFFSET :offset');
        $stmt->bindValue('limit', $perPage, PDO::PARAM_INT);
        $stmt->bindValue('offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        $items = $stmt->fetchAll();

        $count = (int)$this->pdo->query('SELECT COUNT(*) FROM articles')->fetchColumn();

        return [
            'items' => $items,
            'total' => $count,
            'page' => $page,
            'perPage' => $perPage,
        ];
    }

    public function findBySlug(string $slug): ?array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM articles WHERE slug = :slug LIMIT 1');
        $stmt->execute(['slug' => $slug]);
        $article = $stmt->fetch();
        return $article ?: null;
    }
}
