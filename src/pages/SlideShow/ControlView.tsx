import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

// Utility function to clean search input
const cleanSearchInput = (input: string): string => {
  return input
    .trim() // Remove leading and trailing whitespace
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/\s+(?=[\u4e00-\u9fff])|(?<=[\u4e00-\u9fff])\s+/g, ''); // Remove spaces around Chinese characters
};

export interface ControlViewProps {
  currentSlide: number;
  onPrev: () => void;
  onNext: () => void;
  onSearch: (word: string) => void;
  onExitSearch: () => void;
  isSearchMode: boolean;
  isAutoPlay: boolean;
  onToggleAutoPlay: () => void;
}

export const ControlView: React.FC<ControlViewProps> = ({
  onPrev,
  onNext,
  onSearch,
  onExitSearch,
  isSearchMode,
  isAutoPlay,
  onToggleAutoPlay
}) => {
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when it becomes visible
  useEffect(() => {
    if (showSearchInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showSearchInput]);

  const handleSearchClick = () => {
    setShowSearchInput(true);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedValue = cleanSearchInput(searchValue);
    if (cleanedValue) {
      onSearch(cleanedValue);
      setShowSearchInput(false);
      setSearchValue(''); // Clear the input after successful search
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowSearchInput(false);
      setSearchValue('');
    }
  };

  const handleClear = () => {
    setSearchValue('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowSearchInput(false);
      setSearchValue('');
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 px-4 py-2 bg-surface0 rounded-lg shadow-sm">
        <button
          onClick={onPrev}
          disabled={isSearchMode}
          className="px-3 py-1 bg-blue text-base rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-sapphire transition-colors"
        >
          ←
        </button>
        <button
          onClick={onNext}
          disabled={isSearchMode}
          className="px-3 py-1 bg-blue text-base rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-sapphire transition-colors"
        >
          →
        </button>
        <button
          onClick={onToggleAutoPlay}
          disabled={isSearchMode}
          className={`px-3 py-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            isAutoPlay 
              ? 'bg-yellow text-base hover:bg-peach' 
              : 'bg-surface2 text-text hover:bg-overlay0'
          }`}
          title={isAutoPlay ? 'Pause auto-play' : 'Start auto-play'}
        >
          {isAutoPlay ? '⏸️' : '▶️'}
        </button>
        {!isSearchMode ? (
          <button
            onClick={handleSearchClick}
            className="px-3 py-1 bg-green text-base rounded hover:bg-teal transition-colors"
          >
            🔍
          </button>
        ) : (
          <button
            onClick={onExitSearch}
            className="px-3 py-1 bg-red text-base rounded hover:bg-maroon transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Floating search input overlay using Portal */}
      {showSearchInput && createPortal(
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-70 flex items-center justify-center"
          onClick={handleClickOutside}
        >
          <div className="bg-surface0 p-6 rounded-lg shadow-lg w-full max-w-[500px] sm:min-w-[500px] m-4">
            <h3 className="text-lg font-semibold text-text mb-4">Search Word</h3>
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={searchValue}
                  onChange={(e) => {
                    const rawValue = e.target.value;
                    // Allow typing but clean on blur or when spaces are around Chinese characters
                    setSearchValue(rawValue);
                  }}
                  onBlur={(e) => {
                    // Clean the input when user leaves the field
                    const cleanedValue = cleanSearchInput(e.target.value);
                    setSearchValue(cleanedValue);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter Chinese word..."
                  className="w-full px-4 py-2 pr-10 bg-surface1 text-text border border-surface2 rounded focus:outline-none focus:border-blue font-chinese"
                />
                {searchValue && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-subtext1 hover:text-text"
                  >
                    ✕
                  </button>
                )}
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  type="submit"
                  disabled={!cleanSearchInput(searchValue)}
                  className="px-4 py-2 bg-blue text-base rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-sapphire transition-colors"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowSearchInput(false);
                    setSearchValue('');
                  }}
                  className="px-4 py-2 bg-surface2 text-text rounded hover:bg-overlay0 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
            <div className="text-xs text-subtext1 mt-2 space-y-1">
              <p>• Press Enter to search • Press Escape to close</p>
              <p>• Spaces around Chinese characters will be auto-removed</p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

