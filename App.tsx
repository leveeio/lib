import React, { useState } from 'react';
import { Background } from './components/Background';
import { Navigation } from './components/Navigation';
import { HomeView } from './components/HomeView';
import { ThoughtInputView } from './components/ThoughtInputView';
import { RecommendationView } from './components/RecommendationView';
import { GalaxyView } from './components/GalaxyView';
import { ReadingView } from './components/ReadingView';
import { AuthorDetailView } from './components/AuthorDetailView';
import { AppView, Book, Author, Language } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.HOME);
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [language, setLanguage] = useState<Language>('zh'); // Default to Chinese as per request context

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'zh' : 'en');
  };

  const renderView = () => {
    switch (view) {
      case AppView.HOME:
        return <HomeView onNavigate={setView} language={language} />;
      
      case AppView.THOUGHT_INPUT:
        return (
          <ThoughtInputView 
            onRecommendationsLoaded={(books) => {
              setRecommendedBooks(books);
              setView(AppView.RECOMMENDATION);
            }} 
            language={language}
          />
        );
      
      case AppView.RECOMMENDATION:
        return <RecommendationView books={recommendedBooks} language={language} />;
      
      case AppView.GALAXY:
        return (
          <GalaxyView 
            onSelectAuthor={(author) => {
              setSelectedAuthor(author);
              setView(AppView.AUTHOR_DETAIL);
            }} 
            language={language}
          />
        );
      
      case AppView.AUTHOR_DETAIL:
        return selectedAuthor ? (
          <AuthorDetailView 
            author={selectedAuthor} 
            onRead={() => setView(AppView.READING)}
            language={language}
          />
        ) : null;
        
      case AppView.READING:
        return selectedAuthor ? <ReadingView author={selectedAuthor} language={language} /> : null;
        
      default:
        return <HomeView onNavigate={setView} language={language} />;
    }
  };

  const handleBack = () => {
    switch (view) {
      case AppView.THOUGHT_INPUT:
      case AppView.GALAXY:
        setView(AppView.HOME);
        break;
      case AppView.RECOMMENDATION:
        setView(AppView.THOUGHT_INPUT);
        break;
      case AppView.AUTHOR_DETAIL:
        setView(AppView.GALAXY);
        break;
      case AppView.READING:
        setView(AppView.AUTHOR_DETAIL);
        break;
      default:
        setView(AppView.HOME);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden text-stone-100">
      <Background />
      
      <Navigation 
        currentView={view} 
        onNavigate={setView}
        onBack={handleBack}
        language={language}
        onToggleLanguage={toggleLanguage}
      />

      <main className="relative z-10 w-full h-full pt-20 transition-all duration-700 ease-in-out">
         <div className="w-full h-full animate-[fadeIn_0.5s_ease-out]">
            {renderView()}
         </div>
      </main>
      
      {/* Optional overlay vignette to enhance focus */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)] z-40"></div>
    </div>
  );
};

export default App;
