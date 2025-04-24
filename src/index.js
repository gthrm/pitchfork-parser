require("dotenv").config();
const { CronJob } = require("cron");
const { fetchPitchforkBestTracks, findChanges } = require("./tracks-parser");
const { refreshSpotifyToken, searchMusic } = require("./music-search");
const TelegramNotifier = require("./telegram-bot");

// Initialize the Telegram notifier
const telegramNotifier = new TelegramNotifier(
  process.env.TELEGRAM_BOT_TOKEN,
  process.env.TELEGRAM_CHAT_ID
);

// Main function to check for new music and send notifications
async function checkForNewMusic() {
  console.log("Проверка новых треков на Pitchfork...");

  try {
    // Fetch the latest tracks data from Pitchfork
    const latestTracks = await fetchPitchforkBestTracks();
    console.log(`Найдено ${latestTracks.length} треков`);
    
    // Find changes compared to previous run
    const newTracks = await findChanges(latestTracks);
    
    // Check if there are any new items
    if (newTracks.length > 0) {
      console.log(`Найдено ${newTracks.length} новых треков`);
      
      // Search music services for each new track
      const musicResults = {};
      console.log("Поиск треков на Spotify и YouTube...");
      
      for (const track of newTracks) {
        const query = track.searchQuery;
        console.log(`Поиск: ${query}`);
        musicResults[query] = await searchMusic(query);
      }
      
      // Send Telegram notification with the results
      await sendTrackNotifications(newTracks, musicResults);
      console.log("Уведомления успешно отправлены!");
    } else {
      console.log("Новых треков не найдено");
    }
  } catch (error) {
    console.error("Ошибка при проверке новых треков:", error);
  }
}

// Function to send track notifications via Telegram
async function sendTrackNotifications(tracks, musicResults) {
  if (tracks.length === 0) {
    console.log('Нет новых треков для уведомления');
    return;
  }

  // Create a message with all new tracks
  let message = '<b>🎵 Новые треки на Pitchfork Best New Music 🎵</b>\n\n';

  for (const track of tracks) {
    message += `<b>${track.artist}</b> - ${track.title} [${track.genre}]\n`;
    message += `📝 Рецензент: ${track.reviewer}\n`;
    
    if (track.reviewLink) {
      message += `📄 <a href="${track.reviewLink}">Обзор на Pitchfork</a>\n`;
    }
    
    // Add links if we have search results
    const result = musicResults[track.searchQuery];
    if (result) {
      if (result.spotify) {
        message += `🎧 <a href="${result.spotify.url}">Spotify</a>\n`;
      }
      if (result.youtube) {
        message += `🎬 <a href="${result.youtube.url}">YouTube</a>\n`;
      }
    }
    
    message += '\n';
  }

  await telegramNotifier.sendMessage(message);
}

// Function to run on startup
async function startup() {
  try {
    // Refresh Spotify token on startup
    await refreshSpotifyToken();
    
    // Schedule the job using the cron pattern from .env
    const job = new CronJob(
      process.env.CRON_SCHEDULE,
      checkForNewMusic,
      null,
      true,
      "America/New_York" // Adjust timezone as needed
    );
    
    console.log(`Задание запланировано по расписанию: ${process.env.CRON_SCHEDULE}`);
    
    // Run immediately on startup
    checkForNewMusic();
  } catch (error) {
    console.error("Ошибка при запуске:", error);
  }
}

// Start the application
startup();
