import React, { useState } from 'react';
import { useAuth } from './AuthProvider';

export const UserProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="relative">
      {/* User avatar/button */}
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-full bg-surface0 hover:bg-surface1 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg border border-transparent hover:border-blue/20"
        title={`Logged in as ${user.username}`}
      >
        {user.image ? (
          <img
            src={user.image}
            alt={user.username}
            className="w-6 h-6 rounded-full object-cover"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-blue text-base flex items-center justify-center text-xs font-semibold">
            {user.username.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="text-xs font-medium text-text hidden sm:block">
          {user.username.split(' ')[0]}
        </span>
        <svg
          className={`w-3 h-3 text-subtext1 transition-transform duration-300 ease-out ${
            showDropdown ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown menu */}
      <>
        {/* Backdrop */}
        <div
          className={`fixed inset-0 z-10 transition-opacity duration-300 ${
            showDropdown ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setShowDropdown(false)}
        />
        
        {/* Dropdown content */}
        <div className={`absolute right-0 mt-2 w-64 bg-surface0 rounded-lg shadow-xl border border-surface2 z-20
                       transition-all duration-300 ease-out origin-top-right ${
          showDropdown 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
        }`}>
          <div className="p-4 border-b border-surface2">
            <div className="flex items-center gap-3">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.username}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-blue text-base flex items-center justify-center text-lg font-semibold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <div className="font-semibold text-text">{user.username}</div>
                <div className="text-sm text-subtext1">{user.email}</div>
              </div>
            </div>
          </div>
          
          <div className="p-2">
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-sm text-text hover:bg-surface1 rounded-md transition-colors flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Sign out
            </button>
          </div>
        </div>
      </>
    </div>
  );
}; 
