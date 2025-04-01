import { fetchFromAPI } from "./client";

export const fetchEarnings = (date_from: string = "", date_to: string = "") => {
  return fetchFromAPI("/earnings", {
    pagesize: 1000,
    page: 0,
    date_from,
    date_to,
  });
};
