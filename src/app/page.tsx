import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/queryClient';
import { PRODUCTS_LIST_STALE_TIME, productKeys } from '@/lib/queryKeys';
import { productsService } from '@/services/products/productsService';
import { CatalogView } from '@/features/catalog/components/CatalogView';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ search?: string }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const { search } = await searchParams;
  const queryClient = getQueryClient();
  const params = { search: search ?? '', limit: 20, offset: 0 };
  await queryClient.prefetchQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productsService.list(params),
    staleTime: PRODUCTS_LIST_STALE_TIME,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CatalogView initialSearch={search ?? ''} />
    </HydrationBoundary>
  );
}
