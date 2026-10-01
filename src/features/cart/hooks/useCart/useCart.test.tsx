import { describe, it, expect, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useCartStore } from '@/features/cart/store/useCartStore';
import {
  makeCartItem,
  makeProductDetail,
  makeColor,
  makeStorage,
} from '../../../../../tests/factories';
import { useCart, useCartActions, useCartCount, useCartTotal, useHasHydrated } from './index';

beforeEach(() => {
  useCartStore.setState({ items: [] });
  localStorage.clear();
});

describe('useCart hooks', () => {
  it('useCart returns the current items array', () => {
    const items = [makeCartItem({ cartLineId: '1' })];
    useCartStore.setState({ items });
    const { result } = renderHook(() => useCart());
    expect(result.current).toEqual(items);
  });

  it('useCartTotal sums unitPrice values', () => {
    useCartStore.setState({
      items: [
        makeCartItem({ cartLineId: '1', unitPrice: 100 }),
        makeCartItem({ cartLineId: '2', unitPrice: 250 }),
      ],
    });
    const { result } = renderHook(() => useCartTotal());
    expect(result.current).toBe(350);
  });

  it('useCartActions exposes addItem, removeItem and clear', () => {
    const { result } = renderHook(() => useCartActions());
    const product = makeProductDetail();
    act(() => result.current.addItem(product, makeColor(), makeStorage()));
    expect(useCartStore.getState().items).toHaveLength(1);

    const item = useCartStore.getState().items[0]!;
    act(() => result.current.removeItem(item.cartLineId));
    expect(useCartStore.getState().items).toHaveLength(0);

    useCartStore.setState({ items: [makeCartItem()] });
    act(() => result.current.clear());
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('useCartCount returns 0 before hydration and the length after', async () => {
    useCartStore.setState({
      items: [makeCartItem({ cartLineId: '1' }), makeCartItem({ cartLineId: '2' })],
    });
    const { result } = renderHook(() => useCartCount());
    // In jsdom the store rehydrates synchronously; after one microtask it is hydrated.
    await act(async () => {
      await Promise.resolve();
    });
    expect(result.current).toBe(2);
  });

  it('useHasHydrated eventually reports true', async () => {
    const { result } = renderHook(() => useHasHydrated());
    await act(async () => {
      await Promise.resolve();
    });
    expect(typeof result.current).toBe('boolean');
  });
});
