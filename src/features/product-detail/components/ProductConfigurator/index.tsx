'use client';

import type { ColorOption, ProductDetail, StorageOption } from '@/domain/product';
import { ConfiguratorProvider } from '@/features/product-detail/state/ConfiguratorContext';
import { Gallery } from './Gallery';
import { Header } from './Header';
import { ColorPicker } from './ColorPicker';
import { StoragePicker } from './StoragePicker';
import { Price } from './Price';
import { AddToCart } from './AddToCart';

export interface ProductConfiguratorProps {
  product: ProductDetail;
  initialColor?: ColorOption | null;
  initialStorage?: StorageOption | null;
  children: React.ReactNode;
}

export function ProductConfigurator({
  product,
  initialColor,
  initialStorage,
  children,
}: ProductConfiguratorProps) {
  return (
    <ConfiguratorProvider
      product={product}
      initialColor={initialColor ?? null}
      initialStorage={initialStorage ?? null}
    >
      {children}
    </ConfiguratorProvider>
  );
}

ProductConfigurator.Gallery = Gallery;
ProductConfigurator.Header = Header;
ProductConfigurator.ColorPicker = ColorPicker;
ProductConfigurator.StoragePicker = StoragePicker;
ProductConfigurator.Price = Price;
ProductConfigurator.AddToCart = AddToCart;
