import {type FormEvent, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {authApi, useAuthStore} from '../../features/auth';
import {Button, DebouncedInput} from '../../shared/ui';
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
                    <DebouncedInput
                        label="Логин"
                        type="text"
                        value={credentials.login}
                        onChange={(value) => setCredentials({...credentials, login: value})}
                        disabled={loading}
                        debounceDelay={300}
                        required
                    />
                    <DebouncedInput
                        label="Пароль"
                        type="password"
                        value={credentials.password}
                        onChange={(value) => setCredentials({...credentials, password: value})}
                        disabled={loading}
                        debounceDelay={300}
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
