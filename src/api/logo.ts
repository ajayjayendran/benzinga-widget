import { fetchFromAPI } from "./client";

export const fetchLogos = (symbols: string[]) => {
  return fetchFromAPI("/v2/logos/search", {
    search_keys: symbols.join(","),
    fields: "mark_vector_light,mark_vector_dark",
  });
};
