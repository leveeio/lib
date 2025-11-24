import React from 'react';
import { Book, Language } from '../types';
import { t } from '../translations';

interface RecommendationViewProps {
  books: Book[];
  language: Language;
}

export const RecommendationView: React.FC<RecommendationViewProps> = ({ books, language }) => {
  return (
    <div className="h-full w-full overflow-y-auto px-6 py-24 flex flex-col items-center">
      <h3 className="text-3xl font-serif text-stone-200 mb-12 text-center text-glow">
        {t('rec.title', language)}
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {books.map((book, idx) => (
          <div 
            key={idx} 
            className="group relative bg-black/40 backdrop-blur-md border border-white/10 p-8 rounded-lg transition-all duration-700 hover:transform hover:-translate-y-2 hover:bg-white/5"
            style={{ animationDelay: `${idx * 200}ms` }}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <h4 className="text-2xl font-serif text-stone-100 mb-2 font-bold italic">
              {book.title}
            </h4>
            <p className="text-purple-300/80 font-sans text-sm tracking-widest uppercase mb-4">
              {book.author} {book.year && `• ${book.year}`}
            </p>
            
            <div className="h-px w-12 bg-white/20 mb-6"></div>
            
            <p className="text-stone-300 font-light leading-relaxed mb-6">
              {book.description}
            </p>
            
            <div className="bg-white/5 p-4 rounded border-l-2 border-purple-500/50">
              <p className="text-stone-400 text-sm italic font-serif">
                "{book.reason}"
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {books.length === 0 && (
        <div className="text-stone-500 text-center font-serif italic">
          {t('rec.empty', language)}
        </div>
      )}
    </div>
  );
};
