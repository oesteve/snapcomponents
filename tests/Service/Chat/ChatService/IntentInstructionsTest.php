<?php

namespace App\Tests\Service\Chat\ChatService;

use App\Entity\ChatConfiguration;
use App\Entity\ChatIntent;
use App\Service\Chat\ChatService;

class IntentInstructionsTest extends AbstractChatServiceTest
{
    protected function withIntents(ChatConfiguration $configuration): array
    {
        return [
            new ChatIntent(
                'support',
                'Provide support about the their purchases in the store.',
                'Your access to information about the order is limited. Please refer to the FAQ section of the store for any related support topics.',
                [],
                [],
                $configuration
            ),
        ];
    }

    public function testDetermineIntent(): void
    {
        $chatService = $this->getService(ChatService::class);

        $chat = $chatService->createChat('I want ask for a refound or my order.');
        $this->assertEquals('support', $chat->getIntent()?->getName());

        $lastMessage = $chat->getMessages()->last();
        $this->assertNotFalse($lastMessage, 'No messages found');
        $this->assertStringContainsStringIgnoringCase('FAQ', $lastMessage->getContent());
    }
}
