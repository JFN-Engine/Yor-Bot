import {
  EmbedBuilder,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  StringSelectMenuOptionBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
  ComponentType,
  GuildMember,
} from "discord.js";
import ExtendedClient from "../client";
import { validateInteraction } from "../helpers/interactionValidator";
import { createServerQueue } from "../helpers/serverQueueManager";
import { QueryType, useMainPlayer } from "discord-player";
import { join } from "path";
import { SearchYtLink } from "../utils/fetchYT";
import { Interaction } from "discord.js";
import { DisTube, QueueManager, SearchResultType } from "distube";

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
    const interactionError = await validateInteraction(interaction);

    if (interactionError) {
      return interaction.reply(interactionError);
    }

    const distube = new DisTube(client);

    const serverQueue = new QueueManager(distube);
    //@ts-expect-error TS not recognizing validations performed before.
    const channel = interaction.member.voice.channel!;

    const embedElement = new EmbedBuilder();

    if (interaction.options.getSubcommand() === "youtube-song") {
      const query = interaction.options.getString("song_url", true);

      if (!query) {
        return await interaction.reply(
          "A value needs to be entered in the field."
        );
      }

      const search = await distube.search(query, {
        type: SearchResultType.VIDEO,
        limit: 4,
      });

      if (search.length == 0) {
        const embed = embedElement
          .setTitle(`No Results Found`)
          .setDescription(`No results found for \`${query}\``)
          .setColor(0xff2a16)
          .setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL(),
          });

        return interaction.reply({ embeds: [embed] });
      }

      // serverQueue.create(channel, search[0], channel);

      await distube.play(channel, query);

      // const embed = embedElement
      //   .setTitle(
      //     `${searchResult.hasPlaylist() ? "Playlist" : "Track"} queued!`
      //   )
      //   .setDescription(`**[${track.title}](${track.url})**`)
      //   .setThumbnail(track.thumbnail)
      //   .setFooter({ text: `Duration: ${track.duration}` })
      //   .setColor(0x00fa9a)
      //   .setAuthor({
      //     name: interaction.user.username,
      //     iconURL: interaction.user.displayAvatarURL(),
      //   })
      //   .setFields(
      //     searchResult.playlist
      //       ? [{ name: "Playlist", value: searchResult.playlist.title }]
      //       : []
      //   );

      // return interaction.reply({
      //   embeds: [embed],
      // });
      // });
      // if (!result.hasTracks()) {

      // }

      // const { track, searchResult } = await player.play(channel, result);
    }
  },
};

export default playCommand;
