import './App.css';
import { useEffect } from 'react';
import { Router, Route } from 'wouter';
import { ThemeProvider } from './components/ThemeProvider';
import { AuthProvider } from './components/AuthProvider';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { SearchDetail } from './pages/SearchDetail';
import { Notebooks } from './pages/Notebooks';
import { NotebookDetail } from './pages/NotebookDetail';
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
        <Router>
          <div className="flex flex-col min-h-screen transition-colors duration-300">
            <Header />
            
            <main className="flex-1 pt-12">
              <Route path="/" component={Home} />
              <Route path="/notebooks" component={Notebooks} />
              <Route path="/notebooks/:id" component={NotebookDetail} />
              <Route path="/search/:wordItem" component={SearchDetail} />
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
