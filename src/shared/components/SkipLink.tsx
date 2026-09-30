import { COPY } from '@/constants';
import styles from './SkipLink.module.scss';

export function SkipLink({ targetId = 'main' }: { targetId?: string }) {
  return (
    <a href={`#${targetId}`} className={styles.link}>
      {COPY.nav.SKIP_TO_CONTENT}
    </a>
  );
}
