// Global cache configuration
export const CACHE_CONFIG = {
    enabled: false,
    duration: 1000 * 60 * 60, // 1 hour in milliseconds
};

// Cache storage prefix
const CACHE_PREFIX = "sieman_";

// Module-level cache storage
const memoryCache: Map<string, any> = new Map();
const fetchPromises: Map<string, Promise<any>> = new Map();

interface CacheOptions {
    key: string;
    enabled?: boolean;
    duration?: number;
}

/**
 * Get data from cache (memory or session storage)
 */
export function getFromCache<T>(key: string): T | null {
    if (!CACHE_CONFIG.enabled) return null;

    // Check memory cache first
    if (memoryCache.has(key)) {
        return memoryCache.get(key) as T;
    }

    // Check session storage
    try {
        const cacheKey = `${CACHE_PREFIX}${key}`;
        const timestampKey = `${cacheKey}_ts`;

        const storedData = sessionStorage.getItem(cacheKey);
        const storedTimestamp = sessionStorage.getItem(timestampKey);

        if (storedData && storedTimestamp) {
            const timestamp = parseInt(storedTimestamp, 10);
            if (Date.now() - timestamp < CACHE_CONFIG.duration) {
                const parsed = JSON.parse(storedData) as T;
                // Update memory cache
                memoryCache.set(key, parsed);
                return parsed;
            } else {
                // Cache expired, clean up
                sessionStorage.removeItem(cacheKey);
                sessionStorage.removeItem(timestampKey);
            }
        }
    } catch (e) {
        console.error("Cache read error:", e);
    }

    return null;
}

/**
 * Store data in cache (memory and session storage)
 */
export function setInCache<T>(key: string, data: T): void {
    if (!CACHE_CONFIG.enabled) return;

    // Store in memory cache
    memoryCache.set(key, data);

    // Store in session storage
    try {
        const cacheKey = `${CACHE_PREFIX}${key}`;
        const timestampKey = `${cacheKey}_ts`;

        sessionStorage.setItem(cacheKey, JSON.stringify(data));
        sessionStorage.setItem(timestampKey, Date.now().toString());
    } catch (e) {
        console.error("Cache write error:", e);
    }
}

/**
 * Get pending fetch promise if exists
 */
export function getPendingFetch<T>(key: string): Promise<T> | null {
    return fetchPromises.get(key) || null;
}

/**
 * Set pending fetch promise
 */
export function setPendingFetch<T>(key: string, promise: Promise<T>): void {
    fetchPromises.set(key, promise);
}

/**
 * Clear pending fetch promise
 */
export function clearPendingFetch(key: string): void {
    fetchPromises.delete(key);
}

/**
 * Clear specific cache entry
 */
export function clearCache(key: string): void {
    memoryCache.delete(key);

    try {
        const cacheKey = `${CACHE_PREFIX}${key}`;
        const timestampKey = `${cacheKey}_ts`;
        sessionStorage.removeItem(cacheKey);
        sessionStorage.removeItem(timestampKey);
    } catch (e) {
        console.error("Cache clear error:", e);
    }
}

/**
 * Clear all cache
 */
export function clearAllCache(): void {
    memoryCache.clear();
    fetchPromises.clear();

    try {
        // Clear all session storage items with our prefix
        const keys = Object.keys(sessionStorage);
        keys.forEach(key => {
            if (key.startsWith(CACHE_PREFIX)) {
                sessionStorage.removeItem(key);
            }
        });
    } catch (e) {
        console.error("Cache clear all error:", e);
    }
}
