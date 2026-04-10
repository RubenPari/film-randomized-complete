/**
 * Authentication context and provider.
 * Manages user authentication state, token storage, and authentication methods.
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/authApi.js';

/**
 * Authentication context.
 * @type {React.Context<Object|null>}
 */
const AuthContext = createContext(null);

/**
 * Authentication provider component.
 * Provides authentication state and methods to child components.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} AuthContext provider
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  /**
   * Effect hook that checks if user is logged in on mount.
   * Validates stored token and loads user data if valid.
   */
  useEffect(() => {
    // Check if user is logged in on mount
    if (token) {
      authApi
        .getCurrentUser(token)
        .then((userData) => {
          setUser(userData);
        })
        .catch(() => {
          // Token invalid, clear it
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

  /**
   * Logs in a user with username and password.
   * 
   * @param {string} username - The username
   * @param {string} password - The password
   * @returns {Promise<Object>} Promise that resolves to auth response
   * @throws {Error} If login fails
   */
  const login = async (username, password) => {
    try {
      const response = await authApi.login(username, password);
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem('token', response.token);
      return response;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Registers a new user.
   * 
   * @param {string} username - The username
   * @param {string} email - The email address
   * @param {string} password - The password
   * @returns {Promise<Object>} Promise that resolves to auth response
   * @throws {Error} If registration fails
   */
  const register = async (username, email, password) => {
    try {
      const response = await authApi.register(username, email, password);
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem('token', response.token);
      return response;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Logs out the current user.
   * Clears token and user data from state and localStorage.
   */
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  const forgotPassword = async (email) => {
    return await authApi.forgotPassword(email);
  };

  const resetPassword = async (tokenParam, newPassword) => {
    return await authApi.resetPassword(tokenParam, newPassword);
  };

  const changePassword = async (currentPassword, newPassword) => {
    return await authApi.changePassword(currentPassword, newPassword, token);
  };

  const value = {
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

/**
 * Custom hook to access authentication context.
 * 
 * @returns {Object} Authentication context value
 * @throws {Error} If used outside AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
