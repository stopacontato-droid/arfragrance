import { saveImageToDb, getImageFromDb, deleteImageFromDb } from '../utils/imageDb';

export interface BannersConfig {
  collections: {
    importados?: string;
    arabes?: string;
    lab8?: string;
  };
  heroSlides: {
    [slideId: string]: {
      productImage?: string;
      backgroundImage?: string;
    };
  };
}

const STORAGE_KEY = 'arfragrance_banners_config';

export const DEFAULT_COLLECTION_IMAGES = {
  importados: '/collections/colecao-importados.jpg',
  arabes: '/collections/colecao-arabes.jpg',
  lab8: '/collections/colecao-lab8.jpg'
};

let inMemoryBanners: BannersConfig | null = null;

export function getBannersConfig(): BannersConfig {
  if (inMemoryBanners) return inMemoryBanners;
  if (typeof window === 'undefined') {
    return { collections: {}, heroSlides: {} };
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      inMemoryBanners = JSON.parse(saved);
      return inMemoryBanners || { collections: {}, heroSlides: {} };
    }
  } catch (e) {
    console.error('Error loading banners config:', e);
  }

  inMemoryBanners = { collections: {}, heroSlides: {} };
  return inMemoryBanners;
}

export function saveCollectionImage(collectionId: 'importados' | 'arabes' | 'lab8', imageUrl: string): void {
  const current = { ...getBannersConfig() };
  current.collections = {
    ...current.collections,
    [collectionId]: imageUrl
  };
  inMemoryBanners = current;

  if (typeof window !== 'undefined') {
    // If base64, save to IndexedDB as backup
    if (imageUrl.startsWith('data:image/')) {
      saveImageToDb(`banner_col_${collectionId}`, imageUrl).catch(() => {});
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    } catch {
      // If quota exceeded, save stripped version in localStorage
      const stripped = {
        ...current,
        collections: { ...current.collections, [collectionId]: imageUrl.length > 20000 ? undefined : imageUrl }
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stripped));
      } catch {}
    }

    window.dispatchEvent(new CustomEvent('arfragrance_banners_updated'));
  }
}

export function saveHeroSlideImage(
  slideId: string, 
  images: { productImage?: string; backgroundImage?: string }
): void {
  const current = { ...getBannersConfig() };
  current.heroSlides = {
    ...current.heroSlides,
    [slideId]: {
      ...(current.heroSlides[slideId] || {}),
      ...images
    }
  };
  inMemoryBanners = current;

  if (typeof window !== 'undefined') {
    if (images.productImage?.startsWith('data:image/')) {
      saveImageToDb(`banner_hero_prod_${slideId}`, images.productImage).catch(() => {});
    }
    if (images.backgroundImage?.startsWith('data:image/')) {
      saveImageToDb(`banner_hero_bg_${slideId}`, images.backgroundImage).catch(() => {});
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    } catch {
      // Safe fallback
    }

    window.dispatchEvent(new CustomEvent('arfragrance_banners_updated'));
  }
}

export function resetCollectionImage(collectionId: 'importados' | 'arabes' | 'lab8'): void {
  const current = { ...getBannersConfig() };
  if (current.collections) {
    delete current.collections[collectionId];
    inMemoryBanners = current;
    deleteImageFromDb(`banner_col_${collectionId}`).catch(() => {});
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    } catch {}
    window.dispatchEvent(new CustomEvent('arfragrance_banners_updated'));
  }
}

export function resetHeroSlideImage(slideId: string): void {
  const current = { ...getBannersConfig() };
  if (current.heroSlides && current.heroSlides[slideId]) {
    delete current.heroSlides[slideId];
    inMemoryBanners = current;
    deleteImageFromDb(`banner_hero_prod_${slideId}`).catch(() => {});
    deleteImageFromDb(`banner_hero_bg_${slideId}`).catch(() => {});
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    } catch {}
    window.dispatchEvent(new CustomEvent('arfragrance_banners_updated'));
  }
}
