import type { Metadata } from 'next';
import { CartView } from '@/features/cart/components/CartView';

export const metadata: Metadata = {
  title: 'Carrito · Mobile Store',
};

export default function CartPage() {
  return <CartView />;
}
