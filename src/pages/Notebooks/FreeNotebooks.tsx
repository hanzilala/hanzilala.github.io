import React from 'react';
import { useLocation } from 'wouter';
import { useLanguage } from '../../components/ThemeProvider';
import { useTranslation } from '../../i18n/translations';
import { NotebookItem, NotebookItemData } from '../../components/NotebookItem';

export const FreeNotebooks: React.FC = () => {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const [, setLocation] = useLocation();

  // Free section items
  const freeItems: NotebookItemData[] = [
    { id: 'free-hsk1', name: 'HSK 1', label: 'HSK 1' },
    { id: 'free-hsk2', name: 'HSK 2', label: 'HSK 2' },
    { id: 'free-hsk3', name: 'HSK 3', label: 'HSK 3' },
    { id: 'free-hsk4', name: 'HSK 4', label: 'HSK 4' },
    { id: 'free-hsk5', name: 'HSK 5', label: 'HSK 5' },
    { id: 'free-hsk6', name: 'HSK 6', label: 'HSK 6' },
    { id: 'free-hsk7-9', name: 'HSK 7-9', label: 'HSK 7-9' },
  ];

  // Handle free notebook click
  const handleFreeNotebookClick = (notebook: NotebookItemData) => {
    console.log('Free notebook clicked:', notebook);
    // Navigate to notebook detail page using wouter
    setLocation(`/notebooks/${notebook.id}`);
  };

  return (
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
  );
}; 
