<?php

namespace App\Tests\Service\Chat\ChatService;

use App\Service\Chat\ChatService;

class SayHelloTest extends AbstractChatServiceTest
{
    public function testChatResponse(): void
    {
        /** @var ChatService $chatService */
        $chatService = static::getContainer()->get(ChatService::class);

        $res = $chatService->createChat('Say hello');
        $content = $res->getMessages()->last()->getContent();

        $this->assertStringContainsStringIgnoringCase('hello', $content);
    }
}
