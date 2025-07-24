interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

class CacheService {
  private cache = new Map<string, CacheItem<any>>();
  private readonly DEFAULT_TTL = 3600000; // 1 hour in milliseconds

  /**
   * Store data in cache with optional TTL
   */
  set<T>(key: string, data: T, ttlMs?: number): void {
    const expiresIn = ttlMs || this.DEFAULT_TTL;
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresIn
    });

    // Also persist to localStorage for offline support
    try {
      localStorage.setItem(`cache_${key}`, JSON.stringify({
        data,
        timestamp: Date.now(),
        expiresIn
      }));
    } catch (e) {
      console.warn('Failed to persist cache to localStorage:', e);
    }
  }

  /**
   * Get data from cache if not expired
   */
  get<T>(key: string): T | null {
    // First check memory cache
    const memoryItem = this.cache.get(key);
    if (memoryItem && this.isValid(memoryItem)) {
      return memoryItem.data;
    }

    // Then check localStorage
    try {
      const storedItem = localStorage.getItem(`cache_${key}`);
      if (storedItem) {
        const item: CacheItem<T> = JSON.parse(storedItem);
        if (this.isValid(item)) {
          // Restore to memory cache
          this.cache.set(key, item);
          return item.data;
        } else {
          // Clean up expired item
          localStorage.removeItem(`cache_${key}`);
        }
      }
    } catch (e) {
      console.warn('Failed to retrieve cache from localStorage:', e);
    }

    return null;
  }

  /**
   * Check if cache item is still valid
   */
  private isValid<T>(item: CacheItem<T>): boolean {
    return Date.now() - item.timestamp < item.expiresIn;
  }

  /**
   * Remove specific item from cache
   */
  remove(key: string): void {
    this.cache.delete(key);
    try {
      localStorage.removeItem(`cache_${key}`);
    } catch (e) {
      console.warn('Failed to remove cache from localStorage:', e);
    }
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
    // Clear localStorage cache items
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('cache_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (e) {
      console.warn('Failed to clear localStorage cache:', e);
    }
  }

  /**
   * Get or fetch data with caching
   */
  async getOrFetch<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlMs?: number
  ): Promise<T> {
    // Check cache first
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Fetch fresh data
    try {
      const data = await fetcher();
      this.set(key, data, ttlMs);
      return data;
    } catch (error) {
      // If offline, try to return stale cache if available
      const staleItem = this.getStale<T>(key);
      if (staleItem) {
        console.warn('Returning stale cache due to fetch error:', error);
        return staleItem;
      }
      throw error;
    }
  }

  /**
   * Get stale data (expired but still in storage)
   */
  private getStale<T>(key: string): T | null {
    try {
      const storedItem = localStorage.getItem(`cache_${key}`);
      if (storedItem) {
        const item: CacheItem<T> = JSON.parse(storedItem);
        return item.data;
      }
    } catch (e) {
      console.warn('Failed to retrieve stale cache:', e);
    }
    return null;
  }

  /**
   * Preload multiple cache entries
   */
  async preload(entries: Array<{ key: string; fetcher: () => Promise<any>; ttl?: number }>): Promise<void> {
    const promises = entries.map(({ key, fetcher, ttl }) => 
      this.getOrFetch(key, fetcher, ttl).catch(err => 
        console.warn(`Failed to preload cache for ${key}:`, err)
      )
    );
    await Promise.allSettled(promises);
  }
}

// Export singleton instance
export const cacheService = new CacheService();

// Cache keys constants
export const CACHE_KEYS = {
  PARTNERS: 'partners_list',
  PRODUCTS: 'products_list',
  CHAPTERS: 'chapters_content',
  USER_BADGES: 'user_badges',
  COMMUNITY_POSTS: 'community_posts',
  LINKS: 'useful_links',
  NOTICES: 'important_notices'
} as const;