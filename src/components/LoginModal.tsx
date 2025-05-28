import React, { useState } from 'react';
import { GoogleLoginButton } from './GoogleLoginButton';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) {
    return null;
  }

  const handleSuccess = () => {
    setError(null);
    onSuccess?.();
    onClose();
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-surface0 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text">Sign In</h2>
          <button
            onClick={onClose}
            className="text-subtext1 hover:text-text transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <p className="text-subtext1 mb-4">
            Sign in to access your personalized learning experience and sync your progress across devices.
          </p>
        </div>

        {/* Google Login Button */}
        <div className="mb-6">
          <GoogleLoginButton
            onSuccess={handleSuccess}
            onError={handleError}
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red/10 border border-red/20 rounded-lg">
            <p className="text-red text-sm">{error}</p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-subtext1">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}; 
