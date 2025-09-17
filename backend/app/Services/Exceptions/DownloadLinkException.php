<?php

namespace App\Services\Exceptions;

use RuntimeException;

class DownloadLinkException extends RuntimeException
{
    public function __construct(string $message = "Unable to generate download link", int $code = 0, ?\Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }
}
