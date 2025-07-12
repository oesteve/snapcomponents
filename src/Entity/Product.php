<?php

namespace App\Entity;

use App\Repository\ProductRepository;
use App\Service\Product\ProductInterface;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ProductRepository::class)]
class Product implements ProductInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private string $name;

    #[ORM\Column(length: 255)]
    private string $title;

    #[ORM\Column(length: 255)]
    private string $description;

    #[ORM\Column(length: 500)]
    private string $image;

    #[ORM\Column(type: Types::FLOAT)]
    private float $price;

    #[ORM\ManyToOne(targetEntity: Agent::class, inversedBy: 'products')]
    private Agent $agent;

    public function __construct(string $name, string $title, string $description, string $image, float $price, Agent $agent)
    {
        $this->name = $name;
        $this->title = $title;
        $this->description = $description;
        $this->image = $image;
        $this->price = $price;
        $this->agent = $agent;
    }

    public function update(string $name, string $title, string $description, string $image, float $price): void
    {
        $this->name = $name;
        $this->title = $title;
        $this->description = $description;
        $this->image = $image;
        $this->price = $price;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    public function getImage(): string
    {
        return $this->image;
    }

    public function getPrice(): float
    {
        return $this->price;
    }

    public function getAgent(): Agent
    {
        return $this->agent;
    }
}
