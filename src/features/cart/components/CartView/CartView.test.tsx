import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { COPY, ROUTES, TEST_IDS } from '@/constants';
import { useCartStore } from '@/features/cart/store/useCartStore';
import { CartView } from './index';
import { makeCartItem } from '../../../../../tests/factories';

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const { src, alt } = props as { src: string; alt: string };
    return <img src={src} alt={alt} />;
  },
}));

beforeEach(() => {
  useCartStore.setState({ items: [] });
  localStorage.clear();
});

describe('CartView (integration)', () => {
  it('renders the empty state and a continue-shopping link when the cart has no items', async () => {
    render(<CartView />);
    // CartView gates on hydration; after persist re-hydrates it will render the empty state.
    expect(await screen.findByText(COPY.cart.EMPTY_TITLE)).toBeInTheDocument();
    expect(screen.getByText(COPY.cart.EMPTY_HINT)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: COPY.cart.CONTINUE })).toHaveAttribute(
      'href',
      ROUTES.HOME,
    );
  });

  it('renders one CartItem per cart line and the summary when items exist', async () => {
    useCartStore.setState({
      items: [
        makeCartItem({ cartLineId: '1', unitPrice: 500, name: 'A' }),
        makeCartItem({ cartLineId: '2', unitPrice: 700, name: 'B' }),
      ],
    });
    render(<CartView />);

    const items = await screen.findAllByTestId(TEST_IDS.CART_ITEM);
    expect(items).toHaveLength(2);
    expect(
      screen.getByRole('heading', { name: COPY.cart.headingWithCount(2) }),
    ).toBeInTheDocument();
    expect(screen.getByTestId(TEST_IDS.SUMMARY_TOTAL)).toHaveTextContent(/1\.200/);
  });

  it('rerenders when a cart item is removed from the store', async () => {
    useCartStore.setState({
      items: [makeCartItem({ cartLineId: '1' }), makeCartItem({ cartLineId: '2' })],
    });
    render(<CartView />);
    expect(await screen.findAllByTestId(TEST_IDS.CART_ITEM)).toHaveLength(2);

    await act(async () => {
      useCartStore.setState({ items: [makeCartItem({ cartLineId: '2' })] });
    });
    expect(screen.getAllByTestId(TEST_IDS.CART_ITEM)).toHaveLength(1);
  });
});
