
export class ResponseCacheManager {
  private cache: Map<string, { response: string; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_CACHE_SIZE = 200;

  getCachedResponse(key: string): string | null {
    const cached = this.cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.response;
    }
    
    return null;
  }

  cacheResponse(key: string, response: string): void {
    try {
      // Clean old entries first if cache is too large
      if (this.cache.size >= this.MAX_CACHE_SIZE) {
        this.cleanOldCacheEntries();
      }

      this.cache.set(key, { response, timestamp: Date.now() });
    } catch (error) {
      console.error('Cache management error:', error);
    }
  }

  private cleanOldCacheEntries(): void {
    const now = Date.now();
    const entriesToDelete: string[] = [];

    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.CACHE_DURATION) {
        entriesToDelete.push(key);
      }
    }

    // Delete expired entries
    entriesToDelete.forEach(key => this.cache.delete(key));

    // If still too large, delete oldest entries
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      const entries = Array.from(this.cache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      const toDelete = entries.slice(0, Math.floor(this.MAX_CACHE_SIZE * 0.3));
      toDelete.forEach(([key]) => this.cache.delete(key));
    }
  }

  clearCache(): void {
    try {
      this.cache.clear();
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  getCacheSize(): number {
    return this.cache.size;
  }
}
