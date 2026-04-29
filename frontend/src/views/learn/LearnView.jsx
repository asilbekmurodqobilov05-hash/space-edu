import { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Star, Award, PlayCircle, CheckCircle2, Lock, ArrowRight, Video, Shield, Rocket, Wrench, AlertTriangle, Atom, Mic, Palette, Telescope, HelpCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { learningData } from '@/data/learningData';
import { useLearningStore } from '@/store/useLearningStore';
import { useGamificationStore } from '@/store/useGamificationStore';
import { useTranslation } from '@/hooks/useTranslation';
import GlassCard from '@/components/ui/GlassCard';

/* ───────── section definitions ───────── */
const sections = {
  left: [
    {
      id: 'physics',
      title: 'Fizika',
      titleEn: 'Physics',
      link: '/learn/physics',
      icon: Atom,
      color: '#00e5ff',
      description: "Kosmik mexanika, gravitatsiya va energiya asoslari",
      topics: ['Nyuton qonunlari', 'Gravitatsiya', 'Termodinamika', 'Kvant fizikasi'],
      lessonsCount: 24,
    },
    {
      id: 'interviews',
      title: 'Intervyular',
      titleEn: 'Interviews',
      link: '/learn/interviews',
      icon: Mic,
      color: '#a78bfa',
      description: "Olimlar va astronavtlar bilan suhbatlar",
      topics: ['NASA tadqiqotchilari', "O'zbek olimlari", 'Astronavtlar', 'Muhandislar'],
      lessonsCount: 12,
    },
    {
      id: 'creativity',
      title: 'Ijodkorlik',
      titleEn: 'Creativity',
      link: '/learn/creativity',
      icon: Palette,
      color: '#f472b6',
      description: "Kosmik san'at, yozish va dizayn loyihalari",
      topics: ['Kosmik san\'at', 'Ilmiy fantastika', '3D modellash', 'Infografika'],
      lessonsCount: 16,
    },
  ],
  right: [
    {
      id: 'astronomy',
      title: 'Astronomiya',
      titleEn: 'Astronomy',
      link: '/learn/astronomy',
      icon: Telescope,
      color: '#fbbf24',
      description: "Yulduzlar, galaktikalar va koinot tuzilishi",
      topics: ['Quyosh tizimi', 'Yulduzlar evolyutsiyasi', 'Galaktikalar', 'Qora tuynuklar'],
      lessonsCount: 32,
    },
    {
      id: 'problems',
      title: 'Masalalar',
      titleEn: 'Problems',
      link: '/learn/problems',
      icon: HelpCircle,
      color: '#4ade80',
      description: "Amaliy masalalar va olimpiada savollari",
      topics: ['Hisoblash masalalari', 'Olimpiada', 'Laboratoriya', 'Real loyihalar'],
      lessonsCount: 40,
    },
  ],
};

function LearnCard({ section, index }) {
  const navigate = useNavigate();
  const Icon = section.icon;

  return (
    <GlassCard
      accent={section.color}
      delay={index * 0.1}
      onClick={() => navigate(section.link)}
      className="cursor-pointer"
    >
      {/* Icon + Title row */}
      <div className="flex items-center gap-4 mb-6">
        <div 
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ 
            background: `${section.color}18`, 
            border: `1px solid ${section.color}35`,
            boxShadow: `0 0 20px ${section.color}20`
          }}
        >
          <Icon className="w-7 h-7" style={{ color: section.color }} />
        </div>
        <div>
          <h3 className="text-2xl font-[800] text-white leading-tight">{section.title}</h3>
          <span className="text-[12px] font-[700] uppercase tracking-[0.1em]" style={{ color: section.color }}>
            {section.titleEn}
          </span>
        </div>
      </div>

      <p className="text-white/40 text-[15px] leading-relaxed mb-6">
        {section.description}
      </p>

      {/* Topics */}
      <div className="flex flex-wrap gap-2 mb-8">
        {section.topics.map((topic) => (
          <span
            key={topic}
            className="px-3 py-1 rounded-full text-[11px] font-[700] border"
            style={{ 
              color: section.color, 
              background: `${section.color}10`,
              borderColor: `${section.color}25`
            }}
          >
            {topic}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <span className="text-white/30 text-sm font-[600]">
          <span className="text-white font-[800] mr-1">{section.lessonsCount}</span> darslar
        </span>
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110"
          style={{ background: `${section.color}15` }}
        >
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" style={{ color: section.color }} />
        </div>
      </div>
    </GlassCard>
  );
}

export default function LearnView() {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen pt-32 pb-24 px-4 overflow-hidden">
      {/* Decorative ambient glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(0,229,255,0.04) 0%, transparent 70%)' }} />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[12px] font-[700] tracking-[0.28em] uppercase mb-4 text-violet-light">
              {t("home", "academyTitle")}
            </p>
            <h1 className="text-[clamp(40px,6vw,72px)] font-[900] tracking-[-0.04em] leading-[1] mb-6 text-white">
              Koinot <span className="text-glow-purple text-violet">Akademiyasi</span>
            </h1>
            <p className="max-w-2xl mx-auto text-[18px] text-white/40 leading-relaxed">
              Koinot ilmlarini o'rganing — fizikadan astronomiyagacha, ijodkorlikdan amaliy masalalargacha
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

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column */}
          <div className="flex flex-col gap-8">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-[12px] font-[700] uppercase tracking-[0.2em] text-white/20 ml-2"
            >
              Asosiy fanlar
            </motion.h2>
            {sections.left.map((section, i) => (
              <LearnCard key={section.id} section={section} index={i} />
            ))}
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-8">
            <motion.h2
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-[12px] font-[700] uppercase tracking-[0.2em] text-white/20 ml-2"
            >
              Amaliy yo'nalishlar
            </motion.h2>
            {sections.right.map((section, i) => (
              <LearnCard key={section.id} section={section} index={i + 3} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
