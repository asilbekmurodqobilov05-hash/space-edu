import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white gap-4">
        <div className="text-6xl">🚀</div>
        <h1 className="text-2xl font-bold">Houston, we have a problem</h1>
        <p className="text-white/40">Something crashed. Restart the mission.</p>
        <button
          className="px-6 py-2 bg-blue-600 rounded-lg font-semibold hover:bg-blue-500 transition-colors"
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
      </div>
    );
  }
}
