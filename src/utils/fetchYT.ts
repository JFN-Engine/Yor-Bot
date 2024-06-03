import { YouTube } from "youtube-sr";

export const SearchYtLink = async (query: string, type: string) => {
  return await YouTube.search(query, { limit: 3, type: "video" });
};
