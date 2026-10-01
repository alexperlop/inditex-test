import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import React from 'react';
import { makeProductListItem } from '../../../../../tests/factories';

const listMock = vi.fn();

vi.mock('@/services/products/productsService', () => ({
  productsService: {
    list: (...args: unknown[]) => listMock(...args),
    getById: vi.fn(),
  },
}));

import { useProducts } from './index';

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return React.createElement(QueryClientProvider, { client }, children);
}

beforeEach(() => {
  listMock.mockReset();
});

describe('useProducts', () => {
  it('fetches products via productsService and exposes data', async () => {
    const products = [makeProductListItem({ id: 'A' }), makeProductListItem({ id: 'B' })];
    listMock.mockResolvedValueOnce(products);

    const { result } = renderHook(() => useProducts({ search: '', limit: 20, offset: 0 }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(products);
    expect(listMock).toHaveBeenCalledWith({ search: '', limit: 20, offset: 0 }, expect.anything());
  });

  it('exposes isError when the service fails', async () => {
    listMock.mockRejectedValueOnce(new Error('boom'));

    const { result } = renderHook(() => useProducts({ search: '' }), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.data).toBeUndefined();
  });
});
