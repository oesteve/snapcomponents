<?php

namespace App\Service\Search;

use OpenAI\Client;

class EmbedingsService
{
    public function __construct(
        private Client $client,
    )
    {
    }

    public function createEmbeddings(string $text): array
    {
        $res = $this->client->embeddings()->create([
            'input' => $text,
            "model" => "text-embedding-3-small",
            "encoding_format" => "float"
        ]);

        return $res['data'][0]['embedding'];
    }
}
