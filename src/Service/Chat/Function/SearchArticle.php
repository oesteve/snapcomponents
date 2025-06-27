<?php

namespace App\Service\Chat\Function;

use App\Service\Search\ArticleSearchService;
use Symfony\Component\Serializer\SerializerInterface;

class SearchArticle implements FunctionInterface
{


    public function __construct(
        private ArticleSearchService $searchService,
        private SerializerInterface  $serializer,
    )
    {
    }

    public function getName(): string
    {
        return "search_article";
    }

    public function getParameters(): array
    {
        return [
            "type" => "object",
            "properties" => [
                "query" => [
                    "type" => "string",
                    "description" => "Terms of use"
                ]
            ],
            "required" => ["query"],
            "additionalProperties" => false
        ];
    }

    public function getDescription(): string
    {
        return "Search in the database of articles";
    }

    public function execute(array $parameters): string
    {
        $articles = $this->searchService->search($parameters["query"]);

        return $this->serializer->serialize($articles, 'json');
    }
}
