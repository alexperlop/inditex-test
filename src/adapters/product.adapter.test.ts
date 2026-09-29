import { describe, it, expect } from 'vitest';
import { adaptProductDetail, adaptProductList } from './product.adapter';

describe('adaptProductList', () => {
  it('maps DTO items and normalizes http→https on imageUrl', () => {
    const raw = [
      {
        id: 'SMG-S24U',
        brand: ' Samsung ',
        name: ' Galaxy S24 Ultra ',
        basePrice: 1329,
        imageUrl: 'http://prueba/img/1.webp',
      },
    ];

    const result = adaptProductList(raw);

    expect(result).toEqual([
      {
        id: 'SMG-S24U',
        brand: 'Samsung',
        name: 'Galaxy S24 Ultra',
        basePrice: 1329,
        imageUrl: 'https://prueba/img/1.webp',
      },
    ]);
  });

  it('throws if the API response has an invalid shape', () => {
    expect(() => adaptProductList([{ id: 1, brand: 'X' }])).toThrow();
  });
});

describe('adaptProductDetail', () => {
  const baseDto = {
    id: 'APL-I15PM',
    brand: 'Apple',
    name: 'iPhone 15 Pro Max',
    description: 'desc',
    basePrice: 1319,
    rating: 4.8,
    specs: {
      screen: '6.7"',
      resolution: '2796x1290',
      processor: 'A17 Pro',
      mainCamera: '48MP',
      selfieCamera: '12MP',
      battery: '4422 mAh',
      os: 'iOS 17',
      screenRefreshRate: '120 Hz',
    },
    colorOptions: [{ name: ' Black ', hexCode: '#000', imageUrl: 'http://a/b.webp' }],
    storageOptions: [{ capacity: '256 GB', price: 1319 }],
    similarProducts: [
      { id: 'X', brand: 'B', name: 'N', basePrice: 100, imageUrl: 'http://x/y.webp' },
    ],
  };

  it('normalizes image URLs and trims strings', () => {
    const detail = adaptProductDetail(baseDto);
    expect(detail.colorOptions[0]?.name).toBe('Black');
    expect(detail.colorOptions[0]?.imageUrl).toBe('https://a/b.webp');
    expect(detail.similarProducts[0]?.imageUrl).toBe('https://x/y.webp');
  });

  it('defaults similarProducts to empty array when missing', () => {
    const { similarProducts: _drop, ...rest } = baseDto;
    const detail = adaptProductDetail(rest);
    expect(detail.similarProducts).toEqual([]);
  });
});
