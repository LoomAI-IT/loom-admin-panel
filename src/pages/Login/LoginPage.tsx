import {type FormEvent, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Building2, AlertCircle} from 'lucide-react';

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
            <div className="login-card">
                <div className="login-header">
                    <div className="login-logo">
                        <Building2 />
                    </div>
                    <h1 className="login-title">Админ панель</h1>
                    <p className="login-subtitle">Войдите для продолжения</p>
                </div>
                <form className="login-form" onSubmit={handleSubmit}>
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
                    {error && (
                        <div className="login-error">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}
                    <Button
                        className="login-submit"
                        type="submit"
                        fullWidth
                        loading={loading}
                    >
                        Войти
                    </Button>
                </form>
            </div>
        </div>
    );
};
