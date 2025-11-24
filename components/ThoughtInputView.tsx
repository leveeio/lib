import React, { useState } from 'react';
import { getBookRecommendations } from '../services/geminiService';
import { Book, Language } from '../types';
import { t } from '../translations';

interface ThoughtInputViewProps {
  onRecommendationsLoaded: (books: Book[]) => void;
  language: Language;
}

export const ThoughtInputView: React.FC<ThoughtInputViewProps> = ({ onRecommendationsLoaded, language }) => {
  const [thought, setThought] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!thought.trim()) return;
    setLoading(true);
    const books = await getBookRecommendations(thought, language);
    setLoading(false);
    onRecommendationsLoaded(books);
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center relative z-10 px-6">
      <div className={`transition-all duration-700 ${loading ? 'opacity-0 scale-90' : 'opacity-100 scale-100'} w-full max-w-2xl`}>
        <h3 className="text-3xl font-serif text-stone-200 mb-8 text-center tracking-wide">
          {t('input.title', language)}
        </h3>
        
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <textarea
            value={thought}
            onChange={(e) => setThought(e.target.value)}
            placeholder={t('input.placeholder', language)}
            className="relative w-full h-48 bg-black/60 backdrop-blur-xl border border-white/10 rounded-lg p-6 text-xl text-stone-200 font-light font-serif focus:outline-none focus:border-purple-500/50 transition-colors resize-none placeholder-stone-600"
          />
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={!thought.trim()}
            className="px-10 py-3 bg-white/5 hover:bg-white/10 border border-white/20 rounded-full text-stone-200 font-serif tracking-[0.2em] transition-all hover:tracking-[0.3em] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('input.button', language)}
          </button>
        </div>
      </div>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-t-2 border-r-2 border-purple-400 rounded-full animate-spin mx-auto opacity-70"></div>
            <p className="text-stone-400 font-serif tracking-widest animate-pulse">{t('input.loading', language)}</p>
          </div>
        </div>
      )}
    </div>
  );
};
