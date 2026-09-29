'use client';

import Link from 'next/link';
import { useCart, useCartTotal } from '@/features/cart/hooks/useCart';
import { formatPrice } from '@/lib/format';
import styles from './CartSummary.module.scss';

export function CartSummary() {
  const items = useCart();
  const total = useCartTotal();
  return (
    <aside className={styles.summary} aria-label="Resumen del pedido">
      <div className={styles.row}>
        <span>Artículos</span>
        <span data-testid="summary-count">{items.length}</span>
      </div>
      <div className={`${styles.row} ${styles.total}`}>
        <span>Total</span>
        <span data-testid="summary-total">{formatPrice(total)}</span>
      </div>
      <Link href="/" className={styles.continue}>
        Continuar comprando
      </Link>
    </aside>
  );
}
