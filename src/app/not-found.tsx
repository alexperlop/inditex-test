import Link from 'next/link';
import { COPY, ROUTES } from '@/constants';

export default function NotFound() {
  return (
    <section style={{ padding: 24 }}>
      <h1>{COPY.common.NOT_FOUND_TITLE}</h1>
      <p>{COPY.common.NOT_FOUND_BODY}</p>
      <Link href={ROUTES.HOME}>{COPY.common.NOT_FOUND_LINK}</Link>
    </section>
  );
}
