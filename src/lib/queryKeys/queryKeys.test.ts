import { describe, it, expect } from 'vitest';
import { QUERY } from '@/constants';
import { PRODUCTS_LIST_STALE_TIME, PRODUCT_DETAIL_STALE_TIME, productKeys } from './index';

describe('productKeys', () => {
  it('all returns the base key', () => {
    expect(productKeys.all).toEqual([QUERY.KEYS.PRODUCTS]);
  });

  it('list returns a key tuple that includes the params', () => {
    const params = { search: 'sam', limit: 10, offset: 0 };
    expect(productKeys.list(params)).toEqual([QUERY.KEYS.PRODUCTS, QUERY.KEYS.LIST, params]);
  });

  it('detail returns a key tuple that includes the id', () => {
    expect(productKeys.detail('XYZ')).toEqual([QUERY.KEYS.PRODUCTS, QUERY.KEYS.DETAIL, 'XYZ']);
  });

  it('reexports stale times from constants', () => {
    expect(PRODUCTS_LIST_STALE_TIME).toBe(QUERY.PRODUCTS_LIST_STALE_TIME_MS);
    expect(PRODUCT_DETAIL_STALE_TIME).toBe(QUERY.PRODUCT_DETAIL_STALE_TIME_MS);
  });
});
