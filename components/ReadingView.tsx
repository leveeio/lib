import React, { useEffect, useState } from 'react';
import { Author, GeneratedContent, Language } from '../types';
import { getBookExcerpt } from '../services/geminiService';
import { t } from '../translations';

interface ReadingViewProps {
  author: Author;
  language: Language;
}

export const ReadingView: React.FC<ReadingViewProps> = ({ author, language }) => {
  const [content, setContent] = useState<GeneratedContent | null>(null);

  useEffect(() => {
    // Reset content when author changes
    setContent(null);
    
    const fetchContent = async () => {
      const work = language === 'zh' && author.famousWorkZh ? author.famousWorkZh : author.famousWork;
      const name = language === 'zh' && author.nameZh ? author.nameZh : author.name;
      
      const data = await getBookExcerpt(work, name, language);
      setContent(data);
    };
    fetchContent();
  }, [author, language]);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-6 relative">
      <div className="max-w-3xl w-full bg-black/80 backdrop-blur-xl border border-white/5 p-12 md:p-16 rounded-sm shadow-2xl relative overflow-hidden transition-all duration-1000 animate-in fade-in zoom-in-95">
        
        {/* Book Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper.png')]"></div>
        
        {!content ? (
          <div className="flex flex-col items-center gap-6 py-20">
             <div className="w-1 h-1 bg-white rounded-full animate-ping"></div>
             <p className="text-stone-500 font-serif italic">{t('reading.loading', language)}</p>
          </div>
        ) : (
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-serif text-stone-100 mb-2 text-center">
              {content.title}
            </h2>
            <p className="text-stone-500 text-center font-sans tracking-widest uppercase text-sm mb-12">
              {language === 'zh' && author.nameZh ? author.nameZh : author.name} — {language === 'zh' && author.periodZh ? author.periodZh : author.period}
            </p>

            <div className="prose prose-invert prose-lg mx-auto text-stone-300 font-serif leading-loose text-justify">
               <span className="text-5xl float-left mr-2 mt-[-10px] text-stone-500 font-serif">"</span>
               {content.content}
               <span className="text-5xl float-right ml-2 mt-[-20px] text-stone-500 font-serif">"</span>
            </div>
            
            <div className="mt-12 flex justify-center opacity-50">
               <div className="w-2 h-2 rounded-full bg-stone-500 mx-1"></div>
               <div className="w-2 h-2 rounded-full bg-stone-500 mx-1"></div>
               <div className="w-2 h-2 rounded-full bg-stone-500 mx-1"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
