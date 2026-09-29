'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { COPY, PAGINATION, SEARCH } from '@/constants';
import { useProducts } from '@/features/catalog/hooks/useProducts';
import { withErrorBoundary } from '@/shared/hoc/withErrorBoundary';
import { LoadingMessage } from '@/shared/components/LoadingMessage';
import { QueryErrorRetry } from '@/shared/components/QueryErrorRetry';
import { SearchBar } from './SearchBar';
import { ResultCount } from './ResultCount';
import { ProductGrid } from './ProductGrid';
import styles from './CatalogView.module.scss';

export interface CatalogViewProps {
  initialSearch: string;
}

function CatalogViewImpl({ initialSearch }: CatalogViewProps) {
  const searchParams = useSearchParams();
  const search = searchParams.get(SEARCH.QUERY_PARAM) ?? '';
  const params = useMemo(
    () => ({ search, limit: PAGINATION.DEFAULT_LIMIT, offset: PAGINATION.DEFAULT_OFFSET }),
    [search],
  );
  const { data, isLoading, isError, refetch } = useProducts(params);

  return (
    <section className={styles.section} aria-labelledby="catalog-heading">
      <div className={styles.header}>
        <h1 id="catalog-heading" className={styles.title}>
          {COPY.catalog.HEADING}
        </h1>
        <SearchBar initialValue={initialSearch} />
        <ResultCount count={data?.length ?? 0} />
      </div>

      {isError && <QueryErrorRetry message={COPY.catalog.ERROR} onRetry={() => refetch()} />}

      {isLoading && !data ? (
        <LoadingMessage label={COPY.catalog.LOADING} />
      ) : (
        <ProductGrid products={data ?? []} />
      )}
    </section>
  );
}

export const CatalogView = withErrorBoundary(CatalogViewImpl);
