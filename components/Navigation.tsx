import React from 'react';
import { AppView, Language } from '../types';
import { t } from '../translations';

interface NavigationProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onBack: () => void;
  language: Language;
  onToggleLanguage: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate, onBack, language, onToggleLanguage }) => {
  return (
    <div className="fixed top-8 left-0 right-0 z-50 flex justify-between items-center px-8 md:px-16 pointer-events-none">
      <div 
        className="pointer-events-auto cursor-pointer transition-opacity hover:opacity-70"
        onClick={() => onNavigate(AppView.HOME)}
      >
        <h1 className="text-white font-serif text-xl tracking-[0.2em] uppercase text-glow">
          {t('app.title', language)}
        </h1>
      </div>
      
      <div className="flex gap-4 pointer-events-auto items-center">
        <button
          onClick={onToggleLanguage}
          className="text-stone-400 font-serif text-xs tracking-widest hover:text-white transition-colors uppercase border border-white/10 bg-black/20 px-3 py-1 rounded-full"
        >
          {language === 'en' ? 'EN / 中文' : '英文 / CN'}
        </button>

        {currentView !== AppView.HOME && (
          <button 
            onClick={onBack}
            className="text-stone-300 font-serif text-sm tracking-widest hover:text-white transition-colors uppercase backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 bg-white/5"
          >
            {t('nav.back', language)}
          </button>
        )}
      </div>
    </div>
  );
};
