<?php

namespace App\Entity;

use App\Repository\ChatConfigurationRepository;
use App\Serializer\SerializerGroups;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute as Serializer;

#[ORM\Entity(repositoryClass: ChatConfigurationRepository::class)]
class ChatConfiguration
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    /** @phpstan-ignore-next-line  */
    private int $id;

    #[ORM\Column(length: 255)]
    #[Serializer\Groups([SerializerGroups::CHAT, SerializerGroups::API_LIST])]
    private string $name;

    #[ORM\Column(length: 255)]
    #[Serializer\Groups([SerializerGroups::API_LIST])]
    private string $description;

    #[ORM\Column(type: Types::TEXT)]
    #[Serializer\Groups([SerializerGroups::API_LIST])]
    private string $instructions;

    #[ORM\OneToOne(targetEntity: Agent::class, inversedBy: 'chatConfiguration')]
    #[ORM\JoinColumn(nullable: false)]
    #[Serializer\Ignore]
    private Agent $agent;

    /**
     * @var Collection<int, ChatIntent>
     */
    #[Serializer\Groups([SerializerGroups::API_LIST])]
    #[ORM\OneToMany(targetEntity: ChatIntent::class, mappedBy: 'configuration')]
    private Collection $intents;

    public function __construct(
        string $name,
        string $description,
        string $instructions,
        Agent $agent,
    ) {
        $this->name = $name;
        $this->description = $description;
        $this->instructions = $instructions;
        $this->agent = $agent;
        $this->intents = new ArrayCollection([]);
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    public function getInstructions(): string
    {
        return $this->instructions;
    }

    public function getAgent(): Agent
    {
        return $this->agent;
    }

    /**
     * @return Collection<int, ChatIntent>
     */
    public function getIntents(): Collection
    {
        return $this->intents;
    }

    public function setIntent(ChatIntent $intent): void
    {
        $this->intents->add($intent);
    }

    public function update(string $name, string $description, string $instructions): void
    {
        $this->name = $name;
        $this->description = $description;
        $this->instructions = $instructions;
    }
}
