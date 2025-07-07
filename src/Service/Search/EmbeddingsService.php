<?php

namespace App\Service\Search;

use OpenAI\Client;
use Psr\Log\LoggerInterface;

readonly class EmbeddingsService
{
    public function __construct(
        private Client $client,
        private LoggerInterface $logger,
    ) {
    }

    /**
     * @return array<float>
     */
    public function createEmbeddings(string $text): array
    {
        $start = microtime(true);

        $res = $this->client->embeddings()->create([
            'input' => $text,
            'model' => 'text-embedding-3-small',
            'encoding_format' => 'float',
        ]);

        $this->logger->notice(
            'OpenAI Embeddings request',
            [
                'duration' => (int) ((microtime(true) - $start) * 1000),
                'text' => $text,
            ]
        );

        return $res['data'][0]['embedding'];
    }
}
