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
    <div className="w-full min-h-screen bg-base text-text pt-12 pb-16">
      {/* Horizontal layout: Usage section flexible | Kanji section fixed width */}
      <div className="flex">
        {/* Usage section - flexible width */}
        <div className="flex-1 border-r border-surface1">
          <Usage 
            wordDefinition={wordDefinition}
            isLoading={isLoading}
            error={error}
            currentWord={currentWord}
          />
        </div>

        {/* Kanji section - fixed width optimized for Kanji component */}
        <div className="w-[480px] min-w-[480px]">
          <Kanji 
            wordDefinition={wordDefinition}
            isLoading={false}
            error={null}
            currentWord={currentWord}
          />
        </div>
      </div>
    </div>
  );
}; 
