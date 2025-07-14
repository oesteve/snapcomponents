<?php

namespace App\Service\Search;

use OpenAI\Client;
use Psr\Http\Client\ClientInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

readonly class EmbeddingsService
{
    private Client $client;

    public function __construct(
        private LoggerInterface $logger,
        #[Autowire(env: 'OPENAI_SECRET_KEY')]
        string $apiApiKey,
        ClientInterface $httpClient,
    ) {
        $this->client = \OpenAI::factory()
            ->withApiKey($apiApiKey)
            ->withHttpClient($httpClient)
            ->make();
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
