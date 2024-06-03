import * as dotenv from "dotenv";
dotenv.config();
import { Interaction, REST, Routes } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import ExtendedClient from "./client";
import { Command } from "./types";

/**
 * This file is responsible for initializing the Bot, and reading the commands
 * that are available on the commands folder
 */

/*Tells to the bot the discord the events he is going to process */
const client = new ExtendedClient(
  {
    intents: ["Guilds", "GuildMessages", "GuildVoiceStates"],
  },
  {
    ytdlOptions: {
      quality: "highestaudio",
      highWaterMark: 1 << 25,
    },
  }
);

/*Read and register the commands*/
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

client.on("ready", () => {
  const guild_ids = client.guilds.cache.map((guild) => guild.id);

  const rest = new REST({ version: "9" }).setToken(
    process.env.DC_BOT_TOKEN ?? ""
  );

  console.log("Started refreshing application (/) commands.");

  for (const guildId of guild_ids) {
    rest
      .put(
        Routes.applicationGuildCommands(process.env.DC_APP_ID ?? "", guildId),
        {
          body: commands,
        }
      )
      .then(() =>
        console.log(
          `Successfully reloaded application (/) commands for guild ${guildId}.`
        )
      )
      .catch(console.error);
  }
});

/*
Is listening for a command entered by a user and the it validate's if the command
exists on the app
*/
client.on("interactionCreate", async (interaction: Interaction) => {
  console.log("Interaction");
  if (!interaction.isCommand()) return;

  // Usar type guard para asegurarse de que es un ChatInputCommandInteraction
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    return await command.execute(client, interaction);
  } catch (error) {
    console.error(error);
    return await interaction.reply({
      content: "There was an error executing that command!",
      ephemeral: true,
    });
  }
});

client.login(process.env.DC_BOT_TOKEN);
