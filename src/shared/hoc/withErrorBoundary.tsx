'use client';

import { Component, type ComponentType, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  fallback: (error: Error, reset: () => void) => ReactNode;
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  override componentDidCatch(error: Error) {
    console.error('[error-boundary]', error);
  }

  reset = () => this.setState({ error: null });

  override render() {
    if (this.state.error) {
      return this.props.fallback(this.state.error, this.reset);
    }
    return this.props.children;
  }
}

export interface WithErrorBoundaryOptions {
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

const defaultFallback = (error: Error, reset: () => void) => (
  <div role="alert" style={{ padding: 24 }}>
    <p>Ha ocurrido un error: {error.message}</p>
    <button type="button" onClick={reset}>
      Reintentar
    </button>
  </div>
);

export function withErrorBoundary<P extends object>(
  Wrapped: ComponentType<P>,
  options: WithErrorBoundaryOptions = {},
): ComponentType<P> {
  const displayName = Wrapped.displayName || Wrapped.name || 'Component';
  const fallback = options.fallback ?? defaultFallback;

  function Wrapper(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Wrapped {...props} />
      </ErrorBoundary>
    );
  }

  Wrapper.displayName = `withErrorBoundary(${displayName})`;
  return Wrapper;
}
