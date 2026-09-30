'use client';

import Link from 'next/link';
import { COPY, ROUTES, TEST_IDS } from '@/constants';
import { useCartTotal } from '@/features/cart/hooks/useCart';
import { formatPrice } from '@/lib/format';
import styles from './CartSummary.module.scss';

export function CartSummary() {
  const total = useCartTotal();
  return (
    <div className={styles.footer} aria-label={COPY.cart.SUMMARY_ARIA}>
      <span className={styles.totalLabel}>{COPY.cart.TOTAL_LABEL}</span>
      <span className={styles.totalAmount} data-testid={TEST_IDS.SUMMARY_TOTAL}>
        {formatPrice(total)}
      </span>
      <Link href={ROUTES.HOME} className={styles.continue}>
        {COPY.cart.CONTINUE}
      </Link>
      <button type="button" className={styles.pay}>
        {COPY.cart.PAY}
      </button>
    </div>
  );
}
