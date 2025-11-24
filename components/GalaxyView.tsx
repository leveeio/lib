import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Author, GalaxyCluster, Language } from '../types';
import { t } from '../translations';

// Hardcoded data with Chinese variants
const CLUSTERS: GalaxyCluster[] = [
  {
    name: "Romanticism",
    nameZh: "浪漫主义",
    color: "from-red-900 to-pink-900",
    authors: [
      { id: '1', name: 'Mary Shelley', nameZh: '玛丽·雪莱', period: 'Romantic', periodZh: '浪漫主义', style: 'Gothic', styleZh: '哥特式', famousWork: 'Frankenstein', famousWorkZh: '弗兰肯斯坦', x: 20, y: 30, z: 10 },
      { id: '2', name: 'Lord Byron', nameZh: '拜伦勋爵', period: 'Romantic', periodZh: '浪漫主义', style: 'Poetic', styleZh: '诗意', famousWork: 'Don Juan', famousWorkZh: '唐璜', x: 30, y: 40, z: -20 },
      { id: '3', name: 'John Keats', nameZh: '约翰·济慈', period: 'Romantic', periodZh: '浪漫主义', style: 'Sensual', styleZh: '感性', famousWork: 'Ode to a Nightingale', famousWorkZh: '夜莺颂', x: 10, y: 25, z: 0 },
      { id: '4', name: 'Victor Hugo', nameZh: '维克多·雨果', period: 'Romantic', periodZh: '浪漫主义', style: 'Epic', styleZh: '史诗', famousWork: 'Les Misérables', famousWorkZh: '悲惨世界', x: 40, y: 10, z: 30 },
    ]
  },
  {
    name: "Modernism",
    nameZh: "现代主义",
    color: "from-blue-900 to-slate-900",
    authors: [
      { id: '5', name: 'Virginia Woolf', nameZh: '弗吉尼亚·伍尔夫', period: 'Modernist', periodZh: '现代主义', style: 'Stream of Consciousness', styleZh: '意识流', famousWork: 'Mrs Dalloway', famousWorkZh: '达洛维夫人', x: 70, y: 60, z: 10 },
      { id: '6', name: 'James Joyce', nameZh: '詹姆斯·乔伊斯', period: 'Modernist', periodZh: '现代主义', style: 'Complex', styleZh: '复杂', famousWork: 'Ulysses', famousWorkZh: '尤利西斯', x: 80, y: 70, z: -10 },
      { id: '7', name: 'Franz Kafka', nameZh: '弗兰兹·卡夫卡', period: 'Modernist', periodZh: '现代主义', style: 'Absurdist', styleZh: '荒诞', famousWork: 'The Metamorphosis', famousWorkZh: '变形记', x: 60, y: 50, z: 20 },
      { id: '8', name: 'T.S. Eliot', nameZh: 'T.S.艾略特', period: 'Modernist', periodZh: '现代主义', style: 'Fragmented', styleZh: '碎片化', famousWork: 'The Waste Land', famousWorkZh: '荒原', x: 75, y: 45, z: 0 },
    ]
  },
  {
    name: "Existentialism",
    nameZh: "存在主义",
    color: "from-stone-800 to-gray-900",
    authors: [
      { id: '9', name: 'Albert Camus', nameZh: '阿尔贝·加缪', period: 'Existential', periodZh: '存在主义', style: 'Absurdism', styleZh: '荒诞', famousWork: 'The Stranger', famousWorkZh: '局外人', x: 40, y: 80, z: 40 },
      { id: '10', name: 'Sartre', nameZh: '萨特', period: 'Existential', periodZh: '存在主义', style: 'Philosophy', styleZh: '哲学', famousWork: 'Nausea', famousWorkZh: '恶心', x: 50, y: 85, z: 20 },
      { id: '11', name: 'Dostoevsky', nameZh: '陀思妥耶夫斯基', period: 'Pre-Existential', periodZh: '前存在主义', style: 'Psychological', styleZh: '心理', famousWork: 'Notes from Underground', famousWorkZh: '地下室手记', x: 30, y: 70, z: 0 },
    ]
  }
];

interface GalaxyViewProps {
  onSelectAuthor: (author: Author) => void;
  language: Language;
}

export const GalaxyView: React.FC<GalaxyViewProps> = ({ onSelectAuthor, language }) => {
  const [activeCluster, setActiveCluster] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStyle, setActiveStyle] = useState<string | null>(null);
  const [showStyleMenu, setShowStyleMenu] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Pan and Zoom State
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Extract all unique styles
  const allStyles = useMemo(() => {
    const styles = new Set<string>();
    CLUSTERS.forEach(cluster => {
      cluster.authors.forEach(author => {
        const s = language === 'zh' && author.styleZh ? author.styleZh : author.style;
        styles.add(s);
      });
    });
    return Array.from(styles).sort();
  }, [language]);

  // Filter logic
  const filteredClusters = useMemo(() => {
    if (!searchTerm && !activeStyle) return CLUSTERS;
    const lowerTerm = searchTerm.toLowerCase();

    return CLUSTERS.map(cluster => {
      // Check if cluster name matches search
      const clusterMatch = !activeStyle && (cluster.name.toLowerCase().includes(lowerTerm) || 
                           (cluster.nameZh && cluster.nameZh.includes(lowerTerm)));
      
      // Filter authors
      const matchingAuthors = cluster.authors.filter(author => {
         const name = language === 'zh' && author.nameZh ? author.nameZh : author.name;
         const style = language === 'zh' && author.styleZh ? author.styleZh : author.style;
         
         // If a style filter is active, strictly enforce it
         if (activeStyle && style !== activeStyle) return false;

         // If search term exists, check matches
         if (searchTerm) {
             return name.toLowerCase().includes(lowerTerm) || 
                    style.toLowerCase().includes(lowerTerm);
         }

         return true;
      });

      if (clusterMatch) {
           if (!activeStyle) return cluster;
      }

      if (matchingAuthors.length > 0) {
        return { ...cluster, authors: matchingAuthors };
      }
      return null;
    }).filter(Boolean) as GalaxyCluster[];
  }, [searchTerm, activeStyle, language]);

  // Search Suggestions Logic
  const suggestions = useMemo(() => {
    if (!searchTerm) return [];
    const lowerTerm = searchTerm.toLowerCase();
    const results: { label: string, type: 'author' | 'style', data?: any }[] = [];

    CLUSTERS.forEach(c => {
        c.authors.forEach(a => {
            const name = language === 'zh' && a.nameZh ? a.nameZh : a.name;
            const style = language === 'zh' && a.styleZh ? a.styleZh : a.style;
            
            if (name.toLowerCase().includes(lowerTerm)) {
                results.push({ label: name, type: 'author', data: a });
            }
            // Add style suggestion if not already present and matches
            if (style.toLowerCase().includes(lowerTerm) && !results.some(r => r.label === style && r.type === 'style')) {
                results.push({ label: style, type: 'style', data: style });
            }
        });
    });
    return results.slice(0, 5); // Limit to 5 suggestions
  }, [searchTerm, language]);


  // Handlers for Pan/Zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    const newScale = Math.max(0.5, Math.min(3, scale - e.deltaY * 0.001));
    setScale(newScale);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleClusterClick = (clusterName: string) => {
    if (activeCluster === clusterName) {
        setActiveCluster(null);
        setScale(1); 
    } else {
        setActiveCluster(clusterName);
        setScale(1.5);
    }
  };

  const handleSuggestionClick = (suggestion: { label: string, type: string, data?: any }) => {
      if (suggestion.type === 'author') {
          onSelectAuthor(suggestion.data);
      } else if (suggestion.type === 'style') {
          setActiveStyle(suggestion.data);
          setSearchTerm(''); // Clear search to show the filter results
      }
      setShowSuggestions(false);
  };

  return (
    <div 
        className="h-full w-full overflow-hidden relative bg-black/20"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        onClick={() => {
            setShowStyleMenu(false);
            setShowSuggestions(false);
        }}
    >
      <div className="absolute top-24 left-0 right-0 z-30 flex flex-col items-center gap-4 pointer-events-none">
        <h3 className="text-center text-stone-500 font-serif text-sm tracking-[0.3em] uppercase opacity-70">
          {t('galaxy.prompt', language)}
        </h3>
        
        {/* Controls Bar */}
        <div className="pointer-events-auto flex items-center gap-2 relative">
            {/* Search Input */}
            <div className="relative group">
                <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setShowSuggestions(true);
                        if (activeStyle) setActiveStyle(null); // Clear filter on typing
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder={activeStyle ? `${t('galaxy.filter', language)}: ${activeStyle}` : t('galaxy.search', language)}
                    className={`bg-black/60 backdrop-blur-xl border ${activeStyle ? 'border-purple-500/50' : 'border-white/10'} text-stone-200 px-6 py-2 rounded-full w-64 text-center font-serif focus:outline-none focus:border-purple-500/50 transition-all focus:w-80 shadow-lg`}
                />
                {activeStyle && (
                    <button 
                        onClick={() => setActiveStyle(null)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-white"
                    >
                        ✕
                    </button>
                )}

                {/* Search Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        {suggestions.map((s, idx) => (
                            <div 
                                key={idx}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleSuggestionClick(s);
                                }}
                                className="px-4 py-3 hover:bg-white/10 cursor-pointer border-b border-white/5 last:border-0 flex justify-between items-center group"
                            >
                                <span className="text-stone-300 font-serif group-hover:text-white transition-colors">{s.label}</span>
                                <span className="text-[10px] uppercase tracking-wider text-stone-500 border border-white/10 px-1 rounded">
                                    {s.type === 'author' ? t('galaxy.author', language) : t('galaxy.style', language)}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Filter Toggle */}
            <div className="relative">
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowStyleMenu(!showStyleMenu);
                        setShowSuggestions(false);
                    }}
                    className={`h-10 w-10 flex items-center justify-center rounded-full border transition-all duration-300 ${activeStyle || showStyleMenu ? 'bg-white/10 border-purple-500 text-purple-300' : 'bg-black/60 border-white/10 text-stone-400 hover:text-white hover:bg-white/5'}`}
                    title={t('galaxy.filter', language)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2z"/>
                    </svg>
                </button>

                {/* Style Menu Dropdown */}
                {showStyleMenu && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-black/90 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 grid grid-cols-1 max-h-60 overflow-y-auto custom-scrollbar">
                        <div 
                            className={`px-4 py-2 hover:bg-white/10 cursor-pointer text-sm font-serif ${!activeStyle ? 'text-purple-300 bg-white/5' : 'text-stone-400'}`}
                            onClick={() => setActiveStyle(null)}
                        >
                            {t('galaxy.all_styles', language)}
                        </div>
                        {allStyles.map((style) => (
                            <div 
                                key={style}
                                onClick={() => setActiveStyle(style)}
                                className={`px-4 py-2 hover:bg-white/10 cursor-pointer text-sm font-serif border-t border-white/5 ${activeStyle === style ? 'text-purple-300 bg-white/5' : 'text-stone-300'}`}
                            >
                                {style}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
      </div>

      <div 
        ref={containerRef}
        className="relative w-full h-full max-w-6xl mx-auto flex items-center justify-center transform-style-3d transition-transform duration-100 ease-out"
        style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`
        }}
      >
        {filteredClusters.map((cluster, idx) => {
          const isActive = activeCluster === cluster.name;
          const isDimmed = activeCluster !== null && !isActive;
          
          const originalIndex = CLUSTERS.findIndex(c => c.name === cluster.name);
          const clusterX = (originalIndex - 1) * 40; 
          
          return (
            <div
              key={cluster.name}
              className={`absolute transition-all duration-1000 ease-in-out
                ${isActive ? 'z-20' : 'z-10'}
                ${isDimmed ? 'opacity-10 blur-sm scale-75' : 'opacity-100'}
              `}
              style={{
                left: `${50 + clusterX}%`,
                top: '50%',
                transform: `translate(-50%, -50%) scale(${isActive ? 1.5 : 1})`,
              }}
            >
              <div 
                className="relative cursor-pointer group flex items-center justify-center"
                onClick={(e) => {
                    e.stopPropagation();
                    handleClusterClick(cluster.name);
                }}
              >
                {/* Cluster Center Star */}
                <div className={`w-40 h-40 rounded-full bg-gradient-to-br ${cluster.color} opacity-20 blur-xl animate-pulse group-hover:opacity-40 transition-opacity`}></div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-2xl font-serif text-stone-200 tracking-widest uppercase border-b border-white/20 pb-1 whitespace-nowrap shadow-lg bg-black/20 backdrop-blur-sm px-2 rounded">
                        {language === 'zh' && cluster.nameZh ? cluster.nameZh : cluster.name}
                    </span>
                </div>

                {/* Author Stars */}
                {(isActive || searchTerm || activeStyle) && cluster.authors.map((author, aIdx) => {
                    // Increased radius for better separation
                    const angle = (aIdx / cluster.authors.length) * Math.PI * 2;
                    const radius = 260; 
                    const ax = Math.cos(angle) * radius;
                    const ay = Math.sin(angle) * radius;
                    
                    return (
                        <div 
                            key={author.id}
                            className="absolute left-1/2 top-1/2 w-auto min-w-[120px] flex flex-col items-center justify-center transition-all duration-500 cursor-pointer hover:scale-110 z-20"
                            style={{
                                '--ax': `${ax}px`,
                                '--ay': `${ay}px`,
                                transform: `translate(-50%, -50%) translate(${ax}px, ${ay}px)`,
                                opacity: 0,
                                animation: `fadeIn 0.5s forwards ${aIdx * 0.1}s`
                            } as React.CSSProperties}
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelectAuthor(author);
                            }}
                        >
                            <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_15px_white] mb-2 hover:bg-purple-200 transition-colors"></div>
                            <span className="text-stone-300 font-serif text-lg whitespace-nowrap bg-black/40 px-3 py-1 rounded backdrop-blur-md border border-white/5 shadow-xl">
                                {language === 'zh' && author.nameZh ? author.nameZh : author.name}
                            </span>
                            <span className="text-stone-500 text-xs tracking-wider uppercase mt-1 bg-black/40 px-2 rounded">
                                {language === 'zh' && author.styleZh ? author.styleZh : author.style}
                            </span>
                        </div>
                    );
                })}
              </div>
            </div>
          );
        })}
      </div>
      
      <style>{`
        @keyframes fadeIn {
            from { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
            to { opacity: 1; transform: translate(-50%, -50%) translate(var(--ax), var(--ay)) scale(1); } 
        }
        .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255,255,255,0.2);
            border-radius: 2px;
        }
      `}</style>
    </div>
  );
};