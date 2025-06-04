import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import { loginWithGoogle } from '../api/auth';
import { AUTH_CONFIG } from '../config/auth';

// Google Identity Services types
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

interface GoogleLoginButtonProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  onSuccess,
  onError,
}) => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  // Load Google Identity Services script
  useEffect(() => {
    const loadGoogleScript = () => {
      if (window.google) {
        setIsGoogleLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setIsGoogleLoaded(true);
      };
      script.onerror = () => {
        console.error('Failed to load Google Identity Services');
        onError?.('Failed to load Google login');
      };
      document.head.appendChild(script);
    };

    loadGoogleScript();
  }, [onError]);

  // Initialize Google Sign-In
  useEffect(() => {
    if (!isGoogleLoaded || !window.google) return;

    try {
             window.google.accounts.id.initialize({
         client_id: AUTH_CONFIG.GOOGLE_CLIENT_ID,
         callback: handleGoogleResponse,
         auto_select: false,
         cancel_on_tap_outside: true,
       });

      // Render the Google Sign-In button
      const buttonElement = document.getElementById('google-signin-button');
      if (buttonElement) {
        window.google.accounts.id.renderButton(buttonElement, {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left',
        });
      }
    } catch (error) {
      console.error('Error initializing Google Sign-In:', error);
      onError?.('Failed to initialize Google login');
    }
  }, [isGoogleLoaded]);

  // Handle Google authentication response
  const handleGoogleResponse = async (response: any) => {
    if (!response.credential) {
      onError?.('No credential received from Google');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Google credential received:', response.credential);
      
      // Call our API with the Google token
      const authResponse = await loginWithGoogle(response.credential);
      if (authResponse?.status === 200 && authResponse?.result) {
        // Login successful
        login(authResponse.result);
        onSuccess?.();
      } else {
        throw new Error(authResponse.message || 'Login failed!!!');
      }
    } catch (error) {
      console.error('Google login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Manual login trigger (fallback)
  const handleManualLogin = () => {
    if (window.google) {
      window.google.accounts.id.prompt();
    }
  };

  if (!isGoogleLoaded) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-sm text-subtext1">Loading Google Sign-In...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Google Sign-In button will be rendered here */}
      <div id="google-signin-button"></div>
      
      {/* Loading state */}
      {isLoading && (
        <div className="text-sm text-subtext1">Signing in...</div>
      )}
      
      {/* Fallback manual button */}
      <button
        onClick={handleManualLogin}
        disabled={isLoading}
        className="px-4 py-2 bg-surface0 hover:bg-surface1 text-text rounded-lg border border-surface2 transition-colors disabled:opacity-50"
      >
        Sign in with Google (Manual)
      </button>
    </div>
  );
}; 
