import React from 'react';
import { Language } from '../api/hanzii';
import { useLanguage } from './ThemeProvider';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  // Toggle between English and Vietnamese
  const toggleLanguage = () => {
    const newLanguage: Language = language === 'en' ? 'vi' : 'en';
    setLanguage(newLanguage);
  };

  // Language configuration
  const languageConfig: Record<Language, { label: string; flag: string; name: string }> = {
    en: { label: 'Switch to Vietnamese', flag: '🇺🇸', name: 'EN' },
    vi: { label: 'Switch to English', flag: '🇻🇳', name: 'VI' }
  };

  const config = languageConfig[language];

  return (
    <button
      onClick={toggleLanguage}
      className={`
        flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-full 
        bg-surface0 hover:bg-surface1 
        transition-all duration-300 ease-in-out
        transform hover:scale-105 active:scale-95
        shadow-md hover:shadow-lg
        border border-transparent hover:border-blue/20
        min-w-[60px]
      `}
      title={config.label}
    >
      <span className="text-sm">{config.flag}</span>
      <span className="text-xs font-semibold text-text">{config.name}</span>
    </button>
  );
};

export default LanguageSwitcher; 
