export interface EarningsData {
  date: string;
  name: string;
  ticker: string;
  time: string;
}

export interface CalendarData {
  date: string;
  name: string;
  ticker: string;
  time: string;
  logo: {
    files: {
      mark_vector_dark: string;
      mark_vector_light: string;
    };
  };
}

export type EarningsResponse = EarningsData[];
