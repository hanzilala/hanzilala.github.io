import React, { useEffect, useState } from 'react';
import { getWordDetails, HanziiWordDetails } from '../../api/hanzii';
import { Usage } from './Usage';
import { Kanji } from './Kanji';

export interface ContentProps {
  currentSlide: number;
  wordItems: WordItem[];
}

export const Content: React.FC<ContentProps> = ({ currentSlide, wordItems }) => {
  const [wordDefinition, setWordDefinition] = useState<HanziiWordDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate the current word to display (with wrapping)
  const wordIndex = currentSlide % wordItems.length;
  const currentWord = wordItems[wordIndex];

  // Fetch word definition when current word changes
  useEffect(() => {
    const fetchWordDefinition = async () => {
      if (!currentWord?.word) return;

      setIsLoading(true);
      setError(null);

      try {
        console.log('=== AUTO API CALL ===');
        const wordDetails = await getWordDetails(currentWord.word);
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
  }, [currentWord?.word]);

  // Handle empty state
  if (wordItems.length === 0) {
    return (
      <div className="w-full h-screen bg-mantle text-text flex flex-col items-center justify-center px-6">
        <h2 className="text-2xl font-bold mb-4">No Words Found</h2>
        <p className="text-center text-subtext0">
          No words from today were found in storage.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-mantle text-text pt-16">
      {/* Slide counter positioned at top right */}
      <div className="absolute top-4 right-4 text-sm text-subtext0 z-10">
        {wordIndex + 1} / {wordItems.length}
      </div>

      {/* Horizontal layout: Usage (40%) | Kanji (60%, min 400px) */}
      <div className="h-full flex">
        {/* Usage section - 40% width */}
        <div className="w-2/5 border-r border-surface1">
          <Usage 
            wordDefinition={wordDefinition}
            isLoading={isLoading}
            error={error}
            currentWord={currentWord}
          />
        </div>

        {/* Kanji section - 60% width with minimum 400px */}
        <div className="flex-1 min-w-[400px]">
          <Kanji 
            wordDefinition={wordDefinition}
            isLoading={isLoading}
            error={error}
            currentWord={currentWord}
          />
        </div>
      </div>
    </div>
  );
};

