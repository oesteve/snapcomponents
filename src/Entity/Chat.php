<?php

namespace App\Entity;

use App\Repository\ChatRepository;
use App\Serializer\SerializerGroups;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute as Serializer;

#[ORM\Entity(repositoryClass: ChatRepository::class)]
class Chat extends BaseEntity
{
    #[Serializer\Groups([SerializerGroups::CHAT])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Serializer\Groups([SerializerGroups::CHAT])]
    #[ORM\Column(length: 255, nullable: false)]
    private string $sessionId;

    /**
     * @var Collection<int, ChatMessage>
     */
    #[Serializer\Groups([SerializerGroups::CHAT])]
    #[ORM\OneToMany(targetEntity: ChatMessage::class, mappedBy: 'chat', orphanRemoval: true)]
    private Collection $messages;

    #[ORM\ManyToOne(targetEntity: Agent::class, inversedBy: 'chats')]
    #[ORM\JoinColumn(nullable: false)]
    private Agent $agent;

    #[ORM\ManyToOne]
    private ?ChatIntent $intent = null;

    #[Serializer\Groups([SerializerGroups::CHAT])]
    #[ORM\ManyToOne(targetEntity: ChatConfiguration::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ChatConfiguration $configuration;

    /**
     * @param array<ChatMessage> $messages
     */
    public function __construct(
        Agent $agent,
        ChatConfiguration $configuration,
        string $sessionId,
        array $messages = [],
    ) {
        $this->agent = $agent;
        $this->configuration = $configuration;
        $this->sessionId = $sessionId;
        $this->messages = new ArrayCollection($messages);
    }

    public function setIntent(ChatIntent $intent): void
    {
        $this->intent = $intent;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAgent(): Agent
    {
        return $this->agent;
    }

    /**
     * @return Collection<int, ChatMessage>
     */
    public function getMessages(bool $isDebug = false): Collection
    {
        if ($isDebug) {
            return $this->messages;
        }

        $values = $this->messages->filter(function (ChatMessage $message) {
            return in_array($message->getRole(), [
                ChatMessage::ROLE_USER,
                ChatMessage::ROLE_ASSISTANT,
            ], true);
        })->getValues();

        return new ArrayCollection($values);
    }

    public function addMessage(ChatMessage $message): void
    {
        $this->messages->add($message);
    }

    public function getConfiguration(): ChatConfiguration
    {
        return $this->configuration;
    }

    public function getIntent(): ?ChatIntent
    {
        return $this->intent;
    }

    public function getSessionId(): string
    {
        return $this->sessionId;
    }
}
