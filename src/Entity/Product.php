<?php

namespace App\Entity;

use App\Repository\ProductRepository;
use App\Service\Product\ProductInterface;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ProductRepository::class)]
class Product implements ProductInterface
{
    /**
     * @phpstan-ignore-next-line
     */
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private int $id;

    #[ORM\Column(length: 255)]
    private string $referenceCode;

    #[ORM\Column(length: 255)]
    private string $title;

    #[ORM\Column(length: 255)]
    private string $description;

    #[ORM\Column(length: 255)]
    private string $sku;

    #[ORM\Column(length: 255)]
    private string $brand;

    #[ORM\Column(length: 500)]
    private string $image;

    #[ORM\Column(type: Types::FLOAT)]
    private float $price;

    #[ORM\Column(type: Types::STRING, length: 3, nullable: false)]
    private string $currency;

    #[ORM\ManyToOne(targetEntity: Agent::class, inversedBy: 'products')]
    private Agent $agent;

    public function __construct(
        string $referenceCode,
        string $title,
        string $description,
        string $sku,
        string $brand,
        string $image,
        float $price,
        string $currency,
        Agent $agent,
    ) {
        $this->referenceCode = $referenceCode;
        $this->title = $title;
        $this->description = $description;
        $this->sku = $sku;
        $this->brand = $brand;
        $this->image = $image;
        $this->price = $price;
        $this->currency = $currency;
        $this->agent = $agent;
    }

    public function update(
        string $referenceCode,
        string $title,
        string $description,
        string $sku,
        string $brand,
        string $image,
        float $price,
        string $currency,
    ): void {
        $this->referenceCode = $referenceCode;
        $this->title = $title;
        $this->description = $description;
        $this->sku = $sku;
        $this->brand = $brand;
        $this->image = $image;
        $this->price = $price;
        $this->currency = $currency;
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getReferenceCode(): string
    {
        return $this->referenceCode;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    public function getSku(): string
    {
        return $this->sku;
    }

    public function getBrand(): string
    {
        return $this->brand;
    }

    public function getImage(): string
    {
        return $this->image;
    }

    public function getPrice(): float
    {
        return $this->price;
    }

    public function getCurrency(): string
    {
        return $this->currency;
    }

    public function getAgent(): Agent
    {
        return $this->agent;
    }
}
