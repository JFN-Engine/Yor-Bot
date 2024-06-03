import {
  APIEmbedField,
  ColorResolvable,
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
