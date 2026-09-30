'use client';

import { useConfiguratorProduct } from '@/features/product-detail/state/ConfiguratorContext';
import styles from './Header.module.scss';

export function Header() {
  const product = useConfiguratorProduct();
  return (
    <div className={styles.wrapper}>
      <p className={styles.brand}>{product.brand.toUpperCase()}</p>
      <h1 className={styles.name}>{product.name}</h1>
    </div>
  );
}
