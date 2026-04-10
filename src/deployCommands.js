import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const commandsPath = path.join(__dirname, '../commands');

export async function deployCommands(client) {
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  const commands = [];

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = await import(pathToFileURL(filePath).href);
    
    if (command.default.data && command.default.execute) {
      client.commands.set(command.default.data.name, command.default);
      commands.push(command.default.data.toJSON());
      console.log(`✓ Loaded command: ${command.default.data.name}`);
    }
  }

  // Register slash commands with Discord
  const rest = new REST().setToken(process.env.DISCORD_TOKEN);
  
  try {
    console.log('Registering slash commands...');
    await rest.put(
      Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
      { body: commands },
    );
    console.log(`✓ Registered ${commands.length} slash command(s)`);
  } catch (error) {
    console.error('Failed to register commands:', error);
  }
}