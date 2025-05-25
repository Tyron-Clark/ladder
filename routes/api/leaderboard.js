import express from "express";
import { URLSearchParams } from "url";
import getAccessToken from "../../config/blizzardAPI.js";

const router = express.Router();

router.get("/leaderboard", async (req, res) => {
  try {
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
    res.json(data);
  } catch (error) {
    console.error(`Error fetching leaderboard data: ${error.message}`);
    throw error;
  }
});

export default router;
