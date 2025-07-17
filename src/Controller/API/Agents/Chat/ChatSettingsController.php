<?php

namespace App\Controller\API\Agents\Chat;

use App\Controller\AbstractController;
use App\Controller\API\Agents\DTO\ChatConfigData;
use App\DTO\Chat\CreateIntent;
use App\DTO\Chat\UpdateIntent;
use App\Entity\Agent;
use App\Entity\ChatConfiguration;
use App\Entity\ChatIntent;
use App\Repository\ChatConfigurationRepository;
use App\Repository\ChatIntentRepository;
use App\Security\Voter\AgentVoter;
use App\Service\Chat\Component\ComponentManager;
use App\Service\Chat\Tool\ToolManager;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/agents/{agentId:agent.id}/chats/settings', format: 'json')]
#[IsGranted('ROLE_ADMIN')]
class ChatSettingsController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    #[IsGranted(AgentVoter::EDIT, 'agent')]
    public function list(
        Agent $agent,
    ): JsonResponse {
        return $this->json($agent->getChatConfiguration());
    }

    #[Route('', methods: ['PUT'])]
    #[IsGranted(AgentVoter::EDIT, 'agent')]
    public function update(
        Agent $agent,
        #[MapRequestPayload]
        ChatConfigData $chatConfigData,
        ChatConfigurationRepository $chatConfigurationRepository,
        ChatIntentRepository $chatIntentRepository,
    ): JsonResponse {
        $chatConfiguration = $agent->getChatConfiguration();

        if (!$chatConfiguration) {
            // Use default data; those fields are not visible.
            $chatConfiguration = new ChatConfiguration(
                'Default',
                'Default chat configuration',
                $chatConfigData->instructions,
                $agent
            );

            $agent->setChatConfiguration($chatConfiguration);
        } else {
            $chatConfiguration->update(
                $chatConfiguration->getName(),
                $chatConfiguration->getDescription(),
                $chatConfigData->instructions,
            );
        }

        $chatConfigurationRepository->save($chatConfiguration);

        // Remove any intents not in the updated list
        $existentIntents = $chatIntentRepository->findBy([
            'configuration' => $chatConfiguration,
        ]);

        $newIntentIds = array_map(fn (array $intentData) => $intentData['id'] ?? null, $chatConfigData->intents);

        foreach ($existentIntents as $existingIntent) {
            if (in_array($existingIntent->getId(), $newIntentIds)) {
                continue;
            }
            $chatIntentRepository->remove($existingIntent);
        }

        // update or create intents
        foreach ($chatConfigData->intents as $intentData) {
            $intent = $chatIntentRepository->findOneBy([
                'id' => $intentData['id'] ?? null,
                'configuration' => $chatConfiguration,
            ]);

            if ($intent) {
                $intent->update(
                    $intentData['name'],
                    $intentData['description'],
                    $intentData['instructions'],
                    $intentData['widgets'] ?? [],
                    $intentData['tools'] ?? [],
                );
            } else {
                $intent = new ChatIntent(
                    $intentData['name'],
                    $intentData['description'],
                    $intentData['instructions'],
                    $intentData['tools'] ?? [],
                    $intentData['widgets'] ?? [],
                    $chatConfiguration,
                );
            }

            $chatIntentRepository->save($intent);
        }

        return $this->json($chatConfiguration);
    }

    #[Route('/tools', methods: ['GET'])]
    #[IsGranted(AgentVoter::EDIT, 'agent')]
    public function tools(
        Agent $agent,
        ToolManager $toolManager,
    ): JsonResponse {
        $tools = $toolManager->getTools(ToolManager::CHAT_SCOPE);

        return $this->json(
            $tools
        );
    }

    #[Route('/components', methods: ['GET'])]
    #[IsGranted(AgentVoter::EDIT, 'agent')]
    public function components(
        Agent $agent,
        ComponentManager $widgetProvider,
    ): JsonResponse {
        return $this->json($widgetProvider->getComponents());
    }

    #[Route('/intents', methods: ['POST'])]
    #[IsGranted(AgentVoter::EDIT, 'agent')]
    public function createIntent(
        Agent $agent,
        #[MapRequestPayload]
        CreateIntent $createIntent,
        ChatIntentRepository $chatIntentRepository,
    ): JsonResponse {
        $configuration = $agent->getChatConfiguration();

        if (!$configuration) {
            throw $this->createNotFoundException('Chat configuration not found');
        }

        $intent = new ChatIntent(
            $createIntent->name,
            $createIntent->description,
            $createIntent->instructions,
            $createIntent->tools,
            $createIntent->widgets,
            $configuration
        );

        $chatIntentRepository->save($intent);

        return $this->json($intent);
    }

    #[Route('/intents/{id}', methods: ['PUT'])]
    public function updateIntent(
        ChatIntent $intent,
        #[MapRequestPayload]
        UpdateIntent $updateIntent,
        ChatIntentRepository $chatIntentRepository,
    ): JsonResponse {
        $intent->update(
            $updateIntent->name,
            $updateIntent->description,
            $updateIntent->instructions,
            $updateIntent->tools,
            $updateIntent->widgets
        );

        $chatIntentRepository->save($intent);

        return $this->json($intent);
    }

    #[Route('/intents/{id}', methods: ['DELETE'])]
    public function removeIntent(
        ChatIntent $intent,
        ChatIntentRepository $chatIntentRepository,
    ): JsonResponse {
        $chatIntentRepository->remove($intent);

        return $this->json(null);
    }
}
