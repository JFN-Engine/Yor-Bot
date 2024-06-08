import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  GuildMember,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ComponentType,
} from "discord.js";
import ExtendedClient from "../client";
import { validateInteraction } from "../helpers/interactionValidator";
import { SearchResultType } from "distube";
import { embedBuilder, secondsToMinutes } from "../utils/utils";
import { playInteraction } from "../helpers/playInteraction";

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
    ),

  execute: async (
    client: ExtendedClient,
    interaction: ChatInputCommandInteraction
  ) => {
    const interactionError = await validateInteraction(interaction);

    await interaction.deferReply();

    if (interactionError) {
      await interaction.editReply({
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
      await interaction.reply({
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
        await interaction.editReply({
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
        await interaction.editReply({
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

      const queue = await client.distube.getQueue(voiceChannel);

      await client.distube.play(voiceChannel, query, {
        textChannel: voiceChannel,
        member: member as GuildMember,
      });

      let reply;

      if (!queue?.playing) {
        reply = await interaction.editReply({
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
          components: [
            {
              type: 1,
              components: [
                {
                  type: ComponentType.Button,
                  style: ButtonStyle.Danger,
                  custom_id: "Stop",
                  emoji: {
                    id: "1122098224098979840",
                  },
                },
                {
                  type: ComponentType.Button,
                  style: ButtonStyle.Secondary,
                  custom_id: "Pause",
                  emoji: {
                    id: "1122097586246008895",
                  },
                },
                {
                  type: ComponentType.Button,
                  style: ButtonStyle.Primary,
                  custom_id: "Skip",
                  emoji: {
                    id: "1122099413679095808",
                  },
                },
                {
                  type: ComponentType.Button,
                  style: ButtonStyle.Primary,
                  custom_id: "ShowPlaylist",
                  emoji: {
                    id: "1122101739760398447",
                  },
                },
              ],
            },
          ],
        });
      } else {
        reply = await interaction.editReply({
          embeds: [
            embedBuilder(
              `Track Queued Succesfully!`,
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
          components: [
            {
              type: 1,
              components: [
                {
                  type: ComponentType.Button,
                  style: ButtonStyle.Primary,
                  custom_id: "ShowPlaylist",
                  emoji: {
                    id: "1122101739760398447",
                  },
                },
              ],
            },
          ],
        });
      }

      try {
        const confirmation = await reply.awaitMessageComponent({
          time: 60_000,
        });

        playInteraction(client, voiceChannel, interaction, confirmation);
      } catch (e: any) {
        console.log(e.message);
      }
    }
  },
};

export default playCommand;
