import React, { useState, useEffect } from 'react';
import { Content } from './Content';
import { ControlView } from './ControlView';
import ThemeSwitcher from '../../components/ThemeSwitcher';
import { isFromToday } from '../../utils';

export interface SlideShowProps {
  // Props can be added here as needed
  initialSlide?: number;
}

export const SlideShow: React.FC<SlideShowProps> = ({ 
  initialSlide = 0
}) => {
  const [currentSlide, setCurrentSlide] = useState(initialSlide);
  const [wordItems, setWordItems] = useState<WordItem[]>([]);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchedWord, setSearchedWord] = useState<WordItem | null>(null);
  
  // Load items from localStorage on component mount
  useEffect(() => {
    try {
      const items: WordItem[] = [];
      const storageKeys = Object.keys(localStorage);
      
      // Filter keys with the prefix "hanzii-word-"
      const wordKeys = storageKeys.filter(key => key.startsWith('hanzii-word-'));
      
      wordKeys.forEach(key => {
        try {
          const itemData = localStorage.getItem(key);
          if (itemData) {
            const parsedData = JSON.parse(itemData);
            
            // Create WordItem with word being the key with "hanzii-" prefix removed
            const item: WordItem = {
              word: key.replace('hanzii-', ''),
              timestamp: parsedData.timestamp
            };
            
            // Check if the item is from today
            if (isFromToday(item.timestamp)) {
              items.push(item);
            } else {
              // Remove outdated items
              localStorage.removeItem(key);
            }
          }
        } catch (error) {
          console.error(`Error processing item ${key}:`, error);
          // Remove invalid items
          localStorage.removeItem(key);
        }
      });
      
      // setWordItems(items);
      setWordItems([{
        word: '宝贝',
        timestamp: Date.now()
      }]);
    } catch (error) {
      console.error("Error loading word items:", error);
      setWordItems([{
        word: '宝贝',
        timestamp: Date.now()
      }]);
    }
  }, []);

  const handlePrev = () => {
    setCurrentSlide(prev => Math.max(0, prev - 1));
  };
  
  const handleNext = () => {
    if (wordItems.length === 0) {
      return; // Don't increment if there are no items
    }
    setCurrentSlide(prev => prev + 1);
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

  return (
    <div className="relative w-full h-screen bg-base overflow-hidden">
      {/* ThemeSwitcher positioned at top-left corner */}
      <div className="absolute top-4 left-4 z-10">
        <ThemeSwitcher />
      </div>
      
      {/* ControlView component positioned absolutely at top center */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        <ControlView 
          currentSlide={currentSlide} 
          onPrev={handlePrev} 
          onNext={handleNext}
          onSearch={handleSearch}
          isSearchMode={isSearchMode}
        />
      </div>
      
      {/* Content component taking full screen */}
      <Content 
        currentSlide={currentSlide} 
        wordItems={isSearchMode && searchedWord ? [searchedWord] : wordItems} 
      />
    </div>
  );
};
