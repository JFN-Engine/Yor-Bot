import { Client, ClientOptions, Collection } from "discord.js";
import { SpotifyPlugin } from "@distube/spotify";
import { YtDlpPlugin } from "@distube/yt-dlp";
import { Command } from "./types";
import DisTube from "distube";

/**
 * Defines an extended class of Client to include a commands Collection and in that
 * way be able to use it on the main.ts
 */
class ExtendedClient extends Client {
  commands: Collection<string, Command>;
  distube: DisTube;

  constructor(options: ClientOptions) {
    super(options);
    this.commands = new Collection();
    this.distube = new DisTube(this, {
      leaveOnFinish: true,
      searchCooldown: 10,
      leaveOnEmpty: false,
      leaveOnStop: true,
      emitNewSongOnly: true,
      emitAddSongWhenCreatingQueue: false,
      emitAddListWhenCreatingQueue: false,
      plugins: [
        new SpotifyPlugin({
          emitEventsAfterFetching: true,
        }),
        new YtDlpPlugin(),
      ],
    });
  }
}

export default ExtendedClient;
