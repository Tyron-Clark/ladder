import { URLSearchParams } from "url";
import getAccessToken from "../config/blizzardAPI.js";
import cacheService from "./cacheService.js";

export const fetchPlayerSpecializations = async (params) => {
  const { region, realm, characterName } = params;
  const cacheKey = cacheService.generateKey(params);

  // Check if cached data
  const cachedSpecializations = cacheService.get(cacheKey);
  if (cachedSpecializations) {
    return cachedSpecializations;
  }

  try {
    const accessToken = await getAccessToken();
    const urlParams = new URLSearchParams({
      namespace: `profile-classic-${region}`,
      locale: "en_US",
    });
    const url = `https://${region}.api.blizzard.com/profile/wow/character/${realm}/${characterName.toLocaleLowerCase()}/specializations?${urlParams}`;

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

    // // Find the active specialization group and get its specialization names
    // const activeGroup = data.specialization_groups?.find(
    //   (group) => group.is_active === true
    // );
    // const activeSpecs =
    //   activeGroup?.specializations?.specialization_name || null;

    cacheService.set(cacheKey, data, cacheService.playerTTL);

    return data;
  } catch (error) {
    console.error(`Error fetching player specializations: ${error.message}`);
    throw error;
  }
};
