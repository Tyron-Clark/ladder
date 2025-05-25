import express from "express";
import { URLSearchParams } from "url";
import getAccessToken from "../../config/blizzardAPI.js";

const router = express.Router();

let leaderboardCache = {
  data: null,
  lastFetched: null,
  cacheTime: 15 * 60 * 1000, // 15 minutes
};

router.get("/leaderboard", async (req, res) => {
  try {
    const now = Date.now();

    // Check if cached data
    if (
      leaderboardCache.data &&
      leaderboardCache.lastFetched &&
      now - leaderboardCache.lastFetched < leaderboardCache.cacheTime
    ) {
      console.log("Serving cached leaderboard data...");

      // Process data based on what user wants
      const processedData = processLeaderboardData(
        leaderboardCache.data,
        req.query
      );
      return res.json(processedData);
    }

    // Fetch fresh data
    console.log("Fetching fresh leaderboard data...");
    const season = req.query.season || 11;
    const bracket = req.query.bracket || "2v2";
    const region = req.query.region || "us";

    const accessToken = await getAccessToken();
    const params = new URLSearchParams({
      namespace: `dynamic-classic-${region}`,
      locale: "en_US",
    });
    const url = `https://${region}.api.blizzard.com/data/wow/pvp-season/${season}/pvp-leaderboard/${bracket}?${params}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();

    //Cache dataset
    leaderboardCache.data = data;
    leaderboardCache.lastFetched = now;

    // Process and return data within query params
    const processedData = processedLeaderboardData(data, req.query);
    res.json(processedData);
  } catch (error) {
    console.error(`Error fetching leaderboard data: ${error.message}`);
    throw error;
  }
});

export default router;
