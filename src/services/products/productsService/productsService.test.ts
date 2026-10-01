import { describe, it, expect, vi, beforeEach } from 'vitest';
import { API } from '@/constants';
import { makeProductDetail, makeProductListItem } from '../../../../tests/factories';

const getMock = vi.fn();
vi.mock('@/services/http/axiosClient', () => ({
  getApiClient: () => ({ get: getMock }),
  getServerApiClient: () => ({ get: getMock }),
  getApiErrorStatus: () => 502,
}));

const adaptListMock = vi.fn();
const adaptDetailMock = vi.fn();
vi.mock('@/adapters/productAdapter', () => ({
  adaptProductList: (raw: unknown) => adaptListMock(raw),
  adaptProductDetail: (raw: unknown) => adaptDetailMock(raw),
}));

import { productsService } from './index';

beforeEach(() => {
  getMock.mockReset();
  adaptListMock.mockReset();
  adaptDetailMock.mockReset();
});

describe('productsService', () => {
  describe('list', () => {
    it('calls the products endpoint with the given params and signal', async () => {
      const raw = [{ id: '1' }];
      const adapted = [makeProductListItem({ id: '1' })];
      getMock.mockResolvedValueOnce({ data: raw });
      adaptListMock.mockReturnValueOnce(adapted);

      const controller = new AbortController();
      const result = await productsService.list({ search: 'sam', limit: 10 }, controller.signal);

      expect(getMock).toHaveBeenCalledWith(API.ENDPOINTS.PRODUCTS, {
        params: { search: 'sam', limit: 10 },
        signal: controller.signal,
      });
      expect(adaptListMock).toHaveBeenCalledWith(raw);
      expect(result).toEqual(adapted);
    });

    it('works without params or signal', async () => {
      getMock.mockResolvedValueOnce({ data: [] });
      adaptListMock.mockReturnValueOnce([]);
      await expect(productsService.list()).resolves.toEqual([]);
      expect(getMock).toHaveBeenCalledWith(API.ENDPOINTS.PRODUCTS, {
        params: undefined,
        signal: undefined,
      });
    });

    it('propagates errors from the http client', async () => {
      getMock.mockRejectedValueOnce(new Error('500'));
      await expect(productsService.list()).rejects.toThrow('500');
    });
  });

  describe('getById', () => {
    it('calls the detail endpoint and adapts the response', async () => {
      const raw = { id: 'A' };
      const adapted = makeProductDetail({ id: 'A' });
      getMock.mockResolvedValueOnce({ data: raw });
      adaptDetailMock.mockReturnValueOnce(adapted);

      const result = await productsService.getById('A');
      expect(getMock).toHaveBeenCalledWith(API.ENDPOINTS.productById('A'), { signal: undefined });
      expect(result).toEqual(adapted);
    });

    it('url-encodes special characters in the id', async () => {
      getMock.mockResolvedValueOnce({ data: {} });
      adaptDetailMock.mockReturnValueOnce(makeProductDetail());
      await productsService.getById('a b/c');
      expect(getMock).toHaveBeenCalledWith('/products/a%20b%2Fc', { signal: undefined });
    });
  });
});
