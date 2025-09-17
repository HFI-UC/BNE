<?php

namespace App\Services\Exceptions;

use RuntimeException;

class FileUploadException extends RuntimeException
{
    public function __construct(string $message = "File upload failed", int $code = 0, ?\Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }
}
