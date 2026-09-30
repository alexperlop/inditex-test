import { QUERY } from '@/constants';
import type { ListProductsParams } from '@/services/products/productsService.types';

export const PRODUCTS_LIST_STALE_TIME = QUERY.PRODUCTS_LIST_STALE_TIME_MS;
export const PRODUCT_DETAIL_STALE_TIME = QUERY.PRODUCT_DETAIL_STALE_TIME_MS;

export const productKeys = {
  all: [QUERY.KEYS.PRODUCTS] as const,
  list: (params: ListProductsParams) => [QUERY.KEYS.PRODUCTS, QUERY.KEYS.LIST, params] as const,
  detail: (id: string) => [QUERY.KEYS.PRODUCTS, QUERY.KEYS.DETAIL, id] as const,
};
