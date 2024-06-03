import { ChatInputCommandInteraction, GuildMember } from "discord.js";

export const validateInteraction = async (
  interaction: ChatInputCommandInteraction
) => {
  if (!interaction.member || !(interaction.member instanceof GuildMember)) {
    return "You need to be in a server to use this command.";
  }

  if (!interaction.member.voice.channel) {
    return "You need to be in a voice channel to play a song.";
  }

  if (!interaction.guild) {
    return "This command can only be used in a server.";
  }

  return null;
};
