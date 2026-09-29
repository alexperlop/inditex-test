import type { Metadata } from 'next';
import { META } from '@/constants';
import { CartView } from '@/features/cart/components/CartView';

export const metadata: Metadata = {
  title: META.CART_TITLE,
};

export default function CartPage() {
  return <CartView />;
}
