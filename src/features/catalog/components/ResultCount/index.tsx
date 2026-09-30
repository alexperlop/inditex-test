import { COPY, TEST_IDS } from '@/constants';
import styles from './ResultCount.module.scss';

export function ResultCount({ count }: { count: number }) {
  const label = count === 1 ? COPY.catalog.RESULT_ONE : COPY.catalog.resultMany(count);
  return (
    <p className={styles.text} aria-live="polite" data-testid={TEST_IDS.RESULT_COUNT}>
      {label}
    </p>
  );
}
