<?php

namespace App\Service\Chat\Tool;

use App\Entity\ChatIntent;
use App\Entity\ChatMessage;

class DefineIntent implements ToolInterface
{
    public const string NAME = 'define_intent';

    public function getName(): string
    {
        return self::NAME;
    }

    public function getDisplayName(): string
    {
        return 'Define Intent';
    }

    /**
     * @return array<string, mixed>
     */
    public function getParameters(
        ChatMessage $message,
    ): array {
        $intents = $this->getAvailableIntentNames($message);

        return [
            'type' => 'object',
            'properties' => [
                'intent' => [
                    'type' => 'string',
                    'enum' => $intents,
                    'description' => 'the type of intent',
                ],
            ],
            'required' => ['intent'],
            'additionalProperties' => false,
        ];
    }

    public function getDescription(
        ChatMessage $message,
    ): string {
        return 'Define an intent of the user based on their messages.';
    }

    public function execute(ChatMessage $message, array $parameters): string
    {
        $intentName = $parameters['intent'];

        $intent = $message->getChat()
            ->getConfiguration()
            ->getIntents()
            ->findFirst(function (int $idx, ChatIntent $intent) use ($intentName) {
                return $intent->getName() === $intentName;
            });

        if (!$intent) {
            return "Intent '$intentName' not found.";
        }

        $message->getChat()->setIntent($intent);

        return '';
    }

    private function getAvailableIntentNames(ChatMessage $message): array
    {
        return $message->getChat()->getConfiguration()->getIntents()->map(function ($intent) {
            return $intent->getName();
        })->toArray();
    }

    public function support(string $scope): bool
    {
        return in_array($scope, [ToolManager::CHAT_SCOPE]);
    }
}
