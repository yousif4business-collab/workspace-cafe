import { Component, type ErrorInfo, type ReactNode } from 'react';

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Application rendering failed:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main role="alert" className="min-h-screen bg-[#12100F] text-white flex flex-col items-center justify-center gap-4 px-6 text-center">
          <h1 className="font-serif text-2xl font-bold">Something went wrong</h1>
          <p className="text-sm text-stone-400">The page could not render. Try again.</p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
            className="rounded-full bg-[#C85228] px-5 py-3 text-sm font-bold text-white hover:bg-[#d95d31]"
          >
            Try again
          </button>
        </main>
      );
    }

    return this.props.children;
  }
}
