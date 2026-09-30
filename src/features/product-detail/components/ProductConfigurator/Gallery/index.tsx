'use client';

import Image from 'next/image';
import { COPY, IMAGE_SIZES } from '@/constants';
import {
  useConfiguratorProduct,
  useConfiguratorState,
} from '@/features/product-detail/state/ConfiguratorContext';
import styles from './Gallery.module.scss';

export function Gallery() {
  const product = useConfiguratorProduct();
  const state = useConfiguratorState();
  const image = state.color?.imageUrl ?? product.colorOptions[0]?.imageUrl;
  const altColor = state.color?.name ?? product.colorOptions[0]?.name ?? '';

  if (!image) {
    return (
      <div className={styles.placeholder} role="img" aria-label={COPY.productDetail.NO_IMAGE} />
    );
  }

  return (
    <div className={styles.wrapper}>
      <Image
        src={image}
        alt={`${product.brand} ${product.name} ${altColor}`.trim()}
        fill
        priority
        sizes={IMAGE_SIZES.GALLERY}
        className={styles.image}
      />
    </div>
  );
}
