export interface LogoData {
  created_at: string;
  search_key: string;
  id: string;
  files: {
    mark_vector_dark: string;
    mark_vector_light: string;
  };
}

export type LogoResponse = LogoData[];
