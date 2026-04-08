<?php

namespace App\Controller\Api;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use KnpU\OAuth2ClientBundle\Client\ClientRegistry;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use League\OAuth2\Client\Provider\GoogleUser;

#[Route('/api/auth')]
class GoogleAuthController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private JWTTokenManagerInterface $jwtManager,
        private ClientRegistry $clientRegistry
    ) {}

    // Étape 1 → Rediriger vers Google
    // Le 2ème argument [] est les paramètres supplémentaires (vide ici)
    #[Route('/google', name: 'api_auth_google', methods: ['GET'])]
    public function redirectToGoogle(): RedirectResponse
    {
        return $this->clientRegistry
            ->getClient('google')
            ->redirect(['email', 'profile'], []); 
    }

    // Étape 2 → Google redirige ici après connexion
    // On change le type de retour en Response pour accepter les deux types
    #[Route('/google/callback', name: 'api_auth_google_callback', methods: ['GET'])]
    public function googleCallback(): Response
    {
        $client = $this->clientRegistry->getClient('google');

        /** @var GoogleUser $googleUser */
        // On cast explicitement en GoogleUser pour que PHP connaisse les méthodes
        $googleUser = $client->fetchUser();

        // getEmail() et getName() sont des méthodes de GoogleUser
        $email = $googleUser->getEmail();
        $name  = $googleUser->getName();

        // On vérifie si l'utilisateur existe déjà
        $user = $this->em->getRepository(User::class)->findOneBy([
            'email' => $email
        ]);

        // Si l'utilisateur n'existe pas → on le crée
        if (!$user) {
            $user = new User();
            $user->setName($name);
            $user->setEmail($email);
            // Mot de passe aléatoire car connexion via Google
            $user->setPassword(bin2hex(random_bytes(20)));
            $user->setRoles(['ROLE_USER']);
            // Vérifié automatiquement car Google a déjà vérifié l'email
            $user->setIsVerified(true);

            $this->em->persist($user);
            $this->em->flush();
        }

        // On génère le token JWT
        $token = $this->jwtManager->create($user);

        // RedirectResponse est maintenant accepté car le retour est Response
        return new RedirectResponse(
            'http://localhost:5173/auth/callback?token=' . $token
        );
    }
}