import type { HTMLAttributes, ReactNode } from 'react';
import styles from './PageContainer.module.scss';

interface PageContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function PageContainer({ className, children, ...rest }: PageContainerProps) {
  const classes = className ? `${styles.container} ${className}` : styles.container;
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}
