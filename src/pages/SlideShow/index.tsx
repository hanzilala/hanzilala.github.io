import React, { useState, useEffect, useRef } from 'react';
import { Content } from './Content';
import { ControlView } from './ControlView';
import LayoutSwitcher from '../../components/LayoutSwitcher';
import { useWordItems, useLayout } from '../../components/ThemeProvider';

export interface SlideShowProps {
  // Props can be added here as needed
  initialSlide?: number;
}

export const SlideShow: React.FC<SlideShowProps> = ({ 
  initialSlide = 0
}) => {
  const [currentSlide, setCurrentSlide] = useState(initialSlide);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchedWord, setSearchedWord] = useState<WordItem | null>(null);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Use global word items state and layout
  const { wordItems } = useWordItems();
  const { layout } = useLayout();
  const wordItemsRef = useRef(wordItems);
  
  // Update the ref whenever wordItems changes
  useEffect(() => {
    wordItemsRef.current = wordItems;
  }, [wordItems]);

  // Auto-play functionality - only for DefaultLayout
  useEffect(() => {
    console.log('Auto-play effect running:', { isAutoPlay, isSearchMode, layout, wordItemsLength: wordItems.length });
    
    // Clear any existing interval first
    if (autoPlayIntervalRef.current) {
      console.log('Clearing existing auto-play interval');
      clearInterval(autoPlayIntervalRef.current);
      autoPlayIntervalRef.current = null;
    }

    // Only enable auto-play for DefaultLayout, not FullScreenLayout
    if (isAutoPlay && !isSearchMode && layout === 'default' && wordItems.length > 1) {
      console.log('Setting up auto-play interval for DefaultLayout with', wordItems.length, 'items');
      autoPlayIntervalRef.current = setInterval(() => {
        console.log('Auto-play: advancing slide');
        setCurrentSlide(prev => {
          // Use the ref to get the current wordItems length
          const currentLength = wordItemsRef.current.length;
          const nextSlide = currentLength > 0 ? (prev + 1) % currentLength : 0;
          console.log('Auto-play: current slide', prev, '-> next slide', nextSlide);
          return nextSlide;
        });
      }, 10000); // 10 seconds
    }

    // Cleanup function
    return () => {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
        autoPlayIntervalRef.current = null;
      }
    };
  }, [isAutoPlay, isSearchMode, layout, wordItems.length]);

  const handlePrev = () => {
    // Pause auto-play when user manually navigates
    setIsAutoPlay(false);
    if (autoPlayIntervalRef.current) {
      clearInterval(autoPlayIntervalRef.current);
      autoPlayIntervalRef.current = null;
    }
    setCurrentSlide(prev => prev === 0 ? wordItems.length - 1 : prev - 1);
  };
  
  const handleNext = () => {
    if (wordItems.length === 0) {
      return; // Don't increment if there are no items
    }
    // Pause auto-play when user manually navigates
    setIsAutoPlay(false);
    if (autoPlayIntervalRef.current) {
      clearInterval(autoPlayIntervalRef.current);
      autoPlayIntervalRef.current = null;
    }
    setCurrentSlide(prev => (prev + 1) % wordItems.length);
  };

  const handleSearch = (word: string) => {
    // Create a search word item
    const searchWord: WordItem = {
      word: word,
      timestamp: Date.now()
    };
    
    setSearchedWord(searchWord);
    setIsSearchMode(true);
    setCurrentSlide(0); // Reset to first slide
  };

  const handleExitSearch = () => {
    setIsSearchMode(false);
    setSearchedWord(null);
    setCurrentSlide(0); // Reset to first slide of normal items
  };

  const handleToggleAutoPlay = () => {
    setIsAutoPlay(prev => !prev);
  };

  return (
    <div className="relative w-full h-screen bg-base overflow-hidden">
      {/* Switchers positioned at bottom-left corner */}
      <div className="absolute bottom-4 left-4 z-60 flex gap-3">
        <LayoutSwitcher />
      </div>
      
      {/* ControlView component positioned absolutely at bottom center */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-60">
        <ControlView 
          currentSlide={currentSlide} 
          onPrev={handlePrev} 
          onNext={handleNext}
          onSearch={handleSearch}
          onExitSearch={handleExitSearch}
          isSearchMode={isSearchMode}
          isAutoPlay={isAutoPlay}
          onToggleAutoPlay={handleToggleAutoPlay}
        />
      </div>
      
      {/* Content component taking full screen */}
      <Content 
        currentSlide={currentSlide} 
        wordItems={isSearchMode && searchedWord ? [searchedWord] : wordItems}
        onNextWord={handleNext}
      />
    </div>
  );
};
