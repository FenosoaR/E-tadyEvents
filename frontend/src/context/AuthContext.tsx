import { createContext, useContext, useState, type ReactNode, } from 'react';
import { jwtDecode } from 'jwt-decode';

// Ce que contient notre token JWT décodé
interface JwtPayload {
    email: string;
    roles: string[];
    exp: number;
}

// Ce que le contexte expose à toute l'application
interface AuthContextType {
    token: string | null;
    user: JwtPayload | null;
    isAuthenticated: boolean;
    isOrganizer: boolean;
    login: (token: string) => void;
    logout: () => void;
}

// Création du contexte
const AuthContext = createContext<AuthContextType | null>(null);

// Provider → entoure toute l'app pour que tous les composants
// aient accès au token et aux infos de l'utilisateur
export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(
        // On récupère le token depuis localStorage au démarrage
        localStorage.getItem('token')
    );

    const [user, setUser] = useState<JwtPayload | null>(() => {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            return jwtDecode<JwtPayload>(savedToken);
        }
        return null;
    });

    // Appelée après un login réussi
    const login = (newToken: string) => {
        // On stocke le token dans localStorage
        // comme ça il reste même si on rafraîchit la page
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(jwtDecode<JwtPayload>(newToken));
    };

    // Appelée quand l'utilisateur se déconnecte
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            token,
            user,
            // true si le token existe
            isAuthenticated: !!token,
            // true si l'utilisateur a le rôle ROLE_ORGANIZER
            isOrganizer: user?.roles?.includes('ROLE_ORGANIZER') ?? false,
            login,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook personnalisé pour utiliser le contexte facilement
// Au lieu de useContext(AuthContext) partout, on fait juste useAuth()
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth doit être utilisé dans AuthProvider');
    }
    return context;
}