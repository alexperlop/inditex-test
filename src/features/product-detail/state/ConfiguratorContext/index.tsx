'use client';

import { createContext, useCallback, useContext, useMemo, useReducer, type ReactNode } from 'react';
import { CONFIGURATOR_ACTION, COPY } from '@/constants';
import type { ColorOption, ProductDetail, StorageOption } from '@/domain/product';
import {
  configuratorReducer,
  initialConfiguratorState,
  type ConfiguratorState,
} from '../configuratorReducer';

interface ConfiguratorStableContextValue {
  product: ProductDetail;
  setColor: (color: ColorOption) => void;
  setStorage: (storage: StorageOption) => void;
}

interface ConfiguratorStateContextValue {
  state: ConfiguratorState;
  currentPrice: number;
  selection: { color: ColorOption; storage: StorageOption } | null;
}

const ConfiguratorStableContext = createContext<ConfiguratorStableContextValue | null>(null);
const ConfiguratorStateContext = createContext<ConfiguratorStateContextValue | null>(null);

export interface ConfiguratorProviderProps {
  product: ProductDetail;
  initialColor?: ColorOption | null;
  initialStorage?: StorageOption | null;
  children: ReactNode;
}

export function ConfiguratorProvider({
  product,
  initialColor = null,
  initialStorage = null,
  children,
}: ConfiguratorProviderProps) {
  const [state, dispatch] = useReducer(configuratorReducer, {
    color: initialColor ?? initialConfiguratorState.color,
    storage: initialStorage ?? initialConfiguratorState.storage,
  });

  const setColor = useCallback(
    (color: ColorOption) => dispatch({ type: CONFIGURATOR_ACTION.SET_COLOR, color }),
    [],
  );
  const setStorage = useCallback(
    (storage: StorageOption) => dispatch({ type: CONFIGURATOR_ACTION.SET_STORAGE, storage }),
    [],
  );

  const stable = useMemo<ConfiguratorStableContextValue>(
    () => ({ product, setColor, setStorage }),
    [product, setColor, setStorage],
  );

  const derived = useMemo<ConfiguratorStateContextValue>(() => {
    const currentPrice = state.storage?.price ?? product.basePrice;
    const selection =
      state.color !== null && state.storage !== null
        ? { color: state.color, storage: state.storage }
        : null;
    return { state, currentPrice, selection };
  }, [state, product.basePrice]);

  return (
    <ConfiguratorStableContext.Provider value={stable}>
      <ConfiguratorStateContext.Provider value={derived}>
        {children}
      </ConfiguratorStateContext.Provider>
    </ConfiguratorStableContext.Provider>
  );
}

function useStable(): ConfiguratorStableContextValue {
  const ctx = useContext(ConfiguratorStableContext);
  if (!ctx) throw new Error(COPY.productDetail.configuratorProviderError);
  return ctx;
}

function useDerived(): ConfiguratorStateContextValue {
  const ctx = useContext(ConfiguratorStateContext);
  if (!ctx) throw new Error(COPY.productDetail.configuratorProviderError);
  return ctx;
}

export function useConfiguratorProduct(): ProductDetail {
  return useStable().product;
}

export function useConfiguratorActions() {
  const { setColor, setStorage } = useStable();
  return { setColor, setStorage };
}

export function useConfiguratorState(): ConfiguratorState {
  return useDerived().state;
}

export function useConfiguratorPrice(): number {
  return useDerived().currentPrice;
}

export function useConfiguratorSelection() {
  return useDerived().selection;
}
