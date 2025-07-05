<?php

namespace App\Tests\Service\Chat\ChatService;

use App\Entity\ChatConfiguration;
use App\Entity\ChatIntent;
use App\Service\Chat\ChatService;
use App\Service\Chat\Tool\SearchArticle;
use App\Service\Search\ArticleSearchService;

class ReturnComponentTest extends AbstractChatServiceTest
{
    public function withIntents(ChatConfiguration $configuration): array
    {
        return [
            new ChatIntent(
                'counter',
                'Retrieve a counter',
                'Acts as a counter, returns a counter based in the user query.',
                [],
                [
                    'counter'
                ],
                $configuration
            )
        ];
    }

    public function testSearchArticleResponse(): void
    {
        $chatService = $this->getService(ChatService::class);

        $res = $chatService->createChat("Give me a counter from 5");

        $this->assertEquals("counter", $res->getIntent()?->getName());

        $this->assertStringContainsStringIgnoringCase(
            '<wg-counter initial-value="5"></wg-counter>',
            $res->getMessages()->last()?->getContent() ?? ''
        );
    }
}
