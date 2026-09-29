'use client';

import { useConfiguratorPrice } from '@/features/product-detail/state/ConfiguratorContext';
import { formatPrice } from '@/lib/format';
import styles from './Price.module.scss';

export function Price() {
  const currentPrice = useConfiguratorPrice();
  return (
    <p className={styles.price} data-testid="current-price" aria-live="polite">
      {formatPrice(currentPrice)}
    </p>
  );
}
