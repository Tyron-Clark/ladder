import express from "express";
import leaderboardEntries from "./leaderboard.js";

const router = express.Router();

router.use("/", leaderboardEntries);

export default router;
