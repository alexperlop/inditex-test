export function LoadingMessage({ label }: { label: string }) {
  return (
    <p role="status" aria-live="polite">
      {label}
    </p>
  );
}
