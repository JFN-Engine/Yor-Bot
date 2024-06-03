import ExtendedClient from "../client";
import { Guild } from "discord.js";

export const createServerQueue = (
  client: ExtendedClient,
  guild: Guild | null
) => {
  if (!guild) {
    throw new Error("Guild is null.");
  }
  return client.player.nodes.create(guild);
};
