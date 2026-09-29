'use client';

import { useRouter } from 'next/navigation';
import {
  useConfiguratorProduct,
  useConfiguratorSelection,
} from '@/features/product-detail/state/ConfiguratorContext';
import { useCartActions } from '@/features/cart/hooks/useCart';
import styles from './AddToCart.module.scss';

export function AddToCart() {
  const product = useConfiguratorProduct();
  const selection = useConfiguratorSelection();
  const { addItem } = useCartActions();
  const router = useRouter();

  const handleAdd = () => {
    if (!selection) return;
    addItem(product, selection.color, selection.storage);
    router.push('/cart');
  };

  return (
    <button
      type="button"
      className={styles.button}
      onClick={handleAdd}
      disabled={!selection}
      data-testid="add-to-cart"
    >
      Añadir al carrito
    </button>
  );
}
