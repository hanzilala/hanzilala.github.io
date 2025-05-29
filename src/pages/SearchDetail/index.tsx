import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { Content } from './Content';
import { ControlView } from './ControlView';
import LayoutSwitcher from '../../components/LayoutSwitcher';
import { SearchInput } from '../../components/SearchInput';
import { useWordItems, useLayout } from '../../components/ThemeProvider';

export interface SearchDetailProps {
  // Props can be added here as needed
}

export const SearchDetail: React.FC<SearchDetailProps> = () => {
  const params = useParams<{ wordItem: string }>();
  const [, setLocation] = useLocation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchedWord, setSearchedWord] = useState<WordItem | null>(null);
  
  // Use global word items state and layout
  const { wordItems } = useWordItems();
  const { layout } = useLayout();

  // Initialize searched word from URL parameter
  useEffect(() => {
    if (params.wordItem) {
      const decodedWord = decodeURIComponent(params.wordItem);
      const searchWord: WordItem = {
        word: decodedWord,
        timestamp: Date.now()
      };
      setSearchedWord(searchWord);
      setCurrentSlide(0);
    }
  }, [params.wordItem]);

  const handlePrev = () => {
    setCurrentSlide(prev => prev === 0 ? wordItems.length - 1 : prev - 1);
  };
  
  const handleNext = () => {
    if (wordItems.length === 0) {
      return; // Don't increment if there are no items
    }
    setCurrentSlide(prev => (prev + 1) % wordItems.length);
  };

  const handleSearch = (word: string) => {
    // Navigate to new search URL
    setLocation(`/search/${encodeURIComponent(word)}`);
  };

  const handleBackToHome = () => {
    setLocation('/');
  };

  return (
    <div className="relative w-full h-screen bg-base overflow-hidden">
      {/* Search input at the top */}
      <div className="absolute top-2 sm:top-4 left-1/2 transform -translate-x-1/2 z-60 w-full max-w-xs sm:max-w-md px-3 sm:px-4">
        <SearchInput
          onSearch={handleSearch}
          placeholder="Search for Chinese characters, pinyin, or meanings..."
          showButton={false}
          autoFocus={false}
          className="w-full"
          initialValue={searchedWord?.word || ''}
          suggestionsZIndex={9999}
          maxSuggestionsHeight="16rem"
        />
      </div>

      {/* Switchers positioned at bottom-left corner */}
      <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 z-60 flex gap-2 sm:gap-3">
        <LayoutSwitcher />
      </div>
      
      {/* ControlView component positioned absolutely at bottom center */}
      <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 z-60">
        <ControlView 
          currentSlide={currentSlide} 
          onPrev={handlePrev} 
          onNext={handleNext}
          onSearch={handleSearch}
          onExitSearch={handleBackToHome}
          isSearchMode={true}
          isAutoPlay={false}
          onToggleAutoPlay={() => {}} // No-op since auto-play is disabled
        />
      </div>
      
      {/* Content component taking full screen */}
      <Content 
        currentSlide={currentSlide} 
        wordItems={searchedWord ? [searchedWord] : []}
        onNextWord={handleNext}
      />
    </div>
  );
};
