import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { COPY, ROUTES, TEST_IDS } from '@/constants';
import { useCartStore } from '@/features/cart/store/useCartStore';
import { CartNavButton } from './index';
import { makeCartItem } from '../../../../../tests/factories';

beforeEach(() => {
  useCartStore.setState({ items: [] });
  localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('CartNavButton', () => {
  it('links to the cart route', () => {
    render(<CartNavButton />);
    expect(screen.getByRole('link')).toHaveAttribute('href', ROUTES.CART);
  });

  it('reflects the number of items in the cart after hydration', async () => {
    render(<CartNavButton />);
    await act(async () => {
      useCartStore.setState({
        items: [makeCartItem({ cartLineId: '1' }), makeCartItem({ cartLineId: '2' })],
      });
    });
    expect(screen.getByTestId(TEST_IDS.CART_COUNT)).toHaveTextContent('2');
  });

  it('uses an aria-label that includes the current count', async () => {
    render(<CartNavButton />);
    await act(async () => {
      useCartStore.setState({ items: [makeCartItem({ cartLineId: '1' })] });
    });
    expect(screen.getByLabelText(COPY.nav.cartAria(1))).toBeInTheDocument();
  });
});
