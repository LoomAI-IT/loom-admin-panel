import {useState, useEffect} from 'react';

interface AuthStore {
    isAuthenticated: boolean;
    accountId: string | null;
    checkAuth: () => boolean;
    login: (accountId: number) => void;
    logout: () => void;
}

// Простой state manager без внешних зависимостей
const AUTH_KEY = 'auth_account_id';

let listeners: Array<() => void> = [];

const authStore = {
    getState: (): { isAuthenticated: boolean; accountId: string | null } => {
        const accountId = localStorage.getItem(AUTH_KEY);
        return {
            isAuthenticated: !!accountId,
            accountId,
        };
    },

    login: (accountId: number) => {
        localStorage.setItem(AUTH_KEY, accountId.toString());
        listeners.forEach((listener) => listener());
    },

    logout: () => {
        localStorage.removeItem(AUTH_KEY);
        listeners.forEach((listener) => listener());
    },

    subscribe: (listener: () => void) => {
        listeners.push(listener);
        return () => {
            listeners = listeners.filter((l) => l !== listener);
        };
    },
};

export const useAuthStore = (): AuthStore => {
    const [state, setState] = useState(authStore.getState());

    useEffect(() => {
        return authStore.subscribe(() => {
            setState(authStore.getState());
        });
    }, []);

    return {
        isAuthenticated: state.isAuthenticated,
        accountId: state.accountId,
        checkAuth: () => state.isAuthenticated,
        login: authStore.login,
        logout: authStore.logout,
    };
};
