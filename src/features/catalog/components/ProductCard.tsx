import { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { ProductListItem } from '@/domain/product';
import { formatPrice } from '@/lib/format';
import styles from './ProductCard.module.scss';

export const ProductCard = memo(function ProductCard({ product }: { product: ProductListItem }) {
  return (
    <Link href={`/products/${encodeURIComponent(product.id)}`} className={styles.card}>
      <div className={styles.imageWrap}>
        <Image
          src={product.imageUrl}
          alt={`${product.brand} ${product.name}`}
          fill
          sizes="(max-width: 480px) 45vw, (max-width: 768px) 30vw, 22vw"
          className={styles.image}
        />
      </div>
      <div className={styles.info}>
        <p className={styles.brand}>{product.brand}</p>
        <p className={styles.name}>{product.name}</p>
        <p className={styles.price}>{formatPrice(product.basePrice)}</p>
      </div>
    </Link>
  );
});
