import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, GraduationCap, Rocket, Telescope, Database, Monitor, CheckCircle2, ChevronRight, X, Award, Target } from 'lucide-react';
import { careersData, roadmapSteps, careerQuizQuestions } from '@/data/careersData';
import { useGamificationStore } from '@/store/useGamificationStore';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';

const iconMap = {
  Telescope,
  Rocket,
  Database,
  Monitor,
  Briefcase
};

export default function CareersView() {
  const { t } = useTranslation();
  const { completedCareers, markCareerExplored, careerTrack, setCareerTrack } = useGamificationStore();
  const [selectedCareer, setSelectedCareer] = useState(null);
  
  // Quiz State
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizResult, setQuizResult] = useState(null);

  const handleCareerClick = (career) => {
    setSelectedCareer(career);
    markCareerExplored(career.id);
  };

  const handleQuizAnswer = (careerId) => {
    const newAnswers = [...quizAnswers, careerId];
    setQuizAnswers(newAnswers);

    if (quizStep < careerQuizQuestions.length - 1) {
      setQuizStep(prev => prev + 1);
    } else {
      // Calculate result (most frequent answer)
      const counts = newAnswers.reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
      }, {});
      
      const topCareerId = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
      const result = careersData.find(c => c.id === topCareerId) || careersData[0];
      setQuizResult(result);
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setQuizStep(0);
    setQuizAnswers([]);
    setQuizResult(null);
  };

  const handleEnlist = (careerId) => {
    setCareerTrack(careerId);
    setSelectedCareer(null);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          {t('careers', 'title')} <span className="text-glow-purple text-neon-purple">{t('careers', 'titleHighlight')}</span>
        </motion.h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg mb-8">
          {t('careers', 'subtitle')}
        </p>
        
        {careerTrack ? (
          <div className="inline-flex flex-col items-center gap-4 bg-neon-blue/10 border border-neon-blue/30 px-8 py-6 rounded-3xl">
            <div className="flex items-center gap-3 text-neon-blue">
              <CheckCircle2 className="w-6 h-6" />
              <span className="text-xl font-bold">{t('careers', 'currentlyEnlisted')} {careersData.find(c => c.id === careerTrack)?.title}</span>
            </div>
            <Link to="/dashboard" className="px-6 py-2 bg-neon-blue text-space-900 font-bold rounded-full hover:bg-white transition-colors">
              {t('careers', 'goToDashboard')}
            </Link>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 bg-neon-purple/10 border border-neon-purple/30 px-4 py-2 rounded-full text-neon-purple">
            <Award className="w-5 h-5" />
            <span>{t('careers', 'selectTrack')}</span>
          </div>
        )}
      </div>

      {/* Roadmap Section */}
      <div className="mb-20">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-neon-blue" />
          {t('careers', 'pathTitle')}
        </h2>
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2 hidden md:block" />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {roadmapSteps.map((step, index) => (
              <motion.div 
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative z-10 glass p-6 rounded-2xl text-center flex flex-col items-center group hover:border-neon-blue/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-space-800 border-2 border-neon-blue flex items-center justify-center text-neon-blue font-bold mb-4 group-hover:scale-110 transition-transform box-glow-blue">
                  {index + 1}
                </div>
                <h3 className="font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-gray-400">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Career Paths Grid */}
      <div className="mb-20">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-neon-purple" />
          {t('careers', 'explorePaths')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {careersData.map((career) => {
            const Icon = iconMap[career.icon] || Briefcase;
            const isCompleted = completedCareers.includes(career.id);
            const isEnlisted = careerTrack === career.id;

            return (
              <motion.button
                key={career.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCareerClick(career)}
                className={`glass p-6 rounded-3xl text-left relative overflow-hidden group transition-all ${isEnlisted ? 'border-neon-blue shadow-[0_0_30px_rgba(0,229,255,0.2)]' : isCompleted ? 'border-neon-purple/50' : 'border-white/10'}`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-neon-purple/10 transition-colors" />
                
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl ${isEnlisted ? 'bg-neon-blue text-space-900' : isCompleted ? 'bg-neon-purple/20 text-neon-purple' : 'bg-white/10 text-white'}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  {isEnlisted ? (
                    <span className="px-3 py-1 bg-neon-blue/20 text-neon-blue text-xs font-bold rounded-full border border-neon-blue/50">{t('careers', 'enlisted')}</span>
                  ) : isCompleted && <CheckCircle2 className="w-6 h-6 text-neon-purple" />}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{career.title}</h3>
                <p className="text-gray-400 mb-4">{career.shortDesc}</p>
                
                <div className="flex items-center text-sm font-medium text-neon-blue group-hover:translate-x-2 transition-transform">
                  {t('careers', 'viewDetails')} <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Career Quiz */}
      <div className="glass p-8 md:p-12 rounded-3xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/5 to-neon-purple/5" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          {!quizStarted && !quizResult ? (
            <>
              <h2 className="text-3xl font-bold mb-4">{t('careers', 'quizTitle')}</h2>
              <p className="text-gray-300 mb-8">{t('careers', 'quizDesc')}</p>
              <button 
                onClick={() => setQuizStarted(true)}
                className="px-8 py-4 bg-neon-blue text-space-900 font-bold rounded-full hover:bg-white transition-colors box-glow-blue"
              >
                {t('careers', 'startQuiz')}
              </button>
            </>
          ) : quizResult ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="inline-block p-4 bg-neon-purple/20 rounded-full mb-6">
                <Award className="w-12 h-12 text-neon-purple" />
              </div>
              <h3 className="text-2xl text-gray-300 mb-2">{t('careers', 'idealCareer')}</h3>
              <h2 className="text-4xl font-bold text-white mb-6">{quizResult.title}</h2>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto">{quizResult.description}</p>
              <div className="flex gap-4 justify-center">
                <button 
                  onClick={() => handleCareerClick(quizResult)}
                  className="px-6 py-3 bg-neon-purple text-white font-bold rounded-full hover:bg-neon-purple/80 transition-colors box-glow-purple"
                >
                  {t('careers', 'viewDetails')}
                </button>
                <button 
                  onClick={resetQuiz}
                  className="px-6 py-3 bg-white/10 text-white font-medium rounded-full hover:bg-white/20 transition-colors"
                >
                  {t('careers', 'retakeQuiz')}
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="text-left">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-neon-blue">{t('careers', 'question')} {quizStep + 1} {t('careers', 'of')} {careerQuizQuestions.length}</h3>
                <span className="text-sm text-gray-400">{Math.round((quizStep / careerQuizQuestions.length) * 100)}% Completed</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-8">{careerQuizQuestions[quizStep].q}</h2>
              <div className="space-y-4">
                {careerQuizQuestions[quizStep].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuizAnswer(opt.career)}
                    className="w-full text-left p-4 rounded-xl border border-white/10 hover:border-neon-blue hover:bg-neon-blue/10 transition-all text-gray-200"
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Career Detail Modal */}
      <AnimatePresence>
        {selectedCareer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedCareer(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-space-900 border border-white/10 p-6 md:p-8 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-neon-purple/20 text-neon-purple rounded-xl">
                    {(() => {
                      const Icon = iconMap[selectedCareer.icon] || Briefcase;
                      return <Icon className="w-8 h-8" />;
                    })()}
                  </div>
                  <h2 className="text-3xl font-bold text-white">{selectedCareer.title}</h2>
                </div>
                <button 
                  onClick={() => setSelectedCareer(null)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <p className="text-gray-300 mb-8 text-lg leading-relaxed">{selectedCareer.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-neon-blue" /> {t('careers', 'education')}
                  </h3>
                  <ul className="space-y-2">
                    {selectedCareer.education.map((edu, idx) => (
                      <li key={idx} className="text-gray-400 flex items-start gap-2">
                        <span className="text-neon-blue mt-1">•</span> {edu}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-neon-purple" /> {t('careers', 'keySkills')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCareer.skills.map((skill, idx) => (
                      <span key={idx} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-neon-blue/10 to-transparent p-6 rounded-2xl border border-neon-blue/20 mb-8">
                <h3 className="text-sm uppercase tracking-wider text-neon-blue font-bold mb-2">{t('careers', 'inspiringStory')}</h3>
                <h4 className="text-xl font-bold text-white mb-1">{selectedCareer.story.name}</h4>
                <p className="text-sm text-gray-400 mb-4">{selectedCareer.story.role}</p>
                <p className="text-gray-300 italic">"{selectedCareer.story.content}"</p>
              </div>

              <div className="flex justify-end gap-4 border-t border-white/10 pt-6">
                <button 
                  onClick={() => setSelectedCareer(null)}
                  className="px-6 py-3 bg-white/5 text-white font-medium rounded-full hover:bg-white/10 transition-colors"
                >
                  {t('careers', 'close')}
                </button>
                {careerTrack !== selectedCareer.id && (
                  <button 
                    onClick={() => handleEnlist(selectedCareer.id)}
                    className="px-8 py-3 bg-neon-blue text-space-900 font-bold rounded-full hover:bg-white transition-colors box-glow-blue"
                  >
                    {t('careers', 'enlistInTrack')}
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

