'use client';

import { useQuery } from '@tanstack/react-query';
import { PRODUCT_DETAIL_STALE_TIME, productKeys } from '@/lib/queryKeys';
import { productsService } from '@/services/products/productsService';

export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: ({ signal }) => productsService.getById(id, signal),
    staleTime: PRODUCT_DETAIL_STALE_TIME,
  });
}
