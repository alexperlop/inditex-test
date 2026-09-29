import { z } from 'zod';

export const productListItemSchema = z.object({
  id: z.string(),
  brand: z.string(),
  name: z.string(),
  basePrice: z.number(),
  imageUrl: z.string(),
});

export const productListSchema = z.array(productListItemSchema);

export const colorOptionSchema = z.object({
  name: z.string(),
  hexCode: z.string(),
  imageUrl: z.string(),
});

export const storageOptionSchema = z.object({
  capacity: z.string(),
  price: z.number(),
});

export const productSpecsSchema = z.object({
  screen: z.string(),
  resolution: z.string(),
  processor: z.string(),
  mainCamera: z.string(),
  selfieCamera: z.string(),
  battery: z.string(),
  os: z.string(),
  screenRefreshRate: z.string(),
});

export const productDetailSchema = z.object({
  id: z.string(),
  brand: z.string(),
  name: z.string(),
  description: z.string(),
  basePrice: z.number(),
  rating: z.number(),
  specs: productSpecsSchema,
  colorOptions: z.array(colorOptionSchema),
  storageOptions: z.array(storageOptionSchema),
  similarProducts: z.array(productListItemSchema).default([]),
});

export type ProductListItemDto = z.infer<typeof productListItemSchema>;
export type ProductDetailDto = z.infer<typeof productDetailSchema>;
