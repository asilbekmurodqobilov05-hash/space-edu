import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar as CalendarIcon, Star, Sun, Moon, Globe, Clock, MapPin, Info, Bell, BellRing, X, ChevronRight } from 'lucide-react';
import { spaceEvents, SpaceEvent } from '@/data/eventsData';
import { useGamificationStore } from '@/store/useGamificationStore';

const iconMap = {
  meteor: Star,
  solar_eclipse: Sun,
  lunar_eclipse: Moon,
  alignment: Globe
};

const colorMap = {
  meteor: 'text-neon-blue bg-neon-blue/10 border-neon-blue/30',
  solar_eclipse: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  lunar_eclipse: 'text-red-400 bg-red-400/10 border-red-400/30',
  alignment: 'text-neon-purple bg-neon-purple/10 border-neon-purple/30'
};

export default function CalendarView() {
  const { trackedEvents, trackEvent } = useGamificationStore();
  const [selectedEvent, setSelectedEvent] = useState<SpaceEvent | null>(null);
  const [nextEvent, setNextEvent] = useState<SpaceEvent | null>(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Find the next event
    const now = new Date();
    const upcoming = spaceEvents
      .filter(e => new Date(e.date) > now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    if (upcoming.length > 0) {
      setNextEvent(upcoming[0]);
    }
  }, []);

  useEffect(() => {
    if (!nextEvent) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const eventDate = new Date(nextEvent.date).getTime();
      const distance = eventDate - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [nextEvent]);

  const handleTrackEvent = (e: React.MouseEvent, eventId: string) => {
    e.stopPropagation();
    trackEvent(eventId);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          Space <span className="text-glow-blue text-neon-blue">Calendar</span>
        </motion.h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Track upcoming astronomical events, meteor showers, and eclipses. Never miss a moment in the cosmos.
        </p>
      </div>

      {/* Countdown Timer */}
      {nextEvent && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-8 rounded-3xl mb-12 relative overflow-hidden border-neon-blue/30"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-neon-blue/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-neon-blue font-bold tracking-wider uppercase text-sm mb-2">Next Major Event</h2>
              <h3 className="text-3xl font-bold text-white mb-2">{nextEvent.name}</h3>
              <p className="text-gray-400 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                {new Date(nextEvent.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>

            <div className="flex gap-4 text-center">
              {[
                { label: 'Days', value: timeLeft.days },
                { label: 'Hours', value: timeLeft.hours },
                { label: 'Minutes', value: timeLeft.minutes },
                { label: 'Seconds', value: timeLeft.seconds }
              ].map((time, idx) => (
                <div key={idx} className="bg-space-900/50 border border-white/10 rounded-xl p-3 w-20">
                  <div className="text-2xl font-bold text-white font-mono">{time.value.toString().padStart(2, '0')}</div>
                  <div className="text-xs text-gray-400 uppercase">{time.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Events List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <CalendarIcon className="w-6 h-6 text-neon-purple" />
          Upcoming Events 2026
        </h2>
        
        {spaceEvents.map((event, index) => {
          const Icon = iconMap[event.type];
          const colorClass = colorMap[event.type];
          const isTracked = trackedEvents.includes(event.id);

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedEvent(event)}
              className="glass p-6 rounded-2xl cursor-pointer hover:border-white/30 transition-all group relative overflow-hidden"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-xl border ${colorClass}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-neon-blue transition-colors">
                      {event.name}
                    </h3>
                    <p className="text-gray-400 text-sm flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" />
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {event.visibility.split(',')[0]}...
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                  <button
                    onClick={(e) => handleTrackEvent(e, event.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      isTracked 
                        ? 'bg-neon-purple/20 text-neon-purple border border-neon-purple/30' 
                        : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {isTracked ? <BellRing className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                    {isTracked ? 'Tracking' : 'Track'}
                  </button>
                  <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Event Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-space-900 border border-white/10 p-6 md:p-8 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedEvent(null)}
                className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className={`p-4 rounded-xl border ${colorMap[selectedEvent.type]}`}>
                  {(() => {
                    const Icon = iconMap[selectedEvent.type];
                    return <Icon className="w-8 h-8" />;
                  })()}
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">{selectedEvent.name}</h2>
                  <p className="text-neon-blue font-medium capitalize">{selectedEvent.type.replace('_', ' ')}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-start gap-3">
                  <CalendarIcon className="w-5 h-5 text-neon-purple shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Date</p>
                    <p className="text-white font-medium">
                      {new Date(selectedEvent.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-start gap-3">
                  <Clock className="w-5 h-5 text-neon-blue shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Time</p>
                    <p className="text-white font-medium">{selectedEvent.time}</p>
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-start gap-3 md:col-span-2">
                  <MapPin className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Visibility</p>
                    <p className="text-white font-medium">{selectedEvent.visibility}</p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <Info className="w-5 h-5 text-gray-400" /> About this event
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {selectedEvent.description}
                </p>
              </div>

              <div className="bg-gradient-to-br from-neon-purple/10 to-transparent p-6 rounded-2xl border border-neon-purple/20">
                <h3 className="text-sm uppercase tracking-wider text-neon-purple font-bold mb-4">Quick Facts</h3>
                <ul className="space-y-3">
                  {selectedEvent.facts.map((fact, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-300">
                      <Star className="w-4 h-4 text-neon-purple shrink-0 mt-1" />
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
