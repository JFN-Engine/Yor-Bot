import {
  APIEmbedField,
  ButtonStyle,
  ColorResolvable,
  ComponentType,
  EmbedBuilder,
  EmbedFooterOptions,
  RestOrArray,
} from "discord.js";
import type { AuthorProps } from "../types";

export const embedBuilder = (
  title: string,
  description: string,
  color: ColorResolvable,
  author?: AuthorProps,
  thumbnail?: string,
  footer?: EmbedFooterOptions,
  fields?: Array<any>
) => {
  const embedBuilder = new EmbedBuilder();

  return embedBuilder
    .setTitle(title)
    .setDescription(description)
    .setColor(color)
    .setAuthor(author ?? null)
    .setThumbnail(thumbnail ?? null)
    .setFooter(footer ?? null)
    .setFields(fields ?? []);
};

export const secondsToMinutes = (time: number): string => {
  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export const trackButtonComponents = [
  {
    type: ComponentType.Button,
    style: ButtonStyle.Danger,
    custom_id: "Stop",
    emoji: { id: "1122098224098979840" },
  },
  {
    type: ComponentType.Button,
    style: ButtonStyle.Secondary,
    custom_id: "Pause",
    emoji: { id: "1122097586246008895" },
  },
  {
    type: ComponentType.Button,
    style: ButtonStyle.Primary,
    custom_id: "Skip",
    emoji: { id: "1122099413679095808" },
  },
  {
    type: ComponentType.Button,
    style: ButtonStyle.Primary,
    custom_id: "ShowPlaylist",
    emoji: { id: "1122101739760398447" },
  },
];

export const trackEmbed = (
  title: string,
  trackName: any,
  trackURL: any,
  color: any,
  authorName: any,
  authorAvatar: any,
  trackThumbnail: any,
  trackDuration: any
) => {
  return embedBuilder(
    title,
    `**[${trackName}](${trackURL})**`,
    color,
    { name: authorName, iconURL: authorAvatar },
    trackThumbnail,
    { text: `Duration: ${trackDuration}` }
  );
};
