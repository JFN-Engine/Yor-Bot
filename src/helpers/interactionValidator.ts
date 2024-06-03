import { ChatInputCommandInteraction, GuildMember } from "discord.js";

export const validateInteraction = async (
  interaction: ChatInputCommandInteraction
) => {
  if (!interaction.member || !(interaction.member instanceof GuildMember)) {
    await interaction.reply("You need to be in a server to use this command.");
    throw new Error("Invalid interaction.");
  }

  if (!interaction.member.voice.channel) {
    await interaction.reply(
      "You need to be in a voice channel to play a song."
    );
    throw new Error("User is not in a voice channel.");
  }

  if (!interaction.guild) {
    await interaction.reply("This command can only be used in a server.");
    throw new Error("Interaction is not in a guild.");
  }
};
