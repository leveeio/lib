import { Language } from './types';

export const t = (key: string, lang: Language): string => {
  const dict: Record<string, { en: string; zh: string }> = {
    // Navigation
    'app.title': { en: 'Etherium Library', zh: '以太图书馆' },
    'nav.back': { en: 'Back', zh: '返回' },

    // Home
    'home.title': { en: 'Where do your thoughts dwell?', zh: '你的思绪栖息何处？' },
    'home.subtitle': { en: 'Enter the sanctuary of the mind. Connect your current state to timeless wisdom.', zh: '进入心灵的圣殿。将你当下的心境与永恒的智慧相连。' },
    'home.mirror': { en: 'Mirror of Mind', zh: '心灵之镜' },
    'home.mirror_desc': { en: 'Find books that match your thoughts', zh: '寻找契合你思绪的书籍' },
    'home.galaxy': { en: 'Writer\'s Galaxy', zh: '作家星系' },
    'home.galaxy_desc': { en: 'Explore the constellation of styles', zh: '探索文学风格的星群' },

    // Input
    'input.title': { en: 'Whisper your thoughts into the void...', zh: '向虚空低语你的思绪...' },
    'input.placeholder': { en: "I am feeling a strange sense of nostalgia for a place I've never been...", zh: '我感到一种莫名的怀旧，仿佛在思念一个从未去过的地方...' },
    'input.button': { en: 'CONSULT THE LIBRARY', zh: '咨询图书馆' },
    'input.loading': { en: 'Searching the archives...', zh: '正在检索档案...' },

    // Recommendation
    'rec.title': { en: 'The Library Responds', zh: '图书馆的回应' },
    'rec.empty': { en: 'The mists are too thick. Try again.', zh: '迷雾太浓。请重试。' },

    // Galaxy
    'galaxy.search': { en: 'Search authors or styles...', zh: '搜索作家或风格...' },
    'galaxy.prompt': { en: 'Drag to explore • Scroll to zoom', zh: '拖动以探索 • 滚动以缩放' },
    'galaxy.select': { en: 'Select a Constellation', zh: '选择一个星座' },
    'galaxy.filter': { en: 'Filter Style', zh: '筛选风格' },
    'galaxy.all_styles': { en: 'All Styles', zh: '全部风格' },
    'galaxy.clear_filter': { en: 'Clear Filter', zh: '清除筛选' },
    'galaxy.style': { en: 'Style', zh: '风格' },
    'galaxy.author': { en: 'Author', zh: '作家' },

    // Author Detail
    'author.style': { en: 'Style', zh: '风格' },
    'author.period': { en: 'Period', zh: '时期' },
    'author.work': { en: 'Famous Work', zh: '代表作' },
    'author.read': { en: 'READ EXCERPT', zh: '阅读片段' },
    'author.generating_bio': { en: 'Summoning author spirit...', zh: '正在召唤作家之灵...' },

    // Reading
    'reading.loading': { en: 'Retrieving artifact from the ether...', zh: '正在从以太中提取文物...' },
    'reading.error': { en: 'The page is torn...', zh: '书页已残损...' },
  };

  return dict[key]?.[lang] || key;
};