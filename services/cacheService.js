class CacheService {
  constructor() {
    this.cache = new Map();
    this.defaultTTL = 15 * 60 * 1000; // 15 minutes
    this.playerTTL = 23 * 60 * 60 * 1000; // 23 hours for player data
    this.leaderboardTTL = 15 * 60 * 1000; // 15 minutes for leaderboard data
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
    if (params.characterName) {
      return `player:${params.region}:${
        params.realmSlug
      }:${params.characterName.toLowerCase()}`;
    }
    return `leaderboard:${params.region}:${params.season}:${params.bracket}`;
  }
}

export default new CacheService();
