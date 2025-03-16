import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useEarnings } from "../../hooks/useEarnings";
import { CalendarData, EarningsData } from "../../types/Earnings";
import { fetchLogos } from "../../api/logo";
import { LogoData, LogoResponse } from "../../types/Logo";
import { processEarningsData } from "../../utils/earnings";
import styles from "./EarningsCalendar.module.scss";
import { LazyImage } from "../../components/LazyImage";
import EarningWhisperLogo from "../../assets/earnings-whisper-full-logo.svg";

const EarningsCalendar = () => {
  const { data: earningsData } = useEarnings();

  const [calendarData, setCalendarData] =
    useState<
      Record<string, { before: CalendarData[]; after: CalendarData[] }>
    >();

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

  const fetchTicker = async () => {
    if (earningsData) {
      const tickerArray = (earningsData as EarningsData[]).reduce<string[]>(
        (acc, curr) => {
          acc.push(curr.ticker);
          return acc;
        },
        []
      );

      const logoData = await fetchAllLogos(tickerArray);

      const structuredData = processEarningsData(earningsData, logoData);

      setCalendarData(structuredData);
    }
  };

  const getCompanyDetails = (company: {
    ticker: string;
    logo: { files: { mark_vector_light: string } };
  }) => {
    return (
      <>
        <div className={styles.companyName}>{company.ticker}</div>
        {company.logo.files.mark_vector_light && (
          <a
            href={`https://www.benzinga.com/quote/${company.ticker.toLowerCase()}`}
            target="_blank"
          >
            <LazyImage
              src={company.logo.files.mark_vector_light}
              alt={company.ticker}
            />
          </a>
        )}
      </>
    );
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
      <div className={styles.dayCalender}>
        {calendarData &&
          Object.keys(calendarData).map((date) => {
            return (
              <div className={styles.day} key={date}>
                <div className={styles.dayTitle}>
                  {dayjs(date).format("dddd")}
                </div>
                <div className={styles.marketTitle}>
                  <div className={styles.text}>Before Open</div>

                  <div className={styles.text}>
                    {calendarData[date].after.length > 0 ? "After Close" : ""}
                  </div>
                </div>
                <div className={styles.companiesSection}>
                  <div className={styles.bmo}>
                    {calendarData[date].before.map((company) => {
                      return company.logo.files.mark_vector_light &&
                        company.logo.files.mark_vector_light !== "" ? (
                        <div className={styles.item} key={company.ticker}>
                          {getCompanyDetails(company)}
                        </div>
                      ) : null;
                    })}
                  </div>
                  <div className={styles.amc}>
                    {calendarData[date].after.map((company) => {
                      return company.logo.files.mark_vector_light ? (
                        <div className={styles.item} key={company.ticker}>
                          {getCompanyDetails(company)}
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default EarningsCalendar;
