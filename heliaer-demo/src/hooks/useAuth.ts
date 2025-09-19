import { useState, useEffect } from 'react';
import type { User, AuthState } from '../types';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Check for existing authentication on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedUser = localStorage.getItem('heliaer_user');
        const storedToken = localStorage.getItem('heliaer_auth_token');

        if (storedUser && storedToken) {
          const user: User = JSON.parse(storedUser);
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          setAuthState(prev => ({
            ...prev,
            isLoading: false,
          }));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Failed to check authentication status',
        });
      }
    };

    checkAuthStatus();
  }, []);

  const login = (user: User) => {
    setAuthState({
      user,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
  };

  const logout = () => {
    // Clear stored auth data
    localStorage.removeItem('heliaer_user');
    localStorage.removeItem('heliaer_auth_token');
    
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  };

  const updateUser = (updatedUser: Partial<User>) => {
    if (authState.user) {
      const newUser = { ...authState.user, ...updatedUser };
      localStorage.setItem('heliaer_user', JSON.stringify(newUser));
      setAuthState(prev => ({
        ...prev,
        user: newUser,
      }));
    }
  };

  const clearError = () => {
    setAuthState(prev => ({
      ...prev,
      error: null,
    }));
  };

  return {
    ...authState,
    login,
    logout,
    updateUser,
    clearError,
  };
};