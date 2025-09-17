<?php

declare(strict_types=1);

namespace Tests\Repositories;

use App\Repositories\ResourceRepository;
use Tests\TestCase;

final class ResourceRepositoryTest extends TestCase
{
    public function testUpdateStatusApprovesResource(): void
    {
        $repository = new ResourceRepository($this->pdo);
        $uploaderId = $this->createUser(['role' => 'student']);
        $reviewerId = $this->createUser(['role' => 'admin']);

        $resourceId = $repository->create([
            'uploader_id' => $uploaderId,
            'title' => 'Linear Algebra Notes',
            'description' => '矩阵、特征向量与线性变换笔记。',
            'cos_key' => 'uploads/notes.pdf',
            'original_filename' => 'notes.pdf',
            'status' => 'pending',
        ]);

        $updated = $repository->updateStatus($resourceId, 'approved', $reviewerId);
        self::assertTrue($updated);

        $resource = $repository->findById($resourceId);
        self::assertSame('approved', $resource['status']);
        self::assertSame($reviewerId, (int)$resource['approved_by']);
        self::assertNotNull($resource['approved_at']);
    }
}
