import './App.css';
import { useEffect } from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import { AuthProvider } from './components/AuthProvider';
import { Header } from './components/Header';
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
      <AuthProvider>
        <div className="flex flex-col min-h-screen transition-colors duration-300">
          <Header />
          
          <main className="flex-1 pt-12">
            <SlideShow initialSlide={0} />
          </main>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
