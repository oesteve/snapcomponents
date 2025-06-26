<?php

namespace App\Service\Chat;

use App\Entity\Chat;
use App\Entity\ChatMessage;
use App\Repository\ChatMessageRepository;
use App\Repository\ChatRepository;
use App\Service\Agent\AgentService;
use OpenAI;

readonly class ChatService
{
    public function __construct(
        private ChatRepository        $chatRepository,
        private ChatMessageRepository $chatMessageRepository,
        private AgentService          $agentService,
        private OpenAI\Client         $client,
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
            ChatMessage::ROLE_USER,
            $content,
        );

        $this->chatMessageRepository->save($message);
        $chat->addMessage($message);

        $this->handleMessage($message);
        return $chat;
    }

    public function addMessage(Chat $chat, string $content): void
    {
        $message = new ChatMessage(
            $chat,
            ChatMessage::ROLE_USER,
            $content,
        );

        $this->chatMessageRepository->save($message);
        $chat->addMessage($message);

        $this->handleMessage($message);
    }


    private function handleMessage(ChatMessage $message): void
    {

        $messages = $message->getChat()->getMessages()->map(function (ChatMessage $message) {
            return [
                'role' => $message->getRole(),
                'content' => $message->getContent(),
            ];
        })->toArray();

        $result = $this->client->chat()->create([
            'model' => 'gpt-4o',
            'messages' => [
                [
                  "role" => "developer",
                  "content" => 'You are a helpful assistant. Yo can send responses using mdx with the components: <wg-counter initial-value=\"100\" />'
                ],
                ...$messages
            ]
        ]);

        $createResponseMessage = $result->choices[0]->message;

        $message = new ChatMessage(
            $message->getChat(),
            $createResponseMessage->role,
            $createResponseMessage->content,
        );

        $message->getChat()->addMessage($message);

        $this->chatMessageRepository->save($message);
    }
}
