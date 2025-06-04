import { useState, useRef, useEffect, useCallback } from 'react';
import { isValidPinyin, getPinyinWithTones, PINYIN_COMBINATIONS } from '../utils/pinyin-dictionaries';

// Search mode options
type SearchMode = 'default' | 'pinyin';

interface SearchInputProps {
  onSearch: (word: string) => void;
  placeholder?: string;
  className?: string;
  showButton?: boolean;
  autoFocus?: boolean;
  initialValue?: string;
  suggestionsZIndex?: number;
  maxSuggestionsHeight?: string;
}

interface SearchSuggestion {
  id: string;
  word: string;
  displayText: string;
}

// Debounce function instead of throttle
const useDebounce = (callback: Function, delay: number) => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback((...args: any[]) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
};

export const SearchInput: React.FC<SearchInputProps> = ({
  onSearch,
  placeholder = "Search for Chinese characters, pinyin, or meanings...",
  className = "",
  showButton = true,
  autoFocus = false,
  initialValue = "",
  suggestionsZIndex = 100,
  maxSuggestionsHeight = "20rem"
}) => {
  const [searchQuery, setSearchQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchMode, setSearchMode] = useState<SearchMode>('default');
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Focus input on mount if autoFocus is true
  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

  // Handle click outside to close suggestions and dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
      
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Function to highlight search term in text
  const highlightSearchTerm = (text: string, searchTerm: string) => {
    if (!searchTerm.trim()) return text;

    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (regex.test(part)) {
        return <span key={index} className="bg-pink text-base font-medium">{part}</span>;
      }
      return part;
    });
  };

  // API call to fetch suggestions
  const fetchSuggestions = async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('https://suggest.hanzii.net/api/suggest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/plain, */*',
        },
        body: JSON.stringify({
          keyword: query,
          dict: "cnvi"
        })
      });

      if (response.ok) {
        const result = await response.json();

        if (result.status === 200 && Array.isArray(result.data)) {
          // Parse the API response format: "汉字#pinyin#pronunciation#meaning"
          const transformedSuggestions: SearchSuggestion[] = result.data
            .slice(0, 8) // Limit to 8 suggestions
            .map((item: string, index: number) => {
              // Skip the first item if it's just the search query
              if (index === 0 && item === query) {
                return null;
              }

              const parts = item.split('#');
              if (parts.length >= 4) {
                // Format: ${parts[0]} [${parts[2]}] ${parts[3]}
                const displayText = `${parts[0]} [${parts[2]}] ${parts[3]}`;
                return {
                  id: `suggestion-${index}`,
                  word: parts[0], // Use the Chinese character for search
                  displayText: displayText
                };
              } else {
                // Keep original item if less than 4 parts
                return {
                  id: `suggestion-${index}`,
                  word: item,
                  displayText: item
                };
              }
            })
            .filter(Boolean) as SearchSuggestion[]; // Remove null items

          setSuggestions(transformedSuggestions);
          setShowSuggestions(transformedSuggestions.length > 0);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } else {
        console.error('API request failed:', response.status);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced version of fetchSuggestions (300ms delay)
  const debouncedFetchSuggestions = useDebounce(fetchSuggestions, 300);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedFetchSuggestions(value);
  };

  const handleSearch = (word?: string) => {
    const searchTerm = word || searchQuery.trim();
    if (searchTerm) {
      onSearch(searchTerm);
      setShowSuggestions(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSuggestionClick = (word: string) => {
    setSearchQuery(word);
    setShowSuggestions(false);
    handleSearch(word);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative flex">
        {/* Dropdown Button */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center justify-between w-24 sm:w-32 px-2 sm:px-4 py-3 sm:py-4 h-12 sm:h-[4rem] text-sm sm:text-lg border-2 border-overlay0 border-r-0 
                     rounded-l-full bg-mantle text-text hover:bg-surface0 
                     focus:outline-none focus:border-lavender/60 focus:ring-2 focus:ring-lavender/10 transition-all duration-200"
          >
            <span className="text-xs sm:text-sm font-medium truncate">
              {searchMode === 'default' ? 'Default' : 'Pinyin'}
            </span>
            <svg 
              className={`ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-300 ${
                showDropdown ? 'rotate-180' : ''
              }`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {/* Dropdown Menu */}
          <div className={`absolute top-full left-0 mt-1 w-24 sm:w-32 bg-surface0 border border-surface1 
                       rounded-lg shadow-lg transition-all duration-300 ease-out origin-top z-50 ${
            showDropdown 
              ? 'opacity-100 scale-y-100 translate-y-0' 
              : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none'
          }`}>
            <button
              type="button"
              onClick={() => {
                setSearchMode('default');
                setShowDropdown(false);
              }}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm hover:bg-surface1 
                       transition-colors duration-150 first:rounded-t-lg ${
                searchMode === 'default' ? 'bg-surface1 font-medium' : ''
              }`}
            >
              Default
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchMode('pinyin');
                setShowDropdown(false);
              }}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm hover:bg-surface1 
                       transition-colors duration-150 last:rounded-b-lg ${
                searchMode === 'pinyin' ? 'bg-surface1 font-medium' : ''
              }`}
            >
              Pinyin
            </button>
          </div>
        </div>

        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder={placeholder}
          className="flex-1 px-4 sm:px-6 py-3 sm:py-4 h-12 sm:h-[4rem] text-base sm:text-lg border-2 border-overlay0 rounded-r-full 
                   bg-mantle text-text placeholder-subtext1
                   focus:outline-none focus:border-lavender/60 focus:ring-2 focus:ring-lavender/10
                   hover:border-overlay1 transition-all duration-200"
        />

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-lavender/60 border-t-transparent"></div>
          </div>
        )}
      </div>

      {/* Search Button */}
      {showButton && (
        <div className="flex justify-center mt-4 sm:mt-6 space-x-4">
          <button
            onClick={() => handleSearch()}
            disabled={!searchQuery.trim()}
            className="px-6 sm:px-8 py-2.5 sm:py-3 bg-lavender/70 text-base rounded-lg
                     hover:bg-lavender/80 focus:outline-none focus:ring-2 focus:ring-lavender/20
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200 font-semibold text-sm sm:text-base"
          >
            Search
          </button>
        </div>
      )}

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-mantle border border-overlay0 
                   rounded-lg shadow-lg overflow-y-auto"
          style={{ 
            zIndex: suggestionsZIndex,
            maxHeight: maxSuggestionsHeight 
          }}
        >
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion.word)}
              className="px-4 sm:px-6 py-2.5 sm:py-3 hover:bg-surface0 cursor-pointer border-b border-overlay0 last:border-b-0
                       transition-colors duration-150"
            >
              <span className="text-base sm:text-lg text-text">
                {highlightSearchTerm(suggestion.displayText, searchQuery)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 
