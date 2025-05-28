import React from 'react';
import { HanziiWordDetails } from '../../api/hanzii';
import { Usage } from './Usage';
import { Kanji } from './Kanji';

export interface DefaultLayoutProps {
  wordDefinition: HanziiWordDetails | null;
  isLoading: boolean;
  error: string | null;
  currentWord: WordItem;
}

export const DefaultLayout: React.FC<DefaultLayoutProps> = ({
  wordDefinition,
  isLoading,
  error,
  currentWord
}) => {
  return (
    <div className="w-full h-screen bg-mantle text-text pt-12 pb-16">
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
