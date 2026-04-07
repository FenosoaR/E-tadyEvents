import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';


function Home() {
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <div style={{ padding: 20 }}>
            <h1>E-tadyEvents</h1>
            {isAuthenticated ? (
                <>
                    <p>Bienvenue {user?.email} !</p>
                    <button onClick={logout}>Se déconnecter</button>
                </>
            ) : (
                <p>Vous n'êtes pas connecté</p>
            )}
        </div>
    );
}

export default function App() {
    return (
        // AuthProvider entoure toute l'app
        // comme ça tous les composants ont accès au contexte
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}