import express from "express";
import leaderboardRoutes from "./leaderboard.js";

const router = express.Router();

router.use("/", leaderboardRoutes);

export default router;
