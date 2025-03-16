import dayjs from "dayjs";
import { CalendarData, EarningsData } from "../types/Earnings";
import { LogoData } from "../types/Logo";

export const processEarningsData = (
  earnings: EarningsData[],
  logoData: LogoData[]
) => {
  const earningsMap: Record<
    string,
    { before: CalendarData[]; after: CalendarData[] }
  > = {};

  earnings.forEach((element) => {
    const { name, ticker, date, time } = element;

    // Find the corresponding logo
    const logo = logoData.find((logo) => logo.search_key === ticker) || {
      files: { mark_vector_dark: "", mark_vector_light: "" },
    };

    const earningsTime = dayjs(`${date} ${time}`, "YYYY-MM-DD HH:mm:ss").format(
      "HH:mm:ss"
    );

    // Define market open and close times
    const marketOpen = "09:30:00";
    const marketClose = "16:30:00";

    // Initialize if the date is not present
    if (!earningsMap[date]) {
      earningsMap[date] = { before: [], after: [] };
    }

    if (earningsTime < marketOpen) {
      earningsMap[date].before.push({
        name,
        ticker,
        date,
        time,
        logo: {
          files: {
            mark_vector_dark: logo?.files.mark_vector_dark || "",
            mark_vector_light: logo?.files.mark_vector_light || "",
          },
        },
      });
    } else if (earningsTime >= marketClose) {
      earningsMap[date].after.push({
        name,
        ticker,
        date,
        time,
        logo: {
          files: {
            mark_vector_dark: logo?.files.mark_vector_dark || "",
            mark_vector_light: logo?.files.mark_vector_light || "",
          },
        },
      });
    }
  });

  const sortedData = Object.fromEntries(
    Object.entries(earningsMap).sort(
      ([a], [b]) => new Date(a).getTime() - new Date(b).getTime()
    )
  );
  return sortedData;
};
