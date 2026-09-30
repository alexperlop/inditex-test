import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { HTML_LANG, META } from '@/constants';
import { QueryProvider } from '@/providers/QueryProvider';
import { Navbar } from '@/shared/layout/Navbar';
import { SkipLink } from '@/shared/components/SkipLink';
import { CartNavButton } from '@/features/cart/components/CartNavButton';
import './globals.scss';

export const metadata: Metadata = {
  title: META.APP_TITLE,
  description: META.APP_DESCRIPTION,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={HTML_LANG}>
      <body>
        <SkipLink />
        <QueryProvider>
          <Navbar right={<CartNavButton />} />
          <main id="main" tabIndex={-1}>
            {children}
          </main>
        </QueryProvider>
      </body>
    </html>
  );
}
