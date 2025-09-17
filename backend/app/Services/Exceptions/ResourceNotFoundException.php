<?php

namespace App\Services\Exceptions;

use RuntimeException;

class ResourceNotFoundException extends RuntimeException
{
    public function __construct(string $message = "Resource not found", int $code = 0, ?\Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }
}
