import type { Client } from "discord.js";
import ExtendedClient from "../client";
export const HooksRegistry = new Map<symbol, unknown>();

const Symbols = {
  kClient: Symbol("Client"),
};

export function useClient() {
  const client = HooksRegistry.get(Symbols.kClient) as
    | ExtendedClient
    | undefined;
  if (!client) {
    throw new Error("Client has not been initialized");
  }

  return client;
}
