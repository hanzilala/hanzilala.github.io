// Authentication API utilities
const HANZII_API_BASE = 'https://api.hanzii.net/api';

// Types for authentication
export interface GoogleLoginRequest {
  accessToken: string;
  language: string;
  idToken: string;
  provider: 'google';
}

export interface AuthResponse {
  status: number;
  message?: string;
  result?: User;
}

export interface User {
  token: string;
  username: string;
  verify_email: string;
  language: string;
  image: string;
  email: string;
  is_premium: string;
}

// Google login with social API
export const loginWithGoogle = async (googleToken: string): Promise<AuthResponse> => {
  const url = `${HANZII_API_BASE}/account/loginwithsocial`;

  const requestBody: GoogleLoginRequest = {
    accessToken: "",
    language: "vi",
    idToken: googleToken,
    provider: 'google'
  };

  console.log('Making Google login request to:', url);
  console.log('Request body:', requestBody);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Login response status:', response.status);
    console.log('Login response ok:', response.ok);

    const data = await response.json();
    console.log('Login response data:', data);

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Google login error:', error);
    throw error;
  }
};

// Storage utilities for auth tokens
export const getAuthToken = (): string | null => {
  return localStorage.getItem('hanzii-auth-token');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('hanzii-auth-token', token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('hanzii-auth-token');
};

// Storage utilities for user data
export const getStoredUser = (): User | null => {
  const userData = localStorage.getItem('hanzii-user');
  if (userData) {
    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      return null;
    }
  }
  return null;
};

export const setStoredUser = (user: User): void => {
  localStorage.setItem('hanzii-user', JSON.stringify(user));
};

export const removeStoredUser = (): void => {
  localStorage.removeItem('hanzii-user');
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  const user = getStoredUser();
  return !!(token && token.trim() && user);
};

// Validate if the current token is still valid (basic check)
export const isValidToken = (token: string): boolean => {
  if (!token || !token.trim()) {
    return false;
  }

  // For Hanzii API tokens (simple alphanumeric strings)
  // Just check if it's a non-empty string with reasonable length
  const trimmedToken = token.trim();

  // Check if token has reasonable length (at least 10 characters)
  if (trimmedToken.length < 10) {
    return false;
  }

  // Check if token contains only alphanumeric characters
  const alphanumericRegex = /^[a-zA-Z0-9]+$/;
  return alphanumericRegex.test(trimmedToken);
};

// Enhanced authentication check with token validation
export const isAuthenticatedWithValidation = (): boolean => {
  const token = getAuthToken();
  const user = getStoredUser();

  if (!token || !user) {
    return false;
  }

  // Validate token format and expiration
  if (!isValidToken(token)) {
    console.warn('Invalid or expired token found, clearing auth');
    logout();
    return false;
  }

  return true;
};

// Logout utility
export const logout = (): void => {
  removeAuthToken();
  removeStoredUser();
}; 
