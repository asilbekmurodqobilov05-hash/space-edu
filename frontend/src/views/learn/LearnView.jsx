import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Atom, Mic, Lightbulb, Telescope, Target, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import GlassCard from '@/components/ui/GlassCard';
import { getFieldByLang } from '@/lib/utils';
import api from '@/lib/api';

function LevelCard({ level, index, language }) {
  return (
    <GlassCard className="flex flex-col h-full relative overflow-hidden group">
      <div className="flex items-center gap-4 mb-6">
        <div 
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ 
            background: `${level.color || '#a78bfa'}18`, 
            border: `1px solid ${level.color || '#a78bfa'}35`,
            boxShadow: `0 0 20px ${level.color || '#a78bfa'}20`
          }}
        >
          <span className="text-2xl">🚀</span>
        </div>
        <div>
          <span className="text-[12px] font-[800] uppercase tracking-[0.1em]" style={{ color: level.color || '#a78bfa' }}>
            Level {level.order}
          </span>
          <h3 className="text-2xl font-[900] text-white leading-tight">{getFieldByLang(level, 'title', language)}</h3>
        </div>
      </div>

      <p className="text-white/40 text-[15px] leading-relaxed mb-6">
        {getFieldByLang(level, 'description', language)}
      </p>

      <div className="space-y-3 mt-auto flex-grow">
        <h4 className="text-[11px] font-[800] uppercase tracking-widest text-white/30 mb-2">Missions in this level</h4>
        {level.units && level.units.map(unit => (
          <Link
            key={unit.id}
            to={`/unit/${unit.slug}`}
            className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-violet-500/30 hover:bg-white/[0.05] transition-colors group/link"
          >
            <div>
              <p className="text-[14px] font-[700] text-white/80 group-hover/link:text-white transition-colors">{getFieldByLang(unit, 'title', language)}</p>
              <span className="text-[10px] font-[800] uppercase tracking-widest text-violet-400">{unit.lesson_count} Lessons</span>
            </div>
            <ArrowRight className="w-4 h-4 text-white/20 group-hover/link:text-violet-400 transition-colors" />
          </Link>
        ))}
      </div>
    </GlassCard>
  );
}

export default function LearnView() {
  const { t, language } = useTranslation();
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/courses/levels/')
      .then(res => {
        const data = res.data;
        setLevels(Array.isArray(data) ? data : data.results || []);
      })
      .catch(() => setLevels([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="relative min-h-screen pt-32 pb-24 px-4 overflow-hidden">
      {/* Decorative ambient glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[150px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 60%)' }} />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[150px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 60%)' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="text-[clamp(48px,8vw,80px)] font-[900] tracking-[-0.04em] leading-[1.1] mb-6 text-white uppercase"
                style={{ textShadow: '0 0 40px rgba(139,92,246,0.3)' }}>
              Koinot <span className="text-glow-purple text-violet">Akademiyasi</span>
            </h1>
            <p className="max-w-2xl mx-auto text-[20px] text-white/50 leading-relaxed font-medium">
              Koinot sirlarini o'rganing va yulduzlar sari intiling. Ta'lim - bu koinotga yo'llanma.
            </p>
          </motion.div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="h-px w-48 mx-auto mt-12"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.8), transparent)' }}
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {levels.map((level, i) => (
              <LevelCard key={level.id} level={level} index={i} language={language} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
