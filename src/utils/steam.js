const axios = require("axios");
const cheerio = require("cheerio");

async function getSteamBio(steamId) {
  try {
    const res = await axios.get(`https://steamcommunity.com/profiles/${steamId}`);
    const $ = cheerio.load(res.data);

    const bio =
      $(".profile_summary").text() ||
      $("#profile_summary").text() ||
      "";

    return bio;
  } catch {
    return "";
  }
}

module.exports = { getSteamBio };
