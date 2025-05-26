import './App.css';
import { ThemeProvider } from './components/ThemeProvider';
import ThemeSwitcher from './components/ThemeSwitcher';
import { SlideShow } from './pages/SlideShow/index';

const App = () => {
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
