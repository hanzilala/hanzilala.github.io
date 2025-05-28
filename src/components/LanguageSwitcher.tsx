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
        flex items-center justify-center gap-2 px-3 py-2 rounded-full 
        bg-ctp-surface0 hover:bg-ctp-surface1 
        transition-all duration-300 ease-in-out
        transform hover:scale-105 active:scale-95
        shadow-lg hover:shadow-xl
        border-2 border-transparent hover:border-ctp-blue/20
        min-w-[70px]
      `}
      title={config.label}
    >
      <span className="text-lg">{config.flag}</span>
      <span className="text-sm font-semibold text-ctp-text">{config.name}</span>
    </button>
  );
};

export default LanguageSwitcher; 
