<?php

namespace App\Entity;

use App\Repository\ChatRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ChatRepository::class)]
class Chat extends BaseEntity
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    /**
     * @var Collection<int, ChatMessage>
     */
    #[ORM\OneToMany(targetEntity: ChatMessage::class, mappedBy: 'chat', orphanRemoval: true)]
    private Collection $messages;

    #[ORM\ManyToOne(targetEntity: Agent::class, inversedBy: 'chats')]
    #[ORM\JoinColumn(nullable: false)]
    private Agent $agent;

    public function __construct(
        Agent $agent,
        array $messages = [],
    )
    {
        $this->agent = $agent;
        $this->messages = new ArrayCollection($messages);
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
    public function getMessages(): Collection
    {
        return $this->messages;
    }

    public function addMessage(ChatMessage $message): void
    {
        $this->messages->add($message);
    }
}
