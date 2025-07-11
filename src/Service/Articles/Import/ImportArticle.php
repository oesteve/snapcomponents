<?php

namespace App\Service\Articles\Import;

readonly class ImportArticle
{
    /**
     * @param array<string, string> $data
     */
    public function __construct(
        public array $data,
        public int $agentId,
        public int $lineNumber,
    ) {
    }
}
