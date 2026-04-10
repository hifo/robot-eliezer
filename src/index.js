import { Client, GatewayIntentBits, Collection } from 'discord.js';
import dotenv from 'dotenv';
import { deployCommands } from './deployCommands.js';

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

client.login(process.env.DISCORD_TOKEN);
