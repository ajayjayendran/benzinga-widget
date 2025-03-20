import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useEarnings } from "../../hooks/useEarnings";
import { CalendarData, EarningsData } from "../../types/Earnings";
import { fetchLogos } from "../../api/logo";
import { LogoData, LogoResponse } from "../../types/Logo";
import { processEarningsData } from "../../utils/earnings";
import styles from "./EarningsCalendar.module.scss";
import EarningWhisperLogo from "../../assets/earnings-whisper-full-logo.svg";
import EarningsDay from "./EarningsDay";
import { useDeviceSize } from "../../hooks/useDeviceSize";
import HorizontalScroll from "../../components/HorizontalScroll";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const EarningsCalendar = () => {
  const { data: earningsData } = useEarnings();
  const isMobile = useDeviceSize();

  const [calendarData, setCalendarData] =
    useState<
      Record<string, { before: CalendarData[]; after: CalendarData[] }>
    >();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch logos in batches
  const fetchAllLogos = async (tickerArray: string[]) => {
    const chunkSize = 100;
    const logoDataArray: LogoData[] = [];

    for (let i = 0; i < tickerArray.length; i += chunkSize) {
      const batch = tickerArray.slice(i, i + chunkSize);

      try {
        const { data: logoData } = (await fetchLogos(batch)) as {
          data: LogoResponse;
        };
        logoDataArray.push(...logoData);
      } catch (error) {
        console.error("Error fetching logos for batch:", batch, error);
      }
    }

    return logoDataArray;
  };

  // Process earnings and logos
  const fetchTicker = async () => {
    if (earningsData) {
      const tickerArray = (earningsData as EarningsData[]).map(
        (item) => item.ticker
      );

      const logoData = await fetchAllLogos(tickerArray);
      const structuredData = processEarningsData(earningsData, logoData);

      setCalendarData(structuredData);
    }
  };

  useEffect(() => {
    if (!earningsData) return;
    fetchTicker();
  }, [earningsData]);

  return (
    <div className={styles.earningsCalendar}>
      <div className={styles.header}>
        <div>
          <img src={EarningWhisperLogo} alt="Earnings Whisper" />
        </div>
        <div className={styles.calendarTitle}>
          Most Anticipated Earnings Releases
          <br />
          <span className={styles.lightCaption}>for the week beginning</span>
          <br />
          <span>
            {dayjs().startOf("week").add(1, "day").format("MMMM D, YYYY")}
          </span>
        </div>
      </div>

      {!isMobile && (
        <div className={styles.dayCalender}>
          {calendarData &&
            Object.keys(calendarData).map((date) => (
              <EarningsDay key={date} calendarData={calendarData} date={date} />
            ))}
        </div>
      )}

      {isMobile && calendarData && (
        <div className={styles.dayCalender}>
          <HorizontalScroll totalSize={Object.keys(calendarData).length}>
            {Object.keys(calendarData).map((date) => (
              <EarningsDay key={date} calendarData={calendarData} date={date} />
            ))}
          </HorizontalScroll>
        </div>
      )}
    </div>
  );
};

export default EarningsCalendar;
