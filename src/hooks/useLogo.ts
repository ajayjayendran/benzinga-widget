import { useQuery } from "@tanstack/react-query";
import { fetchLogos } from "../api/logo";

export const useLogo = (symbols: string[]) => {
  return useQuery({
    queryKey: ["logos", symbols],
    queryFn: () => fetchLogos(symbols),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};
