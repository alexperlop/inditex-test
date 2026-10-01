import type {
  CartItem,
  ColorOption,
  ProductDetail,
  ProductListItem,
  ProductSpecs,
  StorageOption,
} from '@/domain/product';

export function makeColor(overrides: Partial<ColorOption> = {}): ColorOption {
  return {
    name: 'Negro',
    hexCode: '#000000',
    imageUrl: 'https://example.com/img-black.webp',
    ...overrides,
  };
}

export function makeStorage(overrides: Partial<StorageOption> = {}): StorageOption {
  return { capacity: '128 GB', price: 999, ...overrides };
}

export function makeSpecs(overrides: Partial<ProductSpecs> = {}): ProductSpecs {
  return {
    brand: 'Apple',
    name: 'iPhone 15',
    description: 'desc',
    screen: '6.1" OLED',
    resolution: '2556x1179',
    processor: 'A16 Bionic',
    mainCamera: '48 MP',
    selfieCamera: '12 MP',
    battery: '3349 mAh',
    os: 'iOS 17',
    screenRefreshRate: '60 Hz',
    ...overrides,
  };
}

export function makeProductListItem(overrides: Partial<ProductListItem> = {}): ProductListItem {
  return {
    id: 'PRD-1',
    brand: 'Apple',
    name: 'iPhone 15',
    basePrice: 999,
    imageUrl: 'https://example.com/img.webp',
    ...overrides,
  };
}

export function makeProductDetail(overrides: Partial<ProductDetail> = {}): ProductDetail {
  return {
    id: 'PRD-1',
    brand: 'Apple',
    name: 'iPhone 15',
    description: 'desc',
    basePrice: 999,
    rating: 4.5,
    specs: makeSpecs(),
    colorOptions: [
      makeColor({ name: 'Negro', hexCode: '#000', imageUrl: 'https://x/black.webp' }),
      makeColor({ name: 'Blanco', hexCode: '#fff', imageUrl: 'https://x/white.webp' }),
    ],
    storageOptions: [
      makeStorage({ capacity: '128 GB', price: 999 }),
      makeStorage({ capacity: '256 GB', price: 1099 }),
    ],
    similarProducts: [],
    ...overrides,
  };
}

export function makeCartItem(overrides: Partial<CartItem> = {}): CartItem {
  const color = makeColor();
  const storage = makeStorage();
  return {
    cartLineId: 'PRD-1::Negro::128 GB',
    productId: 'PRD-1',
    name: 'iPhone 15',
    brand: 'Apple',
    color,
    storage,
    imageUrl: color.imageUrl,
    unitPrice: storage.price,
    ...overrides,
  };
}
