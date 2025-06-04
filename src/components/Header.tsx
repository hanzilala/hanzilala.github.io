import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { UserProfile } from './UserProfile';
import { AuthButton } from './AuthButton';
import ThemeSwitcher from './ThemeSwitcher';
import LanguageSwitcher from './LanguageSwitcher';
import { useLocation } from 'wouter';
import { useLanguage } from './ThemeProvider';
import { useTranslation } from '../i18n/translations';
import iconImg from '../assets/icon.png';

interface NavigationItem {
  key: string;
  label: string;
  path: string;
  onClick: () => void;
}

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle scroll for background change
  useEffect(() => {
    const handleScroll = () => {
      // Check both window scroll and document element scroll
      const windowScroll = window.scrollY || window.pageYOffset;
      const documentScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const offset = Math.max(windowScroll, documentScroll);
      setScrolled(offset > 50);
    };

    // Add scroll listeners to both window and document
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navigateToHome = () => {
    setLocation('/');
    setShowMobileMenu(false);
  };

  const navigateToNotebooks = () => {
    setLocation('/notebooks');
    setShowMobileMenu(false);
  };

  const handleLogout = () => {
    logout();
    setShowMobileMenu(false);
  };

  // Navigation items
  const navigationItems: NavigationItem[] = [
    {
      key: 'home',
      label: t.navigation.home,
      path: '/',
      onClick: navigateToHome
    },
    {
      key: 'notebooks',
      label: t.navigation.notebooks,
      path: '/notebooks',
      onClick: navigateToNotebooks
    }
  ];

  // Handle click outside to close mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActivePage = (path: string) => location === path;

  return (
    <>
      {/* Desktop Header - Floating with margin and border radius */}
      <header className="fixed top-0 left-0 right-0 z-50 p-4 hidden md:block">
        <div 
          className={`mx-auto max-w-7xl transition-all duration-300 rounded-2xl ${
            scrolled 
              ? 'bg-base/95 backdrop-blur-xl border border-surface1 shadow-xl' 
              : 'bg-transparent'
          }`}
        >
          <div className="flex items-center justify-between h-16 px-6">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <button 
                onClick={navigateToHome}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200"
              >
                <img 
                  src={iconImg} 
                  alt="Hanzilala Logo" 
                  className="w-8 h-8 object-contain"
                />
                <h1 className="text-xl font-bold text-text">
                  Hanzilala
                </h1>
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="flex items-center gap-8">
              {navigationItems.map((item) => (
                <button
                  key={item.key}
                  onClick={item.onClick}
                  className={`text-sm font-medium transition-all duration-200 hover:text-blue ${
                    isActivePage(item.path)
                      ? 'text-blue'
                      : 'text-text/80'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Desktop Right Side Controls */}
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <ThemeSwitcher />
              {user ? <UserProfile /> : <AuthButton />}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header - Full Width */}
      <header className="fixed top-0 left-0 right-0 z-50 md:hidden">
        <div 
          className={`transition-all duration-300 ${
            scrolled 
              ? 'bg-base/95 backdrop-blur-xl border-b border-surface1 shadow-lg' 
              : 'bg-transparent'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-16">
              {/* Logo/Brand */}
              <div className="flex items-center">
                <button 
                  onClick={navigateToHome}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200"
                >
                  <img 
                    src={iconImg} 
                    alt="Hanzilala Logo" 
                    className="w-8 h-8 object-contain"
                  />
                  <h1 className="text-xl font-bold text-text">
                    Hanzilala
                  </h1>
                </button>
              </div>

              {/* Mobile Menu Button */}
              <div ref={dropdownRef}>
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-surface0/50 transition-colors duration-200"
                >
                  <svg 
                    className={`w-6 h-6 transition-transform duration-300 ${
                      showMobileMenu ? 'rotate-90' : ''
                    }`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    {showMobileMenu ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>

                {/* Mobile Vertical Menu */}
                {user && (
                  <div className={`absolute top-full right-0 mt-2 w-64 bg-surface0 border border-surface1 
                               rounded-xl shadow-xl transition-all duration-300 ease-out origin-top-right ${
                    showMobileMenu 
                      ? 'opacity-100 scale-100 translate-y-0' 
                      : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'
                  }`}>
                    
                    {/* Navigation Section */}
                    <div className="p-4 border-b border-surface1">
                      <h3 className="text-xs font-semibold text-subtext0 uppercase tracking-wider mb-3">
                        Navigation
                      </h3>
                      <div className="space-y-1">
                        {navigationItems.map((item) => (
                          <button
                            key={item.key}
                            onClick={item.onClick}
                            className={`w-full px-3 py-2 text-left text-sm rounded-lg transition-colors duration-150 ${
                              isActivePage(item.path)
                                ? 'bg-blue text-base font-medium'
                                : 'text-text hover:bg-surface1 hover:text-blue'
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Settings Section */}
                    <div className="p-4 border-b border-surface1">
                      <h3 className="text-xs font-semibold text-subtext0 uppercase tracking-wider mb-3">
                        Settings
                      </h3>
                      <div className="space-y-3">
                        {/* Language Switcher */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-text">Language</span>
                          <LanguageSwitcher />
                        </div>
                        
                        {/* Theme Switcher */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-text">Theme</span>
                          <ThemeSwitcher />
                        </div>
                      </div>
                    </div>

                    {/* Account Section */}
                    <div className="p-4">
                      <h3 className="text-xs font-semibold text-subtext0 uppercase tracking-wider mb-3">
                        Account
                      </h3>
                      <div className="space-y-3">
                        {/* User Info */}
                        <div className="flex items-center gap-3 p-2 rounded-lg bg-surface1">
                          {user.image ? (
                            <img 
                              src={user.image} 
                              alt={user.username || 'User'} 
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-blue flex items-center justify-center">
                              <span className="text-xs font-medium text-base">
                                {(user.username || user.email || 'U').charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-text truncate">
                              {user.username || 'User'}
                            </p>
                            <p className="text-xs text-subtext0 truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        
                        {/* Logout Button */}
                        <button
                          onClick={handleLogout}
                          className="w-full px-3 py-2 text-left text-sm text-red hover:bg-red/10 rounded-lg transition-colors duration-150"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {!user && (
                  <div className={`absolute top-full right-0 mt-2 w-64 bg-surface0 border border-surface1 
                               rounded-xl shadow-xl transition-all duration-300 ease-out origin-top-right ${
                    showMobileMenu 
                      ? 'opacity-100 scale-100 translate-y-0' 
                      : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'
                  }`}>
                    
                    {/* Navigation Section */}
                    <div className="p-4 border-b border-surface1">
                      <h3 className="text-xs font-semibold text-subtext0 uppercase tracking-wider mb-3">
                        Navigation
                      </h3>
                      <div className="space-y-1">
                        {navigationItems.map((item) => (
                          <button
                            key={item.key}
                            onClick={item.onClick}
                            className={`w-full px-3 py-2 text-left text-sm rounded-lg transition-colors duration-150 ${
                              isActivePage(item.path)
                                ? 'bg-blue text-base font-medium'
                                : 'text-text hover:bg-surface1 hover:text-blue'
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Settings Section */}
                    <div className="p-4 border-b border-surface1">
                      <h3 className="text-xs font-semibold text-subtext0 uppercase tracking-wider mb-3">
                        Settings
                      </h3>
                      <div className="space-y-3">
                        {/* Language Switcher */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-text">Language</span>
                          <LanguageSwitcher />
                        </div>
                        
                        {/* Theme Switcher */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-text">Theme</span>
                          <ThemeSwitcher />
                        </div>
                      </div>
                    </div>

                    {/* Account Section */}
                    <div className="p-4">
                      <h3 className="text-xs font-semibold text-subtext0 uppercase tracking-wider mb-3">
                        Account
                      </h3>
                      <div className="space-y-3">
                        <AuthButton />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}; 
 