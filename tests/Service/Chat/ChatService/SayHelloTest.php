<?php

namespace App\Tests\Service\Chat\ChatService;

use App\Service\Chat\ChatService;

class SayHelloTest extends AbstractChatServiceTest
{
    public function testChatResponse(): void
    {
        $chatService = $this->getService(ChatService::class);

        $res = $chatService->createChat('Say hello');
        $lastMessage = $res->getMessages()->last();
        $this->assertNotFalse($lastMessage, 'No messages found');
        $content = $lastMessage->getContent();

        $this->assertStringContainsStringIgnoringCase('hello', $content);
    }
}
