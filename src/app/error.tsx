'use client';

import { useEffect } from 'react';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section style={{ padding: 24 }} role="alert">
      <h1>Algo ha ido mal</h1>
      <p>{error.message || 'Error inesperado'}</p>
      <button type="button" onClick={reset}>
        Reintentar
      </button>
    </section>
  );
}
