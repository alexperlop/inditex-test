'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { COPY, ROUTES } from '@/constants';
import { useProduct } from '@/features/product-detail/hooks/useProduct';
import { withErrorBoundary } from '@/shared/hoc/withErrorBoundary';
import { LoadingMessage } from '@/shared/components/LoadingMessage';
import { QueryErrorRetry } from '@/shared/components/QueryErrorRetry';
import { ProductConfigurator } from './ProductConfigurator';
import { Specs } from './Specs';
import styles from './ProductDetailView.module.scss';

const SimilarProducts = dynamic(() => import('./SimilarProducts'), {
  loading: () => <SimilarSkeleton />,
});

function SimilarSkeleton() {
  return (
    <div className={styles.similarSkeleton} aria-hidden="true">
      <div />
      <div />
      <div />
      <div />
    </div>
  );
}

export interface ProductDetailViewProps {
  productId: string;
}

function ProductDetailViewImpl({ productId }: ProductDetailViewProps) {
  const { data, isLoading, isError, refetch } = useProduct(productId);

  if (isLoading && !data) {
    return (
      <div className={styles.wrapper}>
        <LoadingMessage label={COPY.productDetail.LOADING} />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className={styles.wrapper}>
        <QueryErrorRetry message={COPY.productDetail.ERROR} onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <nav className={styles.breadcrumbs} aria-label={COPY.productDetail.BREADCRUMBS_ARIA}>
        <Link href={ROUTES.HOME}>{COPY.productDetail.BACK}</Link>
      </nav>

      <ProductConfigurator product={data}>
        <div className={styles.grid}>
          <div className={styles.gallery}>
            <ProductConfigurator.Gallery />
          </div>
          <div className={styles.aside}>
            <ProductConfigurator.Header />
            <ProductConfigurator.Price />
            <ProductConfigurator.StoragePicker />
            <ProductConfigurator.ColorPicker />
            <ProductConfigurator.AddToCart />
          </div>
        </div>
      </ProductConfigurator>

      <Specs specs={data.specs} />

      <SimilarProducts items={data.similarProducts} />
    </div>
  );
}

export const ProductDetailView = withErrorBoundary(ProductDetailViewImpl);
