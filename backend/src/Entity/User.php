<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

// On dit à Doctrine que cette classe = une table en BDD
// et qu'on utilise UserRepository pour les requêtes
#[ORM\Entity(repositoryClass: UserRepository::class)]

// Le nom de la table dans PostgreSQL sera "users"
#[ORM\Table(name: 'users')]

// UserInterface → obligatoire pour que Symfony gère la connexion
// PasswordAuthenticatedUserInterface → obligatoire pour hasher le mot de passe
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    // UUID au lieu de int
    // car dans votre BDD les IDs sont des UUID (plus sécurisé que 1, 2, 3...)
    #[ORM\Id]
    #[ORM\Column(type: 'uuid', unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: 'doctrine.uuid_generator')]
    private ?string $id = null;

    // Nom de l'organisateur, 100 caractères max comme dans votre document
    #[ORM\Column(length: 100)]
    private ?string $name = null;

    // Email unique → deux comptes ne peuvent pas avoir le même email
    // unique: true crée automatiquement la contrainte UQ_users_email
    #[ORM\Column(length: 180, unique: true)]
    private ?string $email = null;

    // Mot de passe hashé → jamais stocké en clair
    // Le hash est fait automatiquement par Symfony via bcrypt
    #[ORM\Column(length: 255)]
    private ?string $password = null;

    // Rôles stockés en JSON dans PostgreSQL
    // Ex: ["ROLE_USER"] ou ["ROLE_USER", "ROLE_ORGANIZER"]
    // Par défaut tout utilisateur a au moins ROLE_USER
    #[ORM\Column(type: 'json')]
    private array $roles = [];

    // false par défaut → l'utilisateur doit vérifier son email avant de publier
    #[ORM\Column]
    private bool $isVerified = false;

    // Token envoyé par email pour confirmer le compte
    // nullable: true car il est supprimé une fois le compte activé
    #[ORM\Column(length: 100, nullable: true)]
    private ?string $verificationToken = null;

    // Date limite du token → après 24h il faut en demander un nouveau
    // nullable: true car supprimé après activation
    #[ORM\Column(nullable: true)]
    private ?\DateTime $tokenExpiresAt = null;

    // Date de création du compte → remplie automatiquement dans le constructeur
    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    // Relation One-to-Many → un User peut avoir plusieurs Events
    // mappedBy: 'organizer' → c'est la colonne organizer_id dans la table events
    // cascade: remove → si on supprime le User, ses events sont supprimés aussi (CASCADE)
    #[ORM\OneToMany(targetEntity: Event::class, mappedBy: 'organizer', cascade: ['remove'])]
    private Collection $events;

    public function __construct()
    {
        // On initialise la collection d'événements vide
        $this->events = new ArrayCollection();

        // La date de création est remplie automatiquement à l'instanciation
        $this->createdAt = new \DateTimeImmutable();
    }

    // ─── Getters & Setters ───────────────────────────────────────────

    public function getId(): ?string
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;
        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;
        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;
        return $this;
    }

    // getRoles() est obligatoire pour UserInterface
    // On s'assure que ROLE_USER est toujours présent
    public function getRoles(): array
    {
        $roles = $this->roles;
        $roles[] = 'ROLE_USER';
        return array_unique($roles);
    }

    public function setRoles(array $roles): static
    {
        $this->roles = $roles;
        return $this;
    }

    public function isVerified(): bool
    {
        return $this->isVerified;
    }

    public function setIsVerified(bool $isVerified): static
    {
        $this->isVerified = $isVerified;
        return $this;
    }

    public function getVerificationToken(): ?string
    {
        return $this->verificationToken;
    }

    public function setVerificationToken(?string $verificationToken): static
    {
        $this->verificationToken = $verificationToken;
        return $this;
    }

    public function getTokenExpiresAt(): ?\DateTime
    {
        return $this->tokenExpiresAt;
    }

    public function setTokenExpiresAt(?\DateTime $tokenExpiresAt): static
    {
        $this->tokenExpiresAt = $tokenExpiresAt;
        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    // ─── Méthodes obligatoires de UserInterface ───────────────────────

    // Symfony utilise l'email comme identifiant unique de l'utilisateur
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    // Efface les données sensibles temporaires
    // On ne stocke pas de données sensibles en dehors du password donc vide
    public function eraseCredentials(): void
    {
    }

    // ─── Gestion des événements ───────────────────────────────────────

    public function getEvents(): Collection
    {
        return $this->events;
    }

    public function addEvent(Event $event): static
    {
        if (!$this->events->contains($event)) {
            $this->events->add($event);
            $event->setOrganizer($this);
        }
        return $this;
    }

    public function removeEvent(Event $event): static
    {
        if ($this->events->removeElement($event)) {
            if ($event->getOrganizer() === $this) {
                $event->setOrganizer(null);
            }
        }
        return $this;
    }
}