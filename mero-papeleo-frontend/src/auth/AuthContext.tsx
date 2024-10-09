import { useContext, createContext, useState, useEffect } from "react";
import axios from 'axios';
import { BaseUrl } from './BaseUrl';

interface LoginResponse {
    token: string;
    username: string;
    message: string;
}

interface RegisterResponse {
    success: boolean;
    message: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<LoginResponse>;
    logout: () => void;
    register: (username: string, email: string, password: string) => Promise<RegisterResponse>;
    token: string | null;
    username: string | null;
    role: string | null;
}

interface AuthProviderProps {
    children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    login: async () => Promise.resolve({ token: '', username: '', message: '' }),
    logout: () => {},
    register: async () => Promise.resolve({ success: false, message: '' }),
    token: null,
    username: null,
    role: null,
});

export function AuthProvider({ children }: AuthProviderProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [role, setRole] = useState<string | null >(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = sessionStorage.getItem('token');
        const storedUsername = sessionStorage.getItem('username');
        const storedRole = sessionStorage.getItem("role")
        if (storedToken && storedUsername) {
            setToken(storedToken);
            setUsername(storedUsername);
            setRole(storedRole);
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const login = async (username: string, password: string) => {
        try {
            const response = await axios.post(`${BaseUrl}/login`, { username, password });
            if (response.data.status === 'success') {
                // const newToken = response.data.access_token;
                const {access_token, role} = response.data;
                setToken(access_token);
                setUsername(username);
                setRole(role);
                sessionStorage.setItem('token', access_token);
                sessionStorage.setItem('username', username);
                sessionStorage.setItem('role', role);
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
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('username');
            sessionStorage.removeItem('role');
            throw error;
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setToken(null);
        setUsername(null);
        setRole(null);
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('role');
    };

    const register = async (username: string, email: string, password: string) => {
        try {
            const response = await axios.post(`${BaseUrl}/register`, { username, email, password });
            if (response.data.status === 'success') {
                return response.data.message;
            } else if (response.data.message) {
                throw new Error(response.data.message);
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

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ 
            isAuthenticated, 
            login, 
            logout, 
            register,
            token, 
            username,
            role,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
