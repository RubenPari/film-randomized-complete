/**
 * Authentication context and provider.
 * Manages user authentication state, token storage, and authentication methods.
 */
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '../services/authApi.js';
import { AuthResponse, User } from '../types/index.js';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<AuthResponse>;
  register: (username: string, email: string, password: string) => Promise<AuthResponse>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<unknown>;
  resetPassword: (token: string, newPassword: string) => Promise<unknown>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<unknown>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (token) {
      authApi
        .getCurrentUser(token)
        .then((userData) => {
          setUser(userData);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setToken(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (username: string, password: string): Promise<AuthResponse> => {
    const response = await authApi.login(username, password);
    setToken(response.token);
    setUser(response.user);
    localStorage.setItem('token', response.token);
    return response;
  };

  const register = async (username: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await authApi.register(username, email, password);
    setToken(response.token);
    setUser(response.user);
    localStorage.setItem('token', response.token);
    return response;
  };

  const logout = (): void => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  const forgotPassword = async (email: string): Promise<unknown> => {
    return await authApi.forgotPassword(email);
  };

  const resetPassword = async (tokenParam: string, newPassword: string): Promise<unknown> => {
    return await authApi.resetPassword(tokenParam, newPassword);
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<unknown> => {
    return await authApi.changePassword(currentPassword, newPassword, token);
  };

  const value: AuthContextValue = {
    user,
    token,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    changePassword,
    isAuthenticated: !!token && !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
