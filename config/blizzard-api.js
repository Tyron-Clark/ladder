import { URLSearchParams } from "url";

export default async function getAccessToken() {
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;

  try {
    const requestBody = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: `${clientId}`,
      client_secre: `${clientSecret}`,
    });

    const response = await fetch("https://oauth.battle.net/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: requestBody,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error(`Error fetching access token: ${error.message}`);
    throw error;
  }
}
