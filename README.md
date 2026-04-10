# Robot Eliezer

Robot Eliezer is a Discord slash-command bot for Jewish calendar lookups powered by Hebcal.

## Features

- Slash-command only workflow (no prefix commands)
- `/information` command for today's Hebrew date and holiday details
- Location input with autocomplete from a predefined list
- Friday behavior: includes Saturday items from the Shabbat-focused calendar
- Guild-scoped command deployment for fast updates during development

## Requirements

- Node.js 18+
- A Discord application and bot token
- A Discord server (guild) ID for command deployment

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example` and set values:

```env
DISCORD_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=your_client_id_here
DISCORD_GUILD_ID=your_guild_id_here
```

3. Start the bot:

```bash
npm start
```

For development with file watching:

```bash
npm run dev
```

## Slash Commands

- `/information`
- Optional argument: `location`
- `location` supports autocomplete and is restricted to known locations in `locationsList`

Note: Commands are registered to the guild from `DISCORD_GUILD_ID` when the bot starts.

## Testing And Reports

Run tests:

```bash
npm test
```

Generate HTML test report (Mochawesome):

```bash
npm run test:report
```

Output:
- `reports/mochawesome/index.html`

Generate coverage reports (c8):

```bash
npm run coverage
```

Output:
- `coverage/index.html`
- `coverage/lcov.info`

## Project Structure

- `src/index.js` - Bot startup, interaction handling, autocomplete handling
- `src/deployCommands.js` - Dynamic command loading and guild command registration
- `commands/information.js` - Slash command definition and response logic
- `helper.js` - Hebrew date and holiday helper functions
- `tests/helper.test.js` - Unit tests for helper functions
