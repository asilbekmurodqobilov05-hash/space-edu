import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Star, Sun, Moon, Rocket, Globe, Flame, Eye, Trophy, X, Bell, BellRing, ChevronRight, Clock, MapPin, Info, Loader } from 'lucide-react';
import api from '@/lib/api';
import { useGamificationStore } from '@/store/useGamificationStore';
import { useTranslation } from '@/hooks/useTranslation';

const ICON_MAP = {
  launch:        Rocket,
  mission:       Globe,
  discovery:     Star,
  milestone:     Trophy,
  anniversary:   Calendar,
  observation:   Eye,
  meteor_shower: Flame,
  solar_eclipse: Sun,
  lunar_eclipse: Moon,
};

const COLOR_MAP = {
  launch:        'text-violet-400 bg-violet/10 border-violet/30',
  mission:       'text-neon-blue bg-neon-blue/10 border-neon-blue/30',
  discovery:     'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  milestone:     'text-green-400 bg-green-400/10 border-green-400/30',
  anniversary:   'text-pink-400 bg-pink-400/10 border-pink-400/30',
  observation:   'text-white/50 bg-white/5 border-white/10',
  meteor_shower: 'text-neon-blue bg-neon-blue/10 border-neon-blue/30',
  solar_eclipse: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  lunar_eclipse: 'text-red-400 bg-red-400/10 border-red-400/30',
};

function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!targetDate) return;
    const tick = () => {
      const dist = new Date(targetDate).getTime() - Date.now();
      if (dist < 0) return;
      setTimeLeft({
        days:    Math.floor(dist / 86400000),
        hours:   Math.floor((dist % 86400000) / 3600000),
        minutes: Math.floor((dist % 3600000) / 60000),
        seconds: Math.floor((dist % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return timeLeft;
}

export default function CalendarView() {
  const { t, language } = useTranslation();
  const { trackedEvents, trackEvent } = useGamificationStore();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const translateText = async (text, target) => {
      if (!text || target === 'ENG') return text;
      const langMap = { 'UZB': 'uz', 'RUS': 'ru' };
      const targetLang = langMap[target] || 'en';
      try {
        const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURI(text)}`);
        const data = await res.json();
        return data[0].map(x => x[0]).join('');
      } catch { return text; }
    };

    api.get('/events/')
      .then(async ({ data }) => {
        const list = Array.isArray(data) ? data : data.results || [];
        const today = new Date().toISOString().slice(0, 10);
        const upcoming = list
          .filter((e) => !e.is_historical && e.event_date >= today)
          .sort((a, b) => a.event_date.localeCompare(b.event_date));
        
        // Translate upcoming events
        const translated = await Promise.all(upcoming.map(async (e) => ({
          ...e,
          title: await translateText(e.title_en, language),
          description: await translateText(e.description_en, language),
          visibility: await translateText(e.visibility, language),
          facts: e.facts ? await Promise.all(e.facts.map(f => translateText(f, language))) : []
        })));

        setEvents(translated);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [language]);

  const nextEvent = events[0] || null;
  const timeLeft = useCountdown(nextEvent?.event_date);

  return (
    <div className="relative min-h-screen pt-32 pb-24 px-4 overflow-hidden">
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[140px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(0,229,255,0.03) 0%, transparent 70%)' }} />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1 initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
            className="text-[clamp(36px,6vw,56px)] font-[900] tracking-tight text-white mb-4">
            {t('calendar', 'title')} <span className="text-glow-blue text-neon-blue">{t('calendar', 'titleHighlight')}</span>
          </motion.h1>
          <p className="text-white/40 max-w-xl mx-auto text-[16px]">
            {t('calendar', 'subtitle')}
          </p>
        </div>

        {/* Countdown */}
        {nextEvent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 rounded-3xl mb-12 relative overflow-hidden bg-white/[0.02] border border-neon-blue/15"
            style={{ boxShadow: '0 0 60px rgba(0,229,255,0.05)' }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-neon-blue/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <p className="text-[11px] font-[800] tracking-[0.3em] uppercase text-neon-blue mb-2">{t('calendar', 'nextEvent')}</p>
                <h3 className="text-2xl font-[900] text-white mb-2">{nextEvent.title}</h3>
                <p className="text-white/40 text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(nextEvent.event_date).toLocaleDateString(language === 'UZB' ? 'uz-UZ' : language === 'RUS' ? 'ru-RU' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <div className="flex gap-3 text-center shrink-0">
                {[[t('calendar', 'days'), timeLeft.days], [t('calendar', 'hours'), timeLeft.hours], [t('calendar', 'min'), timeLeft.minutes], [t('calendar', 'sec'), timeLeft.seconds]].map(([label, val]) => (
                  <div key={label} className="bg-black/30 border border-white/5 rounded-2xl p-3 w-[72px]">
                    <div className="text-2xl font-[900] text-white font-mono tabular-nums">{String(val).padStart(2, '0')}</div>
                    <div className="text-[9px] font-[800] uppercase tracking-widest text-white/30 mt-1">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Event list */}
        <h2 className="text-xl font-[900] text-white mb-6 flex items-center gap-3">
          <Calendar className="w-5 h-5 text-violet-light" />
          {t('calendar', 'upcomingTitle')}
        </h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader className="w-8 h-8 text-violet-light animate-spin" />
            <p className="text-[10px] font-[800] uppercase tracking-widest text-white/20">{t('calendar', 'syncing')}</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/5 rounded-3xl">
            <p className="text-white/20 font-bold italic">{t('calendar', 'noEvents')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event, index) => {
              const Icon = ICON_MAP[event.event_type] || Star;
              const colorClass = COLOR_MAP[event.event_type] || COLOR_MAP.observation;
              const isTracked = trackedEvents.includes(event.id);

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.07 }}
                  onClick={() => setSelected(event)}
                  className="p-6 rounded-2xl cursor-pointer transition-all bg-white/[0.02] border border-white/5 hover:border-white/15 hover:bg-white/[0.04] group"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-5">
                      <div className={`p-3.5 rounded-xl border ${colorClass}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-[17px] font-[800] text-white mb-1 group-hover:text-neon-blue transition-colors">
                          {event.title}
                        </h3>
                        <p className="text-white/30 text-[12px] flex items-center gap-4 font-[600]">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(event.event_date).toLocaleDateString(language === 'UZB' ? 'uz-UZ' : language === 'RUS' ? 'ru-RU' : 'en-US', { month: 'short', day: 'numeric' })}
                          </span>
                          {event.visibility && (
                            <span className="flex items-center gap-1.5 hidden md:flex">
                              <MapPin className="w-3.5 h-3.5" />
                              {event.visibility.split(',')[0]}...
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end md:self-auto">
                       <button
                        onClick={(e) => { e.stopPropagation(); trackEvent(event.id); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-[800] uppercase tracking-wider transition-all ${
                          isTracked
                            ? 'bg-violet/10 text-violet-light border border-violet/20'
                            : 'bg-white/5 text-white/40 border border-white/5 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {isTracked ? <BellRing className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
                        {isTracked ? t('calendar', 'tracking') : t('calendar', 'track')}
                      </button>
                      <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-white/60 transition-colors" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              className="bg-[#08060f] border border-white/8 p-8 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setSelected(null)} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-xl transition-colors">
                <X className="w-5 h-5 text-white/40" />
              </button>

              {/* Header */}
              <div className="flex items-center gap-4 mb-8">
                {(() => {
                  const Icon = ICON_MAP[selected.event_type] || Star;
                  const colorClass = COLOR_MAP[selected.event_type] || COLOR_MAP.observation;
                   return (
                    <div className={`p-4 rounded-2xl border ${colorClass}`}>
                      <Icon className="w-7 h-7" />
                    </div>
                  );
                })()}
                <div>
                  <h2 className="text-2xl font-[900] text-white">{selected.title}</h2>
                  <p className="text-[11px] font-[800] uppercase tracking-widest text-white/30 mt-1">
                    {selected.event_type.replace(/_/g, ' ')}
                  </p>
                </div>
              </div>

              {/* Meta grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-violet-light shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-white/30 font-[700] uppercase tracking-wider mb-1">{t('calendar', 'date')}</p>
                    <p className="text-white text-sm font-[700]">
                      {new Date(selected.event_date).toLocaleDateString(language === 'UZB' ? 'uz-UZ' : language === 'RUS' ? 'ru-RU' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                {selected.event_time && (
                  <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl flex items-start gap-3">
                    <Clock className="w-5 h-5 text-neon-blue shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-white/30 font-[700] uppercase tracking-wider mb-1">{t('calendar', 'time')}</p>
                      <p className="text-white text-sm font-[700]">{selected.event_time}</p>
                    </div>
                  </div>
                )}
                {selected.visibility && (
                  <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl flex items-start gap-3 sm:col-span-2">
                    <MapPin className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-white/30 font-[700] uppercase tracking-wider mb-1">{t('calendar', 'visibility')}</p>
                      <p className="text-white text-sm font-[700]">{selected.visibility}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-4 h-4 text-white/30" />
                  <h3 className="text-sm font-[800] text-white uppercase tracking-wider">{t('calendar', 'aboutTitle')}</h3>
                </div>
                <p className="text-white/50 leading-relaxed text-[14px]">{selected.description}</p>
              </div>

              {/* Facts */}
              {selected.facts?.length > 0 && (
                <div className="p-6 rounded-2xl bg-violet/5 border border-violet/15">
                  <h3 className="text-[10px] font-[800] uppercase tracking-[0.2em] text-violet-light mb-4">{t('calendar', 'quickFacts')}</h3>
                  <ul className="space-y-3">
                    {selected.facts.map((fact, i) => (
                      <li key={i} className="flex items-start gap-3 text-white/50 text-[13px]">
                        <Star className="w-3.5 h-3.5 text-violet-light shrink-0 mt-0.5" />
                        {fact}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
