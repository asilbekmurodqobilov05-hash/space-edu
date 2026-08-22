import { Component } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * A boundary around one route, so a broken screen is a broken screen.
 *
 * The only boundary used to be the root one in `main.jsx`, which renders a
 * full-page crash screen. That meant any error anywhere took the whole site
 * down: the `/store` ReferenceError the audit found did exactly that, and it is
 * not the only way in. `SpaceLabView` fetches eight textures from `unpkg.com`
 * and `raw.githubusercontent.com` through `useLoader`, which throws when a load
 * fails — so a blocked network, a rate limit or an offline moment on a
 * third-party host was enough to replace the entire application with "Houston,
 * we have a problem".
 *
 * This keeps the navigation and the footer, and offers a way out of the one
 * page that broke.
 *
 * Error boundaries do not reset themselves, so without `resetKey` a student who
 * hit a broken page would keep seeing the error after navigating away. The key
 * is the pathname.
 */
class RouteErrorBoundaryInner extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidUpdate(prevProps) {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false, error: null });
    }
  }

  componentDidCatch(error, info) {
    try {
      // Same record the root boundary keeps, tagged with the route so a report
      // of "it broke" can be tied to a screen.
      localStorage.setItem('space-edu-last-crash', JSON.stringify({
        message: error?.message || 'Unknown error',
        stack: error?.stack || '',
        componentStack: info?.componentStack || '',
        route: this.props.resetKey,
        at: new Date().toISOString(),
      }));
    } catch {
      // private mode, or storage full
    }
    console.error('[RouteErrorBoundary]', this.props.resetKey, error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="text-5xl">🛰️</div>
        <h2 className="text-xl font-bold text-white">This page could not load</h2>
        <p className="max-w-md text-sm text-white/40">
          Something on this screen failed. The rest of the site still works.
        </p>
        <div className="flex items-center gap-2">
          <button
            className="px-5 py-2 rounded-xl bg-violet text-white text-sm font-bold hover:bg-violet-dark transition-colors"
            onClick={() => this.props.onGoHome()}
          >
            Go home
          </button>
          <button
            className="px-4 py-2 rounded-xl bg-white/10 text-white/70 text-sm font-semibold hover:bg-white/15 transition-colors"
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
        </div>
        {import.meta.env.DEV && this.state.error?.message && (
          <p className="max-w-xl text-xs text-red-300/80">{this.state.error.message}</p>
        )}
      </div>
    );
  }
}

export default function RouteErrorBoundary({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <RouteErrorBoundaryInner
      resetKey={location.pathname}
      onGoHome={() => navigate('/')}
    >
      {children}
    </RouteErrorBoundaryInner>
  );
}
