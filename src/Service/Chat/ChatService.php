<?php

namespace App\Service\Chat;

use App\Entity\Chat;
use App\Entity\ChatMessage;
use App\Repository\ChatMessageRepository;
use App\Repository\ChatRepository;
use App\Service\Agent\AgentService;
use App\Service\Chat\Function\FunctionInterface;
use OpenAI;
use OpenAI\Responses\Chat\CreateResponse;
use OpenAI\Responses\Chat\CreateResponseToolCall;
use OpenAI\Responses\Chat\CreateResponseToolCallFunction;
use Symfony\Component\DependencyInjection\Attribute\AutowireIterator;

class ChatService
{

    /**
     * @var array<string, FunctionInterface>
     */
    private array $functions = [];

    /**
     * @param ChatRepository $chatRepository
     * @param ChatMessageRepository $chatMessageRepository
     * @param AgentService $agentService
     * @param OpenAI\Client $client
     * @param array<FunctionInterface> $functions
     */
    public function __construct(
        private ChatRepository        $chatRepository,
        private ChatMessageRepository $chatMessageRepository,
        private AgentService          $agentService,
        private OpenAI\Client         $client,
        #[AutowireIterator(tag: 'app.chat.function')]
        iterable        $functions,
    )
    {

        foreach ($functions as $function) {
            $this->functions[$function->getName()] = $function;
        }

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

        $this->handleChatMessage($message);
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

        $this->handleChatMessage($message);
    }


    private function handleChatMessage(ChatMessage $message): void
    {
        $messages = $message->getChat()->getMessages()->map(function (ChatMessage $message) {
            return [
                'role' => $message->getRole(),
                'content' => $message->getContent(),
            ];
        })->toArray();

        $result = $this->processChatInteraction($messages);
        $responseMessage = $result->choices[0]->message;

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

        if (!isset($this->functions[$function->name])) {
            return '';
        }

        $parameters = json_decode($function->arguments, true);

        return $this->functions[$function->name]->execute($parameters);
    }

    /**
     * @param array $messages
     * @return CreateResponse
     */
    private function processChatInteraction(array $messages): CreateResponse
    {
        $tools = $this->getFunctionDefinitions();
        $result = $this->client->chat()->create([
            'model' => 'gpt-4o',
            'messages' => [
                [
                    "role" => "developer",
                    "content" => 'You are a helpful assistant. Yo can send responses using mdx with the components: <wg-counter initial-value=\"100\" />'
                ],
                ...$messages
            ],
            'tools' => $tools
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

    /**
     * @return array[]
     */
    private function getFunctionDefinitions(): array
    {
        return array_values(array_map(function (FunctionInterface $function) {
            return [
                'type' => 'function',
                'function' => [
                    'name' => $function->getName(),
                    'description' => $function->getDescription(),
                    'parameters' => $function->getParameters(),
                ]
            ];
        }, $this->functions));
    }
}
