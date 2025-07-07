<?php

namespace App\Controller\API\Chat;

use App\DTO\Chat\AddMessage;
use App\DTO\Chat\CreateIntent;
use App\DTO\Chat\CreateMessage;
use App\DTO\Chat\UpdateIntent;
use App\Entity\Chat;
use App\Entity\ChatIntent;
use App\Repository\ChatConfigurationRepository;
use App\Repository\ChatIntentRepository;
use App\Service\Chat\ChatService;
use App\Service\Chat\Component\ComponentManager;
use App\Service\Chat\Tool\ToolManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/chats')]
class ChatController extends AbstractController
{
    #[Route('/tools', methods: ['GET'])]
    public function tools(
        ToolManager $toolManager,
    ): JsonResponse {
        $tools = $toolManager->getTools(ToolManager::CHAT_SCOPE);

        return $this->json(
            $tools
        );
    }

    #[Route('/components', methods: ['GET'])]
    public function components(
        ComponentManager $widgetProvider,
    ): JsonResponse {
        return $this->json($widgetProvider->getComponents());
    }

    #[Route('/intents', methods: ['POST'])]
    public function createIntent(
        #[MapRequestPayload]
        CreateIntent $createIntent,
        ChatIntentRepository $chatIntentRepository,
        ChatConfigurationRepository $chatConfigurationRepository,
    ): JsonResponse {
        $configuration = $chatConfigurationRepository->findOrFail($createIntent->configurationId);

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

    #[Route('', methods: ['POST'])]
    public function sendMessage(
        #[MapRequestPayload]
        CreateMessage $createMessage,
        ChatService $chatService,
    ): JsonResponse {
        $chat = $chatService->createChat($createMessage->content);

        return $this->json($chat);
    }

    #[Route('/{id}', methods: ['GET'])]
    public function getChat(Chat $chat): JsonResponse
    {
        return $this->json($chat);
    }

    #[Route('/{id}/messages', methods: ['POST'])]
    public function addMessage(
        #[MapRequestPayload]
        AddMessage $addMessage,
        Chat $chat,
        ChatService $chatService,
    ): JsonResponse {
        $chatService->addMessage($chat, $addMessage->content);

        return $this->json($chat);
    }
}
