<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_EMAIL', fields: ['email'])]
class User implements UserInterface
{
    public const string ROLE_USER = 'ROLE_USER';

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    /** @phpstan-ignore-next-line */
    private int $id;

    #[ORM\Column(length: 180)]
    private string $email;

    #[ORM\Column(nullable: true)]
    private ?string $github;

    #[ORM\Column(nullable: true)]
    private ?string $picture;

    /**
     * @var list<string> The user roles
     */
    #[ORM\Column]
    private array $roles = [];

    #[ORM\OneToMany(targetEntity: Agent::class, mappedBy: 'user')]
    private Collection $agents;

    /**
     * @param string[] $roles
     */
    public function __construct(
        string $email,
        array $roles,
        ?string $picture = null,
        ?string $github = null,
    ) {
        $this->email = $email;
        $this->picture = $picture;
        $this->github = $github;
        $this->roles = $roles;

        $this->agents = new ArrayCollection();
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function getPicture(): ?string
    {
        return $this->picture;
    }

    public function getGithub(): ?string
    {
        return $this->github;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    /**
     * @param list<string> $roles
     */
    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function setGithub(?string $github): void
    {
        $this->github = $github;
    }

    public function getAgents(): Collection
    {
        return $this->agents;
    }
}
