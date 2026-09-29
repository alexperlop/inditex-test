import Link from 'next/link';
import type { ReactNode } from 'react';
import { COPY, ROUTES } from '@/constants';
import styles from './Navbar.module.scss';

export interface NavbarProps {
  right?: ReactNode;
}

export function Navbar({ right }: NavbarProps) {
  return (
    <header className={styles.header} role="banner">
      <nav className={styles.nav} aria-label={COPY.nav.PRIMARY_ARIA}>
        <Link href={ROUTES.HOME} className={styles.brand} aria-label={COPY.nav.HOME_ARIA}>
          <HomeIcon aria-hidden="true" />
          <span className={styles.brandText}>{COPY.nav.BRAND}</span>
        </Link>
        <div className={styles.right}>{right}</div>
      </nav>
    </header>
  );
}

function HomeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5 10v10h4v-6h6v6h4V10" />
    </svg>
  );
}
