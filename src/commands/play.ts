import {
  EmbedBuilder,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import ExtendedClient from "../client";
import { validateInteraction } from "../helpers/interactionValidator";
import { createServerQueue } from "../helpers/serverQueueManager";
import { QueryType } from "discord-player";

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

    const embedElement = new EmbedBuilder();

    if (interaction.options.getSubcommand() === "youtube-song") {
      const query = interaction.options.getString("song-url");

      if (!query) {
        await interaction.reply("A value needs to be entered in the field.");

        throw new Error("User leaving url field empty");
      }

      const result = await client.player.search(query, {
        searchEngine: QueryType.AUTO,
      });

      if (result.tracks.length === 0) {
        return interaction.reply("No tracks found.");
      }

      const song = result.tracks[0];
      serverQueue.addTrack(song);

      embedElement
        .setDescription(
          `**[${song.title}](${song.url})** has been added to the Queue`
        )
        .setThumbnail(song.thumbnail)
        .setFooter({ text: `Duration: ${song.duration}` });
    }

    // if (!serverQueue.isPlaying) await serverQueue.play();

    // Respond with the embed containing information about the player
    await interaction.reply({
      embeds: [embedElement],
    });
  },
};

export default playCommand;
