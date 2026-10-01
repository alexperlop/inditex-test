import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { COPY, ROUTES, TEST_IDS } from '@/constants';
import { useCartStore } from '@/features/cart/store/useCartStore';
import { CartSummary } from './index';
import { makeCartItem } from '../../../../../tests/factories';

beforeEach(() => {
  useCartStore.setState({ items: [] });
});

describe('CartSummary', () => {
  it('shows a formatted zero total when the cart is empty', () => {
    render(<CartSummary />);
    expect(screen.getByTestId(TEST_IDS.SUMMARY_TOTAL)).toHaveTextContent(/0/);
  });

  it('sums all unitPrice values', () => {
    useCartStore.setState({
      items: [
        makeCartItem({ cartLineId: '1', unitPrice: 500 }),
        makeCartItem({ cartLineId: '2', unitPrice: 1000 }),
      ],
    });
    render(<CartSummary />);
    expect(screen.getByTestId(TEST_IDS.SUMMARY_TOTAL)).toHaveTextContent(/1\.500/);
  });

  it('renders a "continue shopping" link pointing to home', () => {
    render(<CartSummary />);
    expect(screen.getByRole('link', { name: COPY.cart.CONTINUE })).toHaveAttribute(
      'href',
      ROUTES.HOME,
    );
  });

  it('renders a pay button', () => {
    render(<CartSummary />);
    expect(screen.getByRole('button', { name: COPY.cart.PAY })).toBeInTheDocument();
  });
});
