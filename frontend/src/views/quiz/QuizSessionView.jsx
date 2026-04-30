import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Home, ArrowRight, Hourglass, Trophy, Star, Target, Zap } from "lucide-react";
import { quizData } from "@/data/quizData";

// Helper to get time in seconds from difficulty (1 = 1m, 2 = 2m, 3 = 3m)
const getTimeForDifficulty = (diff) => (diff || 1) * 60;

export default function QuizSessionView() {
  const { category } = useParams();
  const navigate = useNavigate();
  
  const questions = quizData[category] || [];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  
  // Initialize timer for first question
  useEffect(() => {
    if (questions.length > 0 && !isCompleted) {
      setTimeLeft(getTimeForDifficulty(questions[currentIndex]?.difficulty));
    }
  }, [currentIndex, isCompleted, questions]);

  // Timer countdown
  useEffect(() => {
    if (isCompleted || timeLeft <= 0 || questions.length === 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft, isCompleted, questions]);

  // Handlers
  const handleAnswer = (selectedIndex) => {
    const isCorrect = selectedIndex === questions[currentIndex].correctAnswer;
    if (isCorrect) setScore(s => s + 1);
    goToNextQuestion();
  };

  const handleTimeUp = () => {
    // Time is up, move to next question automatically (no points)
    goToNextQuestion();
  };

  const goToNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(c => c + 1);
    } else {
      setIsCompleted(true);
    }
  };

  // If invalid category
  if (!quizData[category] || questions.length === 0) {
    return (
      <div className="min-h-screen pt-32 text-center">
        <h2 className="text-3xl text-red-400">Category not found or empty.</h2>
        <button onClick={() => navigate("/quiz")} className="mt-6 px-6 py-2 bg-white/10 rounded-lg">Go Back</button>
      </div>
    );
  }

  // Calculate stats for results
  const total = questions.length;
  const percentage = Math.round((score / total) * 100);
  
  let feedback = "Good effort!";
  let achievementIcon = Target;
  let achievementText = "Learner";
  let achievementColor = "#60a5fa"; // blue

  if (percentage === 100) {
    feedback = "Absolutely perfect! Flawless victory.";
    achievementIcon = Trophy;
    achievementText = "Perfect Score";
    achievementColor = "#fbbf24"; // gold
  } else if (percentage >= 80) {
    feedback = "Excellent work! You have great knowledge in this area.";
    achievementIcon = Star;
    achievementText = "Expert";
    achievementColor = "#34d399"; // green
  } else if (percentage >= 50) {
    feedback = "Not bad, but there's room for improvement.";
    achievementIcon = Zap;
    achievementText = "Challenger";
    achievementColor = "#a78bfa"; // purple
  } else {
    feedback = "Keep studying! Review the materials and try again.";
  }

  // Timer format (MM:SS)
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const currentQ = questions[currentIndex];

  return (
    <div className="min-h-screen pt-24 pb-24 px-4 flex flex-col items-center relative">
      <div className="w-full max-w-4xl relative z-10">
        
        {/* Header / Progress */}
        <div className="flex items-center justify-between mb-8 px-2">
          <h2 className="text-2xl font-bold uppercase tracking-widest text-white/80">
            {category} Test
          </h2>
          {!isCompleted && (
            <div className="text-sm font-medium text-white/50">
              Question {currentIndex + 1} / {total}
            </div>
          )}
        </div>

        {/* Progress bar */}
        {!isCompleted && (
          <div className="w-full h-1.5 bg-white/5 rounded-full mb-12 overflow-hidden">
            <motion.div 
              className="h-full bg-violet-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex) / total) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        )}

        {/* Main Content Area */}
        <AnimatePresence mode="wait">
          {!isCompleted ? (
            <motion.div
              key={`question-${currentIndex}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl"
            >
              <h3 className="text-2xl md:text-3xl font-medium leading-relaxed text-white mb-10">
                {currentQ.text}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQ.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    className="text-left p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-violet-500/20 hover:border-violet-500/50 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-4">
                      <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white/50 group-hover:bg-violet-500 group-hover:text-white transition-colors text-sm font-bold">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="text-white/80 group-hover:text-white transition-colors leading-snug">
                        {opt}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            // Results Screen
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-10 md:p-16 shadow-2xl text-center"
            >
              <motion.div 
                initial={{ scale: 0 }} animate={{ scale: 1 }} 
                transition={{ type: "spring", damping: 12, delay: 0.2 }}
                className="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6"
                style={{ background: `${achievementColor}20`, border: `2px solid ${achievementColor}` }}
              >
                {React.createElement(achievementIcon, { className: "w-12 h-12", style: { color: achievementColor } })}
              </motion.div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-2 text-white">Test Completed!</h2>
              <p className="text-xl text-white/60 mb-8">{feedback}</p>
              
              <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto mb-12">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <div className="text-sm text-white/50 uppercase tracking-wider mb-1">Score</div>
                  <div className="text-4xl font-bold text-white">{score}<span className="text-2xl text-white/30">/{total}</span></div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <div className="text-sm text-white/50 uppercase tracking-wider mb-1">Accuracy</div>
                  <div className="text-4xl font-bold" style={{ color: achievementColor }}>{percentage}%</div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4">
                <button 
                  onClick={() => window.location.reload()}
                  className="px-8 py-4 rounded-xl font-semibold text-white bg-white/10 hover:bg-white/20 transition-colors"
                >
                  Retry Test
                </button>
                <button 
                  onClick={() => navigate("/quiz")}
                  className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white bg-violet-600 hover:bg-violet-500 transition-colors shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                >
                  <Home className="w-5 h-5" /> Return Home
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Timer - Bottom Left */}
      <AnimatePresence>
        {!isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            className="fixed bottom-8 left-8 z-50 flex items-center gap-4 px-6 py-4 rounded-2xl backdrop-blur-md border shadow-2xl"
            style={{
              background: timeLeft < 30 ? "rgba(239,68,68,0.15)" : "rgba(3,2,8,0.8)",
              borderColor: timeLeft < 30 ? "rgba(239,68,68,0.4)" : "rgba(139,92,246,0.3)",
            }}
          >
            <div className="relative w-10 h-10 flex items-center justify-center">
              {/* Special hourglass animation */}
              <motion.div
                animate={{ 
                  rotate: timeLeft % 60 === 0 ? 180 : 0 // Flip every minute
                }}
                transition={{ duration: 0.8, ease: "backInOut" }}
                className="relative z-10"
              >
                <Hourglass 
                  className="w-6 h-6" 
                  style={{ color: timeLeft < 30 ? "#ef4444" : "#a78bfa" }} 
                />
              </motion.div>
              {/* Pulse effect if low time */}
              {timeLeft <= 10 && (
                <motion.div 
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="absolute inset-0 bg-red-500 rounded-full"
                />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wider font-semibold" 
                    style={{ color: timeLeft < 30 ? "#fca5a5" : "rgba(255,255,255,0.5)" }}>
                Time Left
              </span>
              <span className="text-2xl font-mono font-bold tracking-tight"
                    style={{ color: timeLeft < 30 ? "#ef4444" : "#fff" }}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
