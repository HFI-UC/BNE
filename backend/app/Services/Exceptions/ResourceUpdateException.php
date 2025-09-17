<?php

namespace App\Services\Exceptions;

use RuntimeException;

class ResourceUpdateException extends RuntimeException
{
    public function __construct(string $message = "Failed to update resource", int $code = 0, ?\Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }
}
