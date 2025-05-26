import React from 'react';
import { HanziiWordDetails } from '../../api/hanzii';

export interface UsageProps {
  wordDefinition: HanziiWordDetails | null;
  isLoading: boolean;
  error: string | null;
  currentWord: WordItem;
}

export const Usage: React.FC<UsageProps> = ({ 
  wordDefinition, 
  isLoading, 
  error, 
  currentWord 
}) => {
  const wordAvailable = wordDefinition && !isLoading && !error;

  // Format the timestamp
  const formattedTime = new Date(currentWord.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="h-full flex flex-col p-6 overflow-auto">
      {/* Word title */}
      <h2 className="text-4xl font-bold mb-4 text-pink text-center">{currentWord.word}</h2>
      
      {/* Pronunciation */}
      {wordAvailable && wordDefinition.pronunciation && (
        <div className="text-lg text-maroon mb-6 text-center">
          /{wordDefinition.pronunciation}/
        </div>
      )}

      {/* Content area */}
      <div className="flex-1 flex flex-col justify-center">
        {isLoading && (
          <div className="text-center text-subtext1 text-lg">
            Loading definition...
          </div>
        )}

        {error && (
          <div className="text-center text-red text-lg">
            {error}
          </div>
        )}

        {wordAvailable && (
          <div className="bg-surface0 p-6 rounded-lg">
            {wordDefinition.definition && (
              <div className="text-text mb-6 text-lg">
                <strong className="text-blue">Definition:</strong>
                <div className="mt-2">{wordDefinition.definition}</div>
              </div>
            )}

            {wordDefinition.examples && wordDefinition.examples.length > 0 && (
              <div className="text-base text-subtext1">
                <strong className="text-blue">Examples:</strong>
                <ul className="list-none mt-3 space-y-2">
                  {wordDefinition.examples.slice(0, 3).map((example, index) => (
                    <li key={index} className="italic text-sm">"{example}"</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {!wordDefinition && !isLoading && !error && (
          <div className="text-center text-subtext1 text-lg">
            No definition found
          </div>
        )}
      </div>

      {/* Timestamp at bottom */}
      <div className="bg-surface0 px-4 py-2 rounded-md text-subtext1 text-sm text-center mt-4">
        Added at {formattedTime}
      </div>
    </div>
  );
}; 
