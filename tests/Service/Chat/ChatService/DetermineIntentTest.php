<?php

namespace App\Tests\Service\Chat\ChatService;

use App\Entity\ChatConfiguration;
use App\Entity\ChatIntent;
use App\Service\Chat\ChatService;

class DetermineIntentTest extends AbstractChatServiceTest
{
    protected function withIntents(ChatConfiguration $configuration): array
    {
        return [
            new ChatIntent(
                'play_music',
                'The user wants to play music.',
                'Say the user to play a song with a falute',
                [],
                [],
                $configuration
            ),
            new ChatIntent(
                'cooking',
                'The user wants to cook something.',
                'Ask the user to cook a delicious dish.',
                [],
                [],
                $configuration
            ),
            new ChatIntent(
                'get_weather',
                'The user wants to know the weather.',
                'Provide weather information for the requested location.',
                [],
                [],
                $configuration
            ),
            new ChatIntent(
                'get_news',
                'The user wants to be more happy',
                'Tell to the user a joke',
                [],
                [],
                $configuration
            ),
        ];
    }

    public function testDetermineIntent(): void
    {
        $chatService = $this->getService(ChatService::class);

        $chat = $chatService->createChat('I want to play music');
        $this->assertEquals('play_music', $chat->getIntent()?->getName());
    }

    public function testUnknownIntent(): void
    {
        $chatService = $this->getService(ChatService::class);

        $chat = $chatService->createChat('Random unrelated message');
        $this->assertNull($chat->getIntent());
    }

    public function testChangeIntent(): void
    {
        $chatService = $this->getService(ChatService::class);

        // Set an initial intention
        $chat = $chatService->createChat('I want to play music');
        $this->assertEquals('play_music', $chat->getIntent()?->getName());

        // Change my mind
        $chat = $chatService->createChat("I'm hungry");
        $this->assertEquals('cooking', $chat->getIntent()?->getName());

        // Unrelated topic
        $chat = $chatService->createChat("I'm really tired, I want to have a nap");
        $this->assertNull($chat->getIntent());
    }
}
