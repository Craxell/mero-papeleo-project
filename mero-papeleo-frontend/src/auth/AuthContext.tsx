import { useContext, createContext, useState, useEffect } from "react";
import axios from 'axios';
import { baseUrl } from '../helpers/url';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<any>;
    logout: () => void;
    register: (username: string, email: string, password: string) => Promise<any>;
    token: string | null;
    username: string | null; 
}

interface AuthProviderProps {
    children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    login: async () => Promise.resolve(),
    logout: () => {},
    register: async () => Promise.resolve(),
    token: null,
    username: null,
});


export function AuthProvider({ children }: AuthProviderProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null); 

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            setIsAuthenticated(true);
            setUsername(localStorage.getItem('username'));
        }
    }, []);

    const login = async (username: string, password: string) => {
        try {
            const response = await axios.post(`${baseUrl}/login`, { username, password });
            if (response.data.status === 'success') {
                const newToken = response.data.access_token;
                setToken(newToken);
                setUsername(username);
                localStorage.setItem('token', newToken);
                localStorage.setItem('username', username);
                setIsAuthenticated(true);
                return response.data; 
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            console.error('Error in login:', error);
            setIsAuthenticated(false);
            setToken(null);
            setUsername(null);
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            throw error;
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setToken(null);
        setUsername(null);
        localStorage.removeItem('token');
        localStorage.removeItem('username');
    };

    const register = async (username: string, email: string, password: string) => {
        try {
            const response = await axios.post(`${baseUrl}/register`, { username, email, password });
            if (response.data.status === 'success') {
                return response.data;
            } else if (response.data.detail) {
                throw new Error(response.data.detail);
            } else {
                throw new Error('Error inesperado al registrar.');
            }
        } catch (error) {
            console.error('Error in registration:', error);
            throw error;
        }
    };

    useEffect(() => {
        const interceptor = axios.interceptors.request.use(
            (config) => {
                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        return () => axios.interceptors.request.eject(interceptor);
    }, [token]);

    return (
        <AuthContext.Provider value={{ 
            isAuthenticated, 
            login, 
            logout, 
            register,
            token, 
            username 
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
