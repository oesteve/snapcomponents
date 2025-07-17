<?php

namespace App\Controller\API\Chat;

use App\DTO\Chat\AddMessage;
use App\DTO\Chat\CreateMessage;
use App\Entity\Chat;
use App\Service\Chat\ChatService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/chats')]
class ChatController extends AbstractController
{
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
