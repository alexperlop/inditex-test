import { COPY } from '@/constants';

export default function Loading() {
  return (
    <div style={{ padding: 24 }} role="status" aria-live="polite">
      {COPY.common.LOADING}
    </div>
  );
}
