import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../../components/AuthProvider';
import { AuthButton } from '../../components/AuthButton';
import { useLanguage } from '../../components/ThemeProvider';
import { useTranslation } from '../../i18n/translations';
import { PersonalNotebook, fetchPersonalNotebooks, HanziiApiError } from '../../api/hanzii';
import { NotebookItem, NotebookItemData } from '../../components/NotebookItem';

export const PersonalNotebooks: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const [, setLocation] = useLocation();
  
  const [personalNotebooks, setPersonalNotebooks] = useState<PersonalNotebook[]>([]);
  const [isLoadingNotebooks, setIsLoadingNotebooks] = useState(false);
  const [notebooksError, setNotebooksError] = useState<string | null>(null);

  // Fetch personal notebooks from API
  const fetchNotebooks = async () => {
    console.log('fetchNotebooks', isAuthenticated); 
    if (!isAuthenticated) {
      return;
    }

    setIsLoadingNotebooks(true);
    setNotebooksError(null);

    try {
      const notebooks = await fetchPersonalNotebooks(1, 100);
      setPersonalNotebooks(notebooks);
    } catch (error) {
      if (error instanceof HanziiApiError) {
        setNotebooksError(error.message);
      } else {
        console.error('Error fetching personal notebooks:', error);
        setNotebooksError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoadingNotebooks(false);
    }
  };

  // Fetch notebooks when component mounts and when authentication status changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotebooks();
    } else {
      setPersonalNotebooks([]);
      setNotebooksError(null);
    }
  }, [isAuthenticated]);

  // Handle notebook click
  const handlePersonalNotebookClick = (notebook: NotebookItemData) => {
    console.log('Personal notebook clicked:', notebook);
    // Navigate to personal notebook detail page with "your-" prefix
    setLocation(`/notebooks/your-${notebook.id}`);
  };

  // Convert PersonalNotebook to NotebookItemData
  const convertToNotebookItemData = (notebook: PersonalNotebook): NotebookItemData => {
    return {
      id: notebook.id.toString(),
      name: notebook.name,
      description: `${notebook.notebooks_count} ${t.common.words} • ${notebook.language.toUpperCase()}`,
    };
  };

  return (
    <div className="rounded-2xl p-6 sm:p-8 transition-all duration-300">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-blue mb-2">
          {t.notebooks.personal.title}
        </h2>
        
        {isAuthenticated ? (
          <div className="space-y-4">
            <p className="text-subtext1">
              {t.notebooks.personal.description}
            </p>
            
            {/* Loading state */}
            {isLoadingNotebooks && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue border-t-transparent"></div>
                <span className="ml-3 text-subtext1">Loading notebooks...</span>
              </div>
            )}
            
            {/* Error state */}
            {notebooksError && (
              <div className="bg-red/10 border border-red/20 rounded-lg p-4">
                <p className="text-red text-sm">{notebooksError}</p>
                <button 
                  onClick={fetchNotebooks}
                  className="mt-2 text-blue hover:text-mauve text-sm underline"
                >
                  Try again
                </button>
              </div>
            )}
            
            {/* Notebooks list */}
            {!isLoadingNotebooks && !notebooksError && personalNotebooks.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {personalNotebooks.map((notebook) => (
                  <NotebookItem
                    key={notebook.id}
                    notebook={convertToNotebookItemData(notebook)}
                    onClick={handlePersonalNotebookClick}
                    variant="default"
                  />
                ))}
              </div>
            )}
            
            {/* Empty state */}
            {!isLoadingNotebooks && !notebooksError && personalNotebooks.length === 0 && (
              <div className="py-8">
                <div className="text-center">
                  <svg className="w-16 h-16 text-subtext0 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-subtext1 mb-2">{t.notebooks.personal.noNotebooks}</p>
                  <p className="text-sm text-subtext0">Create your first notebook to get started!</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-subtext1 mb-6">
              {t.notebooks.personal.loginPrompt}
            </p>
            <div className="flex justify-center">
              <AuthButton />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 
