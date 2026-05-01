import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Camera, Calendar, ExternalLink } from 'lucide-react';

const NASA_KEY = 'DEMO_KEY';

export default function NasaApod() {
  const [apod, setApod] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApod = async () => {
      try {
        const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}`);
        if (res.ok) {
          const data = await res.json();
          setApod(data);
        } else {
          throw new Error('API error');
        }
      } catch {
        setApod({
          title: 'The Carina Nebula',
          url: 'https://apod.nasa.gov/apod/image/2307/STScI-01_1024.png',
          explanation: 'A star-forming region captured by the James Webb Space Telescope, revealing hundreds of previously hidden young stars in the Carina Nebula.',
          date: new Date().toISOString().split('T')[0],
          media_type: 'image',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchApod();
  }, []);

  if (loading || !apod) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
        Loading NASA image of the day...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Image */}
      <div style={{ borderRadius: '16px', overflow: 'hidden', position: 'relative', aspectRatio: '16/9' }}>
        {apod.media_type === 'video' ? (
          <iframe
            src={apod.url}
            title={apod.title}
            style={{ width: '100%', height: '100%', border: 'none' }}
            allowFullScreen
          />
        ) : (
          <img
            src={apod.url}
            alt={apod.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '24px 20px 16px',
          background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
        }}>
          <div style={{ fontSize: '10px', color: '#a78bfa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Camera style={{ width: '12px', height: '12px' }} /> NASA Astronomy Picture of the Day
          </div>
          <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', margin: 0 }}>{apod.title}</h4>
        </div>
      </div>

      {/* Description */}
      <p style={{
        fontSize: '13px', lineHeight: 1.7, color: 'rgba(255,255,255,0.45)',
        display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>
        {apod.explanation}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
        <Calendar style={{ width: '12px', height: '12px' }} /> {apod.date}
      </div>
    </div>
  );
}
