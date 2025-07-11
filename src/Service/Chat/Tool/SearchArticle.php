<?php

namespace App\Service\Chat\Tool;

use App\Entity\ChatMessage;
use App\Service\Articles\ArticleSearchService;
use Symfony\Component\Serializer\SerializerInterface;

class SearchArticle implements ToolInterface
{
    public const string NAME = 'search_article';

    public function __construct(
        private ArticleSearchService $searchService,
        private SerializerInterface $serializer,
    ) {
    }

    public function getName(): string
    {
        return self::NAME;
    }

    /**
     * @return array<string, mixed>
     */
    public function getParameters(
        ChatMessage $message,
    ): array {
        return [
            'type' => 'object',
            'properties' => [
                'query' => [
                    'type' => 'string',
                    'description' => 'Terms of use',
                ],
                'category' => [
                    'type' => 'string',
                    'description' => 'Category of the article',
                    'enum' => $this->searchService->getCategories(),
                ],
            ],
            'required' => ['query'],
            'additionalProperties' => false,
        ];
    }

    public function getDescription(
        ChatMessage $message,
    ): string {
        return 'Search results articles database';
    }

    /**
     * @param array{query: string} $parameters
     */
    public function execute(
        ChatMessage $message,
        array $parameters,
    ): string {
        $agent = $message->getChat()->getAgent();
        $articles = $this->searchService->search($agent, $parameters['query']);

        return $this->serializer->serialize($articles, 'json');
    }

    public function getDisplayName(): string
    {
        return 'Search Articles';
    }

    public function support(string $scope): bool
    {
        return in_array($scope, [ToolManager::CHAT_SCOPE]);
    }
}
