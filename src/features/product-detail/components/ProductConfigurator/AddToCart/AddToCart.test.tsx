import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ROUTES, TEST_IDS } from '@/constants';
import { ConfiguratorProvider } from '@/features/product-detail/state/ConfiguratorContext';
import { useCartStore } from '@/features/cart/store/useCartStore';
import { AddToCart } from './index';
import { ColorPicker } from '../ColorPicker';
import { StoragePicker } from '../StoragePicker';
import { makeProductDetail } from '../../../../../../tests/factories';

const pushMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock, replace: vi.fn(), back: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/products/1',
}));

beforeEach(() => {
  useCartStore.setState({ items: [] });
  pushMock.mockReset();
});

describe('AddToCart', () => {
  it('is disabled until both color and storage are chosen', async () => {
    const product = makeProductDetail();
    const user = userEvent.setup();
    render(
      <ConfiguratorProvider product={product}>
        <StoragePicker />
        <ColorPicker />
        <AddToCart />
      </ConfiguratorProvider>,
    );
    expect(screen.getByTestId(TEST_IDS.ADD_TO_CART)).toBeDisabled();

    await user.click(screen.getByTestId(`${TEST_IDS.STORAGE_PICKER_PREFIX}-128 GB`));
    expect(screen.getByTestId(TEST_IDS.ADD_TO_CART)).toBeDisabled();

    await user.click(screen.getByTestId(`${TEST_IDS.COLOR_PICKER_PREFIX}-Negro`));
    expect(screen.getByTestId(TEST_IDS.ADD_TO_CART)).toBeEnabled();
  });

  it('adds the item to the cart and navigates to /cart when clicked', async () => {
    const product = makeProductDetail({ id: 'XYZ' });
    const user = userEvent.setup();
    render(
      <ConfiguratorProvider product={product}>
        <StoragePicker />
        <ColorPicker />
        <AddToCart />
      </ConfiguratorProvider>,
    );
    await user.click(screen.getByTestId(`${TEST_IDS.STORAGE_PICKER_PREFIX}-128 GB`));
    await user.click(screen.getByTestId(`${TEST_IDS.COLOR_PICKER_PREFIX}-Negro`));
    await user.click(screen.getByTestId(TEST_IDS.ADD_TO_CART));

    const items = useCartStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ productId: 'XYZ', storage: { capacity: '128 GB' } });
    expect(pushMock).toHaveBeenCalledWith(ROUTES.CART);
  });

  it('does not duplicate when the same color+storage is added twice', async () => {
    const product = makeProductDetail({ id: 'DUP' });
    const user = userEvent.setup();
    const { rerender } = render(
      <ConfiguratorProvider product={product}>
        <StoragePicker />
        <ColorPicker />
        <AddToCart />
      </ConfiguratorProvider>,
    );
    await user.click(screen.getByTestId(`${TEST_IDS.STORAGE_PICKER_PREFIX}-128 GB`));
    await user.click(screen.getByTestId(`${TEST_IDS.COLOR_PICKER_PREFIX}-Negro`));
    await user.click(screen.getByTestId(TEST_IDS.ADD_TO_CART));
    rerender(
      <ConfiguratorProvider product={product}>
        <StoragePicker />
        <ColorPicker />
        <AddToCart />
      </ConfiguratorProvider>,
    );
    await user.click(screen.getByTestId(`${TEST_IDS.STORAGE_PICKER_PREFIX}-128 GB`));
    await user.click(screen.getByTestId(`${TEST_IDS.COLOR_PICKER_PREFIX}-Negro`));
    await user.click(screen.getByTestId(TEST_IDS.ADD_TO_CART));

    expect(useCartStore.getState().items).toHaveLength(1);
  });
});
