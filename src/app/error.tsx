'use client';

import { useEffect } from 'react';
import { COPY } from '@/constants';

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
      <h1>{COPY.common.ERROR_HEADING}</h1>
      <p>{error.message || COPY.common.UNEXPECTED_ERROR}</p>
      <button type="button" onClick={reset}>
        {COPY.common.RETRY}
      </button>
    </section>
  );
}
