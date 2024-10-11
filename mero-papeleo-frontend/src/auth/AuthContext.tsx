import { useContext, createContext, useState, useEffect } from "react";
import axios from 'axios';
import { BaseUrl } from './BaseUrl';

interface LoginResponse {
    token: string;
    username: string;
    email_user: string;
    id: number;
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
    email_user: string | null;
    id: number | null;
    role: string | null;
}

interface AuthProviderProps {
    children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType>( {
    isAuthenticated: false,
    login: async () => Promise.resolve({ token: '', username: '', email_user: '', id: 0, message: '' }),
    logout: () => {},
    register: async () => Promise.resolve({ success: false, message: '' }),
    token: null,
    username: null,
    email_user: null,
    id: null,
    role: null,
});

export function AuthProvider({ children }: AuthProviderProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [email_user, setEmail_user] = useState<string | null>(null);
    const [id, setId] = useState<number | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = sessionStorage.getItem('token');
        const storedUsername = sessionStorage.getItem('username');
        const storedRole = sessionStorage.getItem("role");
        const storedEmail_user = sessionStorage.getItem("email_user");
        const storedId = sessionStorage.getItem("id");

        if (storedToken && storedUsername) {
            setToken(storedToken);
            setUsername(storedUsername);
            setEmail_user(storedEmail_user);
            setId(storedId ? Number(storedId) : null);
            setRole(storedRole);
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const login = async (username: string, password: string) => {
        try {
            const response = await axios.post(`${BaseUrl}/login`, { username, password });
            if (response.data.status === 'success') {
                const { access_token, role, username, email, id } = response.data;
                setToken(access_token);
                setUsername(username);
                setRole(role);
                setEmail_user(email);
                setId(id);
                sessionStorage.setItem('token', access_token);
                sessionStorage.setItem('username', username);
                sessionStorage.setItem('email_user', email);
                sessionStorage.setItem('id', String(id));
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
            setEmail_user(null);
            setId(null);
            setRole(null);
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('username');
            sessionStorage.removeItem('email_user');
            sessionStorage.removeItem('id');
            sessionStorage.removeItem('role');
            throw error;
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setToken(null);
        setUsername(null);
        setEmail_user(null);
        setId(null);
        setRole(null);
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('email_user');
        sessionStorage.removeItem('id');
        sessionStorage.removeItem('role');
    };

    const register = async (username: string, email: string, password: string) => {
        try {
            const response = await axios.post(`${BaseUrl}/register`, { username, email, password });
            if (response.data.status === 'success') {
                return { success: true, message: response.data.message }; // Ajustado para que coincida con `RegisterResponse`
            } else {
                throw new Error(response.data.message || 'Error inesperado al registrar.');
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
            email_user,
            id
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
