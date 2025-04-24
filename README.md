# Pitchfork Best Music Tracker

A Node.js application that monitors Pitchfork's Best New Music page for updates, finds matching tracks on YouTube and Spotify, and sends notifications to a Telegram bot.

## Features

- 🎵 Tracks updates to Pitchfork's Best New Music (Albums, Tracks, and Reissues)
- 🔍 Automatically searches for music on YouTube and Spotify
- 📱 Sends notifications via Telegram when new music is found
- 🕒 Runs on a customizable schedule (default: once per day)
- 🧪 Includes a browser-based testing tool for verifying the parser

## Prerequisites

- Node.js 16+ installed
- A Telegram bot token (create one via [BotFather](https://t.me/botfather))
- Spotify API credentials (register at [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/))

## Installation

1. Clone this repository:

   ```
   git clone <repository-url>
   cd pitchfork-parser
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Copy `.env.example` to `.env` and fill in your API keys:

   ```
   cp .env.example .env
   ```

4. Edit the `.env` file with your configuration:

   ```
   # Telegram Bot Configuration
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token
   TELEGRAM_CHAT_ID=your_chat_id

   # Spotify API Configuration
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

   # URLs
   PITCHFORK_URL=https://pitchfork.com/reviews/best/tracks/

   # Schedule (cron format - default: once a day at 10:00 AM)
   CRON_SCHEDULE=0 10 * * *
   ```

## Usage

### Run the application:

```
npm start
```

This will:

1. Start monitoring Pitchfork's Best New Music page
2. Run on the schedule defined in your `.env` file
3. Send notifications to your Telegram bot when new music is found

### Run the browser test:

```
npm test
```

This will:

1. Launch a headless browser
2. Visit Pitchfork's Best New Music page
3. Extract data and save it to the `test-output` directory
4. Generate a screenshot and HTML dump for debugging purposes

## Deploying as a Service

### Using PM2:

1. Install PM2 globally:

   ```
   npm install -g pm2
   ```

2. Start the application:

   ```
   pm2 start src/index.js --name pitchfork-tracker
   ```

3. Configure PM2 to start on system boot:
   ```
   pm2 startup
   pm2 save
   ```

### Using Docker (Raspberry Pi compatible):

1. Make sure Docker and Docker Compose are installed on your Raspberry Pi:

   ```
   sudo apt update
   sudo apt install docker.io docker-compose
   ```

2. Clone the repository and navigate to the project folder:

   ```
   git clone <repository-url>
   cd pitchfork-parser
   ```

3. Create and configure the `.env` file as described above.

4. Build and start the Docker container:

   ```
   docker-compose up -d
   ```

5. To view logs:

   ```
   docker-compose logs -f
   ```

6. To stop the service:
   ```
   docker-compose down
   ```

The Docker setup is optimized for ARM processors like the one in Raspberry Pi 5.

## Troubleshooting

- If you're not receiving Telegram messages, verify your bot token and chat ID
- If music searches aren't working, check your Spotify API credentials
- For parser issues, run the browser test to see if the website structure has changed

## License

MIT
