import styles from './ResultCount.module.scss';

export function ResultCount({ count }: { count: number }) {
  const label = count === 1 ? '1 resultado' : `${count} resultados`;
  return (
    <p className={styles.text} aria-live="polite" data-testid="result-count">
      {label}
    </p>
  );
}
