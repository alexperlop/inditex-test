'use client';

import Link from 'next/link';
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
        <LoadingMessage label="Cargando carrito…" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Tu carrito está vacío</h1>
        <p className={styles.empty}>Aún no has añadido productos.</p>
        <Link href="/" className={styles.link}>
          Continuar comprando
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Carrito</h1>
      <div className={styles.grid}>
        <ul className={styles.list}>
          {items.map((item) => (
            <CartItem key={item.cartLineId} item={item} />
          ))}
        </ul>
        <CartSummary />
      </div>
    </div>
  );
}
