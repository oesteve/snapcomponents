<?php

namespace App\Entity;

use App\Repository\AgentRepository;
use App\Serializer\SerializerGroups;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\String\ByteString;

#[ORM\Entity(repositoryClass: AgentRepository::class)]
#[ORM\Table(indexes: [
    new ORM\Index(name: 'code_idx', columns: ['code']),
])]
class Agent extends BaseEntity
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups([SerializerGroups::ELASTICA, SerializerGroups::API_LIST])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups([SerializerGroups::API_LIST])]
    private string $name;

    #[ORM\Column(length: 255)]
    #[Groups([SerializerGroups::API_LIST])]
    private string $code;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'agents')]
    #[ORM\JoinColumn(nullable: false)]
    private User $user;

    #[ORM\OneToMany(targetEntity: Chat::class, mappedBy: 'agent', orphanRemoval: true)]
    #[ORM\OrderBy(['createdAt' => 'DESC'])]
    private Collection $chats;

    #[ORM\OneToOne(targetEntity: ChatConfiguration::class, mappedBy: 'agent', cascade: ['persist', 'remove'])]
    private ?ChatConfiguration $chatConfiguration = null;

    /**
     * @var Collection<int, Product>
     */
    #[ORM\OneToMany(targetEntity: Product::class, mappedBy: 'agent', orphanRemoval: true)]
    private Collection $products;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    private array $attributes = [];

    /**
     * @var Collection<int, Article>
     */
    #[ORM\OneToMany(targetEntity: Article::class, mappedBy: 'agent', orphanRemoval: true)]
    private Collection $articles;

    public function __construct(
        string $name,
        User $user,
    ) {
        $this->name = $name;
        $this->code = $this->generateCode();
        $this->user = $user;
        $this->chats = new ArrayCollection();
        $this->articles = new ArrayCollection();
        $this->products = new ArrayCollection();
        $this->attributes = [];
    }

    public function update(string $name): void
    {
        $this->name = $name;
    }

    public function setChatConfiguration(ChatConfiguration $configuration): void
    {
        $this->chatConfiguration = $configuration;
    }

    public function getId(): int
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

    /**
     * @return Collection<int,Chat>
     */
    public function getChats(): Collection
    {
        return $this->chats;
    }

    public function getChatConfiguration(): ?ChatConfiguration
    {
        return $this->chatConfiguration;
    }

    /**
     * @return array<string, mixed>
     */
    public function getAttributes(): array
    {
        return $this->attributes;
    }

    public function setAttribute(string $name, mixed $value): void
    {
        $this->attributes[$name] = $value;
    }

    /**
     * @template T
     *
     * @param T $default
     *
     * @return T
     */
    public function getAttribute(string $name, mixed $default)
    {
        return $this->attributes[$name] ?? $default;
    }
}
