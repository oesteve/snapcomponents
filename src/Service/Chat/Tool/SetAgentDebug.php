<?php

namespace App\Service\Chat\Tool;

use App\Entity\ChatMessage;
use App\Service\Agent\SessionProvider;

readonly class SetAgentDebug implements ToolInterface
{
    public function __construct(
        private SessionProvider $sessionProvider,
    ) {
    }

    public function getName(): string
    {
        return 'set_agent_debug';
    }

    public function getDisplayName(): string
    {
        return 'Set agent debug mode';
    }

    public function getDescription(ChatMessage $message): string
    {
        return 'Enable or disable the agent debug mode. Useful for debugging and development purposes.';
    }

    public function getParameters(ChatMessage $message): array
    {
        return [
            'type' => 'object',
            'properties' => [
                'enabled' => [
                    'type' => 'boolean',
                    'description' => 'Define the debug mode enabled or not.',
                ],
            ],
            'required' => [
                'enabled',
            ],
            'additionalProperties' => false,
        ];
    }

    /**
     * @param array{enabled: bool} $parameters
     */
    public function execute(ChatMessage $message, array $parameters): string
    {
        $this->sessionProvider->setDebugEnabled($parameters['enabled']);

        return '';
    }

    public function support(string $scope): bool
    {
        return true;
    }
}
