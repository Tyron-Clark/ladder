import "dotenv/config";
import { URLSearchParams } from "url";
import cacheService from "../services/cacheService.js";

const ACCESS_TOKEN_CACHE_KEY = "blizzard_access_token";
const ACCESS_TOKEN_TTL = 23 * 60 * 60 * 1000; // 23 hours in milliseconds

export default async function getAccessToken() {
  // Check cache
  const cachedToken = cacheService.get(ACCESS_TOKEN_CACHE_KEY);
  if (cachedToken) {
    return cachedToken;
  }

  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const url = "https://oauth.battle.net/token";

  if (!clientId || !clientSecret) {
    throw new Error(
      "Missing API Credentials. Check CLIENT_ID or CLIENT_SECRET"
    );
  }
  try {
    const params = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    });
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });
    if (!response.ok) {
      console.error(response.status);
    }
    const data = await response.json();

    // Cache token
    cacheService.set(
      ACCESS_TOKEN_CACHE_KEY,
      data.access_token,
      ACCESS_TOKEN_TTL
    );

    return data.access_token;
  } catch (error) {
    console.error(`Error fetching access token: ${error.message}`);
    throw error;
  }
}
