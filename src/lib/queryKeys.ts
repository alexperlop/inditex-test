import type { ListProductsParams } from '@/services/products/productsService.types';

export const PRODUCTS_LIST_STALE_TIME = 5 * 60 * 1000;
export const PRODUCT_DETAIL_STALE_TIME = 60 * 1000;

export const productKeys = {
  all: ['products'] as const,
  list: (params: ListProductsParams) => ['products', 'list', params] as const,
  detail: (id: string) => ['products', 'detail', id] as const,
};
