import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Star, ChevronRight, HelpCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getLessonById, getNextLesson } from '@/data/learningData';
import { useLearningStore } from '@/store/useLearningStore';
import { useAIStore } from '@/store/useAIStore';

export default function LessonView() {
  const { unitId, lessonId } = useParams();
  const navigate = useNavigate();
  const { completeLesson, resumeLesson } = useLearningStore();
  const { setContext, setIsSupportOpen } = useAIStore();
  
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [isLessonComplete, setIsLessonComplete] = useState(false);

  const lessonData = lessonId ? getLessonById(lessonId) : undefined;
  const lesson = lessonData?.lesson;

  useEffect(() => {
    if (lessonId && unitId) {
      resumeLesson(lessonId, unitId);
    }
  }, [lessonId, unitId, resumeLesson]);

  useEffect(() => {
    if (lesson) {
      setContext(lesson.title);
    }
    return () => setContext(undefined);
  }, [lesson, setContext]);

  if (!lesson || !unitId) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Lesson not found</h2>
          <button onClick={() => navigate('/learn')} className="text-neon-blue hover:underline">
            Return to Learning
          </button>
        </div>
      </div>
    );
  }

  const currentSection = lesson.sections[currentSectionIndex];
  const isLastSection = currentSectionIndex === lesson.sections.length - 1;

  const handleNextSection = () => {
    if (isLastSection) {
      // Finish lesson
      const finalScore = (quizScore / (lesson.sections.filter(s => s.type === 'quiz' || s.type === 'practice').length || 1)) * 100;
      completeLesson(lesson.id, unitId, finalScore, lesson.xpReward);
      setIsLessonComplete(true);
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00e5ff', '#b537f2', '#ffffff']
      });
    } else {
      setCurrentSectionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerChecked(false);
    }
  };

  const handleCheckAnswer = (correctIndex) => {
    setIsAnswerChecked(true);
    if (selectedAnswer === correctIndex) {
      setQuizScore(prev => prev + 1);
    }
  };

  if (isLessonComplete) {
    const nextLesson = getNextLesson(unitId, lesson.id);
    
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 border border-white/10 p-12 rounded-[32px] max-w-lg w-full text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-neon-blue/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <div className="w-24 h-24 bg-gradient-to-br from-neon-blue to-neon-purple rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(0,229,255,0.5)]">
            <Star className="w-12 h-12 text-[#04080f]" />
          </div>
          
          <h2 className="text-4xl font-[800] tracking-tight text-white mb-4">Lesson Completed!</h2>
          <p className="text-white/60 text-lg mb-8">
            You earned <span className="text-neon-purple font-bold">+{lesson.xpReward} XP</span> for completing "{lesson.title}".
          </p>
          
          <div className="space-y-4">
            {nextLesson ? (
              <button 
                onClick={() => {
                  setIsLessonComplete(false);
                  setCurrentSectionIndex(0);
                  navigate(`/lesson/${unitId}/${nextLesson.id}`);
                }}
                className="w-full py-4 bg-neon-blue text-[#04080f] font-[700] rounded-full hover:scale-[1.02] transition-all box-glow-blue"
              >
                Continue to Next Lesson
              </button>
            ) : (
              <button 
                onClick={() => navigate(`/learn`)}
                className="w-full py-4 bg-neon-purple text-white font-[700] rounded-full hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(181,55,242,0.4)]"
              >
                Return to Missions
              </button>
            )}
            <button 
              onClick={() => navigate('/learn')}
              className="w-full py-4 bg-white/5 text-white font-[700] rounded-full hover:bg-white/10 transition-colors border border-white/10"
            >
              Back to Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-32 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <Link to={`/learn`} className="p-3 hover:bg-white/10 rounded-full transition-colors border border-white/10 bg-white/5">
          <ArrowLeft className="w-5 h-5 text-white/60 hover:text-white" />
        </Link>
        <div className="flex-grow mx-8">
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-neon-blue shadow-[0_0_10px_rgba(0,229,255,0.5)]"
              initial={{ width: 0 }}
              animate={{ width: `${((currentSectionIndex) / lesson.sections.length) * 100}%` }}
            />
          </div>
        </div>
        <div className="text-sm font-bold font-display tracking-wide text-white/40">
          {currentSectionIndex + 1} / {lesson.sections.length}
        </div>
      </div>

      <h1 className="text-[clamp(28px,3vw,36px)] font-[800] tracking-tight text-white mb-10 text-center">{lesson.title}</h1>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSection.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white/5 border border-white/10 p-8 md:p-12 rounded-[32px] min-h-[400px] flex flex-col relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-neon-blue/5 rounded-full blur-[60px] pointer-events-none" />
          
          <h2 className="text-2xl font-[700] text-neon-blue mb-8 relative z-10">{currentSection.title}</h2>

          {currentSection.type === 'explanation' && currentSection.content && (
            <div className="space-y-6 flex-grow relative z-10">
              {currentSection.content.map((paragraph, idx) => (
                <p key={idx} className="text-lg text-white/70 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          )}

          {currentSection.type === 'worked-example' && currentSection.examples && (
            <div className="space-y-8 flex-grow relative z-10">
              {currentSection.examples.map((example, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-neon-purple/20 border border-neon-purple/30 flex items-center justify-center shrink-0 text-neon-purple font-bold">
                      Q
                    </div>
                    <p className="text-lg font-[600] text-white">{example.problem}</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-neon-blue/20 border border-neon-blue/30 flex items-center justify-center shrink-0 text-neon-blue font-bold">
                      A
                    </div>
                    <p className="text-lg text-white/70 leading-relaxed">{example.solution}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {currentSection.type === 'visual' && currentSection.imageUrl && (
            <div className="flex-grow flex flex-col items-center justify-center relative z-10">
              <img 
                src={currentSection.imageUrl} 
                alt={currentSection.imageAlt || 'Lesson visual'} 
                className="w-full max-h-[400px] object-cover rounded-2xl mb-6 border border-white/10 shadow-lg"
                referrerPolicy="no-referrer"
              />
              {currentSection.imageAlt && (
                <p className="text-sm text-white/40 text-center">{currentSection.imageAlt}</p>
              )}
            </div>
          )}

          {currentSection.type === 'video' && currentSection.videoUrl && (
            <div className="flex-grow flex flex-col items-center justify-center space-y-8 relative z-10">
              <div className="w-full aspect-video rounded-2xl overflow-hidden border border-white/20 shadow-[0_0_40px_rgba(0,229,255,0.15)]">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={currentSection.videoUrl} 
                  title={currentSection.title}
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowFullScreen
                ></iframe>
              </div>
              {currentSection.content && (
                <p className="text-lg text-white/70 text-center leading-relaxed max-w-2xl">
                  {currentSection.content[0]}
                </p>
              )}
            </div>
          )}

          {(currentSection.type === 'practice' || currentSection.type === 'quiz') && (
            <div className="flex-grow relative z-10">
              {/* Assuming one question per section for simplicity in this view */}
              {(() => {
                const questionData = currentSection.type === 'practice' 
                  ? currentSection.practiceExercises?.[0] 
                  : currentSection.quizQuestions?.[0];

                if (!questionData) return null;

                return (
                  <div>
                    <p className="text-xl font-[600] text-white mb-8 leading-relaxed">{questionData.question}</p>
                    <div className="space-y-4">
                      {questionData.options?.map((option, idx) => {
                        const isSelected = selectedAnswer === idx;
                        const isCorrect = idx === questionData.correctAnswerIndex;
                        
                        let buttonClass = "w-full text-left p-5 rounded-2xl border-2 transition-all text-lg font-[500] ";
                        
                        if (!isAnswerChecked) {
                          buttonClass += isSelected ? "border-neon-blue bg-neon-blue/10 text-white" : "border-white/10 hover:border-neon-blue/30 hover:bg-white/5 text-white/70 hover:text-white";
                        } else {
                          if (isCorrect) {
                            buttonClass += "border-green-500 bg-green-500/10 text-green-400";
                          } else if (isSelected && !isCorrect) {
                            buttonClass += "border-red-500 bg-red-500/10 text-red-400";
                          } else {
                            buttonClass += "border-white/5 opacity-40 text-white/50";
                          }
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() => !isAnswerChecked && setSelectedAnswer(idx)}
                            disabled={isAnswerChecked}
                            className={buttonClass}
                          >
                            <div className="flex items-center justify-between">
                              <span>{option}</span>
                              {isAnswerChecked && isCorrect && <CheckCircle2 className="w-6 h-6 text-green-400" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {isAnswerChecked && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mt-8 p-6 rounded-2xl flex items-start gap-4 ${
                          selectedAnswer === questionData.correctAnswerIndex 
                            ? 'bg-green-500/10 border border-green-500/30' 
                            : 'bg-red-500/10 border border-red-500/30'
                        }`}
                      >
                        <HelpCircle className={`w-6 h-6 shrink-0 mt-0.5 ${
                          selectedAnswer === questionData.correctAnswerIndex ? 'text-green-400' : 'text-red-400'
                        }`} />
                        <div className="flex-grow">
                          <h4 className={`font-[700] mb-2 ${
                            selectedAnswer === questionData.correctAnswerIndex ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {selectedAnswer === questionData.correctAnswerIndex ? 'Excellent Work!' : 'Not Quite Right'}
                          </h4>
                          <p className="text-white/70 leading-relaxed">
                            {selectedAnswer === questionData.correctAnswerIndex 
                              ? (questionData).explanation || 'You have a solid understanding of this concept. Keep going!'
                              : "Don't worry! Every mistake is a learning opportunity. Review the hint or open the Space edu AI tutor for a step-by-step explanation."}
                          </p>
                          {selectedAnswer !== questionData.correctAnswerIndex && (
                            <button 
                              onClick={() => {
                                setContext(`the question: "${questionData.question}" in the lesson "${lesson.title}"`);
                                setIsSupportOpen(true);
                              }}
                              className="mt-4 flex items-center gap-2 px-4 py-2 bg-neon-blue/20 border border-neon-blue/30 rounded-xl text-neon-blue text-sm font-bold hover:bg-neon-blue/30 transition-colors"
                            >
                              <Sparkles className="w-4 h-4" /> Open AI Support Chat
                            </button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Footer Navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-[#04080f]/80 backdrop-blur-xl border-t border-white/10 z-50">
        <div className="max-w-3xl mx-auto flex justify-end">
          {((currentSection.type === 'practice' || currentSection.type === 'quiz') && !isAnswerChecked) ? (
            <button
              onClick={() => {
                const qData = currentSection.type === 'practice' ? currentSection.practiceExercises?.[0] : currentSection.quizQuestions?.[0];
                if (qData) handleCheckAnswer(qData.correctAnswerIndex);
              }}
              disabled={selectedAnswer === null}
              className="px-8 py-4 bg-neon-blue text-[#04080f] font-[700] rounded-full hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2 box-glow-blue"
            >
              Check Answer
            </button>
          ) : (
            <button
              onClick={handleNextSection}
              className="px-8 py-4 bg-neon-blue text-[#04080f] font-[700] rounded-full hover:scale-105 transition-all flex items-center gap-2 box-glow-blue"
            >
              {isLastSection ? 'Complete Lesson' : 'Continue'} <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

