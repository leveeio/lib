import React, { useEffect, useState } from 'react';
import { Author, Language } from '../types';
import { t } from '../translations';
import { getAuthorBio } from '../services/geminiService';

interface AuthorDetailViewProps {
  author: Author;
  onRead: () => void;
  language: Language;
}

export const AuthorDetailView: React.FC<AuthorDetailViewProps> = ({ author, onRead, language }) => {
  const [bio, setBio] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadBio = async () => {
        setLoading(true);
        const name = language === 'zh' && author.nameZh ? author.nameZh : author.name;
        const generatedBio = await getAuthorBio(name, language);
        if (isMounted) {
            setBio(generatedBio);
            setLoading(false);
        }
    };
    loadBio();

    return () => { isMounted = false; };
  }, [author, language]);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center relative p-6">
       <div className="max-w-xl w-full bg-black/60 backdrop-blur-xl border border-white/10 p-10 rounded-lg shadow-[0_0_50px_rgba(100,0,255,0.1)] animate-in fade-in zoom-in-95 duration-500">
          
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-4xl font-serif text-white tracking-wide text-glow">
                {language === 'zh' && author.nameZh ? author.nameZh : author.name}
            </h2>
            <div className="flex justify-center gap-4 text-stone-400 text-xs uppercase tracking-[0.2em]">
                <span>{language === 'zh' && author.periodZh ? author.periodZh : author.period}</span>
                <span>•</span>
                <span>{language === 'zh' && author.styleZh ? author.styleZh : author.style}</span>
            </div>
          </div>

          <div className="min-h-[100px] flex items-center justify-center mb-8">
              {loading ? (
                  <div className="text-stone-600 animate-pulse italic text-sm">{t('author.generating_bio', language)}</div>
              ) : (
                  <p className="text-stone-300 font-serif leading-relaxed text-center italic opacity-90">
                      "{bio}"
                  </p>
              )}
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col items-center gap-6">
              <div className="text-center">
                  <span className="text-stone-500 text-xs uppercase tracking-widest block mb-1">{t('author.work', language)}</span>
                  <span className="text-xl font-serif text-purple-200">
                      {language === 'zh' && author.famousWorkZh ? author.famousWorkZh : author.famousWork}
                  </span>
              </div>
              
              <button 
                onClick={onRead}
                className="mt-4 px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded text-white font-serif tracking-[0.25em] text-sm uppercase transition-all duration-300 hover:tracking-[0.35em] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                {t('author.read', language)}
              </button>
          </div>

       </div>
    </div>
  );
};
