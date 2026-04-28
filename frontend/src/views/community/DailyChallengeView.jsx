import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { generateDailyChallenge } from '@/data/quizData';
import { useGamificationStore } from '@/store/useGamificationStore';
import { Timer, Award, Zap, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DailyChallengeView() {
  const { dailyChallengeCompleted, completeDailyChallenge, checkStreak } = useGamificationStore();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    checkStreak();
    setQuestions(generateDailyChallenge());
  }, [checkStreak]);

  useEffect(() => {
    if (isFinished || isAnswerChecked || dailyChallengeCompleted) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleCheckAnswer(-1); // Timeout
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, isFinished, isAnswerChecked, dailyChallengeCompleted]);

  const handleCheckAnswer = (index) => {
    if (isAnswerChecked) return;
    setSelectedAnswer(index);
    setIsAnswerChecked(true);
    
    if (index === questions[currentIndex].correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setIsAnswerChecked(false);
      setTimeLeft(15);
    } else {
      setIsFinished(true);
      const xpEarned = score * 50 + 100; // 50 XP per correct, 100 XP completion bonus
      completeDailyChallenge(xpEarned);
    }
  };

  if (dailyChallengeCompleted && !isFinished) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
        <div className="glass p-8 rounded-2xl text-center max-w-md w-full">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Challenge Completed!</h2>
          <p className="text-gray-400 mb-8">You've already completed today's challenge. Come back tomorrow for more XP!</p>
          <Link to="/profile" className="px-6 py-3 bg-neon-blue text-space-900 font-bold rounded-full hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all inline-block">
            View Profile
          </Link>
        </div>
      </div>
    );
  }

  if (questions.length === 0) return null;

  const currentQ = questions[currentIndex];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      {!isFinished ? (
        <motion.div
          key="quiz"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-8 rounded-3xl relative overflow-hidden"
        >
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 w-full h-2 bg-space-800">
            <motion.div 
              className="h-full bg-neon-blue"
              initial={{ width: `${(currentIndex / questions.length) * 100}%` }}
              animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          <div className="flex justify-between items-center mb-8 mt-4">
            <span className="text-neon-purple font-bold bg-neon-purple/10 px-4 py-1 rounded-full">
              Question {currentIndex + 1}/{questions.length}
            </span>
            <div className={`flex items-center gap-2 font-mono text-xl ${timeLeft <= 5 ? 'text-red-400' : 'text-neon-blue'}`}>
              <Timer className="w-5 h-5" />
              00:{timeLeft.toString().padStart(2, '0')}
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold mb-8 leading-tight">
            {currentQ.question}
          </h2>

          <div className="space-y-4 mb-8">
            {currentQ.options.map((option, idx) => {
              let btnClass = "glass hover:bg-white/10 border-transparent";
              if (isAnswerChecked) {
                if (idx === currentQ.correct) {
                  btnClass = "bg-green-500/20 border-green-500 text-green-400";
                } else if (idx === selectedAnswer) {
                  btnClass = "bg-red-500/20 border-red-500 text-red-400";
                } else {
                  btnClass = "opacity-50 border-transparent";
                }
              } else if (selectedAnswer === idx) {
                btnClass = "border-neon-blue bg-neon-blue/20";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleCheckAnswer(idx)}
                  disabled={isAnswerChecked}
                  className={`w-full text-left p-5 rounded-xl border-2 transition-all text-lg font-medium flex justify-between items-center ${btnClass}`}
                >
                  {option}
                  {isAnswerChecked && idx === currentQ.correct && <CheckCircle className="w-5 h-5" />}
                  {isAnswerChecked && idx === selectedAnswer && idx !== currentQ.correct && <XCircle className="w-5 h-5" />}
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {isAnswerChecked && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex justify-end"
              >
                <button
                  onClick={handleNext}
                  className="px-8 py-3 bg-neon-blue text-space-900 font-bold rounded-full hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all flex items-center gap-2"
                >
                  {currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Challenge'}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          key="results"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-8 md:p-12 rounded-3xl text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 bg-neon-blue/20 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="w-24 h-24 mx-auto bg-space-800 rounded-full flex items-center justify-center mb-6 border-4 border-neon-blue relative z-10">
            <Award className="w-12 h-12 text-neon-blue" />
          </div>
          
          <h2 className="text-4xl font-bold mb-2">Challenge Complete!</h2>
          <p className="text-gray-400 text-lg mb-8">Great job exploring the cosmos today.</p>

          <div className="grid grid-cols-2 gap-4 mb-10 max-w-md mx-auto">
            <div className="glass p-6 rounded-2xl">
              <div className="text-3xl font-bold text-white mb-1">{score}/{questions.length}</div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">Score</div>
            </div>
            <div className="glass p-6 rounded-2xl">
              <div className="text-3xl font-bold text-neon-purple mb-1 flex items-center justify-center gap-1">
                <Zap className="w-6 h-6" />
                {score * 50 + 100}
              </div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">XP Earned</div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Link to="/profile" className="px-8 py-4 bg-neon-blue text-space-900 font-bold rounded-full hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all">
              View Profile
            </Link>
            <Link to="/leaderboard" className="px-8 py-4 glass text-white font-bold rounded-full hover:bg-white/10 transition-all">
              Leaderboard
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
}
