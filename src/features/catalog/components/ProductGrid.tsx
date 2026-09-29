import type { ProductListItem } from '@/domain/product';
import { ProductCard } from './ProductCard';
import styles from './ProductGrid.module.scss';

export function ProductGrid({ products }: { products: ProductListItem[] }) {
  if (products.length === 0) {
    return (
      <p className={styles.empty} role="status">
        No hay resultados para tu búsqueda.
      </p>
    );
  }
  return (
    <ul className={styles.grid} data-testid="product-grid">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
