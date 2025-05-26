import React, { useState, useRef, useEffect } from 'react';

export interface ControlViewProps {
  currentSlide: number;
  onPrev: () => void;
  onNext: () => void;
  onSearch: (word: string) => void;
  isSearchMode: boolean;
}

export const ControlView: React.FC<ControlViewProps> = ({
  currentSlide,
  onPrev,
  onNext,
  onSearch,
  isSearchMode
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
    if (searchValue.trim()) {
      onSearch(searchValue.trim());
      setShowSearchInput(false);
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
          disabled={currentSlide === 0 || isSearchMode}
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
          onClick={handleSearchClick}
          className="px-3 py-1 bg-green text-base rounded hover:bg-teal transition-colors"
        >
          🔍
        </button>
      </div>

      {/* Floating search input overlay */}
      {showSearchInput && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleClickOutside}
        >
          <div className="bg-surface0 p-6 rounded-lg shadow-lg min-w-[400px]">
            <h3 className="text-lg font-semibold text-text mb-4">Search Word</h3>
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter word to search..."
                  className="w-full px-4 py-2 pr-10 bg-surface1 text-text border border-surface2 rounded focus:outline-none focus:border-blue"
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
                  disabled={!searchValue.trim()}
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
            <p className="text-xs text-subtext1 mt-2">Press Escape to close</p>
          </div>
        </div>
      )}
    </>
  );
};

