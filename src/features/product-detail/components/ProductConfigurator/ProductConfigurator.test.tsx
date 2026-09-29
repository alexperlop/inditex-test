import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductConfigurator } from './index';
import { useCartStore } from '@/features/cart/store/useCartStore';
import type { ProductDetail } from '@/domain/product';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

const product: ProductDetail = {
  id: 'PRD-1',
  brand: 'Apple',
  name: 'iPhone 15',
  description: 'desc',
  basePrice: 999,
  rating: 4.5,
  specs: {
    screen: '',
    resolution: '',
    processor: '',
    mainCamera: '',
    selfieCamera: '',
    battery: '',
    os: '',
    screenRefreshRate: '',
  },
  colorOptions: [
    { name: 'Negro', hexCode: '#000', imageUrl: 'https://x/black.webp' },
    { name: 'Blanco', hexCode: '#fff', imageUrl: 'https://x/white.webp' },
  ],
  storageOptions: [
    { capacity: '128 GB', price: 999 },
    { capacity: '256 GB', price: 1099 },
  ],
  similarProducts: [],
};

function Setup() {
  return (
    <ProductConfigurator product={product}>
      <ProductConfigurator.Header />
      <ProductConfigurator.Price />
      <ProductConfigurator.StoragePicker />
      <ProductConfigurator.ColorPicker />
      <ProductConfigurator.AddToCart />
    </ProductConfigurator>
  );
}

beforeEach(() => {
  useCartStore.setState({ items: [] });
});

describe('ProductConfigurator (compound + provider)', () => {
  it('disables Add to cart until color + storage are chosen, then updates price', async () => {
    const user = userEvent.setup();
    render(<Setup />);

    const addBtn = screen.getByTestId('add-to-cart');
    expect(addBtn).toBeDisabled();

    await user.click(screen.getByTestId('storage-256 GB'));
    expect(screen.getByTestId('current-price')).toHaveTextContent('1.099');
    expect(addBtn).toBeDisabled();

    await user.click(screen.getByTestId('color-Negro'));
    expect(addBtn).toBeEnabled();
  });

  it('adds the configured product to the cart store on click', async () => {
    const user = userEvent.setup();
    render(<Setup />);
    await user.click(screen.getByTestId('storage-128 GB'));
    await user.click(screen.getByTestId('color-Blanco'));
    await user.click(screen.getByTestId('add-to-cart'));

    const items = useCartStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      productId: 'PRD-1',
      color: { name: 'Blanco' },
      storage: { capacity: '128 GB' },
      unitPrice: 999,
    });
  });
});
