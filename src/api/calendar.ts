import { fetchFromAPI } from "./client";

export const fetchEarnings = (date_from: string = "", date_to: string = "") => {
  return fetchFromAPI("/v2.1/calendar/earnings", {
    pagesize: 1000,
    page: 0,
    "parameters[date_from]": date_from,
    "parameters[date_to]": date_to,
  });
};
