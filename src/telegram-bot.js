const TelegramBot = require("node-telegram-bot-api");

class TelegramNotifier {
  constructor(token, chatId) {
    this.bot = new TelegramBot(token, { polling: false });
    this.chatId = chatId;
  }

  async sendMessage(message) {
    try {
      await this.bot.sendMessage(this.chatId, message, {
        parse_mode: "HTML",
        disable_web_page_preview: false,
      });
    } catch (error) {
      console.error("Error sending Telegram message:", error);
    }
  }

  async sendNewMusicNotification(changes, musicResults) {
    const hasNewContent =
      changes.newAlbums.length > 0 ||
      changes.newTracks.length > 0 ||
      changes.newReissues.length > 0;

    if (!hasNewContent) {
      console.log("No new music to notify about");
      return;
    }

    // Create a message with all new music
    let message = "<b>🎵 New on Pitchfork Best Music 🎵</b>\n\n";

    // Add albums
    if (changes.newAlbums.length > 0) {
      message += "<b>📀 New Albums:</b>\n";
      for (const album of changes.newAlbums) {
        message += `<b>${album.artist}</b> - ${album.title} [${album.genre}]\n`;

        // Add links if we have search results
        const result = musicResults[`${album.artist} ${album.title}`];
        if (result) {
          if (result.spotify) {
            message += `🎧 <a href="${result.spotify.url}">Spotify</a>\n`;
          }
          if (result.youtube) {
            message += `🎬 <a href="${result.youtube.url}">YouTube</a>\n`;
          }
        }
        message += "\n";
      }
    }

    // Add tracks
    if (changes.newTracks.length > 0) {
      message += "<b>🎵 New Tracks:</b>\n";
      for (const track of changes.newTracks) {
        message += `<b>${track.artist}</b> - ${track.title} [${track.genre}]\n`;

        // Add links if we have search results
        const result = musicResults[`${track.artist} ${track.title}`];
        if (result) {
          if (result.spotify) {
            message += `🎧 <a href="${result.spotify.url}">Spotify</a>\n`;
          }
          if (result.youtube) {
            message += `🎬 <a href="${result.youtube.url}">YouTube</a>\n`;
          }
        }
        message += "\n";
      }
    }

    // Add reissues
    if (changes.newReissues.length > 0) {
      message += "<b>♻️ New Reissues:</b>\n";
      for (const reissue of changes.newReissues) {
        message += `<b>${reissue.artist}</b> - ${reissue.title} [${reissue.genre}]\n`;

        // Add links if we have search results
        const result = musicResults[`${reissue.artist} ${reissue.title}`];
        if (result) {
          if (result.spotify) {
            message += `🎧 <a href="${result.spotify.url}">Spotify</a>\n`;
          }
          if (result.youtube) {
            message += `🎬 <a href="${result.youtube.url}">YouTube</a>\n`;
          }
        }
        message += "\n";
      }
    }

    await this.sendMessage(message);
  }
}

module.exports = TelegramNotifier;
