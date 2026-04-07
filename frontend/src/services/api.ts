import axios from 'axios';

// L'URL de base de votre API Symfony
// Toutes les requêtes commenceront par cette URL
const api = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur → avant chaque requête, on ajoute automatiquement le token JWT
// Comme ça React n'a pas besoin de l'ajouter manuellement à chaque fois
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;