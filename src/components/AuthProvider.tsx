import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, getStoredUser, setStoredUser, getAuthToken, setAuthToken, removeAuthToken, logout as logoutUtil, isValidToken, isAuthenticatedWithValidation } from '../api/auth';

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
        
        // Check if we have both user and valid token
        if (storedUser && token) {
          // Additional validation: ensure token is not empty and valid format
          if (isValidToken(token) && storedUser.email && storedUser.username) {
            setUser(storedUser);
            console.log('Valid authentication restored from storage');
          } else {
            console.warn('Invalid user data or token found, clearing auth');
            logoutUtil();
          }
        } else if (token && !storedUser) {
          // If we have token but no user data, check if token is valid
          if (isValidToken(token)) {
            console.log('Valid token found but no user data, maintaining auth state');
            // Create minimal user object to maintain auth state
            setUser({
              token: token,
              username: '',
              verify_email: '',
              language: 'vi',
              image: '',
              email: '',
              is_premium: ''
            });
          } else {
            console.warn('Invalid token found, clearing auth');
            logoutUtil();
          }
        } else {
          // No valid auth found, clear any invalid data
          if (token || storedUser) {
            console.log('Clearing incomplete auth data');
            logoutUtil();
          }
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
    console.log('userData=====', userData);
    if (userData.token && isValidToken(userData.token)) {
      setUser(userData);
      setStoredUser(userData);
      setAuthToken(userData.token);
      console.log('User logged in successfully');
    } else {
      console.error('Invalid token provided during login');
      throw new Error('Invalid authentication token');
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    logoutUtil(); // Clear localStorage
    console.log('User logged out');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: isAuthenticatedWithValidation(), // Use enhanced validation
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
