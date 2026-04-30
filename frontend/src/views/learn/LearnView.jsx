import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Rocket, Star, Shield, ArrowRight, Loader } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { useTranslation } from '@/hooks/useTranslation';
import GlassCard from '@/components/ui/GlassCard';

function LevelCard({ level, index }) {
  const navigate = useNavigate();

  return (
    <GlassCard
      accent={level.color || '#a78bfa'}
      delay={index * 0.1}
      className="flex flex-col"
    >
      {/* Icon + Title row */}
      <div className="flex items-center gap-4 mb-4">
        <div 
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ 
            background: `${level.color || '#a78bfa'}18`, 
            border: `1px solid ${level.color || '#a78bfa'}35`,
            boxShadow: `0 0 20px ${level.color || '#a78bfa'}20`
          }}
        >
          <Rocket className="w-7 h-7" style={{ color: level.color || '#a78bfa' }} />
        </div>
        <div>
          <span className="text-[12px] font-[800] uppercase tracking-[0.1em]" style={{ color: level.color || '#a78bfa' }}>
            Level {level.order}
          </span>
          <h3 className="text-2xl font-[900] text-white leading-tight">{level.title_en}</h3>
        </div>
      </div>

      <p className="text-white/40 text-[15px] leading-relaxed mb-6">
        {level.description_en}
      </p>

      <div className="space-y-3 mt-auto flex-grow">
        <h4 className="text-[11px] font-[800] uppercase tracking-widest text-white/30 mb-2">Missions in this level</h4>
        {level.units && level.units.map(unit => (
          <Link
            key={unit.id}
            to={`/unit/${unit.slug}`}
            className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-violet/30 hover:bg-white/[0.05] transition-colors group"
          >
            <div>
              <p className="text-[14px] font-[700] text-white/80 group-hover:text-white transition-colors">{unit.title_en}</p>
              <span className="text-[10px] font-[800] uppercase tracking-widest text-violet-light">{unit.lesson_count} Lessons</span>
            </div>
            <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-violet-light transition-colors" />
          </Link>
        ))}
      </div>
    </GlassCard>
  );
}

export default function LearnView() {
  const { t } = useTranslation();
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/courses/levels/')
      .then(res => {
        setLevels(res.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="relative min-h-screen pt-32 pb-24 px-4 overflow-hidden">
      {/* Decorative ambient glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(0,229,255,0.04) 0%, transparent 70%)' }} />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[12px] font-[700] tracking-[0.28em] uppercase mb-4 text-violet-light">
              {t("home", "academyTitle")}
            </p>
            <h1 className="text-[clamp(40px,6vw,64px)] font-[900] tracking-[-0.04em] leading-[1] mb-6 text-white">
              Space <span className="text-glow-purple text-violet">Missions</span>
            </h1>
            <p className="max-w-2xl mx-auto text-[18px] text-white/40 leading-relaxed">
              Complete missions to explore the solar system, earn XP, and unlock new content.
            </p>
          </motion.div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="h-px w-32 mx-auto mt-12"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.5), transparent)' }}
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
             <Loader className="w-10 h-10 text-violet animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {levels.map((level, i) => (
              <LevelCard key={level.id} level={level} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
