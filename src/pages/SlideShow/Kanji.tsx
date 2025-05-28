import React from 'react';
import { HanziiWordDetails } from '../../api/hanzii';
import { KanjiCharacter } from './KanjiCharacter';

export interface KanjiProps {
  wordDefinition: HanziiWordDetails | null;
  isLoading: boolean;
  error: string | null;
  currentWord: WordItem;
}

export const Kanji: React.FC<KanjiProps> = ({ 
  isLoading, 
  error, 
  currentWord 
}) => {
  // Extract kanji characters from the word
  const kanjiChars = currentWord.word.split('').filter(char => 
    /[\u4e00-\u9faf]/.test(char) // Japanese kanji range
  );

  return (
    <div className="h-full flex flex-col p-6 min-w-[400px] overflow-auto">
      {/* Loading/Error states */}
      {isLoading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-subtext1 text-lg">
            Loading kanji details...
          </div>
        </div>
      )}

      {error && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-red text-lg">
            Failed to load kanji information
          </div>
        </div>
      )}

      {/* Main content */}
      {!isLoading && !error && (
        <div className="flex-1 space-y-6 overflow-y-auto">
          {/* Interactive Kanji Writers */}
          {kanjiChars.length > 0 && (
            <div className="py-4 rounded-lg">
              <div className="flex flex-wrap justify-start gap-x-1 gap-y-2">
                {kanjiChars.map((char) => (
                  <KanjiCharacter
                    key={`kanji-${char}`}
                    character={char}
                    isAnimating={false}
                    onAnimationStart={() => {}}
                    onAnimationEnd={() => {}}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 
