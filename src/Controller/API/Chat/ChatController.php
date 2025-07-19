<?php

namespace App\Controller\API\Chat;

use App\DTO\Chat\AddMessage;
use App\Serializer\SerializerGroups;
use App\Service\Chat\ChatService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;

#[Route('/api/chat')]
class ChatController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    public function getChat(
        ChatService $chatService,
    ): JsonResponse {
        $chat = $chatService->getOrCreateChat();

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

    #[Route('/messages', methods: ['POST'])]
    public function addMessage(
        #[MapRequestPayload]
        AddMessage $addMessage,
        ChatService $chatService,
    ): JsonResponse {
        $chat = $chatService->getOrCreateChat();
        $chatService->addMessage(
            $chat,
            $addMessage->content
        );

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
