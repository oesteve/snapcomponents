<?php

namespace App\Entity;

use App\Repository\ChatMessageRepository;
use App\Serializer\SerializerGroups;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute as Serializer;

#[ORM\Entity(repositoryClass: ChatMessageRepository::class)]
class ChatMessage extends BaseEntity
{
    public const string ROLE_USER = 'user';
    public const string ROLE_ASSISTANT = 'assistant';
    public const string ROLE_SYSTEM = 'system';
    public const string ROLE_TOOL = 'tool';

    #[Serializer\Groups([SerializerGroups::CHAT])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    /** @phpstan-ignore-next-line */
    private int $id;

    #[Serializer\Groups([SerializerGroups::CHAT])]
    #[ORM\Column(length: 64)]
    private string $role;

    #[Serializer\Groups([SerializerGroups::CHAT])]
    #[ORM\Column(type: Types::TEXT)]
    private string $content;

    #[ORM\ManyToOne(inversedBy: 'messages')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private Chat $chat;

    public function __construct(
        Chat $chat,
        string $role,
        string $content,
    ) {
        $this->chat = $chat;
        $this->role = $role;
        $this->content = $content;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getContent(): string
    {
        return $this->content;
    }

    public function getRole(): string
    {
        return $this->role;
    }

    public function getChat(): Chat
    {
        return $this->chat;
    }
}
