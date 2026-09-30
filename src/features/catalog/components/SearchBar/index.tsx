'use client';

import { useEffect, useId, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { COPY, ROUTES, SEARCH, TEST_IDS } from '@/constants';
import { useDebouncedValue } from '@/features/catalog/hooks/useDebouncedValue';
import styles from './SearchBar.module.scss';

export interface SearchBarProps {
  initialValue?: string;
}

export function SearchBar({ initialValue = '' }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get(SEARCH.QUERY_PARAM) ?? '';
  const [value, setValue] = useState(initialValue);
  const debounced = useDebouncedValue(value, SEARCH.DEBOUNCE_MS);
  const inputId = useId();

  useEffect(() => {
    if (debounced === currentSearch) return;
    const params = new URLSearchParams(searchParams.toString());
    if (debounced) params.set(SEARCH.QUERY_PARAM, debounced);
    else params.delete(SEARCH.QUERY_PARAM);
    const qs = params.toString();
    router.replace(qs ? `${ROUTES.HOME}?${qs}` : ROUTES.HOME, { scroll: false });
  }, [debounced, currentSearch, router, searchParams]);

  return (
    <div className={styles.wrapper}>
      <label htmlFor={inputId} className="visually-hidden">
        {COPY.catalog.SEARCH_LABEL}
      </label>
      <input
        id={inputId}
        type="search"
        className={styles.input}
        placeholder={COPY.catalog.SEARCH_PLACEHOLDER}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoComplete="off"
        data-testid={TEST_IDS.SEARCH_INPUT}
      />
    </div>
  );
}
