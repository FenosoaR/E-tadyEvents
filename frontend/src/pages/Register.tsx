import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

// Les champs du formulaire
interface RegisterForm {
    name: string;
    email: string;
    password: string;
    role: 'user' | 'organizer';
}

export default function Register() {
    const navigate = useNavigate();

    // react-hook-form gère la validation et les erreurs
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<RegisterForm>();

    const onSubmit = async (data: RegisterForm) => {
        try {
            await api.post('/api/register', data);
            // Rediriger vers le login après inscription réussie
            navigate('/login');
        } catch (error: any) {
            console.log(error)
            // alert(error.response?.data?.message || 'Erreur lors de l\'inscription');
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '100px auto', padding: 20 }}>
            <h1>Créer un compte</h1>

            <form onSubmit={handleSubmit(onSubmit)}>

                {/* Nom */}
                <div style={{ marginBottom: 15 }}>
                    <label>Nom</label>
                    <input
                        {...register('name', {
                            required: 'Le nom est obligatoire',
                            minLength: { value: 2, message: 'Minimum 2 caractères' }
                        })}
                        style={{ display: 'block', width: '100%', padding: 8 }}
                    />
                    {errors.name && <p style={{ color: 'red' }}>{errors.name.message}</p>}
                </div>

                {/* Email */}
                <div style={{ marginBottom: 15 }}>
                    <label>Email</label>
                    <input
                        type="email"
                        {...register('email', {
                            required: 'L\'email est obligatoire',
                            pattern: { value: /^\S+@\S+$/i, message: 'Email invalide' }
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
                            required: 'Le mot de passe est obligatoire',
                            minLength: { value: 6, message: 'Minimum 6 caractères' }
                        })}
                        style={{ display: 'block', width: '100%', padding: 8 }}
                    />
                    {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}
                </div>

                {/* Rôle */}
                <div style={{ marginBottom: 15 }}>
                    <label>Je suis</label>
                    <select
                        {...register('role')}
                        style={{ display: 'block', width: '100%', padding: 8 }}
                    >
                        <option value="user">Utilisateur simple</option>
                        <option value="organizer">Organisateur</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{ width: '100%', padding: 10, backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}
                >
                    {isSubmitting ? 'Chargement...' : 'S\'inscrire'}
                </button>
            </form>

            <p style={{ marginTop: 15 }}>
                Déjà un compte ? <Link to="/login">Se connecter</Link>
            </p>
        </div>
    );
}