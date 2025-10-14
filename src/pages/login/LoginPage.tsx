import {useState, useEffect, type FormEvent} from 'react';
import {useNavigate} from 'react-router-dom';
import {authApi, useAuthStore} from '../../features/auth';
import {Input} from '../../shared/ui/Input';
import {Button} from '../../shared/ui/Button';
import './LoginPage.css';

export const LoginPage = () => {
    const navigate = useNavigate();
    const {login: setAuth, isAuthenticated} = useAuthStore();
    const [credentials, setCredentials] = useState({login: '', password: ''});
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/', {replace: true});
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authApi.login(credentials);
            setAuth(response.account_id);
            navigate('/', {replace: true});
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Ошибка входа');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h1>Вход в админ панель</h1>
                <form onSubmit={handleSubmit} className="login-form">
                    <Input
                        label="Логин"
                        type="text"
                        value={credentials.login}
                        onChange={(e) => setCredentials({...credentials, login: e.target.value})}
                        disabled={loading}
                        required
                    />
                    <Input
                        label="Пароль"
                        type="password"
                        value={credentials.password}
                        onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                        disabled={loading}
                        required
                    />
                    {error && <div className="error-message">{error}</div>}
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Вход...' : 'Войти'}
                    </Button>
                </form>
            </div>
        </div>
    );
};
