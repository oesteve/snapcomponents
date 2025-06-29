<?php

namespace App\Entity;

use App\Repository\AgentRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\String\ByteString;

#[ORM\Entity(repositoryClass: AgentRepository::class)]
#[ORM\Table(indexes: [
    new ORM\Index(name: 'code_idx', columns: ['code'])
])]
class Agent extends BaseEntity
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private string $name;

    #[ORM\Column(length: 255)]
    private string $code;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'agents')]
    #[ORM\JoinColumn(nullable: false)]
    private User $user;

    #[ORM\OneToMany(targetEntity: Chat::class, mappedBy: 'agent', orphanRemoval: true)]
    #[ORM\OrderBy(['createdAt' => 'DESC'])]
    private Collection $chats;

    #[ORM\OneToOne(targetEntity: ChatConfiguration::class, mappedBy: 'agent', cascade: ['persist', 'remove'])]
    private ?ChatConfiguration $configuration = null;

    public function __construct(
        string $name,
        User $user,
    )
    {
        $this->name = $name;
        $this->code = $this->generateCode();
        $this->user = $user;
        $this->chats = new ArrayCollection();
    }

    public function update(string $name): void
    {
        $this->name = $name;
    }

    public function setChatConfiguration(ChatConfiguration $configuration): void
    {
        $this->configuration = $configuration;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getCode(): string
    {
        return $this->code;
    }

    private static function generateCode(): string
    {
        return ByteString::fromRandom(24);
    }

    public function getUser(): User
    {
        return $this->user;
    }

    public function getChats(): Collection
    {
        return $this->chats;
    }

    public function getConfiguration(): ?ChatConfiguration
    {
        return $this->configuration;
    }
}
