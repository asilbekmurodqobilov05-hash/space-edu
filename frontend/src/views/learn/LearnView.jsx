import { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Atom, Mic, Lightbulb, Telescope, Target, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

function SectionCard({ title, titleEn, icon: Icon, desc, color, to, delay, isTall }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link to={to} className="block w-full h-full">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group relative rounded-3xl overflow-hidden h-full flex flex-col"
        style={{
          background: hovered 
            ? `linear-gradient(145deg, rgba(255,255,255,0.04), ${color}10)`
            : 'rgba(255,255,255,0.02)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${hovered ? `${color}40` : 'rgba(255,255,255,0.05)'}`,
          boxShadow: hovered 
            ? `0 10px 40px rgba(0,0,0,0.4), 0 0 20px ${color}15` 
            : '0 4px 20px rgba(0,0,0,0.2)',
          transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
          transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
          minHeight: isTall ? '320px' : '220px',
          padding: isTall ? '40px' : '32px'
        }}
      >
        {/* Glow Effects */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{ background: `radial-gradient(circle at 80% 20%, ${color}20 0%, transparent 60%)` }} 
        />

        <div className="flex justify-between items-start mb-6 relative z-10">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500"
            style={{ 
              background: `${color}15`, 
              border: `1px solid ${color}30`,
              boxShadow: hovered ? `0 0 20px ${color}30` : 'none',
              transform: hovered ? 'scale(1.05)' : 'scale(1)'
            }}
          >
            <Icon className="w-8 h-8" style={{ color }} />
          </div>
          
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500"
            style={{
              background: hovered ? color : 'rgba(255,255,255,0.05)',
              border: `1px solid ${hovered ? color : 'rgba(255,255,255,0.1)'}`,
            }}
          >
            <ArrowRight 
              className="w-5 h-5 transition-all duration-500" 
              style={{ 
                color: hovered ? '#fff' : 'rgba(255,255,255,0.4)',
                transform: hovered ? 'translateX(2px) rotate(-45deg)' : 'translateX(0) rotate(0)'
              }} 
            />
          </div>
        </div>

        <div className="mt-auto relative z-10">
          <h2 className="text-3xl font-[800] text-white tracking-tight mb-2 flex items-center gap-3">
            {title}
            <span 
              className="text-sm font-[600] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
              style={{ background: `${color}20`, color: color }}
            >
              {titleEn}
            </span>
          </h2>
          <p className="text-white/40 text-[16px] leading-relaxed max-w-[90%] transition-colors duration-300 group-hover:text-white/60">
            {desc}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}

export default function LearnView() {
  const { t } = useTranslation();

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

        {/* Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Left Column (3 cards) */}
          <div className="flex flex-col gap-6 lg:gap-8">
            <SectionCard 
              title="Fizika" 
              titleEn="Physics"
              desc="Tabiat qonunlari va mexanikadan tortib kvant olamigacha kashf eting."
              icon={Atom} 
              color="#8b5cf6" // Violet
              to="/learn/physics"
              delay={0.1}
            />
            <SectionCard 
              title="Interviews" 
              titleEn="Interviews"
              desc="Olimlar, muhandislar va fazogirlar bilan ilhomlantiruvchi suhbatlar."
              icon={Mic} 
              color="#3b82f6" // Blue
              to="/learn/interviews"
              delay={0.2}
            />
            <SectionCard 
              title="Yaratuvchilik" 
              titleEn="Creativity"
              desc="O'z g'oyalaringizni ro'yobga chiqaring va ijodiy yondashuvni rivojlantiring."
              icon={Lightbulb} 
              color="#ec4899" // Pink
              to="/learn/creativity"
              delay={0.3}
            />
          </div>

          {/* Right Column (2 taller cards) */}
          <div className="flex flex-col gap-6 lg:gap-8">
            <SectionCard 
              title="Astranomiya" 
              titleEn="Astronomy"
              desc="Yulduzlar, sayyoralar va galaktikalar olamiga chuqur sayohat qiling."
              icon={Telescope} 
              color="#06b6d4" // Cyan
              to="/learn/astronomy"
              delay={0.15}
              isTall={true}
            />
            <SectionCard 
              title="Masalalar" 
              titleEn="Problems"
              desc="Fizika va astronomiyaga oid qiziqarli masalalarni yeching va bilimingizni sinang."
              icon={Target} 
              color="#f59e0b" // Amber
              to="/learn/problems"
              delay={0.25}
              isTall={true}
            />
          </div>

        </div>
      </div>
    </div>
  );
}
