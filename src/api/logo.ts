import { fetchFromAPI } from "./client";

export const fetchLogos = (symbols: string[]) => {
  return fetchFromAPI("/logos", {
    search_keys: symbols.join(","),
    fields: "mark_vector_light,mark_vector_dark",
  });
};
