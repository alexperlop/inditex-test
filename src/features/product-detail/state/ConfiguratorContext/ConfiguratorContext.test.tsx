import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, act, render } from '@testing-library/react';
import type { ReactNode } from 'react';
import { COPY } from '@/constants';
import { makeProductDetail, makeColor, makeStorage } from '../../../../../tests/factories';
import {
  ConfiguratorProvider,
  useConfiguratorActions,
  useConfiguratorPrice,
  useConfiguratorProduct,
  useConfiguratorSelection,
  useConfiguratorState,
} from './index';

const product = makeProductDetail({ basePrice: 1000 });

function wrapper({ children }: { children: ReactNode }) {
  return <ConfiguratorProvider product={product}>{children}</ConfiguratorProvider>;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('ConfiguratorContext', () => {
  it('useConfiguratorProduct exposes the product', () => {
    const { result } = renderHook(() => useConfiguratorProduct(), { wrapper });
    expect(result.current.id).toBe(product.id);
  });

  it('useConfiguratorPrice returns basePrice when no storage is set', () => {
    const { result } = renderHook(() => useConfiguratorPrice(), { wrapper });
    expect(result.current).toBe(1000);
  });

  it('setColor and setStorage update derived state and selection', () => {
    const { result } = renderHook(
      () => ({
        state: useConfiguratorState(),
        price: useConfiguratorPrice(),
        selection: useConfiguratorSelection(),
        actions: useConfiguratorActions(),
      }),
      { wrapper },
    );

    const color = makeColor({ name: 'Rojo' });
    const storage = makeStorage({ capacity: '512 GB', price: 1299 });

    act(() => result.current.actions.setColor(color));
    expect(result.current.state.color?.name).toBe('Rojo');
    expect(result.current.selection).toBeNull();

    act(() => result.current.actions.setStorage(storage));
    expect(result.current.price).toBe(1299);
    expect(result.current.selection).toEqual({ color, storage });
  });

  it('honors initialColor and initialStorage', () => {
    const color = makeColor({ name: 'Verde' });
    const storage = makeStorage({ capacity: '1 TB', price: 1899 });
    function W({ children }: { children: ReactNode }) {
      return (
        <ConfiguratorProvider product={product} initialColor={color} initialStorage={storage}>
          {children}
        </ConfiguratorProvider>
      );
    }
    const { result } = renderHook(() => useConfiguratorSelection(), { wrapper: W });
    expect(result.current).toEqual({ color, storage });
  });

  it('throws when hooks are used outside the provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    function Boom() {
      useConfiguratorProduct();
      return null;
    }
    expect(() => render(<Boom />)).toThrow(COPY.productDetail.configuratorProviderError);
    spy.mockRestore();
  });
});
