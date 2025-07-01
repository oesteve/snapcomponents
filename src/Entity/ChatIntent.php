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

    /**
     * @var string[]
     */
    #[ORM\Column]
    private array $widgets;

    #[ORM\ManyToOne(inversedBy: 'intents')]
    #[ORM\JoinColumn(nullable: false)]
    private ChatConfiguration $configuration;


    /**
     * @param string $name
     * @param string $description
     * @param string $instructions
     * @param array<string> $tools
     * @param array<string> $widgets
     * @param ChatConfiguration $configuration
     */
    public function __construct(
        string            $name,
        string            $description,
        string            $instructions,
        array             $tools,
        array             $widgets,
        ChatConfiguration $configuration
    ) {
        $this->name = $name;
        $this->description = $description;
        $this->instructions = $instructions;
        $this->tools = $tools;
        $this->configuration = $configuration;
        $this->widgets = $widgets;
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

    /**
     * @return string[]
     */
    public function getTools(): array
    {
        return $this->tools;
    }

    /**
     * @return string[]
     */
    public function getWidgets(): array
    {
        return $this->widgets;
    }

    public function getConfiguration(): ChatConfiguration
    {
        return $this->configuration;
    }
}
