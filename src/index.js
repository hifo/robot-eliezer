import { Client, GatewayIntentBits, Collection } from 'discord.js';
import dotenv from 'dotenv';
import { deployCommands } from './deployCommands.js';
import { locationsList } from '../helper.js';

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages,
  ],
});

client.commands = new Collection();

client.once('clientReady', async () => {
  console.log(`✓ Bot logged in as ${client.user.tag}`);
  await deployCommands(client);
});

client.on('interactionCreate', async (interaction) => {
  if (interaction.isAutocomplete()) {
    const focusedOption = interaction.options.getFocused(true);
    
    if (focusedOption.name === 'location') {
      const filtered = locationsList
        .filter(location => location.toLowerCase().startsWith(focusedOption.value.toLowerCase()))
        .slice(0, 25);
      
      await interaction.respond(
        filtered.map(location => ({ name: location, value: location }))
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
});

client.on('error', (error) => {
  console.error('Client error:', error);
});

client.on('warn', (warning) => {
  console.warn('Client warning:', warning);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

client.login(process.env.DISCORD_TOKEN);
