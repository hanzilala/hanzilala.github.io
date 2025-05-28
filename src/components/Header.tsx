import React from 'react';
import { useAuth } from './AuthProvider';
import { UserProfile } from './UserProfile';
import { AuthButton } from './AuthButton';
import ThemeSwitcher from './ThemeSwitcher';
import LanguageSwitcher from './LanguageSwitcher';

export const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-base/80 backdrop-blur-md border-b border-surface2/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-text">
                Hanzii Lala
              </h1>
            </div>
          </div>

          {/* Navigation items - could be expanded later */}
          <nav className="hidden md:flex items-center space-x-8">
            {/* Add navigation items here if needed */}
          </nav>

          {/* Right side controls */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <LanguageSwitcher />
            
            {/* Theme Switcher */}
            <ThemeSwitcher />
            
            {/* Account Info */}
            {user ? (
              <UserProfile />
            ) : (
              <AuthButton />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}; 
 