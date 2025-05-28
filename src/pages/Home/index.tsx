import { useLocation } from 'wouter';
import { SearchInput } from '../../components/SearchInput';

export const Home = () => {
  const [, setLocation] = useLocation();

  const handleSearch = (word: string) => {
    setLocation(`/search/${encodeURIComponent(word)}`);
  };

  return (
    <div className="min-h-screen bg-base text-text flex flex-col items-center justify-center px-4">
      {/* Logo/Title */}
      <div className="mb-8 text-center">
        <h1 className="text-6xl font-light text-blue mb-2">Hanzilala</h1>
        <p className="text-lg text-subtext1">Keep it simple</p>
      </div>

      {/* Search Container */}
      <div className="w-full max-w-2xl">
        <SearchInput
          onSearch={handleSearch}
          placeholder="Search for Chinese characters, pinyin, or meanings..."
          showButton={true}
          autoFocus={true}
          className="w-full"
        />
      </div>

      {/* Footer */}
      <div className="mt-16 text-center text-subtext0 text-sm">
        <p>Enter a Chinese character, pinyin, or English meaning to start learning</p>
      </div>
    </div>
  );
}; 
