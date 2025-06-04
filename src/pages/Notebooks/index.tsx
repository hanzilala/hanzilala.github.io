import React from 'react';
import { useLanguage } from '../../components/ThemeProvider';
import { useTranslation } from '../../i18n/translations';
import { NotebookItem, NotebookItemData } from '../../components/NotebookItem';
import { PersonalNotebooks } from './PersonalNotebooks';

export const Notebooks: React.FC = () => {
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  // Free section items
  const freeItems: NotebookItemData[] = [
    { id: '1', name: 'HSK 1', label: 'HSK 1' },
    { id: '2', name: 'HSK 2', label: 'HSK 2' },
    { id: '3', name: 'HSK 3', label: 'HSK 3' },
    { id: '4', name: 'HSK 4', label: 'HSK 4' },
    { id: '5', name: 'HSK 5', label: 'HSK 5' },
    { id: '6', name: 'HSK 6', label: 'HSK 6' },
    { id: '7-9', name: 'HSK 7-9', label: 'HSK 7-9' },
  ];

  // Handle free notebook click
  const handleFreeNotebookClick = (notebook: NotebookItemData) => {
    console.log('Free notebook clicked:', notebook);
    // TODO: Navigate to HSK level
  };

  return (
    <div className="min-h-screen bg-base text-text pt-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Title */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-blue mb-2">
            {t.notebooks.title}
          </h1>
          <p className="text-base sm:text-lg text-subtext1">
            {t.notebooks.subtitle}
          </p>
        </div>

        {/* Sections arranged vertically */}
        <div className="space-y-8 sm:space-y-12">
          
          {/* Personal Section */}
          <PersonalNotebooks />

          {/* Free Section */}
          <div className="rounded-2xl p-6 sm:p-8 transition-all duration-300">
            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-green mb-2">
                {t.notebooks.free.title}
              </h2>
              <p className="text-subtext1">
                {t.notebooks.free.description}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {freeItems.map((item) => (
                <NotebookItem
                  key={item.id}
                  notebook={item}
                  onClick={handleFreeNotebookClick}
                  variant="free"
                />
              ))}
            </div>
          </div>

          {/* Premium Section */}
          <div className="rounded-2xl p-6 sm:p-8 transition-all duration-300">
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-semibold text-yellow mb-2">
                {t.notebooks.premium.title}
              </h2>
              
              <div className="space-y-4">
                <p className="text-subtext1 mb-6">
                  {t.notebooks.premium.description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="flex flex-col items-center gap-2 text-sm text-subtext0">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span>{t.notebooks.premium.features.professional}</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 text-sm text-subtext0">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                    </svg>
                    <span>{t.notebooks.premium.features.statistics}</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 text-sm text-subtext0">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    <span>{t.notebooks.premium.features.sync}</span>
                  </div>
                </div>
                <button className="w-full sm:w-auto px-8 py-3 bg-yellow text-base rounded-lg hover:bg-yellow/90 transition-all duration-200 font-semibold">
                  {t.notebooks.premium.upgradeButton}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 
