import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { COPY, ROUTES, TEST_IDS } from '@/constants';
import { useCartStore } from '@/features/cart/store/useCartStore';
import {
  makeProductDetail,
  makeColor,
  makeStorage,
  makeProductListItem,
} from '../../../../../tests/factories';

const getByIdMock = vi.fn();
vi.mock('@/services/products/productsService', () => ({
  productsService: {
    list: vi.fn(),
    getById: (...args: unknown[]) => getByIdMock(...args),
  },
}));

const pushMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock, replace: vi.fn(), back: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/products/1',
}));

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const { src, alt } = props as { src: string; alt: string };
    return <img src={src} alt={alt} />;
  },
}));

import { ProductDetailView } from './index';

function wrap(ui: ReactNode) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

beforeEach(() => {
  getByIdMock.mockReset();
  pushMock.mockReset();
  useCartStore.setState({ items: [] });
});

describe('ProductDetailView (integration)', () => {
  it('shows the loading state before the fetch resolves', () => {
    getByIdMock.mockImplementationOnce(() => new Promise(() => {}));
    wrap(<ProductDetailView productId="X" />);
    expect(screen.getByRole('status')).toHaveTextContent(COPY.productDetail.LOADING);
  });

  it('shows the error retry UI when the fetch fails', async () => {
    getByIdMock.mockRejectedValueOnce(new Error('nope'));
    wrap(<ProductDetailView productId="X" />);
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(COPY.productDetail.ERROR);
    expect(screen.getByRole('button', { name: COPY.common.RETRY })).toBeInTheDocument();
  });

  it('refetches when retry is clicked after an initial error', async () => {
    getByIdMock
      .mockRejectedValueOnce(new Error('boom'))
      .mockResolvedValueOnce(makeProductDetail({ id: 'OK', name: 'Recovered' }));
    const user = userEvent.setup();
    wrap(<ProductDetailView productId="OK" />);
    await screen.findByRole('alert');
    await user.click(screen.getByRole('button', { name: COPY.common.RETRY }));
    expect(await screen.findByRole('heading', { level: 1, name: 'Recovered' })).toBeInTheDocument();
  });

  it('renders the full detail (header, specs, breadcrumb, add-to-cart disabled)', async () => {
    getByIdMock.mockResolvedValueOnce(
      makeProductDetail({
        id: 'A',
        brand: 'Apple',
        name: 'iPhone',
        similarProducts: [makeProductListItem({ id: 'B', name: 'Pixel' })],
      }),
    );
    wrap(<ProductDetailView productId="A" />);
    expect(await screen.findByRole('heading', { level: 1, name: 'iPhone' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: COPY.productDetail.BACK })).toHaveAttribute(
      'href',
      ROUTES.HOME,
    );
    expect(screen.getByTestId(TEST_IDS.ADD_TO_CART)).toBeDisabled();
    expect(
      screen.getByRole('heading', { name: COPY.productDetail.SPECS_HEADING }),
    ).toBeInTheDocument();
  });

  it('completes a configure → add → navigate flow', async () => {
    getByIdMock.mockResolvedValueOnce(
      makeProductDetail({
        id: 'CFG',
        colorOptions: [makeColor({ name: 'Negro' })],
        storageOptions: [makeStorage({ capacity: '128 GB', price: 899 })],
      }),
    );
    const user = userEvent.setup();
    wrap(<ProductDetailView productId="CFG" />);
    await screen.findByTestId(TEST_IDS.ADD_TO_CART);
    await user.click(screen.getByTestId(`${TEST_IDS.STORAGE_PICKER_PREFIX}-128 GB`));
    await user.click(screen.getByTestId(`${TEST_IDS.COLOR_PICKER_PREFIX}-Negro`));
    await user.click(screen.getByTestId(TEST_IDS.ADD_TO_CART));

    expect(useCartStore.getState().items).toHaveLength(1);
    expect(pushMock).toHaveBeenCalledWith(ROUTES.CART);
  });
});
