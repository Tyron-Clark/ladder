import { URLSearchParams } from "url";
import getAccessToken from "../config/blizzardAPI.js";
import cacheService from "./cacheService.js";

export const fetchPlayerInfo = async (params) => {
  const { currentRegion, realmSlug, characterName } = params;
  const playerCacheKey = `player:${currentRegion}:${realmSlug}:${characterName.toLowerCase()}`;

  const cachedPlayerData = cacheService.get(playerCacheKey);
  if (cachedPlayerData) {
    console.log(`Serving cached player data for ${characterName}`);
    return cachedPlayerData;
  }

  try {
    const accessToken = await getAccessToken();
    const urlParams = new URLSearchParams({
      namespace: `profile-classic-${currentRegion}`,
      locale: "en_US",
    });
    const url = `https://${currentRegion}.api.blizzard.com/profile/wow/character/${realmSlug}/${characterName.toLocaleLowerCase()}?${urlParams}`;

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

    cacheService.set(playerCacheKey, data, 30 * 60 * 1000);

    console.log(`Success fetching player info for ${characterName}`);
    return data;
  } catch (error) {
    console.error(error);
  }
};
