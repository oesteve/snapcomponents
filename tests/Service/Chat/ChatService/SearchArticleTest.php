<?php

namespace App\Tests\Service\Chat\ChatService;

use App\Entity\ChatConfiguration;
use App\Entity\ChatIntent;
use App\Service\Articles\ArticleSearchService;
use App\Service\Chat\ChatService;
use App\Service\Chat\Tool\SearchArticle;

class SearchArticleTest extends AbstractChatServiceTest
{
    public function withIntents(ChatConfiguration $configuration): array
    {
        return [
            new ChatIntent(
                'search_article',
                'Search an article',
                'Acts as articles searcher, find articles based in the user query. If no articles are found, it will return a message saying that no articles were found.',
                [
                    SearchArticle::NAME,
                ],
                [],
                $configuration,
            ),
        ];
    }

    public function testSearchArticleResponse(): void
    {
        $searchService = $this->getMockBuilder(ArticleSearchService::class)
            ->disableOriginalConstructor()
            ->getMock();

        $searchService
            ->expects($this->once())
            ->method('search')
            ->with(self::callback(function (string $query): bool {
                return str_contains($query, 'bot');
            }))
            ->willReturn(['num_items' => '0']);

        static::getContainer()->set(ArticleSearchService::class, $searchService);

        $chatService = $this->getService(ChatService::class);

        $res = $chatService->createChat('How to create a chat bot?');

        $this->assertEquals('search_article', $res->getIntent()?->getName());
    }
}
