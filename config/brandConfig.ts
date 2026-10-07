import { saveImageToDb, getImageFromDb } from '../utils/imageDb';

export type BrandFontId = 
  | 'italiana'
  | 'tenor'
  | 'bellefair'
  | 'prata'
  | 'cormorant' 
  | 'marcellus' 
  | 'jost'
  | 'playfair' 
  | 'cinzel' 
  | 'montserrat' 
  | 'syne';

export interface BrandFontOption {
  id: BrandFontId;
  name: string;
  category: 'delicate' | 'classic' | 'modern';
  categoryLabel: string;
  badge: string;
  styleName: string;
  description: string;
  isDelicateRecommended?: boolean;
  fontClass: string;
  nameClass: string;
  taglineClass: string;
}

export const BRAND_FONT_OPTIONS: BrandFontOption[] = [
  {
    id: 'italiana',
    name: 'Italiana',
    category: 'delicate',
    categoryLabel: 'Delicada & Pura',
    badge: 'Alta Perfumaria',
    styleName: 'Alta Perfumaria Italiana • Sublime, esbelta e graciosa',
    description: 'Traços ultrafinos e proporções nobres. Transmite pureza e luxo discreto sem nenhum peso forçado.',
    isDelicateRecommended: true,
    fontClass: "font-['Italiana',serif]",
    nameClass: "font-['Italiana',serif] font-normal text-[23px] sm:text-[28px] md:text-[31px] lg:text-[33px] tracking-[0.06em]",
    taglineClass: "font-['Italiana',serif] font-normal text-[9.5px] sm:text-[10.5px] tracking-[0.3em]"
  },
  {
    id: 'tenor',
    name: 'Tenor Sans',
    category: 'delicate',
    categoryLabel: 'Quiet Luxury',
    badge: 'Mais Suave',
    styleName: 'Quiet Luxury Sans • Suave, fluida e despretensiosa',
    description: 'Criada para alta costura e fragrâncias refinadas. Geometria humanista com toque aveludado e nada agressivo.',
    isDelicateRecommended: true,
    fontClass: "font-['Tenor_Sans',sans-serif]",
    nameClass: "font-['Tenor_Sans',sans-serif] font-normal text-[21px] sm:text-[25px] md:text-[27px] lg:text-[29px] tracking-[0.07em]",
    taglineClass: "font-['Tenor_Sans',sans-serif] font-normal text-[9px] sm:text-[9.5px] tracking-[0.3em]"
  },
  {
    id: 'bellefair',
    name: 'Bellefair',
    category: 'delicate',
    categoryLabel: 'Atelier Paris',
    badge: 'Romântica & Leve',
    styleName: 'Atelier Parisiense • Romântica, fina e etérea',
    description: 'Serifas delicadas e traço esguio. Evoca os frascos de perfumes raros gravados na Place Vendôme.',
    isDelicateRecommended: true,
    fontClass: "font-['Bellefair',serif]",
    nameClass: "font-['Bellefair',serif] font-normal text-[22px] sm:text-[27px] md:text-[29px] lg:text-[31px] tracking-[0.04em]",
    taglineClass: "font-['Bellefair',serif] font-normal text-[9.5px] sm:text-[10px] tracking-[0.28em]"
  },
  {
    id: 'prata',
    name: 'Prata',
    category: 'delicate',
    categoryLabel: 'Elegância Orgânica',
    badge: 'Curvas Finas',
    styleName: 'Elegância Orgânica • Curvas suaves e contraste gentil',
    description: 'Terminais em gota e serifas muito finas. Movimento orgânico e afetuoso, fluido e acolhedor.',
    isDelicateRecommended: true,
    fontClass: "font-['Prata',serif]",
    nameClass: "font-['Prata',serif] font-normal text-[21px] sm:text-[26px] md:text-[28px] lg:text-[30px] tracking-[0.035em]",
    taglineClass: "font-['Prata',serif] font-normal text-[9px] sm:text-[9.5px] tracking-[0.26em]"
  },
  {
    id: 'cormorant',
    name: 'Cormorant Garamond',
    category: 'delicate',
    categoryLabel: 'Graça Clássica',
    badge: 'Parisiense',
    styleName: 'Graça & Nobreza • Fluida, graciosa e atemporal',
    description: 'Serifas finíssimas e ritmo renascentista que respira leveza natural, sem rigidez.',
    isDelicateRecommended: true,
    fontClass: "font-['Cormorant_Garamond',serif]",
    nameClass: "font-['Cormorant_Garamond',serif] font-medium text-[22px] sm:text-[27px] md:text-[29px] lg:text-[31px] tracking-[0.04em]",
    taglineClass: "font-['Cormorant_Garamond',serif] font-normal text-[9.5px] sm:text-[10px] tracking-[0.28em]"
  },
  {
    id: 'marcellus',
    name: 'Marcellus',
    category: 'delicate',
    categoryLabel: 'Serenidade',
    badge: 'Harmônica',
    styleName: 'Equilíbrio Clássico • Limpa, serena e harmônica',
    description: 'Inspirada na estética romana porém com ângulos suavizados, transmitindo nobreza e calma.',
    isDelicateRecommended: true,
    fontClass: "font-['Marcellus',serif]",
    nameClass: "font-['Marcellus',serif] font-normal text-[21px] sm:text-[26px] md:text-[28px] lg:text-[30px] tracking-[0.05em]",
    taglineClass: "font-['Marcellus',serif] font-normal text-[9px] sm:text-[10px] tracking-[0.26em]"
  },
  {
    id: 'jost',
    name: 'Jost Minimal',
    category: 'modern',
    categoryLabel: 'Clean Arejado',
    badge: 'Minimalista',
    styleName: 'Clean Arejado • Espaçada, leve e moderna',
    description: 'Geometria arejada com traço fino e tracking generoso. Sofisticação minimalista contemporânea.',
    isDelicateRecommended: true,
    fontClass: "font-['Jost',sans-serif]",
    nameClass: "font-['Jost',sans-serif] font-light text-[20px] sm:text-[25px] md:text-[27px] lg:text-[28px] tracking-[0.09em] uppercase",
    taglineClass: "font-['Jost',sans-serif] font-light text-[8.5px] sm:text-[9.5px] tracking-[0.32em]"
  },
  {
    id: 'playfair',
    name: 'Playfair Display',
    category: 'classic',
    categoryLabel: 'Editorial',
    badge: 'Vogue & Harper',
    styleName: 'Editorial Vogue • Clássica com contraste lírico',
    description: 'Estilo editorial com alto contraste e presença elegante para casas de fragrâncias históricas.',
    fontClass: "font-['Playfair_Display',serif]",
    nameClass: "font-['Playfair_Display',serif] font-medium text-[21px] sm:text-[26px] md:text-[28px] lg:text-[30px] tracking-[0.025em]",
    taglineClass: "font-['Playfair_Display',serif] font-normal text-[9px] sm:text-[9.5px] tracking-[0.24em]"
  },
  {
    id: 'cinzel',
    name: 'Cinzel',
    category: 'classic',
    categoryLabel: 'Romana',
    badge: 'Imperial',
    styleName: 'Imperial Romano • Monumental e solene',
    description: 'Inspirada nas inscrições lapidares latinas do primeiro século, formalidade lapidada.',
    fontClass: "font-['Cinzel',serif]",
    nameClass: "font-['Cinzel',serif] font-semibold text-[20px] sm:text-[25px] md:text-[27px] lg:text-[28px] tracking-[0.06em]",
    taglineClass: "font-['Cinzel',serif] font-medium text-[8.5px] sm:text-[9.5px] tracking-[0.3em]"
  },
  {
    id: 'montserrat',
    name: 'Montserrat',
    category: 'modern',
    categoryLabel: 'Clean',
    badge: 'Urbana',
    styleName: 'Moderno Urbano • Geométrico e claro',
    description: 'Geometria funcional contemporânea de excelente legibilidade visual.',
    fontClass: "font-['Montserrat',sans-serif]",
    nameClass: "font-['Montserrat',sans-serif] font-medium text-[20px] sm:text-[24px] md:text-[26px] lg:text-[27px] tracking-[0.05em]",
    taglineClass: "font-['Montserrat',sans-serif] font-normal text-[8.5px] sm:text-[9.5px] tracking-[0.26em]"
  },
  {
    id: 'syne',
    name: 'Syne',
    category: 'modern',
    categoryLabel: 'Autoral',
    badge: 'Vanguarda',
    styleName: 'Nicho Contemporâneo • Arrojada e artística',
    description: 'Tipografia de nicho para coleções autorais com identidade ousada e distinta.',
    fontClass: "font-['Syne',sans-serif]",
    nameClass: "font-['Syne',sans-serif] font-bold text-[20px] sm:text-[24px] md:text-[26px] lg:text-[27px] tracking-[0.02em]",
    taglineClass: "font-['Syne',sans-serif] font-medium text-[9px] sm:text-[9.5px] tracking-[0.24em]"
  }
];

export function getBrandFontClasses(fontId?: string) {
  const target = BRAND_FONT_OPTIONS.find(f => f.id === fontId) || BRAND_FONT_OPTIONS.find(f => f.id === 'cinzel') || BRAND_FONT_OPTIONS[0];
  return {
    nameClass: target.nameClass,
    taglineClass: target.taglineClass,
    fontClass: target.fontClass,
    fontName: target.name,
    styleName: target.styleName
  };
}

export type PerfumeTitleFontId = 'cormorant' | 'playfair' | 'marcellus' | 'sans';

export function getPerfumeTitleFontClass(fontId?: PerfumeTitleFontId | string): string {
  switch (fontId) {
    case 'playfair':
      return 'perfume-name-playfair';
    case 'marcellus':
      return 'perfume-name-marcellus';
    case 'sans':
      return 'font-sans font-semibold';
    case 'cormorant':
    default:
      return 'perfume-name-cormorant';
  }
}

export interface BrandConfig {
  logoUrl: string;
  brandName: string;
  tagline: string;
  showEmblemRing: boolean;
  fontFamily?: BrandFontId;
  perfumeTitleFont?: PerfumeTitleFontId;
}

const STORAGE_KEY = 'arfragrance_brand_config_v4';
const LOGO_DB_ID = 'brand_logo_custom';

export const DEFAULT_BRAND_CONFIG: BrandConfig = {
  logoUrl: '/logo.png',
  brandName: "AR Fragrance",
  tagline: 'SEU PERFUME ESTÁ AQUI.',
  showEmblemRing: true,
  fontFamily: 'italiana',
  perfumeTitleFont: 'cormorant'
};

let inMemoryConfig: BrandConfig | null = null;
let hasHydratedLogoFromDb = false;

// Async hydration from IndexedDB for high-res logo
if (typeof window !== 'undefined') {
  getImageFromDb(LOGO_DB_ID).then((dbLogo) => {
    if (dbLogo) {
      hasHydratedLogoFromDb = true;
      if (inMemoryConfig) {
        inMemoryConfig.logoUrl = dbLogo;
      }
      window.dispatchEvent(new Event('brand_config_updated'));
    }
  }).catch(() => {});
}

export function getBrandConfig(): BrandConfig {
  if (inMemoryConfig) {
    return inMemoryConfig;
  }

  try {
    // Clean up obsolete keys to prevent quota leaks
    try {
      localStorage.removeItem('arfragrance_brand_config_v3');
      localStorage.removeItem('arfragrance_brand_config_v2');
      localStorage.removeItem('arfragrance_brand_config');
      localStorage.removeItem('lelixir_brand_config');
    } catch {
      // ignore
    }

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!parsed.brandName || parsed.brandName === "L'ÉLIXIR" || parsed.brandName.includes("ÉLIXIR")) {
        parsed.brandName = "AR Fragrance";
      }
      if (
        !parsed.logoUrl || 
        parsed.logoUrl.includes('perfume_store_logo') || 
        parsed.logoUrl.includes('lelixir') ||
        parsed.logoUrl === '/image.png' || 
        parsed.logoUrl === '/logo.jpg'
      ) {
        parsed.logoUrl = '/logo.png';
      }
      if (!parsed.tagline || parsed.tagline.includes('Haute Parfumerie') || parsed.tagline === 'Haute Parfumerie & Decantes') {
        parsed.tagline = 'SEU PERFUME ESTÁ AQUI.';
      }
      const validFont = BRAND_FONT_OPTIONS.some(f => f.id === parsed.fontFamily);
      if (!parsed.fontFamily || parsed.fontFamily === 'manrope' || parsed.fontFamily === 'cinzel' || !validFont) {
        parsed.fontFamily = 'italiana';
      }

      const config: BrandConfig = { ...DEFAULT_BRAND_CONFIG, ...parsed };
      inMemoryConfig = config;
      return config;
    }
  } catch (e) {
    console.error('Error loading brand config:', e);
  }

  const fallback: BrandConfig = { ...DEFAULT_BRAND_CONFIG };
  inMemoryConfig = fallback;
  return fallback;
}

export function saveBrandConfig(config: BrandConfig): void {
  inMemoryConfig = { ...config };

  // If logo is a base64 data-URL, safely store in IndexedDB
  if (config.logoUrl && config.logoUrl.startsWith('data:image/')) {
    saveImageToDb(LOGO_DB_ID, config.logoUrl).catch(() => {});
  }

  try {
    // 1. Remove old version keys to keep quota completely free
    try {
      localStorage.removeItem('arfragrance_brand_config_v3');
      localStorage.removeItem('arfragrance_brand_config_v2');
      localStorage.removeItem('arfragrance_brand_config');
      localStorage.removeItem('lelixir_brand_config');
    } catch {
      // ignore
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(new Event('brand_config_updated'));
  } catch (err) {
    console.warn('Quota exceeded when saving brand config, applying fallback cleanup...', err);
    try {
      // 2. Clear non-critical obsolete caches
      localStorage.removeItem('arfragrance_brand_config_v3');
      localStorage.removeItem('arfragrance_brand_config');
      localStorage.removeItem('lelixir_brand_config');
      localStorage.removeItem('lelixir_cart');

      // 3. If payload is too large due to base64, save a lightweight descriptor in localStorage
      // while IndexedDB and in-memory cache safely hold the image
      const safeConfig: BrandConfig = {
        ...config,
        logoUrl: (config.logoUrl && config.logoUrl.startsWith('data:image/'))
          ? '/logo.png'
          : config.logoUrl
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(safeConfig));
      window.dispatchEvent(new Event('brand_config_updated'));
    } catch (fallbackErr) {
      // Even if localStorage is completely locked, state is preserved in memory and IndexedDB
      console.warn('LocalStorage full, state safely preserved in memory and IndexedDB:', fallbackErr);
      window.dispatchEvent(new Event('brand_config_updated'));
    }
  }
}

export function resetBrandConfig(): BrandConfig {
  inMemoryConfig = { ...DEFAULT_BRAND_CONFIG };
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('arfragrance_brand_config_v3');
    localStorage.removeItem('arfragrance_brand_config');
    localStorage.removeItem('lelixir_brand_config');
    window.dispatchEvent(new Event('brand_config_updated'));
  } catch (e) {
    console.error('Error resetting brand config:', e);
  }
  return DEFAULT_BRAND_CONFIG;
}
