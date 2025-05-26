import React, { createContext, useContext, useEffect, useState } from 'react';

// Define the theme types based on Catppuccin flavors
export type ThemeFlavor = 'latte' | 'mocha';

// Define the structure of our theme context
interface ThemeContextType {
  theme: ThemeFlavor;
  setTheme: (theme: ThemeFlavor) => void;
}

// Create a context with a default value
const ThemeContext = createContext<ThemeContextType>({
  theme: 'latte',
  setTheme: () => {},
});

// Define the props for our ThemeProvider component
interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Get the initial theme from localStorage or use 'latte' as default
  const [theme, setTheme] = useState<ThemeFlavor>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as ThemeFlavor;
      return savedTheme || 'latte';
    }
    return 'latte';
  });

  // Update the document with the current theme classes
  useEffect(() => {
    // Save the theme preference to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className={`${theme} min-h-screen bg-base text-text`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

// Custom hook for using the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

