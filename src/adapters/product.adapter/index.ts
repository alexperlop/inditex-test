import type { ProductDetail, ProductListItem } from '@/domain/product';
import {
  productDetailSchema,
  productListSchema,
  type ProductDetailDto,
  type ProductListItemDto,
} from '../product.schema';

function normalizeImageUrl(url: string): string {
  if (!url) return url;
  return url.replace(/^http:\/\//i, 'https://');
}

function mapListItem(dto: ProductListItemDto): ProductListItem {
  return {
    id: dto.id,
    brand: dto.brand.trim(),
    name: dto.name.trim(),
    basePrice: dto.basePrice,
    imageUrl: normalizeImageUrl(dto.imageUrl),
  };
}

function dedupeById<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((item) => (seen.has(item.id) ? false : seen.add(item.id) && true));
}

function mapDetail(dto: ProductDetailDto): ProductDetail {
  const brand = dto.brand.trim();
  const name = dto.name.trim();
  const description = dto.description.trim();
  return {
    id: dto.id,
    brand,
    name,
    description,
    basePrice: dto.basePrice,
    rating: dto.rating,
    specs: { brand, name, description, ...dto.specs },
    colorOptions: dto.colorOptions.map((c) => ({
      name: c.name.trim(),
      hexCode: c.hexCode,
      imageUrl: normalizeImageUrl(c.imageUrl),
    })),
    storageOptions: dto.storageOptions,
    similarProducts: dedupeById(dto.similarProducts.map(mapListItem)),
  };
}

export function adaptProductList(raw: unknown): ProductListItem[] {
  const parsed = productListSchema.parse(raw);
  return dedupeById(parsed.map(mapListItem));
}

export function adaptProductDetail(raw: unknown): ProductDetail {
  const parsed = productDetailSchema.parse(raw);
  return mapDetail(parsed);
}
