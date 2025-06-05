import { URLSearchParams } from "url";
import getAccessToken from "../config/blizzardAPI.js";
import cacheService from "./cacheService.js";
import { fetchPlayerInfo } from "./playerInfoService.js";

// Rate limiting configuration
const BATCH_SIZE = 50; // Process 50 players at a time
const DELAY_BETWEEN_BATCHES = 1000; // 1 second delay between batches

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const enrichLeaderboardWithPlayerInfo = async (
  leaderboardData,
  region
) => {
  const entries = leaderboardData.entries || [];
  const enrichedEntries = [];

  // Process entries in batches
  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const batch = entries.slice(i, i + BATCH_SIZE);
    const batchPromises = batch.map(async (entry) => {
      const { character } = entry.character;
      if (!character || !character.name || !character.realm) {
        return entry;
      }

      // Try to get cached player info first
      const cacheKey = `player:${region}:${
        character.realm
      }:${character.name.toLowerCase()}`;
      const cachedPlayerInfo = cacheService.get(cacheKey);

      if (cachedPlayerInfo) {
        return {
          ...entry,
          playerInfo: cachedPlayerInfo,
        };
      }

      try {
        const playerInfo = await fetchPlayerInfo({
          currentRegion: region,
          realmSlug: character.realm.slug,
          characterName: character.name,
        });

        return {
          ...entry,
          playerInfo,
        };
      } catch (error) {
        console.error(
          `Failed to fetch player info for ${character.name}-${character.realm}:`,
          error.message
        );
        return entry;
      }
    });

    // Process current batch
    const batchResults = await Promise.all(batchPromises);
    enrichedEntries.push(...batchResults);

    // Add delay before processing next batch (unless it's the last batch)
    if (i + BATCH_SIZE < entries.length) {
      await sleep(DELAY_BETWEEN_BATCHES);
    }
  }

  return {
    ...leaderboardData,
    entries: enrichedEntries,
  };
};
