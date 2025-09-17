<?php

namespace App\Logging;

use App\Repositories\ErrorLogRepository;
use Monolog\Handler\AbstractProcessingHandler;
use Monolog\Logger;

class DatabaseErrorHandler extends AbstractProcessingHandler
{
    public function __construct(private readonly ErrorLogRepository $repository, int $level = Logger::ERROR, bool $bubble = true)
    {
        parent::__construct($level, $bubble);
    }

    protected function write(array $record): void
    {
        $context = $record['context'] ?? null;
        $this->repository->record($record['level_name'] ?? 'ERROR', (string)$record['message'], $context ?: null);
    }
}
