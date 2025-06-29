<?php

namespace App\Tests\Service\Chat\ChatService;

use App\Entity\Agent;
use App\Entity\ChatConfiguration;
use App\Entity\ChatIntent;
use App\Entity\User;
use App\Repository\AgentRepository;
use App\Repository\ChatConfigurationRepository;
use App\Repository\UserRepository;
use App\Service\Agent\AgentIdentifierProvider;
use App\Service\Chat\ChatService;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\HttpKernel\KernelInterface;

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
                $configuration
            ),
        ];
    }

    public function testDetermineIntent(): void
    {
        $chatService = $this->getService(ChatService::class);

        $chat = $chatService->createChat("I want ask for a refound or my order.");
        $this->assertEquals('support', $chat->getIntent()?->getName());
        $this->assertStringContainsStringIgnoringCase('FAQ', $chat->getMessages()->last()->getContent());;
    }
}
