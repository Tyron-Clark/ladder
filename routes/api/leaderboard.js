// import { URLSearchParams } from "url";
// import getAccessToken from "../../config/blizzard-api.js";

// export default async function leaderboardEntries(
//   season = 11,
//   bracket = "2v2",
//   region = "us"
// ) {
//   try {
//     const accessToken = await getAccessToken();
//     const params = new URLSearchParams({
//       namespace: `dynamic-classic-${region}`,
//       locale: "en_US",
//     });
//     const url = `https://${region}.api.blizzard.com/data/wow/pvp-season/${season}/pvp-leaderboard/${bracket}?${params}`;

//     const response = await fetch(url, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });

//     if (!response.ok) throw new Error(`API error: ${response.status}`);
//     return await response.json();
//   } catch (error) {
//     console.error(`Error fetching leaderboard data: ${error.message}`);
//     throw error;
//   }
// }
