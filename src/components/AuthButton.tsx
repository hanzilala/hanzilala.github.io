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
      <div className="flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-surface0">
        <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-blue border-t-transparent rounded-full animate-spin"></div>
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
        className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full bg-surface0 hover:bg-surface1 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl border-2 border-transparent hover:border-blue/20"
        title="Sign in with Google"
      >
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5 text-text"
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
        <span className="text-xs sm:text-sm font-medium text-text hidden sm:block">
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
