'use client';

import Image from 'next/image';
import { COPY, IMAGE_SIZES, TEST_IDS } from '@/constants';
import type { CartItem as CartItemType } from '@/domain/product';
import { useCartActions } from '@/features/cart/hooks/useCart';
import { formatPrice } from '@/lib/format';
import styles from './CartItem.module.scss';

export function CartItem({ item }: { item: CartItemType }) {
  const { removeItem } = useCartActions();
  return (
    <li className={styles.row} data-testid={TEST_IDS.CART_ITEM}>
      <div className={styles.imageWrap}>
        <Image
          src={item.imageUrl}
          alt={`${item.brand} ${item.name} ${item.color.name}`}
          fill
          sizes={IMAGE_SIZES.CART_ITEM}
          className={styles.image}
        />
      </div>
      <div className={styles.info}>
        <div className={styles.details}>
          <p className={styles.name}>{item.name}</p>
          <p className={styles.specs}>
            {item.storage.capacity} | {item.color.name.toUpperCase()}
          </p>
          <p className={styles.price}>{formatPrice(item.unitPrice)}</p>
        </div>
        <button
          type="button"
          className={styles.remove}
          onClick={() => removeItem(item.cartLineId)}
          aria-label={COPY.cart.removeAria(item.brand, item.name)}
          data-testid={TEST_IDS.REMOVE_ITEM}
        >
          {COPY.cart.REMOVE}
        </button>
      </div>
    </li>
  );
}
