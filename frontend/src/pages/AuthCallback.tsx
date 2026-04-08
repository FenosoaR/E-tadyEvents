import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Cette page récupère le token JWT depuis l'URL
// après la redirection de Google
export default function AuthCallback() {
    const [searchParams] = useSearchParams();
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // On récupère le token dans l'URL
        // ex: http://localhost:5173/auth/callback?token=eyJ...
        const token = searchParams.get('token');

        if (token) {
            // On stocke le token via le contexte
            login(token);
            // On redirige vers la page d'accueil
            navigate('/');
        } else {
            // Si pas de token → erreur → retour au login
            navigate('/login');
        }
    }, []);

    return <p>Connexion en cours...</p>;
}