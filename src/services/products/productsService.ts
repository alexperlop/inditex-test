import { adaptProductDetail, adaptProductList } from '@/adapters/product.adapter';
import type { ProductDetail, ProductListItem } from '@/domain/product';
import { getApiClient } from '@/services/http/axiosClient';
import type { ListProductsParams } from './productsService.types';

export const productsService = {
  async list(params?: ListProductsParams, signal?: AbortSignal): Promise<ProductListItem[]> {
    const { data } = await getApiClient().get('/products', { params, signal });
    return adaptProductList(data);
  },
  async getById(id: string, signal?: AbortSignal): Promise<ProductDetail> {
    const { data } = await getApiClient().get(`/products/${encodeURIComponent(id)}`, { signal });
    return adaptProductDetail(data);
  },
};
