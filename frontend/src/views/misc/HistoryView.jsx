import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Landmark, PlayCircle, Loader } from 'lucide-react';
import api from '@/lib/api';

const TYPE_COLORS = {
  launch:      'border-violet/30 text-violet-light bg-violet/10',
  mission:     'border-neon-blue/30 text-neon-blue bg-neon-blue/10',
  discovery:   'border-yellow-400/30 text-yellow-400 bg-yellow-400/10',
  milestone:   'border-green-400/30 text-green-400 bg-green-400/10',
  anniversary: 'border-pink-400/30 text-pink-400 bg-pink-400/10',
  observation: 'border-white/20 text-white/50 bg-white/5',
};

function EventCard({ event, index }) {
  const isEven = index % 2 === 0;
  const color = TYPE_COLORS[event.event_type] || TYPE_COLORS.milestone;
  const year = event.event_date?.slice(0, 4) || '';
  const isVideo = event.source_url?.includes('youtube') || event.source_url?.includes('youtu.be');

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay: 0.05 * (index % 4) }}
      className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}
    >
      {/* Visual side */}
      <div className="w-full md:w-1/2 relative group rounded-2xl overflow-hidden bg-white/[0.02] border border-white/5">
        <div className="aspect-video relative">
          {event.image_url ? (
            <img
              src={event.image_url}
              alt={event.title_en}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet/5 to-neon-blue/5">
              <Landmark className="w-16 h-16 text-white/10" />
            </div>
          )}
          {event.source_url && (
            <a
              href={event.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white"
            >
              <PlayCircle className="w-14 h-14 mb-2" />
              <span className="text-xs font-[800] uppercase tracking-widest">
                {isVideo ? 'Watch Video' : 'Learn More'}
              </span>
            </a>
          )}
        </div>
      </div>

      {/* Content side */}
      <div className="w-full md:w-1/2 space-y-4">
        <div className={`inline-flex px-4 py-1.5 rounded-full border text-[11px] font-[800] uppercase tracking-widest ${color}`}>
          {year}
        </div>
        <h3 className="text-2xl md:text-3xl font-[900] text-white tracking-tight">{event.title_en}</h3>
        <p className="text-white/50 leading-relaxed text-[15px]">{event.description_en}</p>
      </div>
    </motion.div>
  );
}

export default function HistoryView() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/events/?historical=true')
      .then(({ data }) => {
        const list = Array.isArray(data) ? data : data.results || [];
        setEvents(list.sort((a, b) => a.event_date.localeCompare(b.event_date)));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="relative min-h-screen pt-32 pb-24 px-4 overflow-hidden">
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[140px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%)' }} />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            className="w-20 h-20 rounded-3xl bg-violet/10 border border-violet/20 flex items-center justify-center mx-auto mb-8"
            style={{ boxShadow: '0 0 40px rgba(139,92,246,0.15)' }}
          >
            <Landmark className="w-10 h-10 text-violet" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[clamp(36px,6vw,56px)] font-[900] tracking-tight mb-4 text-white"
          >
            Space <span className="text-glow-purple text-violet">History</span>
          </motion.h1>
          <p className="text-white/40 text-lg max-w-2xl mx-auto">
            Monumental milestones in human space exploration — from ancient observatories to the modern space age.
          </p>
        </div>

        {/* Events */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader className="w-8 h-8 text-violet-light animate-spin" />
            <p className="text-[10px] font-[800] uppercase tracking-widest text-white/20">Loading timeline...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/5 rounded-3xl">
            <p className="text-white/20 font-bold italic">No historical events yet. Add them via admin panel.</p>
          </div>
        ) : (
          <div className="space-y-20">
            {events.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
