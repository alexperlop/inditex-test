import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { QueryProvider } from '@/providers/QueryProvider';
import { Navbar } from '@/shared/layout/Navbar';
import { CartNavButton } from '@/features/cart/components/CartNavButton';
import './globals.scss';

export const metadata: Metadata = {
  title: 'Mobile Store · Zara Challenge',
  description: 'Catálogo de teléfonos móviles con configurador y carrito.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <QueryProvider>
          <Navbar right={<CartNavButton />} />
          <main id="main">{children}</main>
        </QueryProvider>
      </body>
    </html>
  );
}
