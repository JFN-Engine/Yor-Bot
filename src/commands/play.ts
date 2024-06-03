// File: commands/PlayCommand.ts
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import ExtendedClient from "../client";
import { validateInteraction } from "../helpers/interactionValidator";
import { createServerQueue } from "../helpers/serverQueueManager";

const playCommand = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play one or more songs")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("spotify-song")
        .setDescription(
          "Search for a single song by its name on spotify and plays it"
        )
        .addStringOption((option) =>
          option
            .setName("song-name")
            .setDescription("The song name")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("spotify-playlist")
        .setDescription(
          "Search for a playlist with an url on youtube and plays it"
        )
        .addStringOption((option) =>
          option
            .setName("playlist-url")
            .setDescription("The playlist URL")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("youtube-song")
        .setDescription(
          "Search for a single song with an url on youtube and plays it"
        )
        .addStringOption((option) =>
          option
            .setName("song_url")
            .setDescription("The song URL")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("youtube-playlist")
        .setDescription(
          "Search for a playlist with an url on youtube and plays it"
        )
        .addStringOption((option) =>
          option
            .setName("playlist-url")
            .setDescription("The playlist URL")
            .setRequired(true)
        )
    ),

  execute: async (
    client: ExtendedClient,
    interaction: ChatInputCommandInteraction
  ) => {
    await validateInteraction(interaction);
    const serverQueue = createServerQueue(client, interaction.guild);

    if (!serverQueue.connection) {
      //@ts-expect-error TS not recognizing validations performed before.
      await serverQueue.connect(interaction.member.voice.channel);
    }
  },
};

export default playCommand;
