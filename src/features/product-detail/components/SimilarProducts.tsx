import type { ProductListItem } from '@/domain/product';
import { ProductCard } from '@/features/catalog/components/ProductCard';
import styles from './SimilarProducts.module.scss';

export default function SimilarProducts({ items }: { items: ProductListItem[] }) {
  if (items.length === 0) return null;
  return (
    <section className={styles.section} aria-labelledby="similar-heading">
      <h2 id="similar-heading" className={styles.heading}>
        Productos similares
      </h2>
      <ul className={styles.grid}>
        {items.slice(0, 4).map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
}
