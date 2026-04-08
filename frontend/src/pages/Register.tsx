import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/auth.css';

interface RegisterForm {
    name: string;
    email: string;
    password: string;
    role: 'user' | 'organizer';
}

/* ─── Icons ────────────────────────────────────────── */
function IconCalendar() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
        </svg>
    );
}

function IconUser() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
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


function LeftPanel() {
    return (
        <aside className="auth-panel-left">
            <div className="auth-left-top">
                {/* Logo */}
                <div className="auth-logo">
                    <div className="auth-logo-mark">
                        <IconCalendar />
                    </div>
                    <span className="auth-logo-name">E-tadyEvents</span>
                </div>

                {/* Heading */}
                <div className="auth-left-heading">
                    <span className="auth-left-tag">Nouveau par ici ?</span>
                    <h2 className="auth-left-title">
                        Rejoignez des milliers<br />
                        d'organisateurs.
                    </h2>
                    <p className="auth-left-desc">
                        Créez votre compte gratuitement et commencez à organiser
                        vos événements dès aujourd'hui.
                    </p>

                    <ul className="auth-features">
                        {[
                            'Compte gratuit, sans carte bancaire',
                            'Accès immédiat à toutes les fonctionnalités',
                            'Support dédié pour les organisateurs',
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
                        <span className="auth-stat-value">Gratuit</span>
                        <span className="auth-stat-label">Pour commencer</span>
                    </div>
                    <div className="auth-stat">
                        <span className="auth-stat-value">2 min</span>
                        <span className="auth-stat-label">Pour s'inscrire</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}


export default function Register() {
    const navigate = useNavigate();
    const [showPw, setShowPw] = useState(false);
    const [globalErr, setGlobalErr] = useState('');

    const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
        defaultValues: { role: 'user' }
    });

    const selectedRole = watch('role');

    const onSubmit = async (data: RegisterForm) => {
        setGlobalErr('');
        try {
            await api.post('/api/register', data);
            navigate('/login');
        } catch (error: any) {
            setGlobalErr(
                error.response?.data?.message || "Une erreur est survenue lors de l'inscription."
            );
        }
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
                        <span className="auth-header-tag">Inscription</span>
                        <h1 className="auth-title">
                            Rejoindre <strong>E-tadyEvents</strong>
                        </h1>
                        <p className="auth-subtitle">
                            Créez votre compte et commencez à organiser vos événements dès aujourd'hui.
                        </p>
                    </div>

                    {/* Error */}
                    {globalErr && (
                        <div className="auth-banner-error" style={{ marginBottom: 20 }}>
                            <IconAlert />
                            <span>{globalErr}</span>
                        </div>
                    )}

                    <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>

                        {/* Name */}
                        <div className="auth-field">
                            <label className="auth-label" htmlFor="reg-name">
                                Nom complet
                            </label>
                            <div className="auth-input-wrap">
                                <span className="auth-input-icon"><IconUser /></span>
                                <input
                                    id="reg-name"
                                    type="text"
                                    placeholder="Jean Dupont"
                                    autoComplete="name"
                                    className={`auth-input${errors.name ? ' is-error' : ''}`}
                                    {...register('name', {
                                        required: 'Le nom est obligatoire',
                                        minLength: { value: 2, message: 'Minimum 2 caractères' }
                                    })}
                                />
                            </div>
                            {errors.name && (
                                <span className="auth-field-error">{errors.name.message}</span>
                            )}
                        </div>

                        {/* Email */}
                        <div className="auth-field">
                            <label className="auth-label" htmlFor="reg-email">
                                Adresse email
                            </label>
                            <div className="auth-input-wrap">
                                <span className="auth-input-icon"><IconMail /></span>
                                <input
                                    id="reg-email"
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
                            <label className="auth-label" htmlFor="reg-pw">
                                Mot de passe
                            </label>
                            <div className="auth-input-wrap">
                                <span className="auth-input-icon"><IconLock /></span>
                                <input
                                    id="reg-pw"
                                    type={showPw ? 'text' : 'password'}
                                    placeholder="6 caractères minimum"
                                    autoComplete="new-password"
                                    className={`auth-input${errors.password ? ' is-error' : ''}`}
                                    {...register('password', {
                                        required: 'Le mot de passe est obligatoire',
                                        minLength: { value: 6, message: 'Minimum 6 caractères' }
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

                        {/* Role */}
                        <div className="auth-field">
                            <label className="auth-label">Je suis…</label>
                            <div className="auth-role-cards">
                                <label className="auth-role-option">
                                    <input
                                        type="radio"
                                        value="user"
                                        {...register('role')}
                                    />
                                    <div className="auth-role-inner">
                                        <span className="auth-role-emoji">🎟️</span>
                                        <div className="auth-role-info">
                                            <span className="auth-role-name">Participant</span>
                                            <span className="auth-role-note">Je cherche des événements</span>
                                        </div>
                                    </div>
                                </label>
                                <label className="auth-role-option">
                                    <input
                                        type="radio"
                                        value="organizer"
                                        {...register('role')}
                                    />
                                    <div className="auth-role-inner">
                                        <span className="auth-role-emoji">🎤</span>
                                        <div className="auth-role-info">
                                            <span className="auth-role-name">Organisateur</span>
                                            <span className="auth-role-note">Je crée des événements</span>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            id="register-submit"
                            type="submit"
                            className="auth-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="auth-spinner" />
                                    Création du compte…
                                </>
                            ) : (
                                <>
                                    {selectedRole === 'organizer'
                                        ? 'Créer mon compte organisateur'
                                        : 'Créer mon compte'}
                                    <IconArrow />
                                </>
                            )}
                        </button>

                        {/* Terms note */}
                        <p style={{ fontSize: 12, color: 'var(--text-3)', textAlign: 'center', lineHeight: 1.5 }}>
                            En créant un compte, vous acceptez nos{' '}
                            <a href="#" style={{ color: 'var(--text-3)', textDecoration: 'underline' }}>
                                conditions d'utilisation
                            </a>.
                        </p>
                    </form>

                    {/* Footer */}
                    <p className="auth-foot">
                        Déjà un compte ?{' '}
                        <Link to="/login">Se connecter</Link>
                    </p>
                </div>
            </main>
        </div>
    );
}