import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import getAccessToken from "./config/blizzardAPI.js";
import routes from "./routes/api/leaderboard.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use("/", routes);

async function testToken() {
  try {
    await getAccessToken();
  } catch (error) {
    console.error(error.message);
  }
}

///// Routes /////
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

///// Start Server /////
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  testToken();
});
