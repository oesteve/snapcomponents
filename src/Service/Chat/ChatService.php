<?php

namespace App\Service\Chat;

use App\Entity\Agent;
use App\Entity\Chat;
use App\Entity\ChatMessage;
use App\Repository\AgentRepository;
use App\Repository\ChatMessageRepository;
use App\Repository\ChatRepository;
use App\Service\Agent\AgentService;

readonly class ChatService
{
    public function __construct(
        private ChatRepository        $chatRepository,
        private ChatMessageRepository $chatMessageRepository,
        private AgentService          $agentService,
    )
    {
    }

    public function createChat(
        string $content,
    ): Chat
    {
        $chat = new Chat(
            $this->agentService->getAgentOrFail(),
        );

        $this->chatRepository->save($chat);

        $message = new ChatMessage(
            $chat,
            $content,
        );

        $this->chatMessageRepository->save($message);
        $chat->addMessage($message);

        $this->handleMessage($message);
        return $chat;
    }

    private function handleMessage(ChatMessage $message): void
    {
        $message = new ChatMessage(
            $message->getChat(),
            "echo: ".$message->getContent(),
        );

        $message->getChat()->addMessage($message);

        $this->chatMessageRepository->save($message);
    }

    public function addMessage(Chat $chat, string $content): void
    {
        $message = new ChatMessage(
            $chat,
            $content,
        );

        $this->chatMessageRepository->save($message);
        $chat->addMessage($message);

        $this->handleMessage($message);
    }
}
