import type { ProductDetail, ProductListItem } from '@/domain/product';
import {
  productDetailSchema,
  productListSchema,
  type ProductDetailDto,
  type ProductListItemDto,
} from './product.schema';

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

function mapDetail(dto: ProductDetailDto): ProductDetail {
  return {
    id: dto.id,
    brand: dto.brand.trim(),
    name: dto.name.trim(),
    description: dto.description.trim(),
    basePrice: dto.basePrice,
    rating: dto.rating,
    specs: dto.specs,
    colorOptions: dto.colorOptions.map((c) => ({
      name: c.name.trim(),
      hexCode: c.hexCode,
      imageUrl: normalizeImageUrl(c.imageUrl),
    })),
    storageOptions: dto.storageOptions,
    similarProducts: dto.similarProducts.map(mapListItem),
  };
}

export function adaptProductList(raw: unknown): ProductListItem[] {
  const parsed = productListSchema.parse(raw);
  return parsed.map(mapListItem);
}

export function adaptProductDetail(raw: unknown): ProductDetail {
  const parsed = productDetailSchema.parse(raw);
  return mapDetail(parsed);
}
