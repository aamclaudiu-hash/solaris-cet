import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  /** Custom fallback UI shown when an error is caught. */
  fallback?: ReactNode;
  /**
   * Optional callback fired after the boundary resets its error state.
   * Use this to clear any external error state or refetch data.
   */
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  /** Incremented on every reset to remount children after recovery. */
  resetKey: number;
}

/**
 * ErrorBoundary — catches JavaScript errors anywhere in the child component
 * tree, logs them, and renders a fallback UI instead of crashing the page.
 *
 * Supports two recovery paths:
 * 1. **Try again** — resets the boundary's error state and remounts the child
 *    tree without a full-page reload.
 * 2. **Reload Page** — falls back to a hard refresh for unrecoverable errors.
 *
 * @example
 * ```tsx
 * <ErrorBoundary onReset={() => refetch()}>
 *   <MySection />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, resetKey: 0 };
    this.handleReset = this.handleReset.bind(this);
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
  }

  handleReset() {
    this.setState(prev => ({ hasError: false, error: undefined, resetKey: prev.resetKey + 1 }));
    this.props.onReset?.();
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="py-16 flex items-center justify-center text-white">
          <div className="text-center px-6">
            <h1 className="text-2xl font-bold mb-3">Something went wrong</h1>
            <p className="text-gray-400 mb-5 text-sm">
              {this.state.error?.message ?? 'An unexpected error occurred.'}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={this.handleReset}
                className="px-6 py-2 bg-solaris-gold/80 rounded-lg hover:bg-solaris-gold transition-colors text-black font-medium"
              >
                Try Again
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-cyan-500 rounded-lg hover:bg-cyan-400 transition-colors"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
