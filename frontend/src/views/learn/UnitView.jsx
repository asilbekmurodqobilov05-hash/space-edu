import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, PlayCircle, CheckCircle2, Star, Loader, Clock } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import GlassCard from '@/components/ui/GlassCard';
import { getFieldByLang } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';

function LessonRow({ lesson, unitSlug, completed, index, language }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
    >
      <Link
        to={`/lesson/${unitSlug}/${lesson.slug}`}
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl border transition-all group ${
          completed
            ? 'bg-green-500/5 border-green-500/20 hover:border-green-500/40 hover:bg-green-500/10'
            : 'bg-white/[0.02] border-white/5 hover:border-violet/30 hover:bg-white/[0.05]'
        }`}
      >
        <div className="flex items-center gap-5">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
            completed
              ? 'bg-green-500/15 text-green-400 border border-green-500/25'
              : 'bg-white/5 text-white/40 border border-white/10 group-hover:border-violet/30 group-hover:text-violet-light'
          }`}>
            {completed ? <CheckCircle2 className="w-6 h-6" /> : <PlayCircle className="w-6 h-6" />}
          </div>
          <div>
            <p className="text-[11px] font-[800] text-white/20 uppercase tracking-widest mb-1">
              Lesson {index + 1}
            </p>
            <h3 className={`text-lg font-[800] transition-colors ${
              completed ? 'text-white' : 'text-white/80 group-hover:text-white'
            }`}>
              {getFieldByLang(lesson, 'title', language)}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
          {lesson.estimated_minutes && (
            <div className="flex items-center gap-1.5 text-white/20 text-[11px] font-[700]">
              <Clock className="w-3.5 h-3.5" />
              {lesson.estimated_minutes}m
            </div>
          )}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet/10 border border-violet/20 text-[11px] font-[800] text-violet-light">
            <Star className="w-3 h-3" /> {lesson.xp_reward} XP
          </div>
          <span className={`px-5 py-2.5 rounded-xl font-[800] text-xs uppercase tracking-widest transition-all ${
            completed
              ? 'bg-white/5 text-white/50 group-hover:bg-white/10'
              : 'bg-violet text-white shadow-lg shadow-violet/20 group-hover:bg-violet-dark'
          }`}>
            {completed ? 'Review' : 'Start'}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export default function UnitView() {
  const { unitId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { language } = useTranslation();

  const [unit, setUnit] = useState(null);
  const [completedSlugs, setCompletedSlugs] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get(`/courses/units/${unitId}/`);
        setUnit(data);

        if (isAuthenticated) {
          try {
            const { data: progress } = await api.get(`/progress/units/${unitId}/`);
            setCompletedSlugs(new Set(progress.lessons.map((l) => l.lesson_slug)));
          } catch { /* not enrolled yet — fine */ }
        }
      } catch {
        navigate('/learn');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [unitId, isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 text-violet-light animate-spin" />
      </div>
    );
  }

  if (!unit) return null;

  const completedCount = unit.lessons?.filter((l) => completedSlugs.has(l.slug)).length || 0;
  const total = unit.lessons?.length || 0;
  const progressPct = total ? Math.round((completedCount / total) * 100) : 0;

  return (
    <div className="relative min-h-screen pt-32 pb-24 px-4 overflow-hidden">
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[140px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(0,229,255,0.03) 0%, transparent 70%)' }} />

      <div className="max-w-3xl mx-auto relative z-10">
        <Link to="/learn" className="inline-flex items-center gap-2 text-white/30 hover:text-white transition-colors text-[11px] font-[800] uppercase tracking-widest mb-10">
          <ArrowLeft className="w-4 h-4" /> Back to Academy
        </Link>

        {/* Unit header */}
        <GlassCard accent="#00e5ff" delay={0} className="mb-10">
          <h1 className="text-[clamp(28px,4vw,40px)] font-[900] tracking-tight text-white mb-4">
            {getFieldByLang(unit, 'title', language)}
          </h1>
          <p className="text-white/40 text-[15px] leading-relaxed mb-8">
            Complete all lessons to earn <span className="text-violet-light font-[800]">{unit.xp_reward} XP</span>
            {unit.fuel_reward > 0 && <> and <span className="text-orange-400 font-[800]">{unit.fuel_reward} Fuel</span></>}.
          </p>

          {/* Progress */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between text-[11px] font-[800] uppercase tracking-wider">
              <span className="text-white/30">Progress</span>
              <span className="text-neon-blue">{completedCount} / {total} lessons</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="h-full rounded-full bg-gradient-to-r from-neon-blue to-violet"
                style={{ boxShadow: '0 0 10px rgba(0,229,255,0.4)' }}
              />
            </div>
          </div>
        </GlassCard>

        {/* Lessons */}
        <div className="space-y-4">
          <h2 className="text-[12px] font-[800] uppercase tracking-[0.2em] text-white/20 mb-6">Mission Objectives</h2>
          {unit.lessons?.map((lesson, i) => (
            <LessonRow
              key={lesson.id}
              lesson={lesson}
              unitSlug={unit.slug}
              completed={completedSlugs.has(lesson.slug)}
              index={i}
              language={language}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
