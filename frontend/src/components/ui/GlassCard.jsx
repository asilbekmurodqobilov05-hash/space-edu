import { motion } from "motion/react";

export default function GlassCard({ 
  icon, 
  title, 
  desc, 
  accent = "#8b5cf6", 
  delay = 0, 
  children,
  className = "",
  onClick
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      className={`group relative p-8 rounded-3xl overflow-hidden cursor-default transition-all duration-500 hover:-translate-y-1 ${className}`}
      style={{
        background: 'rgba(255,255,255,0.025)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 4px 28px rgba(0,0,0,0.35)',
      }}
    >
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(ellipse at 25% 25%, ${accent}28 0%, transparent 62%)` }} />
      <div className="absolute top-0 left-8 right-8 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}90, transparent)` }} />
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ border: `1px solid ${accent}30` }} />

      <div className="relative z-10">
        {icon && (
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
            style={{ 
              background: `${accent}18`, 
              border: `1px solid ${accent}35`, 
              boxShadow: `0 0 22px ${accent}22` 
            }}>
            {icon}
          </div>
        )}
        {title && <h3 className="text-xl font-[700] text-white mb-3">{title}</h3>}
        {desc && <p className="text-white/40 leading-relaxed text-[15px]">{desc}</p>}
        {children}
      </div>
    </motion.div>
  );
}
