<?php

namespace App\Entity;

use App\Repository\ChatIntentRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ChatIntentRepository::class)]
class ChatIntent
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private string $name;

    #[ORM\Column(type: Types::TEXT)]
    private string $description;

    #[ORM\Column(type: Types::TEXT)]
    private string $instructions;

    /**
     * @var array<string>
     */
    #[ORM\Column]
    private array $tools;

    #[ORM\ManyToOne(inversedBy: 'chatIntents')]
    private ChatConfiguration $configuration;


    public function __construct(
        string            $name,
        string            $description,
        string            $instructions,
        array             $tools,
        ChatConfiguration $configuration
    ) {
        $this->name = $name;
        $this->description = $description;
        $this->instructions = $instructions;
        $this->tools = $tools;
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

    public function getDescription(): string
    {
        return $this->description;
    }

    public function getInstructions(): string
    {
        return $this->instructions;
    }

    public function getTools(): array
    {
        return $this->tools;
    }

    public function getConfiguration(): ChatConfiguration
    {
        return $this->configuration;
    }
}
