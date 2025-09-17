<?php

namespace App\Services;

use App\Repositories\ArticleRepository;
use RuntimeException;

class ArticleService
{
    public function __construct(private readonly ArticleRepository $articles)
    {
    }

    public function getHomepageFeed(): array
    {
        return [
            'featured' => $this->articles->getFeatured(),
            'latest' => $this->articles->getLatest(),
            'announcements' => $this->articles->getAnnouncements(),
        ];
    }

    public function getArchive(int $page = 1, int $perPage = 10): array
    {
        return $this->articles->getArchive($page, $perPage);
    }

    public function getArticle(string $slug): array
    {
        $article = $this->articles->findBySlug($slug);
        if (!$article) {
            throw new RuntimeException('Article not found');
        }
        return $article;
    }
}
