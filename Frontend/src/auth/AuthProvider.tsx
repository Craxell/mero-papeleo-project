import { useContext, createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '../helpers/urlHelpers';

// Definir la interfaz para el usuario
interface User {
  username: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  token: string | null;
  user: User | null; // Nueva propiedad para almacenar el usuario autenticado
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
  token: null,
  user: null, // Iniciar como null
});

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null); // Estado para almacenar el usuario

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post(`${baseUrl}/login`, { username, password });
      if (response.data.status === 'success') {
        const newToken = response.data.access_token;
        const userData = { username: response.data.username, email: response.data.email }; // Obtener datos del usuario
        setToken(newToken);
        setUser(userData); // Establecer el usuario
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData)); // Guardar el usuario en localStorage
        setIsAuthenticated(true);
      } else {
        throw new Error(response.data.detail || 'Login failed');
      }
    } catch (error) {
      console.error('Error in login:', error);
      setIsAuthenticated(false);
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error; // Re-throw the error so it can be handled by the component
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
    <AuthContext.Provider value={{ isAuthenticated, login, logout, token, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);