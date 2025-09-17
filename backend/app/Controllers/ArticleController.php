<?php

namespace App\Controllers;

use App\Services\ArticleService;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use RuntimeException;

class ArticleController extends Controller
{
    public function __construct(private readonly ArticleService $articles)
    {
    }

    public function homepage(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        $feed = $this->articles->getHomepageFeed();
        return $this->json($response, $feed);
    }

    public function archive(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        $query = $request->getQueryParams();
        $page = max(1, (int)($query['page'] ?? 1));
        $perPage = min(50, max(1, (int)($query['perPage'] ?? 10)));
        $result = $this->articles->getArchive($page, $perPage);
        return $this->json($response, $result);
    }

    public function show(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        try {
            $article = $this->articles->getArticle($args['slug']);
        } catch (RuntimeException) {
            return $this->json($response, ['message' => 'article not found'], 404);
        }

        return $this->json($response, ['article' => $article]);
    }
}
