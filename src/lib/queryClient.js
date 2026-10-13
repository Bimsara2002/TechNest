import { QueryClient } from "@tanstack/react-query";

/**
 * Single QueryClient for the app. Defaults are tuned for a catalogue that
 * changes slowly: data stays fresh for a minute, and we do not refetch every
 * time the customer tabs back to the window (costly on mobile data).
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
