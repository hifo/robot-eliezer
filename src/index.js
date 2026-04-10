import path from 'path';
import { fileURLToPath } from 'url';
import { Client, GatewayIntentBits, Collection } from 'discord.js';
import dotenv from 'dotenv';
import { deployCommands } from './deployCommands.js';
import { locationsList } from '../helper.js';

export async function handleInteraction(interaction, client, locations = locationsList) {
  if (interaction.isAutocomplete()) {
    const focusedOption = interaction.options.getFocused(true);

    if (focusedOption.name === 'location') {
      const filtered = locations
        .filter(location => location.toLowerCase().startsWith(focusedOption.value.toLowerCase()))
        .slice(0, 25);

      await interaction.respond(
        filtered.map(location => ({ name: location, value: location })),
      );
    }
    return;
  }

  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error executing that command!', ephemeral: true }).catch(console.error);
    } else {
      await interaction.reply({ content: 'There was an error executing that command!', ephemeral: true }).catch(console.error);
    }
  }
}

export function registerClientHandlers(client, deployCommandsFn = deployCommands, locations = locationsList) {
  client.once('clientReady', async () => {
    console.log(`✓ Bot logged in as ${client.user.tag}`);
    await deployCommandsFn(client);
  });

  client.on('interactionCreate', async (interaction) => {
    await handleInteraction(interaction, client, locations);
  });

  client.on('error', (error) => {
    console.error('Client error:', error);
  });

  client.on('warn', (warning) => {
    console.warn('Client warning:', warning);
  });
}

export function registerProcessHandlers(processObj = process) {
  processObj.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });

  processObj.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
  });
}

export function createBotClient(options = {}) {
  const { clientInstance, deployCommandsFn = deployCommands, locations = locationsList } = options;

  const client = clientInstance ?? new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.DirectMessages,
    ],
  });

  client.commands = client.commands ?? new Collection();
  registerClientHandlers(client, deployCommandsFn, locations);
  return client;
}

export async function startBot(options = {}) {
  dotenv.config();
  const { processObj = process, token = process.env.DISCORD_TOKEN } = options;
  const client = createBotClient(options);
  registerProcessHandlers(processObj);
  await client.login(token);
  return client;
}

const isMainModule = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMainModule) {
  startBot().catch((error) => {
    console.error('Failed to start bot:', error);
  });
}
