<?php

namespace App\Service\Search;

use OpenAI\Client;
use Psr\Cache\CacheItemPoolInterface;
use Psr\Http\Client\ClientInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

readonly class Embedder
{
    private Client $client;

    public function __construct(
        private CacheItemPoolInterface $cache,
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
        // Create a cache key based on the text
        $cacheKey = 'embedding_'.md5($text);

        // Try to get from cache
        $cacheItem = $this->cache->getItem($cacheKey);

        if ($cacheItem->isHit()) {
            return $cacheItem->get();
        }

        $res = $this->client->embeddings()->create([
            'input' => $text,
            'model' => 'text-embedding-3-small',
            'encoding_format' => 'float',
        ]);

        $embeddings = $res['data'][0]['embedding'];

        // Store in cache
        $cacheItem->set($embeddings);
        // Cache for 30 days (embeddings don't change for the same text)
        $cacheItem->expiresAfter(30 * 24 * 60 * 60);
        $this->cache->save($cacheItem);

        return $embeddings;
    }
}
