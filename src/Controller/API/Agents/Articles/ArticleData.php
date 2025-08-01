<?php

namespace App\Controller\API\Agents\Articles;

class ArticleData
{
    public function __construct(
        public readonly string $title,
        public readonly string $description,
        public readonly string $content,
        public readonly int $categoryId,
    ) {
    }
}
