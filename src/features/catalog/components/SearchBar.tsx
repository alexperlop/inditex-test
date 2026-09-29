'use client';

import { useEffect, useId, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedValue } from '@/features/catalog/hooks/useDebouncedValue';
import styles from './SearchBar.module.scss';

export interface SearchBarProps {
  initialValue?: string;
}

export function SearchBar({ initialValue = '' }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get('search') ?? '';
  const [value, setValue] = useState(initialValue);
  const debounced = useDebouncedValue(value, 350);
  const inputId = useId();

  useEffect(() => {
    if (debounced === currentSearch) return;
    const params = new URLSearchParams(searchParams.toString());
    if (debounced) params.set('search', debounced);
    else params.delete('search');
    const qs = params.toString();
    router.replace(qs ? `/?${qs}` : '/', { scroll: false });
  }, [debounced, currentSearch, router, searchParams]);

  return (
    <div className={styles.wrapper}>
      <label htmlFor={inputId} className="visually-hidden">
        Buscar por nombre o marca
      </label>
      <input
        id={inputId}
        type="search"
        className={styles.input}
        placeholder="Buscar por nombre o marca…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoComplete="off"
        data-testid="search-input"
      />
    </div>
  );
}
