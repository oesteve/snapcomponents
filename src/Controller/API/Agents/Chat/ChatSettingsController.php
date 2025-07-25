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
use App\Serializer\SerializerGroups;
use App\Service\Chat\Component\ComponentManager;
use App\Service\Chat\Tool\ToolManager;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;

#[Route('/api/agents/{agentId:agent.id}/chats/settings', format: 'json')]
#[IsGranted('ROLE_ADMIN')]
class ChatSettingsController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    #[IsGranted(AgentVoter::EDIT, 'agent')]
    public function list(
        Agent $agent,
    ): JsonResponse {
        return $this->json(
            $agent->getChatConfiguration(),
            Response::HTTP_OK,
            [],
            [
                AbstractNormalizer::GROUPS => [
                    SerializerGroups::API_LIST,
                ],
            ]
        );
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
                $chatConfigData->name,
                $chatConfiguration->getDescription(),
                $chatConfigData->instructions,
            );
        }

        $chatConfigurationRepository->save($chatConfiguration);

        return $this->json(
            $chatConfiguration,
            Response::HTTP_OK,
            [],
            [
                AbstractNormalizer::GROUPS => [
                    SerializerGroups::API_LIST,
                ],
            ]
        );
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
        return $this->json(
            $widgetProvider->getComponents(),
        );
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

        return $this->json(
            $intent,
            Response::HTTP_OK,
            [],
            [
                AbstractNormalizer::GROUPS => [
                    SerializerGroups::API_LIST,
                ],
            ]
        );
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

        return $this->json(
            $intent,
            Response::HTTP_OK,
            [],
            [
                AbstractNormalizer::GROUPS => [
                    SerializerGroups::API_LIST,
                ],
            ]
        );
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
