import { URLSearchParams } from "url";
import getAccessToken from "../config/blizzardAPI.js";
import cacheService from "./cacheService.js";

export const fetchPlayerInfo = async (params) => {
  const { region, realm, characterName } = params;
  const cacheKey = cacheService.generateKey(params);

  // Check if cached data
  const cachedPlayerData = cacheService.get(cacheKey);
  if (cachedPlayerData) {
    console.log(`Serving cached player data for ${characterName}`);
    return cachedPlayerData;
  }

  try {
    const accessToken = await getAccessToken();
    const urlParams = new URLSearchParams({
      namespace: `profile-classic-${region}`,
      locale: "en_US",
    });
    const url = `https://${region}.api.blizzard.com/profile/wow/character/${realm}/${characterName.toLocaleLowerCase()}?${urlParams}`;

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

    // Cache data with playerTTL
    cacheService.set(cacheKey, data, cacheService.playerTTL);

    return data;
  } catch (error) {
    console.error(`Error fetching player info: ${error.message}`);
    throw error;
  }
};
