import { useContext, createContext, useState, useEffect } from "react";
import axios from 'axios';
import { baseUrl } from '../helpers/urlHelpers';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    token: string | null;
    username: string | null; // Añadido para el nombre de usuario
}

interface AuthProviderProps {
    children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    login: async () => {},
    logout: () => {},
    token: null,
    username: null,
});

export function AuthProvider({ children }: AuthProviderProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null); // Añadido para el nombre de usuario

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {

            
            setToken(storedToken);
            setIsAuthenticated(true);
            
        }
    }, []);

    const login = async (username: string, password: string) => {
        try {
            const response = await axios.post(`${baseUrl}/login`, { username, password });
            if (response.data.status === 'success') {
                const newToken = response.data.access_token;
                setToken(newToken);
                setUsername(username); // Assuming you already have the username
                localStorage.setItem('token', newToken);
                setIsAuthenticated(true);
            } else {
                throw new Error(response.data.detail || 'Login failed');
            }
        } catch (error) {
            console.error('Error in login:', error);
            setIsAuthenticated(false);
            setToken(null);
            setUsername(null); // Limpiar el nombre de usuario en caso de error
            localStorage.removeItem('token');
            throw error; // Re-throw the error so it can be handled by the component
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setToken(null);
        setUsername(null); // Limpiar el nombre de usuario al hacer logout
        localStorage.removeItem('token');
       
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
        <AuthContext.Provider value={{ isAuthenticated, login, logout, token, username }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
