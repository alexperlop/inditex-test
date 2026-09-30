'use client';

import Link from 'next/link';
import { COPY, ROUTES, TEST_IDS } from '@/constants';
import { useCartCount } from '@/features/cart/hooks/useCart';
import styles from './CartNavButton.module.scss';

export function CartNavButton() {
  const count = useCartCount();
  return (
    <Link href={ROUTES.CART} className={styles.link} aria-label={COPY.nav.cartAria(count)}>
      <BagIcon className={styles.icon} aria-hidden="true" />
      <span className={styles.count} data-testid={TEST_IDS.CART_COUNT}>
        {count}
      </span>
    </Link>
  );
}

function BagIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.47059 0H3.76471V3.76471H0V16H12.2353V3.76471H8.47059V0ZM7.52941 4.70588V7.05882H8.47059V4.70588H11.2941V15.0588H0.941176V4.70588H3.76471V7.05882H4.70588V4.70588H7.52941ZM7.52941 3.76471V0.941176H4.70588V3.76471H7.52941Z"
        fill="currentColor"
      />
    </svg>
  );
}
