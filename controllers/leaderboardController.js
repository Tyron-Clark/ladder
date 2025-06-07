import { fetchLeaderboardData } from "../services/leaderboardService.js";
import { processLeaderboardData } from "../utils/dataProcess.js";

export const getLeaderboard = async (req, res, next) => {
  try {
    const params = {
      season: req.query.season || 11,
      bracket: req.query.bracket || "2v2",
      region: req.query.region || "us",
    };

    const rawData = await fetchLeaderboardData(params);
    const processedData = await processLeaderboardData(rawData, req.query);

    res.json(processedData);
  } catch (error) {
    console.error(`Error in leaderboard controller: ${error.message}`);
    next(error);
  }
};
