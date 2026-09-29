'use client';

import Link from 'next/link';
import { COPY, ROUTES, TEST_IDS } from '@/constants';
import { useCart, useCartTotal } from '@/features/cart/hooks/useCart';
import { formatPrice } from '@/lib/format';
import styles from './CartSummary.module.scss';

export function CartSummary() {
  const items = useCart();
  const total = useCartTotal();
  return (
    <aside className={styles.summary} aria-label={COPY.cart.SUMMARY_ARIA}>
      <div className={styles.row}>
        <span>{COPY.cart.ITEMS_LABEL}</span>
        <span data-testid={TEST_IDS.SUMMARY_COUNT}>{items.length}</span>
      </div>
      <div className={`${styles.row} ${styles.total}`}>
        <span>{COPY.cart.TOTAL_LABEL}</span>
        <span data-testid={TEST_IDS.SUMMARY_TOTAL}>{formatPrice(total)}</span>
      </div>
      <Link href={ROUTES.HOME} className={styles.continue}>
        {COPY.cart.CONTINUE}
      </Link>
    </aside>
  );
}
