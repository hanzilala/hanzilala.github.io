import React, { useEffect, useState } from 'react';
import { getWordDetails, HanziiWordDetails } from '../../api/hanzii';
import { useLanguage, useLayout } from '../../components/ThemeProvider';
import { DefaultLayout } from './DefaultLayout';
import { FullScreenLayout } from './FullScreenLayout';

export interface ContentProps {
  currentSlide: number;
  wordItems: WordItem[];
  onNextWord: () => void;
}

export const Content: React.FC<ContentProps> = ({ currentSlide, wordItems, onNextWord }) => {
  const [wordDefinition, setWordDefinition] = useState<HanziiWordDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();
  const { layout } = useLayout();

  // Calculate the current word to display (with wrapping)
  const wordIndex = currentSlide % wordItems.length;
  const currentWord = wordItems[wordIndex];

  // Fetch word definition when current word or language changes
  useEffect(() => {
    const fetchWordDefinition = async () => {
      if (!currentWord?.word) return;

      setIsLoading(true);
      setError(null);

      try {
        console.log('=== AUTO API CALL ===');
        console.log('Language:', language);
        const wordDetails = await getWordDetails(currentWord.word, language);
        console.log('Auto API call result:', wordDetails);
        setWordDefinition(wordDetails);
      } catch (err) {
        console.error('Failed to fetch word definition:', err);
        setError(`Failed to load definition: ${err}`);
        setWordDefinition(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWordDefinition();
  }, [currentWord?.word, language]);

  // Handle empty state
  if (wordItems.length === 0) {
    return (
      <div className="w-full h-screen bg-base text-text flex flex-col items-center justify-center px-6">
        <h2 className="text-2xl font-bold mb-4">No Words Found</h2>
        <p className="text-center text-subtext0">
          No words from today were found in storage.
        </p>
      </div>
    );
  }

  // Render the appropriate layout based on the current layout setting
  const renderLayout = () => {
    const layoutProps = {
      wordDefinition,
      isLoading,
      error,
      currentWord
    };

    switch (layout) {
      case 'fullscreen':
        return <FullScreenLayout {...layoutProps} onNextWord={onNextWord} />;
      case 'default':
      default:
        return <DefaultLayout {...layoutProps} />;
    }
  };

  return (
    <>
      {/* Slide counter positioned at bottom right */}
      <div className="absolute bottom-4 right-4 text-sm text-subtext0 z-60">
        {wordIndex + 1} / {wordItems.length}
      </div>

      {/* Render the selected layout */}
      {renderLayout()}
    </>
  );
};

