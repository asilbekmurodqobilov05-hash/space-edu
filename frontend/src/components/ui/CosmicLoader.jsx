export default function CosmicLoader() {
  return (
    <div style={{ minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '2px solid rgba(167,139,250,0.12)',
          borderTopColor: '#a78bfa',
          animation: 'cosmic-spin 0.9s linear infinite',
        }} />
        <span style={{
          color: 'rgba(255,255,255,0.18)',
          fontSize: '11px',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          fontWeight: 700,
        }}>
          Loading
        </span>
      </div>
    </div>
  );
}
