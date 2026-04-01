const axios = require("axios");
const { faceitKey } = require("../config");

async function getFaceitLevel(steamId) {
  try {
    const res = await axios.get(
      `https://open.faceit.com/data/v4/players?game=cs2&game_player_id=${steamId}`,
      {
        headers: {
          Authorization: `Bearer ${faceitKey}`
        }
      }
    );

    return res.data.games.cs2.skill_level;
  } catch {
    return null;
  }
}

module.exports = { getFaceitLevel };
