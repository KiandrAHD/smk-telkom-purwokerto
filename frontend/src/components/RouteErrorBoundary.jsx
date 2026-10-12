import { Component } from 'react';
import { useLocation } from 'react-router-dom';
import ErrorPage from '../pages/ErrorPage';

class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Route rendering failed:', error, info);
  }

  componentDidUpdate(previousProps) {
    if (this.state.error && previousProps.locationKey !== this.props.locationKey) {
      this.setState({ error: null });
    }
  }

  render() {
    if (!this.state.error) return this.props.children;
    const isChunkError = /ChunkLoadError|Loading chunk|dynamically imported module|module script|Importing a module script/i.test(`${this.state.error.name} ${this.state.error.message}`);
    const kind = !navigator.onLine ? 'offline' : isChunkError ? 'chunk' : 'application';
    // Reload also replaces React.lazy's cached rejection and stale deployment chunks.
    return <ErrorPage kind={kind} onRetry={() => window.location.reload()} />;
  }
}

export default function RouteErrorBoundary({ children }) {
  const { pathname, search } = useLocation();
  return <ErrorBoundary locationKey={`${pathname}${search}`}>{children}</ErrorBoundary>;
}
