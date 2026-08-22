import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Home, ArrowRight, Hourglass, Trophy, Star, Target, Zap } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import api from "@/lib/api";
import { useGamificationStore } from "@/store/useGamificationStore";

// Map store language codes to the suffixes the API uses
const LANG_MAP = { ENG: "en", RUS: "ru", UZB: "uz" };

/**
 * Read a question in the reader's language, falling back to the Uzbek original.
 *
 * The API sends `question`, `question_en` and `question_ru` as separate fields
 * rather than the nested object the static file used.
 */
const localised = (question, lang) => {
  if (!question) return "";
  if (lang === "en") return question.question_en || question.question;
  if (lang === "ru") return question.question_ru || question.question;
  return question.question;
};

const optionsOf = (question) => (Array.isArray(question?.options) ? question.options : []);

export default function QuizSessionView() {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const lesson = searchParams.get("lesson");
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const currentLang = LANG_MAP[language] || "en";

  /*
   * The questions and the grading both come from the server now.
   *
   * They used to come from `src/data/quizData.js`, which put the correct answer
   * to all 24 questions inside the JavaScript bundle — readable from View
   * Source by any student — and the score was computed in the browser from that
   * same key. The XP it showed was never persisted either: `addXp` is a local
   * optimistic update, so the number went up and the next profile fetch wiped
   * it. The endpoints that do this properly already existed; nothing called
   * them.
   *
   * `?lesson=<slug>` narrows the pool to one lesson's questions — ADR 0001,
   * step 5, the half that had no screen.
   */
  const [sessionId, setSessionId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loadState, setLoadState] = useState("loading");
  const [answers, setAnswers] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState(null);
  const [saveFailed, setSaveFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoadState("loading");

    api.post("/challenges/quiz/start/", lesson ? { lesson } : { category, count: 10 })
      .then(({ data }) => {
        if (cancelled) return;
        const list = data.questions ?? [];
        if (!list.length) {
          setLoadState("empty");
          return;
        }
        setSessionId(data.session_id);
        setQuestions(list);
        setLoadState("ready");
      })
      .catch(() => {
        // An unknown category is a 400 from the ChoiceField and a lesson with
        // no questions is a 404; both mean "nothing to show here". This is also
        // what closes the /quiz/constructor hole for good — the category is
        // checked against a fixed list on the server rather than looked up on
        // an object whose prototype answers to `constructor`.
        if (!cancelled) setLoadState("empty");
      });

    return () => {
      cancelled = true;
    };
  }, [category, lesson]);

  // Initialize timer for the current question
  useEffect(() => {
    if (questions.length > 0 && !isCompleted) {
      setTimeLeft(questions[currentIndex]?.time_seconds || 60);
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
  const record = useCallback((selectedIndex) => {
    const question = questions[currentIndex];
    if (!question) return;
    setAnswers((prev) => [
      ...prev,
      {
        question_id: question.id,
        selected: selectedIndex,
        time_spent: Math.max(0, (question.time_seconds || 60) - timeLeft),
      },
    ]);
  }, [questions, currentIndex, timeLeft]);

  const handleAnswer = (selectedIndex) => {
    record(selectedIndex);
    goToNextQuestion();
  };

  const handleTimeUp = () => {
    // Running out of time is an answer nobody gave. -1 is not one of the option
    // indices, so the server grades it wrong without needing a special case.
    record(-1);
    goToNextQuestion();
  };

  const goToNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(c => c + 1);
    } else {
      setIsCompleted(true);
    }
  };

  // Submit once, and take the score from the answer.
  const hasSubmittedRef = useRef(false);
  useEffect(() => {
    if (!isCompleted || hasSubmittedRef.current || !sessionId) return;
    hasSubmittedRef.current = true;

    api.post(`/challenges/quiz/${sessionId}/submit/`, {
      answers,
      time_taken: answers.reduce((sum, a) => sum + a.time_spent, 0),
    })
      .then(({ data }) => {
        setResult(data);
        setScore(data.score ?? 0);
        // The profile is the truth; pull it rather than guess locally.
        useGamificationStore.getState().pullFromServer();
      })
      .catch(() => {
        // The student did finish the quiz. Say the score did not save rather
        // than invent one.
        setSaveFailed(true);
      });
  }, [isCompleted, sessionId, answers]);

  if (loadState === "loading") {
    return (
      <div className="min-h-screen pt-32 text-center text-white/40 text-sm">
        {t("learnViews", "loading")}
      </div>
    );
  }

  if (loadState === "empty" || questions.length === 0) {
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

  let feedback = t('quiz', 'goodEffort');
  let achievementIcon = Target;
  let achievementText = t('quiz', 'achievementLearner');
  let achievementColor = "#60a5fa"; // blue

  if (percentage === 100) {
    feedback = t('quiz', 'perfectScore');
    achievementIcon = Trophy;
    achievementText = t('quiz', 'achievementPerfect');
    achievementColor = "#fbbf24"; // gold
  } else if (percentage >= 80) {
    feedback = t('quiz', 'excellentWork');
    achievementIcon = Star;
    achievementText = t('quiz', 'achievementExpert');
    achievementColor = "#34d399"; // green
  } else if (percentage >= 50) {
    feedback = t('quiz', 'notBad');
    achievementIcon = Zap;
    achievementText = t('quiz', 'achievementChallenger');
    achievementColor = "#a78bfa"; // purple
  } else {
    feedback = t('quiz', 'keepStudying');
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
            {lesson ? t('quiz', 'lessonQuiz') : t('quiz', category)}
          </h2>
          {!isCompleted && (
            <div className="text-sm font-medium text-white/50">
              {t('quiz', 'question')} {currentIndex + 1} / {total}
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
                {localised(currentQ, currentLang)}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {optionsOf(currentQ).map((opt, i) => (
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

              <h2 className="text-4xl md:text-5xl font-bold mb-2 text-white">{t('quiz', 'testCompleted')}</h2>
              <p className="text-xl text-white/60 mb-8">{feedback}</p>

              {/* The XP shown here used to be invented in the browser and never
                  persisted. It now comes back from the submit call, and if that
                  call failed the student is told rather than shown a number
                  that will vanish on their next page load. */}
              {saveFailed ? (
                <p className="text-sm text-rose-300/90 mb-6">{t('quiz', 'scoreNotSaved')}</p>
              ) : result ? (
                <p className="text-sm text-emerald-300/80 mb-6">
                  +{result.xp_earned} XP
                </p>
              ) : (
                <p className="text-sm text-white/30 mb-6">{t('quiz', 'savingScore')}</p>
              )}

              <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto mb-12">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <div className="text-sm text-white/50 uppercase tracking-wider mb-1">{t('quiz', 'score')}</div>
                  <div className="text-4xl font-bold text-white">{score}<span className="text-2xl text-white/30">/{total}</span></div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <div className="text-sm text-white/50 uppercase tracking-wider mb-1">{t('quiz', 'accuracy')}</div>
                  <div className="text-4xl font-bold" style={{ color: achievementColor }}>{percentage}%</div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => window.location.reload()}
                  className="px-8 py-4 rounded-xl font-semibold text-white bg-white/10 hover:bg-white/20 transition-colors"
                >
                  {t('quiz', 'retryTest')}
                </button>
                <button
                  onClick={() => navigate("/quiz")}
                  className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white bg-violet-600 hover:bg-violet-500 transition-colors shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                >
                  <Home className="w-5 h-5" /> {t('quiz', 'returnHome')}
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
                {t('quiz', 'timeLeft')}
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
