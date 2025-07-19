<?php

namespace App\Entity;

use App\Repository\ArticleRepository;
use App\Serializer\SerializerGroups;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: ArticleRepository::class)]
class Article extends BaseEntity
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups([
        SerializerGroups::ELASTICA,
        SerializerGroups::API_LIST,
    ])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups([
        SerializerGroups::ELASTICA,
        SerializerGroups::API_LIST,
    ])]
    private string $title;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups([
        SerializerGroups::ELASTICA,
        SerializerGroups::API_LIST,
    ])]
    private string $description;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups([
        SerializerGroups::ELASTICA,
        SerializerGroups::API_LIST,
    ])]
    private string $content;

    #[ORM\ManyToOne(inversedBy: 'articles')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups([
        SerializerGroups::ELASTICA,
    ])]
    private Agent $agent;

    #[ORM\ManyToOne(inversedBy: 'articles')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups([
        SerializerGroups::ELASTICA,
        SerializerGroups::API_LIST,
    ])]
    private ArticleCategory $category;

    public function __construct(
        string $title,
        string $description,
        string $content,
        Agent $agent,
        ArticleCategory $category,
    ) {
        $this->title = $title;
        $this->description = $description;
        $this->content = $content;
        $this->agent = $agent;
        $this->category = $category;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    public function getContent(): string
    {
        return $this->content;
    }

    public function getAgent(): Agent
    {
        return $this->agent;
    }

    public function getCategory(): ArticleCategory
    {
        return $this->category;
    }

    public function update(
        string $title,
        string $description,
        string $content,
        ArticleCategory $category,
    ): void {
        $this->title = $title;
        $this->description = $description;
        $this->content = $content;
        $this->category = $category;
    }
}
