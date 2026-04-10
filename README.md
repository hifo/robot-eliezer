# Robot Eliezer

A Discord bot for Jewish calendar look ups using HebCal

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file based on `.env.example` and add your Discord bot token:
   ```
   DISCORD_TOKEN=your_token_here
   DISCORD_CLIENT_ID=your_client_id_here
   ```

3. Run the bot:
   ```bash
   npm start
   ```

   Or for development with watch mode:
   ```bash
   npm run dev
   ```

## Project Structure

- `src/` - Main bot files
- `commands/` - Bot commands
- `events/` - Discord event handlers
