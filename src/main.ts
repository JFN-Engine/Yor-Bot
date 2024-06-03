import * as dotenv from "dotenv";
import { readdirSync } from "fs";
import { join } from "path";
import ExtendedClient from "./client";
import { Command } from "./types";
import { REST } from "discord.js";
import { Routes } from "discord-api-types/v9";

dotenv.config();

const client = new ExtendedClient({
  intents: ["Guilds", "GuildMessages", "GuildVoiceStates"],
});

const commands: Array<any> = [];
const commandsPath = join(__dirname, "commands");
const commandFiles = readdirSync(commandsPath).filter((file) =>
  file.endsWith(".js")
);

for (const file of commandFiles) {
  try {
    const commandModule = require(join(commandsPath, file));
    const command: Command = commandModule.default;

    if (!command) {
      throw new Error(`Default export not found in ${file}`);
    }

    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
  } catch (error) {
    console.error(`Error loading command from ${file}:`, error);
  }
}

client.on("ready", async () => {
  const guildIds = client.guilds.cache.map((guild) => guild.id);

  const rest = new REST({ version: "9" }).setToken(
    process.env.DC_BOT_TOKEN ?? ""
  );

  console.log("Started refreshing application (/) commands.");

  for (const guildId of guildIds) {
    try {
      await rest.put(
        Routes.applicationGuildCommands(process.env.DC_APP_ID ?? "", guildId),
        { body: commands }
      );
      console.log(
        `Successfully reloaded application (/) commands for guild ${guildId}.`
      );
    } catch (error) {
      console.error(`Error refreshing commands for guild ${guildId}:`, error);
    }
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand() || !interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(client, interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error executing that command!",
      ephemeral: true,
    });
  }
});

client.login(process.env.DC_BOT_TOKEN);
