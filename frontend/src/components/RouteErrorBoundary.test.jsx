/**
 * Second-pass finding, 22 Aug 2026.
 *
 * The only error boundary was the root one in `main.jsx`, which replaces the
 * whole application with a full-page crash screen. The audit found one way in
 * (the `/store` ReferenceError) and left a test saying so. There was a second,
 * quieter one: `SpaceLabView` loaded eight textures from `unpkg.com` and
 * `raw.githubusercontent.com` through `useLoader`, which throws when a load
 * fails — so a school network that blocks either host, or a GitHub rate limit,
 * took the entire site down rather than one screen.
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import RouteErrorBoundary from './RouteErrorBoundary';

function Boom() {
  throw new Error('texture host unreachable');
}

function Fine() {
  return <p>the page rendered</p>;
}

function Chrome({ children }) {
  const location = useLocation();
  return (
    <div>
      <nav>navigation</nav>
      <main>{children}</main>
      <footer>at {location.pathname}</footer>
    </div>
  );
}

function renderApp(initial = '/broken') {
  return render(
    <MemoryRouter initialEntries={[initial]}>
      <Chrome>
        <RouteErrorBoundary>
          <Routes>
            <Route path="/broken" element={<Boom />} />
            <Route path="/fine" element={<Fine />} />
          </Routes>
        </RouteErrorBoundary>
      </Chrome>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  // React logs the caught error; that is expected here.
  vi.spyOn(console, 'error').mockImplementation(() => {});
  localStorage.clear();
});

describe('a screen that throws', () => {
  it('does not take the rest of the page with it', () => {
    renderApp();
    expect(screen.getByText('navigation')).toBeInTheDocument();
    expect(screen.getByText(/at \/broken/)).toBeInTheDocument();
  });

  it('says so, in place of the screen', () => {
    renderApp();
    expect(screen.getByText(/this page could not load/i)).toBeInTheDocument();
    expect(screen.getByText(/the rest of the site still works/i)).toBeInTheDocument();
  });

  it('offers a way out', () => {
    renderApp();
    expect(screen.getByRole('button', { name: /go home/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('records what broke, and where', () => {
    renderApp();
    const crash = JSON.parse(localStorage.getItem('space-edu-last-crash'));
    expect(crash.message).toBe('texture host unreachable');
    expect(crash.route).toBe('/broken');
  });

  it('does not stay broken after navigating away', async () => {
    // Error boundaries do not reset themselves. Without a reset key, a student
    // who hit one broken page would see the error on every page afterwards.
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/broken']}>
        <Chrome>
          <RouteErrorBoundary>
            <Routes>
              <Route path="/broken" element={<Boom />} />
              <Route path="/fine" element={<Fine />} />
            </Routes>
          </RouteErrorBoundary>
        </Chrome>
      </MemoryRouter>,
    );
    expect(screen.getByText(/this page could not load/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /go home/i }));
    // '/' matches no route here, so the boundary should simply have cleared.
    expect(screen.queryByText(/this page could not load/i)).not.toBeInTheDocument();
  });

  it('a healthy screen is untouched', () => {
    renderApp('/fine');
    expect(screen.getByText('the page rendered')).toBeInTheDocument();
    expect(screen.queryByText(/this page could not load/i)).not.toBeInTheDocument();
  });
});

describe('the app wires it in', () => {
  it('App.jsx wraps its routes', async () => {
    const source = await import('@/App.jsx?raw').then((m) => m.default);
    expect(source).toMatch(/<RouteErrorBoundary>/);
    // Still inside the chrome, not around it — otherwise a crash takes the
    // navigation with it again.
    expect(source.indexOf('<main')).toBeLessThan(source.indexOf('<RouteErrorBoundary>'));
  });
});

describe('third-party textures', () => {
  it('SpaceLabView no longer throws its way out of a failed load', async () => {
    const source = await import('@/views/explore/SpaceLabView.jsx?raw').then((m) => m.default);
    // `useLoader` throws on error; the replacement returns null per texture.
    expect(source).not.toMatch(/useLoader\s*\(/);
    expect(source).toMatch(/useRemoteTextures/);
  });

  it('the loader hands back null rather than raising', async () => {
    const source = await import('@/hooks/useRemoteTextures.js?raw').then((m) => m.default);
    // Third argument to TextureLoader.load is onProgress, fourth is onError.
    expect(source).toMatch(/undefined,\s*\n\s*settle,/);
    expect(source).toMatch(/texture\?\.dispose\?\.\(\)/);
  });

  it('the hosts are named so nobody has to grep for them', async () => {
    const source = await import('@/views/explore/SpaceLabView.jsx?raw').then((m) => m.default);
    expect(source).toMatch(/is not an asset host/);
    expect(source).toMatch(/raw\.githubusercontent\.com/);
  });
});
