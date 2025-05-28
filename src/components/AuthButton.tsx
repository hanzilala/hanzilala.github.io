import React, { useState } from 'react';
import { useAuth } from './AuthProvider';
import { UserProfile } from './UserProfile';
import { LoginModal } from './LoginModal';

export const AuthButton: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
  };

  const handleLoginSuccess = () => {
    console.log('Login successful!');
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-ctp-surface0">
        <div className="w-4 h-4 border-2 border-ctp-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Show user profile if authenticated
  if (isAuthenticated) {
    return <UserProfile />;
  }

  // Show login button if not authenticated
  return (
    <>
      <button
        onClick={handleLoginClick}
        className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-ctp-surface0 hover:bg-ctp-surface1 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl border-2 border-transparent hover:border-ctp-blue/20"
        title="Sign in with Google"
      >
        <svg
          className="w-5 h-5 text-ctp-text"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        <span className="text-sm font-medium text-ctp-text hidden sm:block">
          Sign In
        </span>
      </button>

      <LoginModal
        isOpen={showLoginModal}
        onClose={handleCloseModal}
        onSuccess={handleLoginSuccess}
      />
    </>
  );
}; 
