<?php

namespace App\Controller\Api;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

// Toutes les routes de ce controller commencent par /api
#[Route('/api')]
class AuthController extends AbstractController
{
    // On injecte les services dont on a besoin via le constructeur
    // C'est ce qu'on appelle l'injection de dépendances dans Symfony
    public function __construct(
        // EntityManager → permet de sauvegarder en BDD
        private EntityManagerInterface $em,

        // PasswordHasher → permet de hasher le mot de passe avec bcrypt
        private UserPasswordHasherInterface $passwordHasher,

        // Validator → vérifie que les données envoyées sont correctes
        private ValidatorInterface $validator
    ) {}

    // ─── REGISTER ─────────────────────────────────────────────────────

    // Cette route accepte uniquement les requêtes POST
    // React enverra : { "name": "...", "email": "...", "password": "..." }
    #[Route('/register', name: 'api_register', methods: ['POST'])]
    public function register(Request $request): JsonResponse
    {
        // On récupère le JSON envoyé par React et on le décode en tableau PHP
        $data = json_decode($request->getContent(), true);

        // Si le JSON est invalide ou vide on retourne une erreur
        if (!$data) {
            return $this->json([
                'message' => 'Données invalides'
            ], 400);
        }

        // On vérifie que les champs obligatoires sont présents
        if (empty($data['name']) || empty($data['email']) || empty($data['password'])) {
            return $this->json([
                'message' => 'Les champs name, email et password sont obligatoires'
            ], 400);
        }

        // On vérifie si un compte existe déjà avec cet email
        $existingUser = $this->em->getRepository(User::class)->findOneBy([
            'email' => $data['email']
        ]);

        if ($existingUser) {
            return $this->json([
                'message' => 'Un compte existe déjà avec cet email'
            ], 409); // 409 = Conflict
        }

        // On crée un nouvel utilisateur
        $user = new User();
        $user->setName($data['name']);
        $user->setEmail($data['email']);

        // On hashe le mot de passe → jamais stocké en clair dans la BDD
        $hashedPassword = $this->passwordHasher->hashPassword($user, $data['password']);
        $user->setPassword($hashedPassword);

        // Par défaut le compte n'est pas vérifié
        $user->setIsVerified(false);
        $user->setRoles(['ROLE_USER']);

        // On sauvegarde en BDD
        $this->em->persist($user); // On dit à Doctrine de suivre cet objet
        $this->em->flush();        // On envoie la requête SQL à PostgreSQL

        // On retourne une réponse JSON avec le code 201 (Created)
        return $this->json([
            'message' => 'Compte créé avec succès',
            'user' => [
                'id'    => $user->getId(),
                'name'  => $user->getName(),
                'email' => $user->getEmail(),
            ]
        ], 201);
    }
}