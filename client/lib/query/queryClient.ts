import { QueryClient } from '@tanstack/react-query';

/** Shared QueryClient defaults: in-memory only (no AsyncStorage persist). */
export const createAppQueryClient = (): QueryClient =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        gcTime: 30 * 60_000,
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        structuralSharing: true,
      },
      mutations: {
        retry: 0,
      },
    },
  });
