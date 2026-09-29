import { COPY, TEST_IDS } from '@/constants';
import type { ProductListItem } from '@/domain/product';
import { ProductCard } from './ProductCard';
import styles from './ProductGrid.module.scss';

export function ProductGrid({ products }: { products: ProductListItem[] }) {
  if (products.length === 0) {
    return (
      <p className={styles.empty} role="status">
        {COPY.catalog.EMPTY}
      </p>
    );
  }
  return (
    <ul className={styles.grid} data-testid={TEST_IDS.PRODUCT_GRID}>
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
