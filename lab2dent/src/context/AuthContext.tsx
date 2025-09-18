'use client';

// React Context for managing authentication state across the application
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '@/types/auth';
import { getUserFromStorage, saveUserToStorage, removeUserFromStorage } from '@/lib/auth';

// Extended interface for the authentication context
// Includes state and methods for managing authentication
interface AuthContextType extends AuthState {
  login: (user: User) => void;   // Method to log in a user
  logout: () => void;            // Method to log out current user
}

// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Authentication Provider Component
 * Wraps the application to provide authentication state and methods
 * @param children - Child components to wrap
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialize authentication state
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false
  });

  // Check for existing user session on component mount
  useEffect(() => {
    const user = getUserFromStorage();
    if (user) {
      setAuthState({
        user,
        isAuthenticated: true
      });
    }
  }, []);

  // Login function - saves user to storage and updates state
  const login = (user: User) => {
    saveUserToStorage(user);
    setAuthState({
      user,
      isAuthenticated: true
    });
  };

  // Logout function - removes user from storage and resets state
  const logout = () => {
    removeUserFromStorage();
    setAuthState({
      user: null,
      isAuthenticated: false
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook for accessing authentication context
 * @returns Authentication context with user state and methods
 * @throws Error if used outside of AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}