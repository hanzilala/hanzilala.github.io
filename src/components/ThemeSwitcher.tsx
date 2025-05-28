import React from 'react';
import { ThemeFlavor, useTheme } from './ThemeProvider';

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();

  // Toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme: ThemeFlavor = theme === 'latte' ? 'mocha' : 'latte';
    setTheme(newTheme);
  };

  // Show the current theme
  const currentThemeConfig: Record<ThemeFlavor, { label: string; emoji: string }> = {
    latte: { label: 'Light Mode (click to switch to dark)', emoji: '☀️' },
    mocha: { label: 'Dark Mode (click to switch to light)', emoji: '🌙' }
  };

  const config = currentThemeConfig[theme];

  return (
    <button
      onClick={toggleTheme}
      className={`
        flex items-center justify-center w-12 h-12 rounded-full 
        bg-ctp-surface0 hover:bg-ctp-surface1 
        transition-all duration-300 ease-in-out
        transform hover:scale-110 active:scale-95
        shadow-lg hover:shadow-xl
        border-2 border-transparent hover:border-ctp-blue/20
      `}
      title={config.label}
    >
      <span 
        className={`
          text-2xl transition-all duration-300 ease-in-out
          transform hover:rotate-12
        `}
      >
        {config.emoji}
      </span>
    </button>
  );
};

export default ThemeSwitcher;

