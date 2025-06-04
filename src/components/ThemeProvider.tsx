import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language } from '../api/hanzii';
import { isFromToday } from '../utils';

// Define the theme types based on Catppuccin flavors
export type ThemeFlavor = 'latte' | 'mocha';

// Define the layout types
export type LayoutType = 'default' | 'fullscreen';

// Define the structure of our unified app context
interface AppContextType {
  theme: ThemeFlavor;
  setTheme: (theme: ThemeFlavor) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  wordItems: WordItem[];
  refreshWordItems: () => void;
  layout: LayoutType;
  setLayout: (layout: LayoutType) => void;
}

// Create a unified context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Define the props for our ThemeProvider component
interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeFlavor>('latte');
  const [language, setLanguage] = useState<Language>('vi');
  const [wordItems, setWordItems] = useState<WordItem[]>([]);
  const [layout, setLayout] = useState<LayoutType>('default');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('hanzii-theme') as ThemeFlavor;
    if (savedTheme && (savedTheme === 'latte' || savedTheme === 'mocha')) {
      setTheme(savedTheme);
    }
  }, []);

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('hanzii-language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'vi')) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Load layout from localStorage on mount
  useEffect(() => {
    const savedLayout = localStorage.getItem('hanzii-layout') as LayoutType;
    if (savedLayout && (savedLayout === 'default' || savedLayout === 'fullscreen')) {
      setLayout(savedLayout);
    }
  }, []);

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('hanzii-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Save language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('hanzii-language', language);
  }, [language]);

  // Save layout to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('hanzii-layout', layout);
  }, [layout]);

  // Function to load/refresh word items from localStorage
  const refreshWordItems = () => {
    try {
      const items: WordItem[] = [];
      const storageKeys = Object.keys(localStorage);
      
      // Filter keys with the prefix "hanzii-bookmark-"
      const wordKeys = storageKeys.filter(key => key.startsWith('hanzii-bookmark-'));
      
      wordKeys.forEach(key => {
        try {
          const itemData = localStorage.getItem(key);
          if (itemData) {
            const parsedData = JSON.parse(itemData);
            
            // Create WordItem with word being the key with "hanzii-" prefix removed
            const item: WordItem = {
              word: key.replace('hanzii-bookmark-', ''),
              timestamp: parsedData.timestamp
            };
            
            // Check if the item is from today
            if (isFromToday(item.timestamp)) {
              items.push(item);
            } else {
              // Remove outdated items
              localStorage.removeItem(key);
            }
          }
        } catch (error) {
          console.error(`Error processing item ${key}:`, error);
          // Remove invalid items
          localStorage.removeItem(key);
        }
      });
      
      setWordItems(items);
    } catch (error) {
      console.error("Error loading word items:", error);
      setWordItems([]);
    }
  };

  // Load word items from localStorage on component mount
  useEffect(() => {
    refreshWordItems();
  }, []);

  return (
    <AppContext.Provider value={{ theme, setTheme, language, setLanguage, wordItems, refreshWordItems, layout, setLayout }}>
      <div className={`${theme} min-h-screen bg-base text-text`}>
        {children}
      </div>
    </AppContext.Provider>
  );
};

// Custom hook for using the theme context
export const useTheme = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return { theme: context.theme, setTheme: context.setTheme };
};

// Custom hook for using the language context
export const useLanguage = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a ThemeProvider');
  }
  return { language: context.language, setLanguage: context.setLanguage };
};

// Custom hook for using the word items context
export const useWordItems = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useWordItems must be used within a ThemeProvider');
  }
  return { wordItems: context.wordItems, refreshWordItems: context.refreshWordItems };
};

// Custom hook for using the layout context
export const useLayout = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a ThemeProvider');
  }
  return { layout: context.layout, setLayout: context.setLayout };
};

