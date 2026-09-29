import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { PAGINATION, SEARCH } from '@/constants';
import { getQueryClient } from '@/lib/queryClient';
import { PRODUCTS_LIST_STALE_TIME, productKeys } from '@/lib/queryKeys';
import { productsService } from '@/services/products/productsService';
import { CatalogView } from '@/features/catalog/components/CatalogView';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ [SEARCH.QUERY_PARAM]?: string }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const resolved = await searchParams;
  const search = resolved[SEARCH.QUERY_PARAM] ?? '';
  const queryClient = getQueryClient();
  const params = {
    search,
    limit: PAGINATION.DEFAULT_LIMIT,
    offset: PAGINATION.DEFAULT_OFFSET,
  };
  await queryClient.query({
    queryKey: productKeys.list(params),
    queryFn: () => productsService.list(params),
    staleTime: PRODUCTS_LIST_STALE_TIME,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CatalogView initialSearch={search} />
    </HydrationBoundary>
  );
}
