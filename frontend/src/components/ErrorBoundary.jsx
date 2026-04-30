import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    try {
      const payload = {
        message: error?.message || 'Unknown error',
        stack: error?.stack || '',
        componentStack: info?.componentStack || '',
        at: new Date().toISOString(),
      };
      localStorage.setItem('space-edu-last-crash', JSON.stringify(payload));
      console.error('[ErrorBoundary]', payload);
    } catch {
      // ignore logging/storage failures
    }
  }

  resetAndReload = () => {
    const keys = [
      'auth-storage',
      'uz-cosmos-storage',
      'gamification-storage',
      'uz-cosmos-learning-storage',
      'space-edu-arcade',
    ];
    for (const key of keys) localStorage.removeItem(key);
    window.location.assign('/');
  };

  reload = () => {
    window.location.reload();
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white gap-4">
        <div className="text-6xl">🚀</div>
        <h1 className="text-2xl font-bold">Houston, we have a problem</h1>
        <p className="text-white/40">Something crashed. Restart the mission.</p>
        <div className="flex items-center gap-2">
          <button
            className="px-6 py-2 bg-blue-600 rounded-lg font-semibold hover:bg-blue-500 transition-colors"
            onClick={this.reload}
          >
            Reload
          </button>
          <button
            className="px-4 py-2 bg-white/10 rounded-lg font-semibold hover:bg-white/15 transition-colors text-sm"
            onClick={this.resetAndReload}
          >
            Reset app data
          </button>
        </div>
        {import.meta.env.DEV && this.state.error?.message && (
          <p className="max-w-xl text-center text-xs text-red-300/80 px-4">
            {this.state.error.message}
          </p>
        )}
      </div>
    );
  }
}
