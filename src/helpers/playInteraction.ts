import { Interaction, Message, VoiceBasedChannel } from "discord.js";
import ExtendedClient from "../client";
import { embedBuilder } from "../utils/utils";
import { Queue } from "distube";

export const playInteraction = async (
  client: ExtendedClient,
  voiceChannel: VoiceBasedChannel,
  interaction: Interaction,
  confirmation: any
  // queue?: Queue
) => {
  const { customId } = confirmation;
  const queue = client.distube.getQueue(voiceChannel);
  switch (customId) {
    case "Stop":
      if (!queue) { 
        await confirmation.reply({ 
          content: "No hay ninguna canción reproduciéndose." 
        });
        return;
      }
      queue.stop();
      break;
    case "Pause":
      if (!queue) {
        await confirmation.reply({
          content: "No hay ninguna canción en reproducción.",
        });
        return;
      }

      client.distube.pause(voiceChannel);
      await confirmation.reply({ content: "Acción realizada: Pause!" });
      break;
    case "Skip":
      await confirmation.reply({ content: "Acción realizada Skip!" });
      break;
    case "ShowPlaylist": {
      if (!queue) {
        await confirmation.reply({
          embeds: [
            embedBuilder(`Yor Playlist`, `No active queue`, 0xff2a16, {
              name: interaction.user.username,
              iconURL: interaction.user.displayAvatarURL(),
            }),
          ],
        });
      }

      await confirmation.reply({
        embeds: [
          embedBuilder(
            `Yor Playlist`,
            `${queue?.songs.map(
              (song, id) =>
                `\n**${id + 1}.**${song.name} - \`${song.formattedDuration!}\``
            )}`,
            "Blue",
            {
              name: interaction.user.username,
              iconURL: interaction.user.displayAvatarURL(),
            }
          ),
        ],
      });
    }
    default:
      // Manejar otros botones o interacciones
      break;
  }
};
