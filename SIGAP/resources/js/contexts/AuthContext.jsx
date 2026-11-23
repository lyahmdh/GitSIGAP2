import {
    createContext,
    useCallback,
    useEffect,
    useState,
} from 'react';

import authService from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = useCallback(async () => {
        try {
            const currentUser = await authService.me();
            setUser(currentUser);
            return currentUser;
        } catch {
            setUser(null);
            return null;
        }
    }, []);

    useEffect(() => {
        let active = true;

        authService.me()
            .then((currentUser) => {
                if (active) setUser(currentUser);
            })
            .catch(() => {
                if (active) setUser(null);
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, []);

    const login = async (credentials) => {
        const result = await authService.login(credentials);
        setUser(result.user);
        return result;
    };

    const register = async (data) => {
        const result = await authService.register(data);
        setUser(result.user);
        return result;
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout,
                refreshUser,
                isAuthenticated: Boolean(user),
                isAdmin: user?.role === 'admin',
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}