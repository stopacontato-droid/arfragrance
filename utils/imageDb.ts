/**
 * Simple IndexedDB storage for product custom images.
 * Bypasses browser localStorage 5MB quota limit and supports up to hundreds of megabytes.
 */

const DB_NAME = 'arfragrance_assets_db';
const STORE_NAME = 'product_images';
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase | null> | null = null;

function getDb(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.resolve(null);
  }

  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve) => {
    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = (err) => {
        console.warn('IndexedDB failed to open:', err);
        resolve(null);
      };
    } catch (e) {
      console.warn('IndexedDB unavailable:', e);
      resolve(null);
    }
  });

  return dbPromise;
}

/**
 * Save an image to IndexedDB
 */
export async function saveImageToDb(id: string, imageData: string): Promise<boolean> {
  try {
    const db = await getDb();
    if (!db) return false;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.put({ id, data: imageData, updatedAt: Date.now() });

        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      } catch {
        resolve(false);
      }
    });
  } catch {
    return false;
  }
}

/**
 * Get an image from IndexedDB
 */
export async function getImageFromDb(id: string): Promise<string | null> {
  try {
    const db = await getDb();
    if (!db) return null;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const request = store.get(id);

        request.onsuccess = () => {
          if (request.result && request.result.data) {
            resolve(request.result.data);
          } else {
            resolve(null);
          }
        };

        request.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  } catch {
    return null;
  }
}

/**
 * Get all saved custom images from IndexedDB
 */
export async function getAllImagesFromDb(): Promise<Record<string, string>> {
  try {
    const db = await getDb();
    if (!db) return {};

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => {
          const results: Record<string, string> = {};
          if (Array.isArray(request.result)) {
            for (const item of request.result) {
              if (item.id && item.data) {
                results[item.id] = item.data;
              }
            }
          }
          resolve(results);
        };

        request.onerror = () => resolve({});
      } catch {
        resolve({});
      }
    });
  } catch {
    return {};
  }
}

/**
 * Delete an image from IndexedDB
 */
export async function deleteImageFromDb(id: string): Promise<boolean> {
  try {
    const db = await getDb();
    if (!db) return false;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.delete(id);

        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      } catch {
        resolve(false);
      }
    });
  } catch {
    return false;
  }
}
