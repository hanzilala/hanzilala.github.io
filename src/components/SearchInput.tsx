import { useState, useRef, useEffect, useCallback } from 'react';

interface SearchSuggestion {
  id: string;
  word: string;
  displayText: string;
}

interface SearchInputProps {
  onSearch: (word: string) => void;
  placeholder?: string;
  className?: string;
  showButton?: boolean;
  autoFocus?: boolean;
  initialValue?: string;
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
  initialValue = ""
}) => {
  const [searchQuery, setSearchQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Focus input on mount if autoFocus is true
  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
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
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder={placeholder}
          className="w-full px-6 py-4 text-lg border-2 border-surface1 rounded-full 
                   bg-surface0 text-text placeholder-subtext0
                   focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/20
                   hover:border-surface2 transition-all duration-200"
        />

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue border-t-transparent"></div>
          </div>
        )}
      </div>

      {/* Search Button */}
      {showButton && (
        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={() => handleSearch()}
            disabled={!searchQuery.trim()}
            className="px-8 py-3 bg-surface1 text-text rounded-lg
                     hover:bg-surface2 focus:outline-none focus:ring-2 focus:ring-blue/20
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200"
          >
            Search
          </button>
        </div>
      )}

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-surface0 border border-surface1 
                   rounded-lg shadow-lg max-h-80 overflow-y-auto z-50"
        >
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion.word)}
              className="px-6 py-3 hover:bg-surface1 cursor-pointer border-b border-surface1 last:border-b-0
                       transition-colors duration-150"
            >
              <span className="text-lg text-text">
                {highlightSearchTerm(suggestion.displayText, searchQuery)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 
