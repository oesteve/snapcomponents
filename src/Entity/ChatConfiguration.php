<?php

namespace App\Entity;

use App\Repository\ChatConfigurationRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ChatConfigurationRepository::class)]
class ChatConfiguration
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private string $name;

    #[ORM\Column(length: 255)]
    private string $description;

    #[ORM\Column(type: Types::TEXT)]
    private string $prompt;

    #[ORM\OneToOne(targetEntity: Agent::class, inversedBy: 'configuration')]
    private Agent $agent;

    /**
     * @var Collection<int, ChatIntent>
     */
    #[ORM\OneToMany(targetEntity: ChatIntent::class, mappedBy: 'configuration')]
    private Collection $intents;

    /**
     * @param string $name
     * @param string $description
     * @param Agent $agent
     */
    public function __construct(
        string $name,
        string $description,
        string $prompt,
        Agent  $agent
    )
    {
        $this->name = $name;
        $this->description = $description;
        $this->prompt = $prompt;
        $this->agent = $agent;
        $this->intents = new ArrayCollection([]);
    }


    public function getName(): string
    {
        return $this->name;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    public function getPrompt(): string
    {
        return $this->prompt;
    }

    public function getAgent(): Agent
    {
        return $this->agent;
    }

    /**
     * @return Collection<ChatIntent>
     */
    public function getIntents(): Collection
    {
        return $this->intents;
    }

    public function setIntent(ChatIntent $intent): void
    {
        $this->intents->add($intent);
    }
}
