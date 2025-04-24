const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs").promises;
const path = require("path");

// File path for storing previous results
const DATA_FILE = path.join(__dirname, "../data/previous_tracks.json");

// Ensure the data directory exists
async function ensureDataDir() {
  const dataDir = path.join(__dirname, "../data");
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch (error) {
    if (error.code !== "EEXIST") {
      throw error;
    }
  }
}

// Function to fetch and parse Pitchfork's Best New Tracks
async function fetchPitchforkBestTracks() {
  try {
    const response = await axios.get(process.env.PITCHFORK_URL);
    const $ = cheerio.load(response.data);

    const bestTracks = [];

    // Находим элементы списка треков по классу 
    $(".SummaryItemWrapper-iwvBff").each((i, element) => {
      // Извлекаем информацию о треке
      const title = $(element).find("h3.SummaryItemHedBase-hiFYpQ").text().trim();
      const artist = $(element).find(".SummaryItemSubHedBase-gMyBBg").text().trim();
      const genre = $(element).find(".RubricName-fVtemz").text().trim();
      const reviewer = $(element).find(".BylineName-kwmrLn").text().replace("By ", "").trim();
      const date = $(element).find(".SummaryItemBylinePublishDate-ctLSIQ").text().trim();
      
      // Получаем ссылку на страницу с обзором
      const reviewLink = $(element).find(".SummaryItemHedLink-civMjp").attr("href");
      const fullReviewLink = reviewLink ? `https://pitchfork.com${reviewLink}` : null;
      
      // Получаем URL изображения обложки
      let imageUrl = null;
      const imgElement = $(element).find(".ResponsiveImageContainer-eybHBd");
      if (imgElement.length) {
        imageUrl = imgElement.attr("src");
      }

      if (title && artist) {
        bestTracks.push({
          title,
          artist,
          genre,
          reviewer,
          date,
          reviewLink: fullReviewLink,
          imageUrl,
          searchQuery: `${artist} ${title}`
        });
      }
    });

    return bestTracks;
  } catch (error) {
    console.error("Error fetching Pitchfork tracks data:", error);
    throw error;
  }
}

// Function to compare new data with previous data and identify changes
async function findChanges(newTracks) {
  await ensureDataDir();

  try {
    const previousTracks = await loadPreviousData();

    // Find new additions
    const newAdditions = newTracks.filter(
      (track) =>
        !previousTracks.some(
          (prevTrack) =>
            prevTrack.artist === track.artist &&
            prevTrack.title === track.title
        )
    );

    // Save new data as the previous data for next comparison
    await savePreviousData(newTracks);

    return newAdditions;
  } catch (error) {
    if (error.code === "ENOENT") {
      // If no previous data file exists, treat all current data as new
      await savePreviousData(newTracks);
      return newTracks;
    }
    throw error;
  }
}

// Load previous data from file
async function loadPreviousData() {
  const data = await fs.readFile(DATA_FILE, "utf8");
  return JSON.parse(data);
}

// Save current data as previous data
async function savePreviousData(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
}

module.exports = {
  fetchPitchforkBestTracks,
  findChanges,
}; 