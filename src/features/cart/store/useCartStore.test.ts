import { beforeEach, describe, it, expect } from 'vitest';
import { useCartStore } from './useCartStore';
import type { ColorOption, ProductDetail, StorageOption } from '@/domain/product';

const color: ColorOption = { name: 'Negro', hexCode: '#000', imageUrl: 'https://x/y.webp' };
const storage: StorageOption = { capacity: '256 GB', price: 999 };
const otherStorage: StorageOption = { capacity: '512 GB', price: 1199 };

const product: ProductDetail = {
  id: 'PRD-1',
  brand: 'Samsung',
  name: 'Galaxy',
  description: '',
  basePrice: 999,
  rating: 4,
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
  colorOptions: [color],
  storageOptions: [storage, otherStorage],
  similarProducts: [],
};

beforeEach(() => {
  useCartStore.setState({ items: [] });
});

describe('useCartStore', () => {
  it('adds a new item and derives cartLineId from product+color+storage', () => {
    useCartStore.getState().addItem(product, color, storage);
    const items = useCartStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0]?.cartLineId).toBe('PRD-1::Negro::256 GB');
    expect(items[0]?.unitPrice).toBe(999);
  });

  it('does not add duplicates for the same (product, color, storage)', () => {
    useCartStore.getState().addItem(product, color, storage);
    useCartStore.getState().addItem(product, color, storage);
    expect(useCartStore.getState().items).toHaveLength(1);
  });

  it('treats different storages as separate lines', () => {
    useCartStore.getState().addItem(product, color, storage);
    useCartStore.getState().addItem(product, color, otherStorage);
    expect(useCartStore.getState().items).toHaveLength(2);
  });

  it('removes an item by cartLineId', () => {
    useCartStore.getState().addItem(product, color, storage);
    useCartStore.getState().removeItem('PRD-1::Negro::256 GB');
    expect(useCartStore.getState().items).toEqual([]);
  });

  it('clears all items', () => {
    useCartStore.getState().addItem(product, color, storage);
    useCartStore.getState().addItem(product, color, otherStorage);
    useCartStore.getState().clear();
    expect(useCartStore.getState().items).toEqual([]);
  });
});
