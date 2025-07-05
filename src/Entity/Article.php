<?php

namespace App\Entity;

use App\Repository\ArticleRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ArticleRepository::class)]
class Article extends BaseEntity
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;


    #[ORM\Column(length: 255)]
    private string $title;

    #[ORM\Column(length: 255)]
    private string $description;

    #[ORM\Column(length: 255)]
    private string $content;

    #[ORM\ManyToOne(inversedBy: 'articles')]
    #[ORM\JoinColumn(nullable: false)]
    private User $user;

    #[ORM\ManyToOne(inversedBy: 'articles')]
    #[ORM\JoinColumn(nullable: false)]
    private ArticleCategory $category;

    /**
     */
    public function __construct(
        string $title,
        string $description,
        string $content,
        User $user,
        ArticleCategory $category
    ) {
        $this->title = $title;
        $this->description = $description;
        $this->content = $content;
        $this->user = $user;
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

    public function getUser(): User
    {
        return $this->user;
    }

    public function getCategory(): ArticleCategory
    {
        return $this->category;
    }

    public function update(
        string $title,
        string $description,
        string $content,
        ArticleCategory $category
    ): void {
        $this->title = $title;
        $this->description = $description;
        $this->content = $content;
        $this->category = $category;
    }
}
