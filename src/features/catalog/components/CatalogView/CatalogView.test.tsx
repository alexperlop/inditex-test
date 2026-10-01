import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { COPY, SEARCH, TEST_IDS } from '@/constants';
import { makeProductListItem } from '../../../../../tests/factories';

const listMock = vi.fn();
const refetchSpy = vi.fn();

vi.mock('@/services/products/productsService', () => ({
  productsService: {
    list: (...args: unknown[]) => listMock(...args),
    getById: vi.fn(),
  },
}));

let currentSearch = '';
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn(), back: vi.fn() }),
  useSearchParams: () =>
    new URLSearchParams(currentSearch ? `${SEARCH.QUERY_PARAM}=${currentSearch}` : ''),
}));

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const { src, alt } = props as { src: string; alt: string };
    return <img src={src} alt={alt} />;
  },
}));

import { CatalogView } from './index';

function wrap(ui: ReactNode) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

beforeEach(() => {
  listMock.mockReset();
  refetchSpy.mockReset();
  currentSearch = '';
});

describe('CatalogView (integration)', () => {
  it('shows loading first, then the grid with products from the service', async () => {
    listMock.mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve([makeProductListItem({ id: 'P1', name: 'Pixel' })]), 10),
        ),
    );

    wrap(<CatalogView initialSearch="" />);

    expect(screen.getByRole('status')).toHaveTextContent(COPY.catalog.LOADING);
    expect(await screen.findByTestId(TEST_IDS.PRODUCT_GRID)).toBeInTheDocument();
    expect(screen.getByText('Pixel')).toBeInTheDocument();
    expect(screen.getByTestId(TEST_IDS.RESULT_COUNT)).toHaveTextContent(COPY.catalog.RESULT_ONE);
  });

  it('shows the empty state when the service returns 0 products', async () => {
    listMock.mockResolvedValueOnce([]);
    wrap(<CatalogView initialSearch="" />);
    expect(await screen.findByText(COPY.catalog.EMPTY)).toBeInTheDocument();
    expect(screen.getByTestId(TEST_IDS.RESULT_COUNT)).toHaveTextContent(COPY.catalog.resultMany(0));
  });

  it('shows the error alert with a retry button when the fetch fails', async () => {
    listMock.mockRejectedValueOnce(new Error('boom'));
    const user = userEvent.setup();
    wrap(<CatalogView initialSearch="" />);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(COPY.catalog.ERROR);

    listMock.mockResolvedValueOnce([makeProductListItem({ id: 'OK', name: 'Recovered' })]);
    await user.click(screen.getByRole('button', { name: COPY.common.RETRY }));
    expect(await screen.findByText('Recovered')).toBeInTheDocument();
  });
});
