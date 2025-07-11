<?php

namespace App\Entity;

use App\Repository\ArticleCategoryRepository;
use App\Serializer\SerializerGroups;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: ArticleCategoryRepository::class)]
class ArticleCategory extends BaseEntity
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
    private string $name;

    #[ORM\OneToMany(mappedBy: 'category', targetEntity: Article::class)]
    private Collection $articles;

    public function __construct(string $name)
    {
        $this->name = $name;
        $this->articles = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return Collection<int, Article>
     */
    public function getArticles(): Collection
    {
        return $this->articles;
    }
}
