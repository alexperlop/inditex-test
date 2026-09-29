import { QueryClient, environmentManager } from '@tanstack/react-query';
import { QUERY } from '@/constants';

function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: QUERY.DEFAULT_STALE_TIME_MS,
        gcTime: QUERY.DEFAULT_GC_TIME_MS,
        refetchOnWindowFocus: false,
        retry: QUERY.DEFAULT_RETRY,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient(): QueryClient {
  if (environmentManager.isServer()) {
    return makeQueryClient();
  }
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}
