'use client';

import { COPY } from '@/constants';
import styles from './QueryErrorRetry.module.scss';

interface QueryErrorRetryProps {
  message: string;
  onRetry: () => void;
}

export function QueryErrorRetry({ message, onRetry }: QueryErrorRetryProps) {
  return (
    <div role="alert" className={styles.wrapper}>
      <p>{message}</p>
      <button type="button" onClick={onRetry}>
        {COPY.common.RETRY}
      </button>
    </div>
  );
}
