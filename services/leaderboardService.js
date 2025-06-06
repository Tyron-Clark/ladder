import { URLSearchParams } from "url";
import getAccessToken from "../config/blizzardAPI.js";
import cacheService from "./cacheService.js";

export const fetchLeaderboardData = async (params) => {
  const { season, bracket, region } = params;
  const cacheKey = cacheService.generateKey(params);

  // Check if cached data
  const cachedData = cacheService.get(cacheKey);
  if (cachedData) {
    console.log("Serving cached leaderboard data...");
    return cachedData;
  }
  try {
    const accessToken = await getAccessToken();
    const urlParams = new URLSearchParams({
      namespace: `dynamic-classic-${region}`,
      locale: "en_US",
    });

    const url = `https://${region}.api.blizzard.com/data/wow/pvp-season/${season}/pvp-leaderboard/${bracket}?${urlParams}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Blizzard API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    // Cache data with leaderboardTTL
    cacheService.set(cacheKey, data, cacheService.leaderboardTTL);

    return data;
  } catch (error) {
    console.error(`Error fetching leaderboard data: ${error.message}`);
    throw error;
  }
};
