import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem, ColorOption, ProductDetail, StorageOption } from '@/domain/product';

interface CartState {
  items: CartItem[];
  addItem: (product: ProductDetail, color: ColorOption, storage: StorageOption) => void;
  removeItem: (cartLineId: string) => void;
  clear: () => void;
}

function makeCartLineId(productId: string, colorName: string, capacity: string): string {
  return `${productId}::${colorName}::${capacity}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product, color, storage) => {
        const cartLineId = makeCartLineId(product.id, color.name, storage.capacity);
        set((state) => {
          if (state.items.some((it) => it.cartLineId === cartLineId)) {
            return state;
          }
          const item: CartItem = {
            cartLineId,
            productId: product.id,
            name: product.name,
            brand: product.brand,
            color,
            storage,
            imageUrl: color.imageUrl,
            unitPrice: storage.price,
          };
          return { items: [...state.items, item] };
        });
      },
      removeItem: (cartLineId) => {
        set((state) => ({ items: state.items.filter((it) => it.cartLineId !== cartLineId) }));
      },
      clear: () => set({ items: [] }),
    }),
    {
      name: 'zara-cart-v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
