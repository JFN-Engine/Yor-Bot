import { Client, ClientOptions, Collection } from "discord.js";
import { Player, PlayerInitOptions } from "discord-player";
import { Command } from "./types";

/**
 * Defines an extended class of Client to include a commands Collection and in that
 * way be able to use it on the main.ts
 */
class ExtendedClient extends Client {
  commands: Collection<string, Command>;
  player: Player;

  constructor(options: ClientOptions, playerOptions: PlayerInitOptions) {
    super(options);
    this.commands = new Collection();
    this.player = new Player(this, playerOptions);
  }
}

export default ExtendedClient;
