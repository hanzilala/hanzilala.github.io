import { useLocation } from 'wouter';
import { SearchInput } from '../../components/SearchInput';

export const Home = () => {
  const [, setLocation] = useLocation();

  const handleSearch = (word: string) => {
    setLocation(`/search/${encodeURIComponent(word)}`);
  };

  return (
    <div className="fixed inset-0 bg-base text-text flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-12">
      {/* Logo/Title */}
      <div className="mb-6 sm:mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-blue mb-2">Hanzilala</h1>
        <p className="text-base sm:text-lg text-subtext1">Keep it simple</p>
      </div>

      {/* Search Container */}
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-2xl">
        <SearchInput
          onSearch={handleSearch}
          placeholder="Search for Chinese characters, pinyin, or meanings..."
          showButton={true}
          autoFocus={true}
          className="w-full"
          suggestionsZIndex={50}
          maxSuggestionsHeight="25vh"
        />
      </div>

      {/* Footer */}
      <div className="mt-8 sm:mt-12 text-center text-subtext0 text-xs sm:text-sm px-4">
        <p>Enter a Chinese character, pinyin, or English meaning to start learning</p>
      </div>
    </div>
  );
}; 
