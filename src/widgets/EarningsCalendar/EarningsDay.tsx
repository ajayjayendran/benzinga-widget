import dayjs from "dayjs";
import styles from "./EarningsCalendar.module.scss";
import LazyImage from "../../components/LazyImage";
import { CalendarData } from "../../types/Earnings";

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
  return (
    <div className={styles.day} key={date}>
      <div className={styles.dayTitle}>{dayjs(date).format("dddd")}</div>
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
};

export default EarningsDay;
