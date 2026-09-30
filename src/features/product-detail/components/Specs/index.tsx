import { COPY, SPEC_LABELS } from '@/constants';
import type { ProductSpecs } from '@/domain/product';
import styles from './Specs.module.scss';

export function Specs({ specs }: { specs: ProductSpecs }) {
  return (
    <section className={styles.section} aria-labelledby="specs-heading">
      <h2 id="specs-heading" className={styles.heading}>
        {COPY.productDetail.SPECS_HEADING}
      </h2>
      <dl className={styles.list}>
        {SPEC_LABELS.map(([key, label]) => (
          <div key={key} className={styles.row}>
            <dt className={styles.label}>{label}</dt>
            <dd className={styles.value}>{specs[key]}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
