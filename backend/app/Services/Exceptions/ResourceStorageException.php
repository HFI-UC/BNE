<?php

namespace App\Services\Exceptions;

use RuntimeException;

class ResourceStorageException extends RuntimeException
{
    public function __construct(string $message = "Failed to store resource file", int $code = 0, ?\Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }
}
