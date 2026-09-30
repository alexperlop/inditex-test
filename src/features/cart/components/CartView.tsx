'use client';

import Link from 'next/link';
import { COPY, ROUTES } from '@/constants';
import { useCart, useHasHydrated } from '@/features/cart/hooks/useCart';
import { LoadingMessage } from '@/shared/components/LoadingMessage';
import { CartItem } from './CartItem';
import { CartSummary } from './CartSummary';
import styles from './CartView.module.scss';

export function CartView() {
  const hydrated = useHasHydrated();
  const items = useCart();

  if (!hydrated) {
    return (
      <div className={styles.wrapper}>
        <LoadingMessage label={COPY.cart.LOADING} />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={styles.wrapper}>
        <h1 className={styles.title}>{COPY.cart.EMPTY_TITLE}</h1>
        <p className={styles.empty}>{COPY.cart.EMPTY_HINT}</p>
        <Link href={ROUTES.HOME} className={styles.link}>
          {COPY.cart.CONTINUE}
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>{COPY.cart.headingWithCount(items.length)}</h1>
      <ul className={styles.list}>
        {items.map((item) => (
          <CartItem key={item.cartLineId} item={item} />
        ))}
      </ul>
      <CartSummary />
    </div>
  );
}
