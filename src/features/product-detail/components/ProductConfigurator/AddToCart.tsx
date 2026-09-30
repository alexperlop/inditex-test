'use client';

import { useId } from 'react';
import { useRouter } from 'next/navigation';
import { COPY, ROUTES, TEST_IDS } from '@/constants';
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
  const hintId = useId();
  const disabled = !selection;

  const handleAdd = () => {
    if (!selection) return;
    addItem(product, selection.color, selection.storage);
    router.push(ROUTES.CART);
  };

  return (
    <>
      <button
        type="button"
        className={styles.button}
        onClick={handleAdd}
        disabled={disabled}
        aria-describedby={disabled ? hintId : undefined}
        data-testid={TEST_IDS.ADD_TO_CART}
      >
        {COPY.productDetail.ADD_TO_CART}
      </button>
      <span id={hintId} className="visually-hidden">
        {COPY.productDetail.ADD_TO_CART_HINT}
      </span>
    </>
  );
}
