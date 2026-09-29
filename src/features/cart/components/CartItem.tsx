'use client';

import Image from 'next/image';
import type { CartItem as CartItemType } from '@/domain/product';
import { useCartActions } from '@/features/cart/hooks/useCart';
import { formatPrice } from '@/lib/format';
import styles from './CartItem.module.scss';

export function CartItem({ item }: { item: CartItemType }) {
  const { removeItem } = useCartActions();
  return (
    <li className={styles.row} data-testid="cart-item">
      <div className={styles.imageWrap}>
        <Image
          src={item.imageUrl}
          alt={`${item.brand} ${item.name} ${item.color.name}`}
          fill
          sizes="(max-width: 768px) 30vw, 120px"
          className={styles.image}
        />
      </div>
      <div className={styles.info}>
        <p className={styles.brand}>{item.brand}</p>
        <p className={styles.name}>{item.name}</p>
        <p className={styles.specs}>
          {item.color.name} · {item.storage.capacity}
        </p>
      </div>
      <p className={styles.price}>{formatPrice(item.unitPrice)}</p>
      <button
        type="button"
        className={styles.remove}
        onClick={() => removeItem(item.cartLineId)}
        aria-label={`Eliminar ${item.brand} ${item.name} del carrito`}
        data-testid="remove-item"
      >
        Eliminar
      </button>
    </li>
  );
}
