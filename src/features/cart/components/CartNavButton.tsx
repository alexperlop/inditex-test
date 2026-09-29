'use client';

import Link from 'next/link';
import { useCartCount } from '@/features/cart/hooks/useCart';
import styles from './CartNavButton.module.scss';

export function CartNavButton() {
  const count = useCartCount();
  return (
    <Link href="/cart" className={styles.link} aria-label={`Ir al carrito. ${count} artículos.`}>
      <BagIcon aria-hidden="true" />
      <span className={styles.count} data-testid="cart-count">
        {count}
      </span>
    </Link>
  );
}

function BagIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 7h12l-1 13H7L6 7Z" />
      <path d="M9 7a3 3 0 1 1 6 0" />
    </svg>
  );
}
