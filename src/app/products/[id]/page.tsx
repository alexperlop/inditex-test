import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import { getQueryClient } from '@/lib/queryClient';
import { PRODUCT_DETAIL_STALE_TIME, productKeys } from '@/lib/queryKeys';
import { productsService } from '@/services/products/productsService';
import { ProductDetailView } from '@/features/product-detail/components/ProductDetailView';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const queryClient = getQueryClient();

  try {
    await queryClient.query({
      queryKey: productKeys.detail(id),
      queryFn: () => productsService.getById(id),
      staleTime: PRODUCT_DETAIL_STALE_TIME,
    });
  } catch {
    notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductDetailView productId={id} />
    </HydrationBoundary>
  );
}
