import { COPY } from '@/constants';
import type { ProductListItem } from '@/domain/product';
import { ProductCard } from '@/features/catalog/components/ProductCard';
import styles from './SimilarProducts.module.scss';

export function SimilarProducts({ items }: { items: ProductListItem[] }) {
  if (items.length === 0) return null;
  return (
    <section className={styles.section} aria-labelledby="similar-heading">
      <h2 id="similar-heading" className={styles.heading}>
        {COPY.productDetail.SIMILAR_HEADING}
      </h2>
      <div className={styles.scroller}>
        <ul className={styles.list}>
          {items.map((product) => (
            <li key={product.id} className={styles.item}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
