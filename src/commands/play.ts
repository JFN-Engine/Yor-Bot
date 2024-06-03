import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  GuildMember,
} from "discord.js";
import ExtendedClient from "../client";
import { validateInteraction } from "../helpers/interactionValidator";
import { SearchResultType } from "distube";
import { embedBuilder, secondsToMinutes } from "../utils/utils";

const playCommand = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play one or more songs")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("song")
        .setDescription(
          "Search for a single song with its name or url on youtube and plays it"
        )
        .addStringOption((option) =>
          option
            .setName("query")
            .setDescription("The song query to search")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("volume")
        .setDescription("Adjuste the volume of the song.")
        .addNumberOption((option) =>
          option
            .setName("percentage")
            .setDescription("Adjuste volume in appropiate units: 10 = 10%")
            .setMinValue(1)
            .setMaxValue(100)
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("options")
        .setDescription("Options for music system.")
        .addStringOption((option) =>
          option
            .setName("options")
            .setDescription("Select music options")
            .setRequired(true)
            .addChoices(
              { name: "queue", value: "queue" },
              { name: "skip", value: "skip" },
              { name: "pause", value: "pause" },
              { name: "resume", value: "resume" },
              { name: "stop", value: "stop" },
              { name: "loop-queue", value: "loopqueue" },
              { name: "loop-all", value: "loopall" },
              { name: "autoplay", value: "autoplay" }
            )
        )
    ),

  execute: async (
    client: ExtendedClient,
    interaction: ChatInputCommandInteraction
  ) => {
    const interactionError = await validateInteraction(interaction);

    await interaction.deferReply();

    if (interactionError) {
      return await interaction.editReply({
        embeds: [
          embedBuilder(`Something just happened`, interactionError, 0xff2a16, {
            name: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL(),
          }),
        ],
      });
    }

    const { options, member, guild, channel } = interaction;

    const subCommand = options.getSubcommand();
    const query = options.getString("query", true);
    // const volume = options.getNumber("percentage", true);
    // const option = options.getString("options", true);
    const channelId = (member as GuildMember)?.voice.channelId;
    const voiceChannel = (member as GuildMember)?.voice.channel!;

    if (
      guild?.members.me?.voice.channelId !== null &&
      channelId !== guild?.members.me?.voice.channelId
    ) {
      return interaction.reply({
        embeds: [
          embedBuilder(
            `Something just happened`,
            `You can't use the music system because it's already in use in <#${guild?.members.me?.voice.channelId}>`,
            0xff2a16,
            {
              name: interaction.user.username,
              iconURL: interaction.user.displayAvatarURL(),
            }
          ),
        ],
      });
    }

    if (subCommand === "song") {
      if (!query) {
        return await interaction.editReply({
          embeds: [
            embedBuilder(
              `Something just happened`,
              "A value needs to be entered in the field.",
              0xff2a16,
              {
                name: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL(),
              }
            ),
          ],
        });
      }

      const search: Array<any> = await client.distube.search(query, {
        type: SearchResultType.VIDEO,
        limit: 1,
      });

      if (search.length == 0) {
        return await interaction.editReply({
          embeds: [
            embedBuilder(
              `No Results Found`,
              `No results found for \`${query}\``,
              0xff2a16,
              {
                name: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL(),
              }
            ),
          ],
        });
      }

      await client.distube.play(voiceChannel, query, {
        textChannel: voiceChannel,
        member: member as GuildMember,
      });

      return await interaction.editReply({
        embeds: [
          embedBuilder(
            `Track Found`,
            `**[${search[0].name}](${search[0].url})**`,
            0x00fa9a,
            {
              name: interaction.user.username,
              iconURL: interaction.user.displayAvatarURL(),
            },
            search[0].thumbnail,
            {
              text: `Duration: ${secondsToMinutes(search[0].duration)} `,
            }
          ),
        ],
      });
    }
  },
};

export default playCommand;
