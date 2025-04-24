const ytSearch = require("youtube-search-api");
const SpotifyWebApi = require("spotify-web-api-node");

// Initialize Spotify API client
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

// Refresh Spotify access token
async function refreshSpotifyToken() {
  try {
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body.access_token);
    console.log("Spotify token refreshed");

    // Set token expiration timeout (subtract 1 minute for safety)
    setTimeout(refreshSpotifyToken, (data.body.expires_in - 60) * 1000);
  } catch (error) {
    console.error("Error refreshing Spotify token:", error);
  }
}

// Search for a track on YouTube
async function searchYouTube(query) {
  try {
    const results = await ytSearch.GetListByKeyword(query, false, 1);
    if (results && results.items && results.items.length > 0) {
      const firstResult = results.items[0];
      return {
        title: firstResult.title,
        url: `https://www.youtube.com/watch?v=${firstResult.id}`,
        thumbnail: firstResult.thumbnail.thumbnails[0].url,
      };
    }
    return null;
  } catch (error) {
    console.error("Error searching YouTube:", error);
    return null;
  }
}

// Search for a track on Spotify
async function searchSpotify(query) {
  try {
    // Make sure we have a valid token
    if (!spotifyApi.getAccessToken()) {
      await refreshSpotifyToken();
    }

    const results = await spotifyApi.search(query, ["track", "album"], {
      limit: 1,
    });

    // Check for track results first
    if (results.body.tracks && results.body.tracks.items.length > 0) {
      const track = results.body.tracks.items[0];
      return {
        type: "track",
        name: track.name,
        artist: track.artists[0].name,
        url: track.external_urls.spotify,
        image: track.album.images[0].url,
      };
    }
    // Then check for album results
    else if (results.body.albums && results.body.albums.items.length > 0) {
      const album = results.body.albums.items[0];
      return {
        type: "album",
        name: album.name,
        artist: album.artists[0].name,
        url: album.external_urls.spotify,
        image: album.images[0].url,
      };
    }

    return null;
  } catch (error) {
    console.error("Error searching Spotify:", error);
    return null;
  }
}

// Search both platforms
async function searchMusic(query) {
  const [youtubeResult, spotifyResult] = await Promise.all([
    searchYouTube(query),
    searchSpotify(query),
  ]);

  return {
    youtube: youtubeResult,
    spotify: spotifyResult,
  };
}

module.exports = {
  refreshSpotifyToken,
  searchMusic,
};
