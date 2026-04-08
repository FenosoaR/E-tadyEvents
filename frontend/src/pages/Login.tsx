// 




import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import '../styles/auth.css';

interface LoginForm {
    email: string;
    password: string;
}


function IconCalendar() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
        </svg>
    );
}

function IconMail() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
        </svg>
    );
}

function IconLock() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>
    );
}

function IconEye({ visible }: { visible: boolean }) {
    if (visible) return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" width={16} height={16}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
        </svg>
    );
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" width={16} height={16}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
    );
}

function IconAlert() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>
    );
}

function IconCheck() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" width={10} height={10}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
    );
}

function IconArrow() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width={15} height={15}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
    );
}

// Logo Google en SVG officiel (couleurs Google)
function IconGoogle() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width={18} height={18}>
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
        </svg>
    );
}

function LeftPanel() {
    return (
        <aside className="auth-panel-left">
            <div className="auth-left-top">
                <div className="auth-logo">
                    <div className="auth-logo-mark">
                        <IconCalendar />
                    </div>
                    <span className="auth-logo-name">E-tadyEvents</span>
                </div>

                <div className="auth-left-heading">
                    <span className="auth-left-tag">Plateforme d'événements</span>
                    <h2 className="auth-left-title">
                        Gérez vos événements,<br />
                        sans complications.
                    </h2>
                    <p className="auth-left-desc">
                        Créez, organisez et suivez tous vos événements depuis un seul endroit.
                        Simple, rapide, efficace.
                    </p>

                    <ul className="auth-features">
                        {[
                            'Création d\'événements en quelques clics',
                            'Gestion des billets et inscriptions',
                            'Tableau de bord en temps réel',
                        ].map((feat) => (
                            <li key={feat}>
                                <span className="auth-feature-dot">
                                    <IconCheck />
                                </span>
                                {feat}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="auth-left-bottom">
                <div className="auth-stat-row">
                    <div className="auth-stat">
                        <span className="auth-stat-value">2 400+</span>
                        <span className="auth-stat-label">Événements créés</span>
                    </div>
                    <div className="auth-stat">
                        <span className="auth-stat-value">18k</span>
                        <span className="auth-stat-label">Participants</span>
                    </div>
                    <div className="auth-stat">
                        <span className="auth-stat-value">99%</span>
                        <span className="auth-stat-label">Satisfaction</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}


export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [showPw, setShowPw] = useState(false);
    const [globalErr, setGlobalErr] = useState('');

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>();

    const onSubmit = async (data: LoginForm) => {
        setGlobalErr('');
        try {
            const res = await api.post('/api/login', data);
            login(res.data.token);
            navigate('/');
        } catch {
            setGlobalErr('Email ou mot de passe incorrect.');
        }
    };

    // Redirige simplement vers le backend qui gère tout le flow Google
    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:8000/api/auth/google';
    };

    return (
        <div className="auth-page">
            <LeftPanel />

            <main className="auth-panel-right">
                <div className="auth-form-wrap">

                    {/* Mobile logo */}
                    <div className="auth-mobile-logo">
                        <div className="auth-logo-mark">
                            <IconCalendar />
                        </div>
                        <span className="auth-logo-name">E-tadyEvents</span>
                    </div>

                    {/* Header */}
                    <div className="auth-header">
                        <span className="auth-header-tag">Connexion</span>
                        <h1 className="auth-title">
                            Bon retour sur <strong>E-tadyEvents</strong>
                        </h1>
                        <p className="auth-subtitle">
                            Entrez vos identifiants pour accéder à votre espace personnel.
                        </p>
                    </div>

                    {/* Error banner */}
                    {globalErr && (
                        <div className="auth-banner-error" style={{ marginBottom: 20 }}>
                            <IconAlert />
                            <span>{globalErr}</span>
                        </div>
                    )}

                    {/* Bouton Google */}
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="auth-btn-google"
                    >
                        <IconGoogle />
                        Continuer avec Google
                    </button>

                    {/* Séparateur */}
                    <div className="auth-sep">
  <span className="auth-sep-line" />
  <span className="auth-sep-text">ou</span>
  <span className="auth-sep-line" />
</div>

                    {/* Form */}
                    <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>

                        {/* Email */}
                        <div className="auth-field">
                            <label className="auth-label" htmlFor="login-email">
                                Adresse email
                            </label>
                            <div className="auth-input-wrap">
                                <span className="auth-input-icon"><IconMail /></span>
                                <input
                                    id="login-email"
                                    type="email"
                                    placeholder="vous@exemple.com"
                                    autoComplete="email"
                                    className={`auth-input${errors.email ? ' is-error' : ''}`}
                                    {...register('email', {
                                        required: "L'email est obligatoire",
                                        pattern: {
                                            value: /^\S+@\S+\.\S+$/,
                                            message: "Format d'email invalide",
                                        }
                                    })}
                                />
                            </div>
                            {errors.email && (
                                <span className="auth-field-error">{errors.email.message}</span>
                            )}
                        </div>

                        {/* Password */}
                        <div className="auth-field">
                            <label className="auth-label" htmlFor="login-pw">
                                Mot de passe
                            </label>
                            <div className="auth-input-wrap">
                                <span className="auth-input-icon"><IconLock /></span>
                                <input
                                    id="login-pw"
                                    type={showPw ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    className={`auth-input${errors.password ? ' is-error' : ''}`}
                                    {...register('password', {
                                        required: 'Le mot de passe est obligatoire',
                                    })}
                                />
                                <button
                                    type="button"
                                    className="auth-pw-btn"
                                    onClick={() => setShowPw(v => !v)}
                                    aria-label={showPw ? 'Masquer' : 'Afficher'}
                                >
                                    <IconEye visible={showPw} />
                                </button>
                            </div>
                            {errors.password && (
                                <span className="auth-field-error">{errors.password.message}</span>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            id="login-submit"
                            type="submit"
                            className="auth-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="auth-spinner" />
                                    Connexion…
                                </>
                            ) : (
                                <>
                                    Se connecter
                                    <IconArrow />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="auth-foot">
                        Pas encore de compte ?{' '}
                        <Link to="/register">Créer un compte</Link>
                    </p>
                </div>
            </main>
        </div>
    );
}