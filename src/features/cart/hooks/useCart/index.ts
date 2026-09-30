'use client';

import { useSyncExternalStore } from 'react';
import { useCartStore } from '@/features/cart/store/useCartStore';

export function useCart() {
  return useCartStore((s) => s.items);
}

export function useCartActions() {
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const clear = useCartStore((s) => s.clear);
  return { addItem, removeItem, clear };
}

export function useCartTotal() {
  return useCartStore((s) => s.items.reduce((sum, it) => sum + it.unitPrice, 0));
}

const subscribeToHydration = (onChange: () => void) =>
  useCartStore.persist.onFinishHydration(onChange);
const getHydratedSnapshot = () => useCartStore.persist.hasHydrated();
const getHydratedServerSnapshot = () => false;

export function useHasHydrated(): boolean {
  return useSyncExternalStore(subscribeToHydration, getHydratedSnapshot, getHydratedServerSnapshot);
}

export function useCartCount(): number {
  const hydrated = useHasHydrated();
  const count = useCartStore((s) => s.items.length);
  return hydrated ? count : 0;
}
