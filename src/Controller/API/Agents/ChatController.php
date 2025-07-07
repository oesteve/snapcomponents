<?php

namespace App\Controller\API\Agents;

use App\Controller\AbstractController;
use App\Controller\API\Agents\DTO\AgentData;
use App\Controller\API\Agents\DTO\ChatConfigData;
use App\Entity\Agent;
use App\Entity\ChatConfiguration;
use App\Entity\ChatIntent;
use App\Repository\AgentRepository;
use App\Repository\ChatConfigurationRepository;
use App\Repository\ChatIntentRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/agents/{id:agent}/chat', format: 'json')]
#[IsGranted('ROLE_ADMIN')]
class ChatController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    public function list(
        Agent $agent,
    ): JsonResponse {
        return $this->json($agent->getChatConfiguration());
    }

    #[Route('', methods: ['POST'])]
    public function create(
        #[MapRequestPayload]
        AgentData $agentData,
        AgentRepository $agentRepository,
    ): JsonResponse {
        $agent = new Agent(
            $agentData->name,
            $this->getLoggedUserOrFail(),
        );

        $agentRepository->save($agent);

        return $this->json($agent);
    }

    #[Route('', methods: ['PUT'])]
    public function update(
        Agent $agent,
        #[MapRequestPayload]
        ChatConfigData $chatConfigData,
        ChatConfigurationRepository $chatConfigurationRepository,
        ChatIntentRepository $chatIntentRepository,
    ): JsonResponse {
        $chatConfiguration = $agent->getChatConfiguration();

        if (!$chatConfiguration) {
            $chatConfiguration = new ChatConfiguration(
                $chatConfigData->name,
                $chatConfigData->description,
                $chatConfigData->instructions,
                $agent
            );

            $agent->setChatConfiguration($chatConfiguration);
        } else {
            $chatConfiguration->update(
                $chatConfigData->name,
                $chatConfigData->description,
                $chatConfigData->instructions,
            );

            $chatConfigurationRepository->save($chatConfiguration);
        }

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
}
