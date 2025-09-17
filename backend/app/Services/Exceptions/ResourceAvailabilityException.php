<?php

namespace App\Services\Exceptions;

use RuntimeException;

class ResourceAvailabilityException extends RuntimeException
{
    public function __construct(string $message = "Resource not available", int $code = 0, ?\Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }
}
