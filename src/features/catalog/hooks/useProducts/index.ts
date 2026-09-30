'use client';

import { useQuery } from '@tanstack/react-query';
import { PRODUCTS_LIST_STALE_TIME, productKeys } from '@/lib/queryKeys';
import { productsService } from '@/services/products/productsService';
import type { ListProductsParams } from '@/services/products/productsService.types';

export function useProducts(params: ListProductsParams) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: ({ signal }) => productsService.list(params, signal),
    staleTime: PRODUCTS_LIST_STALE_TIME,
  });
}
