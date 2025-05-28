import './App.css';
import { ThemeProvider } from './components/ThemeProvider';
import ThemeSwitcher from './components/ThemeSwitcher';
import { SlideShow } from './pages/SlideShow/index';
import { hanziService } from './services/hanziService';

const App = () => {
  useEffect(() => {
    // Initialize Hanzi service on app startup
    hanziService.initialize().catch(error => {
      console.error('Failed to initialize Hanzi service:', error);
    });
  }, []);

  return (
    <ThemeProvider>
      <div className="flex flex-col transition-colors duration-300">
        <div className="fixed top-4 right-4">
          <ThemeSwitcher />
        </div>
        
        <div className="w-full flex-1">
          <SlideShow initialSlide={0} />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;
