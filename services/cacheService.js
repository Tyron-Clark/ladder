class CacheService {
  constructor() {
    this.cache = new Map();
    this.defaultTTL = 15 * 60 * 1000; // 15 minutes
  }

  set(key, data, ttl = this.defaultTTL) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get(key) {
    const cached = this.cache.get(key);

    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }
    return cached.data;
  }

  clear() {
    this.cache.clear();
  }

  generateKey(params) {
    return `leaderboard:${params.region}:${params.season}:${params.bracket}`;
  }
}

export default new CacheService();
