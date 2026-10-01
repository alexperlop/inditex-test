import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { type ReactNode } from 'react';
import { makeProductDetail } from '../../../../../tests/factories';

const getByIdMock = vi.fn();
vi.mock('@/services/products/productsService', () => ({
  productsService: {
    list: vi.fn(),
    getById: (...args: unknown[]) => getByIdMock(...args),
  },
}));

import { useProduct } from './index';

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return React.createElement(QueryClientProvider, { client }, children);
}

beforeEach(() => {
  getByIdMock.mockReset();
});

describe('useProduct', () => {
  it('fetches by id and returns the mapped product', async () => {
    const product = makeProductDetail({ id: 'ABC' });
    getByIdMock.mockResolvedValueOnce(product);

    const { result } = renderHook(() => useProduct('ABC'), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.id).toBe('ABC');
    expect(getByIdMock).toHaveBeenCalledWith('ABC', expect.anything());
  });

  it('surfaces isError when the service rejects', async () => {
    getByIdMock.mockRejectedValueOnce(new Error('nope'));
    const { result } = renderHook(() => useProduct('BAD'), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
