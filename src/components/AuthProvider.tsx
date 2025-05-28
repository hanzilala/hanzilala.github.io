import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, getStoredUser, setStoredUser, getAuthToken, setAuthToken, removeAuthToken, logout as logoutUtil } from '../api/auth';

// Define the authentication context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
}

// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the props for the AuthProvider component
interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadStoredAuth = () => {
      try {
        const storedUser = getStoredUser();
        const token = getAuthToken();
        
        if (storedUser && token) {
          setUser(storedUser);
        }
      } catch (error) {
        console.error('Error loading stored authentication:', error);
        // Clear invalid data
        logoutUtil();
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  // Login function
  const login = (userData: User) => {
    setUser(userData);
    setStoredUser(userData);
    setAuthToken(userData.token);
  };

  // Logout function
  const logout = () => {
    setUser(null);
    logoutUtil(); // Clear localStorage
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using the authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
