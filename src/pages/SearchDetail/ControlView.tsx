import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { SearchInput } from '../../components/SearchInput';

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

  const handleSearchClick = () => {
    setShowSearchInput(true);
  };

  const handleSearchSubmit = (word: string) => {
    onSearch(word);
    setShowSearchInput(false);
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowSearchInput(false);
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
          <div className="bg-surface0 p-6 rounded-lg shadow-lg w-full max-w-[600px] m-4">
            <h3 className="text-lg font-semibold text-text mb-4">Search Word</h3>
            
            <SearchInput
              onSearch={handleSearchSubmit}
              placeholder="Enter Chinese characters, pinyin, or meanings..."
              showButton={true}
              autoFocus={true}
              className="w-full"
            />
            
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={() => setShowSearchInput(false)}
                className="px-4 py-2 bg-surface2 text-text rounded hover:bg-overlay0 transition-colors"
              >
                Cancel
              </button>
            </div>
            
            <div className="text-xs text-subtext1 mt-2">
              <p>• Press Enter to search • Click outside to close</p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

