<?php

namespace App\Service\Chat;

use App\Entity\Chat;
use App\Entity\ChatMessage;
use App\Repository\ChatMessageRepository;
use App\Repository\ChatRepository;
use App\Service\Agent\AgentService;
use App\Service\Chat\Function\SearchFunction;
use OpenAI;
use OpenAI\Responses\Chat\CreateResponseToolCall;
use OpenAI\Responses\Chat\CreateResponseToolCallFunction;

readonly class ChatService
{
    public function __construct(
        private ChatRepository        $chatRepository,
        private ChatMessageRepository $chatMessageRepository,
        private AgentService          $agentService,
        private OpenAI\Client         $client,
        private SearchFunction        $searchFunction,
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

        $result = $this->processChatInteraction($messages);

        $responseMessage = $result->choices[0]->message;

        if ($responseMessage->toolCalls) {
            $this->handleToolCalls($responseMessage->toolCalls);
        }

        $message = new ChatMessage(
            $message->getChat(),
            $responseMessage->role,
            $responseMessage->content,
        );

        $message->getChat()->addMessage($message);

        $this->chatMessageRepository->save($message);
    }

    private function handleToolCalls(CreateResponseToolCall $responseToolCall): array
    {
        return [
            'role' => 'tool',
            'tool_call_id' => $responseToolCall->id,
            'content' => $this->executeFunction($responseToolCall->function)
        ];
    }

    private function executeFunction(CreateResponseToolCallFunction $function): string
    {
        return $this->searchFunction->execute(json_decode($function->arguments, true));
    }

    /**
     * @param array $messages
     * @return OpenAI\Responses\Chat\CreateResponse
     */
    private function processChatInteraction(array $messages): OpenAI\Responses\Chat\CreateResponse
    {
        $result = $this->client->chat()->create([
            'model' => 'gpt-4o',
            'messages' => [
                [
                    "role" => "developer",
                    "content" => 'You are a helpful assistant. Yo can send responses using mdx with the components: <wg-counter initial-value=\"100\" />'
                ],
                ...$messages
            ],
            'tools' => [[
                "type" => "function",
                "function" => $this->searchFunction->getConfiguration(),
            ]]
        ]);


        $responseMessage = $result->choices[0]->message;

        if ($responseMessage->toolCalls) {
            $responses = [];
            foreach ($responseMessage->toolCalls as $toolCall) {
                $responses[] = $this->handleToolCalls($toolCall);
            }

            if ($responses) {
                $result = $this->processChatInteraction([
                    ...$messages,
                    $responseMessage->toArray(),
                    ...$responses,
                ]);
            }
        }

        return $result;
    }
}
