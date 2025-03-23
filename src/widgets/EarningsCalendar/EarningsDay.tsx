import dayjs from "dayjs";
import styles from "./EarningsCalendar.module.scss";
import LazyImage from "../../components/LazyImage";
import { CalendarData } from "../../types/Earnings";
import { useEffect, useRef, useState } from "react";
import DownArrow from "../../assets/down-arrow.svg";

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

const EarningsDay = ({
  date,
  calendarData,
}: {
  date: string;
  calendarData: Record<
    string,
    { before: CalendarData[]; after: CalendarData[] }
  >;
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollIcon, setShowScrollIcon] = useState(true);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } =
      scrollContainerRef.current;

    // Show the button only if more content is below
    setShowScrollIcon(scrollTop + clientHeight < scrollHeight - 10);
  };

  const handleScrollDown = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ top: 500, behavior: "smooth" });
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      handleScroll(); // Check on mount
    }

    return () => container?.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={styles.day} key={date}>
      <div className={styles.dayTitle}>{dayjs(date).format("dddd")}</div>
      <div className={styles.marketTitle}>
        <div className={styles.text}>Before Open</div>

        <div className={styles.text}>
          {calendarData[date].after.length > 0 ? "After Close" : ""}
        </div>
      </div>
      <div className={styles.companiesSection} ref={scrollContainerRef}>
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
      {showScrollIcon && (
        <button className={styles.scrollButton} onClick={handleScrollDown}>
          <img src={DownArrow} style={{ objectFit: "contain", width: 18 }} />
        </button>
      )}
    </div>
  );
};

export default EarningsDay;
