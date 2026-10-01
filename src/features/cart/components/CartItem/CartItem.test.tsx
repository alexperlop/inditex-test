import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { COPY, TEST_IDS } from '@/constants';
import { useCartStore } from '@/features/cart/store/useCartStore';
import { CartItem } from './index';
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
});

describe('CartItem', () => {
  it('renders product name, specs line and formatted price', () => {
    const item = makeCartItem({
      name: 'iPhone 15',
      color: {
        name: 'Negro',
        hexCode: '#000',
        imageUrl: 'https://x/black.webp',
      },
      storage: { capacity: '128 GB', price: 999 },
      unitPrice: 999,
    });
    render(<CartItem item={item} />);
    expect(screen.getByText('iPhone 15')).toBeInTheDocument();
    expect(screen.getByText('128 GB | NEGRO')).toBeInTheDocument();
    expect(screen.getByText(/999/)).toBeInTheDocument();
  });

  it('uses "brand name color" as image alt', () => {
    const item = makeCartItem({
      brand: 'Apple',
      name: 'iPhone',
      color: { ...makeCartItem().color, name: 'Rojo' },
    });
    render(<CartItem item={item} />);
    expect(screen.getByAltText('Apple iPhone Rojo')).toBeInTheDocument();
  });

  it('removes the item from the store when clicking Remove', async () => {
    const item = makeCartItem({ cartLineId: 'A::Negro::128' });
    useCartStore.setState({ items: [item] });
    const user = userEvent.setup();
    render(<CartItem item={item} />);

    await user.click(screen.getByTestId(TEST_IDS.REMOVE_ITEM));
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('exposes a descriptive aria-label on the remove button', () => {
    const item = makeCartItem({ brand: 'Samsung', name: 'Galaxy' });
    render(<CartItem item={item} />);
    expect(
      screen.getByRole('button', { name: COPY.cart.removeAria('Samsung', 'Galaxy') }),
    ).toBeInTheDocument();
  });
});
