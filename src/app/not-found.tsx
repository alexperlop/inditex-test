import Link from 'next/link';

export default function NotFound() {
  return (
    <section style={{ padding: 24 }}>
      <h1>Página no encontrada</h1>
      <p>El recurso que buscas no existe.</p>
      <Link href="/">Volver al inicio</Link>
    </section>
  );
}
