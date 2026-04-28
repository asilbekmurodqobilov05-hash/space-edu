import { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Star, Award, PlayCircle, CheckCircle2, Lock, ArrowRight, Video, Shield, Rocket, Wrench, AlertTriangle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { learningData } from '@/data/learningData';
import { useLearningStore } from '@/store/useLearningStore';
import { useGamificationStore } from '@/store/useGamificationStore';
import { useTranslation } from '@/hooks/useTranslation';

export default function LearnView() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { enrolledUnits, enrollUnit, isLessonUnlocked, getUnitProgress, completedLessons, currentLessonId, currentUnitId } = useLearningStore();
  const { xp, level } = useGamificationStore();
  
  const [activeLevel, setActiveLevel] = useState(learningData[0].id);

  const getIconForUnit = (iconName) => {
    switch (iconName) {
      case 'Sun': return <Star className="w-6 h-6 text-neon-blue" />;
      case 'AlertTriangle': return <AlertTriangle className="w-6 h-6 text-neon-blue" />;
      case 'Wrench': return <Wrench className="w-6 h-6 text-neon-blue" />;
      case 'Rocket': return <Rocket className="w-6 h-6 text-neon-blue" />;
      default: return <BookOpen className="w-6 h-6 text-neon-blue" />;
    }
  };

  const handleContinueLearning = () => {
    if (currentLessonId && currentUnitId) {
      navigate(`/lesson/${currentUnitId}/${currentLessonId}`);
    } else if (learningData[0].units[0].lessons[0]) {
      // Default to first lesson if nothing started
      navigate(`/lesson/${learningData[0].units[0].id}/${learningData[0].units[0].lessons[0].id}`);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header & Dashboard Overview */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6 relative">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-neon-blue/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[clamp(32px,4vw,48px)] font-[800] tracking-[-0.02em] mb-2"
          >
            {t('learn', 'title')} <span className="text-glow-blue text-neon-blue">{t('learn', 'titleHighlight')}</span>
          </motion.h1>
          <p className="text-white/60 text-lg font-display">
            {t('learn', 'level')} {level} Explorer • <span className="text-neon-purple font-bold">{xp} {t('learn', 'xp')}</span>
          </p>
        </div>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={handleContinueLearning}
          className="group bg-neon-blue text-[#04080f] px-8 py-4 rounded-[50px] font-[700] text-lg transition-all hover:scale-[1.04] flex items-center gap-3 box-glow-blue hover:shadow-[0_0_40px_rgba(0,229,255,0.6)] relative z-10"
        >
          <PlayCircle className="w-6 h-6" />
          {currentLessonId ? t('learn', 'continueMission') : t('learn', 'startJourney')}
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </div>

      {/* How it Works / Learning Path Explanation */}
      <div className="mb-16 glass p-8 rounded-3xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-neon-purple/5 rounded-full blur-[80px] pointer-events-none" />
        <h2 className="text-2xl font-bold text-white mb-6">{t('learn', 'howItWorks')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-neon-blue/20 flex items-center justify-center shrink-0">
              <span className="text-neon-blue font-bold text-lg">1</span>
            </div>
            <div>
              <h3 className="text-white font-bold mb-1">{t('learn', 'step1Title')}</h3>
              <p className="text-sm text-white/60">{t('learn', 'step1Desc')}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-neon-purple/20 flex items-center justify-center shrink-0">
              <span className="text-neon-purple font-bold text-lg">2</span>
            </div>
            <div>
              <h3 className="text-white font-bold mb-1">{t('learn', 'step2Title')}</h3>
              <p className="text-sm text-white/60">{t('learn', 'step2Desc')}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
              <span className="text-green-400 font-bold text-lg">3</span>
            </div>
            <div>
              <h3 className="text-white font-bold mb-1">{t('learn', 'step3Title')}</h3>
              <p className="text-sm text-white/60">{t('learn', 'step3Desc')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Overview */}
      <div className="mb-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-3xl border border-white/10">
          <h3 className="text-white/60 font-bold mb-2 uppercase tracking-wider text-sm">{t('learn', 'overallProgress')}</h3>
          <div className="flex items-end gap-3 mb-4">
            <span className="text-4xl font-bold text-white">{Math.round((completedLessons.length / 10) * 100)}%</span>
            <span className="text-neon-blue mb-1">{t('learn', 'mastery')}</span>
          </div>
          <div className="h-2 bg-space-900 rounded-full overflow-hidden border border-white/5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.round((completedLessons.length / 10) * 100)}%` }}
              className="h-full bg-gradient-to-r from-neon-blue to-neon-purple rounded-full"
            />
          </div>
        </div>

        <div className="glass p-6 rounded-3xl border border-white/10">
          <h3 className="text-white/60 font-bold mb-2 uppercase tracking-wider text-sm">{t('learn', 'skillAnalysis')}</h3>
          <div className="space-y-3 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-white">{t('learn', 'orbitalMechanics')}</span>
              <span className="text-green-400 text-sm font-bold">{t('learn', 'strong')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white">{t('learn', 'radiationPhysics')}</span>
              <span className="text-yellow-400 text-sm font-bold">{t('learn', 'practicing')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white">{t('learn', 'spaceDebris')}</span>
              <span className="text-white/40 text-sm font-bold">{t('learn', 'notStarted')}</span>
            </div>
          </div>
        </div>

        <div className="glass p-6 rounded-3xl border border-neon-blue/30 box-glow-blue relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-neon-blue/20 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <h3 className="text-neon-blue font-bold mb-2 uppercase tracking-wider text-sm">{t('learn', 'recommendedNext')}</h3>
          <h4 className="text-xl font-bold text-white mb-2">{t('learn', 'spaceDebris')}</h4>
          <p className="text-white/60 text-sm mb-4">{t('learn', 'debrisDesc')}</p>
          <button 
            onClick={() => navigate('/lesson/unit-2-1/lesson-2-debris')}
            className="w-full py-2 bg-neon-blue/10 text-neon-blue font-bold rounded-xl hover:bg-neon-blue hover:text-space-900 transition-colors"
          >
            {t('home', 'startMission')}
          </button>
        </div>
      </div>

      {/* Level Navigation */}
      <div className="flex overflow-x-auto pb-4 mb-12 gap-4 scrollbar-hide">
        {learningData.map((levelData) => (
          <button
            key={levelData.id}
            onClick={() => setActiveLevel(levelData.id)}
            className={`flex-shrink-0 px-6 py-4 rounded-2xl border transition-all ${
              activeLevel === levelData.id 
                ? 'bg-neon-blue/10 border-neon-blue text-white shadow-[0_0_20px_rgba(0,243,255,0.2)]' 
                : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            <div className="flex flex-col items-start text-left">
              <span className="text-xs font-bold uppercase tracking-widest mb-1 opacity-80">{t('learn', 'mission')} {levelData.levelNumber}</span>
              <span className="font-bold text-lg">{levelData.theme}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Active Level Content */}
      <div className="space-y-20">
        {learningData.filter(l => l.id === activeLevel).map((levelData) => (
          <motion.div 
            key={levelData.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">{levelData.title}</h2>
              <p className="text-white/60 text-lg">{levelData.description}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {levelData.units.map((unit) => {
                const isEnrolled = enrolledUnits.includes(unit.id);
                const progress = getUnitProgress(unit.id);

                return (
                  <div key={unit.id} className="glass rounded-3xl p-8 border border-white/10 hover:border-neon-blue/30 transition-colors group relative overflow-hidden">
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-neon-blue/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-neon-blue/10 transition-colors pointer-events-none" />
                    
                    <div className="flex items-start justify-between mb-6 relative z-10">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-space-800 border border-white/10 flex items-center justify-center shadow-inner">
                          {getIconForUnit(unit.icon)}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-1">{unit.title}</h3>
                          <p className="text-white/60 text-sm">{unit.description}</p>
                        </div>
                      </div>
                    </div>

                    {isEnrolled && (
                      <div className="mb-8 relative z-10">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-white/60 font-medium">{t('learn', 'missionProgress')}</span>
                          <span className="text-neon-blue font-bold">{progress}%</span>
                        </div>
                        <div className="h-2 bg-space-900 rounded-full overflow-hidden border border-white/5">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-gradient-to-r from-neon-blue to-neon-purple rounded-full"
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-3 relative z-10">
                      {unit.lessons.map((lesson, idx) => {
                        const unlocked = isLessonUnlocked(unit.id, lesson.id);
                        const completed = completedLessons.includes(lesson.id);

                        return (
                          <div 
                            key={lesson.id}
                            onClick={() => {
                              if (!isEnrolled) enrollUnit(unit.id);
                              if (unlocked) navigate(`/lesson/${unit.id}/${lesson.id}`);
                            }}
                            className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                              unlocked 
                                ? 'bg-space-800/50 border-white/10 hover:border-neon-blue/50 cursor-pointer hover:bg-space-800' 
                                : 'bg-space-900/50 border-white/5 opacity-50 cursor-not-allowed'
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                completed ? 'bg-green-500/20 text-green-400' : 
                                unlocked ? 'bg-neon-blue/20 text-neon-blue' : 'bg-white/5 text-white/40'
                              }`}>
                                {completed ? <CheckCircle2 className="w-4 h-4" /> : 
                                 unlocked ? <PlayCircle className="w-4 h-4 ml-0.5" /> : 
                                 <Lock className="w-4 h-4" />}
                              </div>
                              <div>
                                <p className={`font-bold ${unlocked ? 'text-white' : 'text-white/60'}`}>
                                  {idx + 1}. {lesson.title}
                                </p>
                                <p className="text-xs text-white/40">{lesson.xpReward} XP • {lesson.sections.length} {t('learn', 'activities')}</p>
                              </div>
                            </div>
                            {unlocked && !completed && (
                              <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-neon-blue transition-colors" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {!isEnrolled && (
                      <button 
                        onClick={() => enrollUnit(unit.id)}
                        className="w-full mt-6 py-3 rounded-xl bg-white/5 border border-white/10 font-bold text-white hover:bg-neon-blue hover:text-space-900 hover:border-neon-blue transition-all relative z-10"
                      >
                        {t('home', 'startMission')}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
