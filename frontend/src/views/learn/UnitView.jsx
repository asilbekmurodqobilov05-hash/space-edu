import { motion } from 'motion/react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, PlayCircle, CheckCircle2, Lock, Star } from 'lucide-react';
import { getUnitById } from '@/data/learningData';
import { useLearningStore } from '@/store/useLearningStore';

export default function UnitView() {
  const { unitId } = useParams();
  const navigate = useNavigate();
  const { completedLessons, isLessonUnlocked, getUnitProgress } = useLearningStore();

  const unit = unitId ? getUnitById(unitId) : undefined;

  if (!unit) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Mission not found</h2>
          <button onClick={() => navigate('/learn')} className="text-neon-blue hover:underline">
            Return to Missions
          </button>
        </div>
      </div>
    );
  }

  const progress = getUnitProgress(unit.id);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <Link to="/learn" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors font-display tracking-wide text-sm uppercase">
        <ArrowLeft className="w-4 h-4" /> Back to Missions
      </Link>

      <div className="bg-white/5 border border-white/10 p-8 md:p-12 rounded-[32px] mb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-neon-blue/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        
        <div className="relative z-10">
          <h1 className="text-[clamp(32px,4vw,48px)] font-[800] tracking-[-0.02em] text-white mb-4">{unit.title}</h1>
          <p className="text-white/60 text-lg mb-10 max-w-2xl leading-relaxed">{unit.description}</p>

          <div className="flex items-center gap-6">
            <div className="flex-grow max-w-md">
              <div className="flex justify-between text-sm font-bold font-display tracking-wide mb-3">
                <span className="text-white/40 uppercase">Mission Progress</span>
                <span className="text-neon-blue">{progress}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-neon-blue shadow-[0_0_10px_rgba(0,229,255,0.5)] rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-[800] tracking-tight mb-8">Mission Objectives</h2>
        
        {unit.lessons.map((lesson, index) => {
          const isCompleted = completedLessons.includes(lesson.id);
          const isUnlocked = isLessonUnlocked(unit.id, lesson.id);

          return (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {isUnlocked ? (
                <Link
                  to={`/lesson/${unit.id}/${lesson.id}`}
                  className={`bg-white/5 border p-6 rounded-[24px] flex flex-col sm:flex-row sm:items-center justify-between group transition-all hover:-translate-y-1 ${
                    isCompleted ? 'border-green-500/30 hover:border-green-500/50 hover:bg-green-500/5' : 'border-white/10 hover:border-neon-blue/40 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-6 mb-4 sm:mb-0">
                    <div className={`p-4 rounded-2xl shrink-0 ${
                      isCompleted ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-[#04080f] text-neon-blue border border-white/10 shadow-inner group-hover:border-neon-blue/30'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <PlayCircle className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className={`text-xl font-[700] mb-2 transition-colors ${isCompleted ? 'text-white' : 'text-white group-hover:text-neon-blue'}`}>
                        {index + 1}. {lesson.title}
                      </h3>
                      <p className="text-white/50 text-sm leading-relaxed">
                        {lesson.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 self-end sm:self-auto">
                    <div className="hidden sm:flex items-center gap-1.5 text-neon-purple text-sm font-bold bg-neon-purple/10 border border-neon-purple/20 px-4 py-1.5 rounded-full">
                      <Star className="w-4 h-4" /> {lesson.xpReward} XP
                    </div>
                    <button className={`px-8 py-3 rounded-full font-[700] transition-all ${
                      isCompleted ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-neon-blue text-[#04080f] hover:scale-105 box-glow-blue'
                    }`}>
                      {isCompleted ? 'Review' : 'Start'}
                    </button>
                  </div>
                </Link>
              ) : (
                <div className="bg-white/5 border border-white/5 p-6 rounded-[24px] flex items-center justify-between opacity-50 grayscale">
                  <div className="flex items-center gap-6">
                    <div className="p-4 rounded-2xl bg-[#04080f] text-white/30 border border-white/5">
                      <Lock className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-[700] text-white/50 mb-2">
                        {index + 1}. {lesson.title}
                      </h3>
                      <p className="text-white/30 text-sm">
                        Complete previous objectives to unlock
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
