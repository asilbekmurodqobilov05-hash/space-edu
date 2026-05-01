import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Rocket, Clock, MapPin, ExternalLink, AlertTriangle } from 'lucide-react';

export default function UpcomingLaunches() {
  const [launches, setLaunches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLaunches = async () => {
      try {
        const res = await fetch('https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=8&mode=list');
        if (res.ok) {
          const data = await res.json();
          setLaunches(data.results || []);
        } else {
          throw new Error('API limit');
        }
      } catch {
        // Fallback mock data
        setLaunches([
          { id: '1', name: 'Falcon 9 — Starlink Group 12-5', net: new Date(Date.now() + 86400000 * 2).toISOString(), pad: { location: { name: 'Cape Canaveral, FL' } }, launch_service_provider: { name: 'SpaceX' }, status: { abbrev: 'Go' } },
          { id: '2', name: 'Soyuz 2.1b — Progress MS-29', net: new Date(Date.now() + 86400000 * 5).toISOString(), pad: { location: { name: 'Baikonur Cosmodrome' } }, launch_service_provider: { name: 'Roscosmos' }, status: { abbrev: 'Go' } },
          { id: '3', name: 'PSLV-C60 — SPADEX', net: new Date(Date.now() + 86400000 * 7).toISOString(), pad: { location: { name: 'Satish Dhawan Space Centre' } }, launch_service_provider: { name: 'ISRO' }, status: { abbrev: 'TBD' } },
          { id: '4', name: 'Long March 5B — Wentian', net: new Date(Date.now() + 86400000 * 10).toISOString(), pad: { location: { name: 'Wenchang Space Launch Site' } }, launch_service_provider: { name: 'CASC' }, status: { abbrev: 'Go' } },
          { id: '5', name: 'Electron — NROL-199', net: new Date(Date.now() + 86400000 * 12).toISOString(), pad: { location: { name: 'Mahia Peninsula, NZ' } }, launch_service_provider: { name: 'Rocket Lab' }, status: { abbrev: 'TBC' } },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchLaunches();
  }, []);

  const getStatusColor = (abbrev) => {
    if (abbrev === 'Go') return '#4ade80';
    if (abbrev === 'TBC') return '#fbbf24';
    return '#94a3b8';
  };

  const formatCountdown = (dateStr) => {
    const diff = new Date(dateStr) - Date.now();
    if (diff < 0) return 'Launched';
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    if (d > 0) return `${d}d ${h}h`;
    const m = Math.floor((diff % 3600000) / 60000);
    return `${h}h ${m}m`;
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
        <div style={{ animation: 'pulse 1.5s infinite', fontSize: '14px' }}>Loading launches...</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {launches.map((launch, i) => {
        const status = launch.status?.abbrev || 'TBD';
        const statusColor = getStatusColor(status);
        const provider = launch.launch_service_provider?.name || 'Unknown';
        const location = launch.pad?.location?.name || 'Unknown';

        return (
          <motion.div
            key={launch.id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
            style={{
              padding: '16px 20px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              transition: 'all 0.25s ease',
              cursor: 'default',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
              e.currentTarget.style.borderColor = 'rgba(167,139,250,0.25)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
            }}
          >
            {/* Countdown badge */}
            <div style={{
              minWidth: '64px', textAlign: 'center',
              padding: '8px 10px', borderRadius: '12px',
              background: 'rgba(139,92,246,0.12)',
              border: '1px solid rgba(139,92,246,0.2)',
            }}>
              <Clock style={{ width: '14px', height: '14px', color: '#a78bfa', margin: '0 auto 4px' }} />
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#c4b5fd', letterSpacing: '-0.02em' }}>
                {formatCountdown(launch.net)}
              </div>
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {launch.name}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Rocket style={{ width: '11px', height: '11px' }} /> {provider}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin style={{ width: '11px', height: '11px' }} /> {location}
                </span>
              </div>
            </div>

            {/* Status */}
            <div style={{
              padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700,
              color: statusColor, background: `${statusColor}18`, border: `1px solid ${statusColor}30`,
              whiteSpace: 'nowrap',
            }}>
              {status}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
