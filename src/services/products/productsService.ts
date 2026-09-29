import { adaptProductDetail, adaptProductList } from '@/adapters/product.adapter';
import { API } from '@/constants';
import type { ProductDetail, ProductListItem } from '@/domain/product';
import { getApiClient } from '@/services/http/axiosClient';
import type { ListProductsParams } from './productsService.types';

export const productsService = {
  async list(params?: ListProductsParams, signal?: AbortSignal): Promise<ProductListItem[]> {
    const { data } = await getApiClient().get(API.ENDPOINTS.PRODUCTS, { params, signal });
    return adaptProductList(data);
  },
  async getById(id: string, signal?: AbortSignal): Promise<ProductDetail> {
    const { data } = await getApiClient().get(API.ENDPOINTS.productById(id), { signal });
    return adaptProductDetail(data);
  },
};
