import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

interface LoginForm {
    email: string;
    password: string;
}

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<LoginForm>();

    const onSubmit = async (data: LoginForm) => {
        try {
            const response = await api.post('/api/login', data);
            // On stocke le token JWT via le contexte
            login(response.data.token);
            // Rediriger vers la page d'accueil après connexion
            navigate('/');
        } catch (error: any) {
            alert('Email ou mot de passe incorrect');
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '100px auto', padding: 20 }}>
            <h1>Se connecter</h1>

            <form onSubmit={handleSubmit(onSubmit)}>

                {/* Email */}
                <div style={{ marginBottom: 15 }}>
                    <label>Email</label>
                    <input
                        type="email"
                        {...register('email', {
                            required: 'L\'email est obligatoire'
                        })}
                        style={{ display: 'block', width: '100%', padding: 8 }}
                    />
                    {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
                </div>

                {/* Mot de passe */}
                <div style={{ marginBottom: 15 }}>
                    <label>Mot de passe</label>
                    <input
                        type="password"
                        {...register('password', {
                            required: 'Le mot de passe est obligatoire'
                        })}
                        style={{ display: 'block', width: '100%', padding: 8 }}
                    />
                    {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{ width: '100%', padding: 10, backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}
                >
                    {isSubmitting ? 'Chargement...' : 'Se connecter'}
                </button>
            </form>

            <p style={{ marginTop: 15 }}>
                Pas encore de compte ? <Link to="/register">S'inscrire</Link>
            </p>
        </div>
    );
}