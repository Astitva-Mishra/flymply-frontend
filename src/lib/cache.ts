import { PredictionResponse } from './api';

const CACHE_PREFIX = 'flymply_prediction_cache_';
const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours
const MAX_CACHE_SIZE = 100; // Maximum number of cached entries

interface CachedResponse {
  response: PredictionResponse;
  timestamp: number;
  windowHash: string;
}

/**
 * Generate a simple hash from window data for cache key
 */
function hashWindow(window: number[][]): string {
  // Create a simple hash from the window data
  const str = JSON.stringify(window);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Get cache key for a window
 */
function getCacheKey(window: number[][]): string {
  return `${CACHE_PREFIX}${hashWindow(window)}`;
}

/**
 * Store prediction response in cache
 */
export function cachePrediction(window: number[][], response: PredictionResponse): void {
  try {
    const cacheKey = getCacheKey(window);
    const cached: CachedResponse = {
      response,
      timestamp: Date.now(),
      windowHash: hashWindow(window),
    };

    // Clean up old entries if cache is too large
    cleanupCache();

    localStorage.setItem(cacheKey, JSON.stringify(cached));
  } catch (error) {
    // If localStorage is full or unavailable, silently fail
    console.warn('Failed to cache prediction:', error);
  }
}

/**
 * Get cached prediction response if available and not expired
 */
export function getCachedPrediction(window: number[][]): PredictionResponse | null {
  try {
    const cacheKey = getCacheKey(window);
    const cachedStr = localStorage.getItem(cacheKey);

    if (!cachedStr) {
      return null;
    }

    const cached: CachedResponse = JSON.parse(cachedStr);

    // Check if cache is expired
    if (Date.now() - cached.timestamp > CACHE_EXPIRY_MS) {
      localStorage.removeItem(cacheKey);
      return null;
    }

    return cached.response;
  } catch (error) {
    console.warn('Failed to retrieve cached prediction:', error);
    return null;
  }
}

/**
 * Clean up old cache entries to prevent storage overflow
 */
function cleanupCache(): void {
  try {
    const keys: Array<{ key: string; timestamp: number }> = [];

    // Collect all cache keys with timestamps
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX)) {
        try {
          const cachedStr = localStorage.getItem(key);
          if (cachedStr) {
            const cached: CachedResponse = JSON.parse(cachedStr);
            keys.push({ key, timestamp: cached.timestamp });
          }
        } catch {
          // Invalid entry, remove it
          localStorage.removeItem(key);
        }
      }
    }

    // If cache is too large, remove oldest entries
    if (keys.length >= MAX_CACHE_SIZE) {
      keys.sort((a, b) => a.timestamp - b.timestamp);
      const toRemove = keys.length - MAX_CACHE_SIZE + 1; // Remove one extra to make room
      for (let i = 0; i < toRemove; i++) {
        localStorage.removeItem(keys[i].key);
      }
    }

    // Also remove expired entries
    const now = Date.now();
    keys.forEach(({ key, timestamp }) => {
      if (now - timestamp > CACHE_EXPIRY_MS) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.warn('Failed to cleanup cache:', error);
  }
}

/**
 * Clear all cached predictions
 */
export function clearCache(): void {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.warn('Failed to clear cache:', error);
  }
}

/**
 * Get cache statistics
 */
export function getCacheStats(): { size: number; maxSize: number } {
  try {
    let size = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX)) {
        size++;
      }
    }
    return { size, maxSize: MAX_CACHE_SIZE };
  } catch {
    return { size: 0, maxSize: MAX_CACHE_SIZE };
  }
}

