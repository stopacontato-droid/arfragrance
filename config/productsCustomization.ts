import { Product } from '../types/perfume';
import { PERFUMES_DATA } from '../data/perfumesData';
import { saveImageToDb, getAllImagesFromDb, deleteImageFromDb } from '../utils/imageDb';

export interface ProductCustomization {
  name?: string;
  brand?: string;
  price?: number;
  originalPrice?: number;
  description?: string;
  image?: string;
  images?: string[];
  badge?: string;
  gender?: 'masculino' | 'feminino' | 'unissex';
}

const STORAGE_KEY = 'arfragrance_products_customization';
const CATALOG_SYNC_VERSION = 'arfragrance_catalog_sync_v6';

// In-memory cache to guarantee instant synchronization across views
let inMemoryOverrides: Record<string, ProductCustomization> | null = null;
let hasHydratedFromDb = false;

/**
 * Safely persists customization data to browser localStorage.
 * If quota is exceeded, gracefully trims large base64 strings (which are safely preserved in IndexedDB)
 * to prevent uncaught QuotaExceededError.
 */
function safeSaveToLocalStorage(data: Record<string, ProductCustomization>): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (err) {
    try {
      // 1. Remove non-critical storage keys to free space
      localStorage.removeItem('arfragrance_orders');
      localStorage.removeItem('lelixir_cart');
      localStorage.removeItem('arfragrance_cart');

      // 2. If payload exceeds 5MB due to base64 images, create a lightweight copy
      // preserving full metadata, while images are safely preserved in IndexedDB & memory
      const lightweightCopy: Record<string, ProductCustomization> = {};
      for (const [key, val] of Object.entries(data)) {
        lightweightCopy[key] = { ...val };
        if (
          lightweightCopy[key].image && 
          lightweightCopy[key].image!.startsWith('data:image/') && 
          lightweightCopy[key].image!.length > 15000
        ) {
          // Keep lightweight placeholder in localStorage
          lightweightCopy[key].image = undefined;
          lightweightCopy[key].images = undefined;
        }
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(lightweightCopy));
      return true;
    } catch {
      // If still fails, memory overrides remain active for current session
      return false;
    }
  }
}

/**
 * Hydrates custom images from IndexedDB into in-memory overrides
 */
export function initCustomizationsFromDb(): void {
  if (typeof window === 'undefined' || hasHydratedFromDb) return;
  hasHydratedFromDb = true;

  getAllImagesFromDb().then((dbImages) => {
    let changed = false;
    const current = { ...getProductCustomizations() };
    for (const [id, imageData] of Object.entries(dbImages)) {
      if (imageData && (!current[id]?.image || current[id].image!.length < imageData.length)) {
        current[id] = {
          ...(current[id] || {}),
          image: imageData,
          images: [imageData]
        };
        changed = true;
      }
    }
    if (changed) {
      inMemoryOverrides = current;
      window.dispatchEvent(new CustomEvent('arfragrance_products_updated', { detail: {} }));
    }
  }).catch(() => {});
}

function syncCatalogCustomizations(customizations: Record<string, ProductCustomization>): Record<string, ProductCustomization> {
  if (typeof window === 'undefined') return customizations;
  try {
    const isSynced = localStorage.getItem(CATALOG_SYNC_VERSION);
    if (isSynced) return customizations;

    // Migrate any photos placed under old slot IDs
    if (customizations['arabe-slot-2'] && !customizations['lattafa-yara']) {
      customizations['lattafa-yara'] = { ...customizations['arabe-slot-2'] };
    }
    if (customizations['arabe-slot-7'] && !customizations['sabah-al-ward']) {
      customizations['sabah-al-ward'] = { ...customizations['arabe-slot-7'] };
    }

    // Clean up old removed arabic slots from customizations
    const oldSlotsToRemove = [
      'arabe-slot-1', 'arabe-slot-2', 'arabe-slot-3', 'arabe-slot-4',
      'arabe-slot-5', 'arabe-slot-6', 'arabe-slot-7', 'arabe-slot-8', 'arabe-slot-9'
    ];
    for (const oldKey of oldSlotsToRemove) {
      delete customizations[oldKey];
    }

    // Clean up old removed imported perfumes from customizations
    const oldImportadosToRemove = [
      'dior-sauvage', 'bleu-de-chanel', 'versace-eros', 'phantom-rabanne',
      'le-male-elixir-jpg', 'stronger-with-you-intensely', 'libre-ysl',
      'coco-mademoiselle', 'baccarat-rouge-540', 'creed-aventus', 'one-million-rabanne'
    ];
    for (const oldKey of oldImportadosToRemove) {
      delete customizations[oldKey];
    }

    // Clean up old removed decantes from customizations
    const oldDecantesToRemove = [
      'decant-baccarat-rouge', 'decant-creed-aventus', 'decant-erba-pura',
      'decant-angels-share', 'decant-pdm-layton', 'decant-santal-33', 'decant-another-13'
    ];
    for (const oldKey of oldDecantesToRemove) {
      delete customizations[oldKey];
    }

    // For the 15 official arabic perfumes:
    // If user has customized photo, KEEP the custom photo (and description/name),
    // but synchronize the price and originalPrice to the user's newly requested catalog price!
    const officialArabicPrices: Record<string, { price: number; originalPrice: number }> = {
      'lattafa-asad': { price: 319.90, originalPrice: 389.00 },
      'armaf-club-de-nuit-intense-man': { price: 349.90, originalPrice: 420.00 },
      'lattafa-fakhar-black': { price: 289.90, originalPrice: 349.00 },
      'lattafa-khanjar': { price: 449.90, originalPrice: 539.00 },
      'maison-alhambra-salvo': { price: 299.90, originalPrice: 359.00 },
      'lattafa-khamrah': { price: 299.90, originalPrice: 369.00 },
      'lattafa-yara': { price: 299.90, originalPrice: 359.00 },
      'sabah-al-ward': { price: 279.90, originalPrice: 339.00 },
      'lattafa-asad-zanzibar': { price: 299.90, originalPrice: 359.00 },
      'candid-pour-homme': { price: 319.90, originalPrice: 379.00 },
      'viollet-west': { price: 449.90, originalPrice: 529.00 },
      'mallow-madnes': { price: 349.90, originalPrice: 419.00 },
      'lattafa-fakhar-rose': { price: 349.90, originalPrice: 419.00 },
      'emmer': { price: 299.90, originalPrice: 359.00 },
      'lattafa-sakeena': { price: 299.90, originalPrice: 359.00 },
      'lattafa-hayaati': { price: 289.90, originalPrice: 349.00 },
      'al-wataniah-bareeq-al-dhahab': { price: 329.90, originalPrice: 399.00 },
    };

    for (const [prodId, priceInfo] of Object.entries(officialArabicPrices)) {
      if (customizations[prodId]) {
        customizations[prodId].price = priceInfo.price;
        customizations[prodId].originalPrice = priceInfo.originalPrice;
      }
    }

    // For the 15 official imported perfumes:
    const officialImportedPrices: Record<string, { price: number; originalPrice: number }> = {
      'ferrari-black': { price: 299.90, originalPrice: 359.00 },
      'animale-for-men': { price: 299.90, originalPrice: 359.00 },
      'azzaro-pour-homme': { price: 279.90, originalPrice: 339.00 },
      'silver-scent': { price: 299.90, originalPrice: 359.00 },
      'ch-men-carolina-herrera': { price: 749.90, originalPrice: 849.00 },
      'invictus-rabanne': { price: 699.90, originalPrice: 789.00 },
      '212-vip-men': { price: 789.90, originalPrice: 889.00 },
      'fantasy-britney-spears': { price: 319.90, originalPrice: 379.00 },
      'good-girl-ch': { price: 699.90, originalPrice: 799.00 },
      'scandal-jpg': { price: 649.90, originalPrice: 739.00 },
      '212-vip-rose': { price: 549.90, originalPrice: 629.00 },
      'la-vie-est-belle': { price: 749.99, originalPrice: 849.00 },
      '1-million-elixir': { price: 799.90, originalPrice: 899.00 },
      'acqua-di-gio': { price: 799.90, originalPrice: 899.00 },
      'le-male-jpg': { price: 749.90, originalPrice: 849.00 },
    };

    for (const [prodId, priceInfo] of Object.entries(officialImportedPrices)) {
      if (customizations[prodId]) {
        customizations[prodId].price = priceInfo.price;
        customizations[prodId].originalPrice = priceInfo.originalPrice;
      }
    }

    // For the official Lab8 perfumes:
    const officialLab8Prices: Record<string, { price: number; originalPrice: number }> = {
      'lab8-rouge-absolu': { price: 229.90, originalPrice: 269.00 },
      'lab8-noir-intense': { price: 239.90, originalPrice: 279.00 },
      'lab8-vanilla-smoke': { price: 229.90, originalPrice: 269.00 },
      'lab8-blanc-imperial': { price: 219.90, originalPrice: 259.00 },
      'lab8-ambre-royal': { price: 239.90, originalPrice: 279.00 },
    };

    for (const [prodId, priceInfo] of Object.entries(officialLab8Prices)) {
      if (customizations[prodId]) {
        customizations[prodId].price = priceInfo.price;
        customizations[prodId].originalPrice = priceInfo.originalPrice;
      }
    }

    safeSaveToLocalStorage(customizations);
    localStorage.setItem(CATALOG_SYNC_VERSION, 'true');
  } catch (err) {
    console.error('Error syncing catalog customizations:', err);
  }
  return customizations;
}

/**
 * Get all saved customizations from localStorage and in-memory cache
 */
export function getProductCustomizations(): Record<string, ProductCustomization> {
  if (inMemoryOverrides) return inMemoryOverrides;
  if (typeof window === 'undefined') return {};

  initCustomizationsFromDb();
  
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      inMemoryOverrides = {};
      return {};
    }
    const parsed = JSON.parse(raw) || {};
    inMemoryOverrides = syncCatalogCustomizations(parsed);
    return inMemoryOverrides || {};
  } catch (error) {
    console.error('Failed to parse product customizations from localStorage:', error);
    inMemoryOverrides = inMemoryOverrides || {};
    return inMemoryOverrides;
  }
}

/**
 * Save customization for a specific product
 */
export function saveProductCustomization(
  productId: string, 
  data: ProductCustomization
): { success: boolean; error?: string } {
  const currentOverrides = { ...getProductCustomizations() };

  // Always ensure both image and images array are synchronized
  const finalImage = data.image?.trim();
  const finalImages = data.images && data.images.length > 0 
    ? data.images 
    : (finalImage ? [finalImage] : undefined);

  const updatedEntry: ProductCustomization = {
    ...(currentOverrides[productId] || {}),
    ...data,
    ...(finalImage ? { image: finalImage } : {}),
    ...(finalImages ? { images: finalImages } : {})
  };

  currentOverrides[productId] = updatedEntry;
  inMemoryOverrides = currentOverrides;

  // Persist large base64 images to IndexedDB (no 5MB quota limit)
  if (finalImage && finalImage.startsWith('data:image/')) {
    saveImageToDb(productId, finalImage).catch(() => {});
  }

  // Persist to storage with automatic quota protection
  if (typeof window !== 'undefined') {
    safeSaveToLocalStorage(currentOverrides);

    // Always dispatch global event to trigger UI re-renders immediately
    window.dispatchEvent(
      new CustomEvent('arfragrance_products_updated', { 
        detail: { productId, data: updatedEntry } 
      })
    );
  }

  return { success: true };
}

/**
 * Reset customization for a single product to its default values
 */
export function resetProductCustomization(productId: string): void {
  const currentOverrides = { ...getProductCustomizations() };
  if (currentOverrides[productId]) {
    delete currentOverrides[productId];
    inMemoryOverrides = currentOverrides;

    deleteImageFromDb(productId).catch(() => {});

    if (typeof window !== 'undefined') {
      safeSaveToLocalStorage(currentOverrides);
      window.dispatchEvent(new CustomEvent('arfragrance_products_updated', { detail: { productId } }));
    }
  }
}

/**
 * Reset all product customizations
 */
export function resetAllProductCustomizations(): void {
  inMemoryOverrides = {};
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to reset all product customizations:', error);
    }
    window.dispatchEvent(new CustomEvent('arfragrance_products_updated', { detail: {} }));
  }
}

/**
 * Apply all saved customizations to a list of base products
 */
export function applyCustomizations(baseProducts: Product[]): Product[] {
  const customizations = getProductCustomizations();
  
  return baseProducts.map((p) => {
    const custom = customizations[p.id];
    if (!custom) return p;

    const updatedPrice = typeof custom.price === 'number' && custom.price >= 0 ? custom.price : p.price;
    const updatedOriginalPrice = custom.originalPrice !== undefined ? custom.originalPrice : p.originalPrice;
    
    // Choose updated image with priority
    const updatedImage = custom.image !== undefined ? custom.image : ((custom.images && custom.images[0]) ?? p.image);
    const updatedImages = custom.images !== undefined 
      ? custom.images 
      : (custom.image ? [custom.image] : p.images);

    // Update sizes array to align with new price
    const updatedSizes = (p.availableSizes || [{ size: '100ml', price: updatedPrice }]).map((sizeOpt, idx) => {
      if (idx === 0) {
        return {
          ...sizeOpt,
          price: updatedPrice,
          originalPrice: updatedOriginalPrice
        };
      }
      return sizeOpt;
    });

    return {
      ...p,
      name: custom.name !== undefined ? custom.name : p.name,
      brand: custom.brand !== undefined ? custom.brand : p.brand,
      price: updatedPrice,
      originalPrice: updatedOriginalPrice,
      description: custom.description !== undefined ? custom.description : p.description,
      image: updatedImage,
      images: updatedImages,
      badge: custom.badge !== undefined ? custom.badge : p.badge,
      gender: custom.gender !== undefined ? custom.gender : p.gender,
      availableSizes: updatedSizes
    };
  });
}

/**
 * Get customized products based on default PERFUMES_DATA
 */
export function getCustomizedProducts(): Product[] {
  return applyCustomizations(PERFUMES_DATA);
}
