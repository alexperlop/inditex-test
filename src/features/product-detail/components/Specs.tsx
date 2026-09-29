import type { ProductSpecs } from '@/domain/product';
import styles from './Specs.module.scss';

const SPEC_ROWS: ReadonlyArray<[keyof ProductSpecs, string]> = [
  ['screen', 'Pantalla'],
  ['resolution', 'Resolución'],
  ['processor', 'Procesador'],
  ['mainCamera', 'Cámara principal'],
  ['selfieCamera', 'Cámara frontal'],
  ['battery', 'Batería'],
  ['os', 'Sistema operativo'],
  ['screenRefreshRate', 'Tasa de refresco'],
];

export function Specs({ specs, description }: { specs: ProductSpecs; description: string }) {
  return (
    <section className={styles.section} aria-labelledby="specs-heading">
      <h2 id="specs-heading" className={styles.heading}>
        Especificaciones
      </h2>
      <p className={styles.description}>{description}</p>
      <dl className={styles.list}>
        {SPEC_ROWS.map(([key, label]) => (
          <div key={key} className={styles.row}>
            <dt className={styles.label}>{label}</dt>
            <dd className={styles.value}>{specs[key]}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
