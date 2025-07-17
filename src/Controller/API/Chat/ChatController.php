<?php

namespace App\Controller\API\Chat;

use App\DTO\Chat\AddMessage;
use App\DTO\Chat\CreateMessage;
use App\Entity\Chat;
use App\Serializer\SerializerGroups;
use App\Service\Chat\ChatService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;

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

        return $this->json(
            $chat,
            Response::HTTP_OK,
            [],
            [
                AbstractNormalizer::GROUPS => [
                    SerializerGroups::CHAT,
                ],
            ]
        );
    }

    #[Route('/{id}', methods: ['GET'])]
    public function getChat(Chat $chat): JsonResponse
    {
        return $this->json(
            $chat,
            Response::HTTP_OK,
            [],
            [
                AbstractNormalizer::GROUPS => [
                    SerializerGroups::CHAT,
                ],
            ]
        );
    }

    #[Route('/{id}/messages', methods: ['POST'])]
    public function addMessage(
        #[MapRequestPayload]
        AddMessage $addMessage,
        Chat $chat,
        ChatService $chatService,
    ): JsonResponse {
        $chatService->addMessage($chat, $addMessage->content);

        return $this->json(
            $chat,
            Response::HTTP_OK,
            [],
            [
                AbstractNormalizer::GROUPS => [
                    SerializerGroups::CHAT,
                ],
            ]
        );
    }
}
