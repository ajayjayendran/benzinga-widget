import { useQuery } from "@tanstack/react-query";
import { fetchEarnings } from "../api/calendar";
import dayjs from "dayjs";
import { EarningsData } from "../types/Earnings";

export const useEarnings = () => {
  const start_date = dayjs().startOf("week").add(1, "day").format("YYYY-MM-DD");
  const end_date = dayjs().startOf("week").add(5, "day").format("YYYY-MM-DD");

  return useQuery({
    queryKey: ["earnings", start_date, end_date],
    queryFn: () => fetchEarnings(start_date, end_date),
    staleTime: 1000 * 60 * 5, // 5 minutes
    select: (data) =>
      data.earnings.map(({ name, date, time, ticker }: EarningsData) => ({
        name,
        date,
        time,
        ticker,
      })),
  });
};
