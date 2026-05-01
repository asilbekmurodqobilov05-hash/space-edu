import React from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Atom, Rocket, Brain, MonitorPlay } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const CATEGORIES = [
  {
    id: "physics",
    titleKey: "physics",
    descKey: "physicsDesc",
    icon: Atom,
    color: "#a78bfa",
    bgGradient: "linear-gradient(135deg, rgba(167,139,250,0.1), rgba(139,92,246,0.2))",
    border: "rgba(167,139,250,0.3)"
  },
  {
    id: "astronomy",
    titleKey: "astronomy",
    descKey: "astronomyDesc",
    icon: Rocket,
    color: "#60a5fa",
    bgGradient: "linear-gradient(135deg, rgba(96,165,250,0.1), rgba(59,130,246,0.2))",
    border: "rgba(96,165,250,0.3)"
  },
  {
    id: "problems",
    titleKey: "problems",
    descKey: "problemsDesc",
    icon: Brain,
    color: "#f472b6",
    bgGradient: "linear-gradient(135deg, rgba(244,114,182,0.1), rgba(236,72,153,0.2))",
    border: "rgba(244,114,182,0.3)"
  },
  {
    id: "courses",
    titleKey: "courses",
    descKey: "coursesDesc",
    icon: MonitorPlay,
    color: "#34d399",
    bgGradient: "linear-gradient(135deg, rgba(52,211,153,0.1), rgba(16,185,129,0.2))",
    border: "rgba(52,211,153,0.3)"
  }
];

export default function QuizHubView() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center">
      <div className="w-full max-w-6xl">
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight"
              style={{
                background: "linear-gradient(to right, #fff, #a78bfa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 4px 32px rgba(167,139,250,0.3)"
              }}>
            {t('quiz', 'title')}
          </h1>
          <p className="mt-4 text-lg text-white/60 max-w-2xl mx-auto">
            {t('quiz', 'description')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full h-[60vh] min-h-[500px]">
          {CATEGORIES.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <Link key={cat.id} to={`/quiz/${cat.id}`} className="block w-full h-full">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.98 }}
                  className="relative group overflow-hidden rounded-3xl w-full h-full flex flex-col items-center justify-center p-8 text-center"
                  style={{
                    background: cat.bgGradient,
                    border: `1px solid ${cat.border}`,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
                  }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                       style={{ background: `radial-gradient(circle at center, ${cat.color}20 0%, transparent 70%)` }} />
                  
                  <div className="relative z-10 w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                       style={{ background: `${cat.color}15`, border: `1px solid ${cat.color}40`, boxShadow: `0 0 40px ${cat.color}30` }}>
                    <Icon className="w-12 h-12" style={{ color: cat.color }} />
                  </div>
                  
                  <h2 className="text-3xl font-bold text-white mb-3 tracking-wide">{t('quiz', cat.titleKey)}</h2>
                  <p className="text-white/60 text-sm md:text-base max-w-[80%]">{t('quiz', cat.descKey)}</p>

                  <div className="mt-8 flex items-center gap-2 text-sm font-semibold transition-opacity opacity-70 group-hover:opacity-100"
                       style={{ color: cat.color }}>
                    <span>{t('quiz', 'startBtn')}</span>
                    <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                      →
                    </motion.span>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>

      </div>
    </div>
  );
}
