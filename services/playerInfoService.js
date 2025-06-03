import { URLSearchParams } from "url";
import getAccessToken from "../config/blizzardAPI.js";

export const fetchPlayerInfo = async (
  currentRegion = "us",
  realmSlug = "benediction",
  characterName = "Vdxheavy"
) => {
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
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
};
