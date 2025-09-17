<?php

namespace App\Services\Exceptions;

use RuntimeException;

class ArticleNotFoundException extends RuntimeException
{
    public function __construct(string $message = "Article not found", int $code = 0, ?\Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }
}
