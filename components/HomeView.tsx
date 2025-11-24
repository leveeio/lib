import React from 'react';
import { AppView, Language } from '../types';
import { t } from '../translations';

interface HomeViewProps {
  onNavigate: (view: AppView) => void;
  language: Language;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, language }) => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center relative">
      <div className="max-w-4xl w-full text-center space-y-16 p-6">
        <div className="space-y-4 animate-float">
          <h2 className="text-5xl md:text-7xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-stone-100 to-stone-500 tracking-tight pb-4">
            {t('home.title', language)}
          </h2>
          <p className="text-stone-400 font-light text-lg md:text-xl tracking-wide max-w-2xl mx-auto">
            {t('home.subtitle', language)}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl mx-auto">
          <button 
            onClick={() => onNavigate(AppView.THOUGHT_INPUT)}
            className="group relative overflow-hidden rounded-xl p-[1px] transition-all hover:scale-105 duration-500"
          >
             <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-md group-hover:blur-xl transition-all"></div>
             <div className="relative bg-black/40 backdrop-blur-md border border-white/10 h-full p-8 flex flex-col items-center justify-center gap-4 rounded-xl hover:bg-white/5 transition-colors">
                <span className="text-3xl">🔮</span>
                <span className="text-stone-200 font-serif text-2xl">{t('home.mirror', language)}</span>
                <span className="text-stone-500 text-sm font-light">{t('home.mirror_desc', language)}</span>
             </div>
          </button>

          <button 
            onClick={() => onNavigate(AppView.GALAXY)}
            className="group relative overflow-hidden rounded-xl p-[1px] transition-all hover:scale-105 duration-500"
          >
             <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/20 blur-md group-hover:blur-xl transition-all"></div>
             <div className="relative bg-black/40 backdrop-blur-md border border-white/10 h-full p-8 flex flex-col items-center justify-center gap-4 rounded-xl hover:bg-white/5 transition-colors">
                <span className="text-3xl">🌌</span>
                <span className="text-stone-200 font-serif text-2xl">{t('home.galaxy', language)}</span>
                <span className="text-stone-500 text-sm font-light">{t('home.galaxy_desc', language)}</span>
             </div>
          </button>
        </div>
      </div>
    </div>
  );
};
