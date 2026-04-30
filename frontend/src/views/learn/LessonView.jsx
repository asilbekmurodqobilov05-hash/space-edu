import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, Star, ChevronRight, Loader, Sparkles, Zap, Fuel } from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useGamificationStore } from '@/store/useGamificationStore';
import { useAIStore } from '@/store/useAIStore';
import { getFieldByLang } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildSteps(sections, questions) {
    const steps = [];
    if (sections.length > 0) {
        steps.push({ type: 'content', sections });
    }
    questions.forEach((q) => steps.push({ type: 'question', question: q }));
    return steps;
}

// ── Sub-components ────────────────────────────────────────────────────────────

<<<<<<< HEAD
function ContentStep({ sections, language }) {
  return (
    <div className="flex flex-col gap-8">
      {sections.map((s) => (
        <div key={s.id}>
          <p className="text-[17px] text-white/70 leading-[1.85] whitespace-pre-wrap">
            {getFieldByLang(s, 'content', language)?.text || getFieldByLang(s, 'content', language) || ''}
          </p>
=======
function ContentStep({ sections }) {
    return (
        <div className="flex flex-col gap-8">
            {sections.map((s) => (
                <div key={s.id}>
                    <p className="text-[17px] text-white/70 leading-[1.85] whitespace-pre-wrap">
                        {s.content_en?.text || ''}
                    </p>
                </div>
            ))}
>>>>>>> e71ee2f2c3aec99938d700f4ffb001ea39684039
        </div>
    );
}

<<<<<<< HEAD
function QuestionStep({ question, onAnswer, language }) {
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);
  const { setContext } = useAIStore();
=======
function QuestionStep({ question, onAnswer }) {
    const [selected, setSelected] = useState(null);
    const [checked, setChecked] = useState(false);
    const { setContext } = useAIStore();
>>>>>>> e71ee2f2c3aec99938d700f4ffb001ea39684039

    const isCorrect = selected === question.correct_answer;

    const handleCheck = () => {
        if (selected === null) return;
        setChecked(true);
        onAnswer(isCorrect);
    };

<<<<<<< HEAD
  return (
    <div className="flex flex-col gap-8">
      <p className="text-[20px] font-[700] text-white leading-snug">{getFieldByLang(question, 'text', language)}</p>
=======
    return (
        <div className="flex flex-col gap-8">
            <p className="text-[20px] font-[700] text-white leading-snug">{question.text_en}</p>
>>>>>>> e71ee2f2c3aec99938d700f4ffb001ea39684039

            <div className="flex flex-col gap-3">
                {question.options.map((opt) => {
                    const isSelected = selected === opt.id;
                    const isRight = opt.id === question.correct_answer;

                    let cls = 'w-full text-left p-5 rounded-2xl border-2 transition-all text-[15px] font-[500] flex items-center justify-between gap-4 ';
                    if (!checked) {
                        cls += isSelected
                            ? 'border-violet bg-violet/10 text-white'
                            : 'border-white/8 hover:border-violet/40 hover:bg-white/[0.03] text-white/70 hover:text-white';
                    } else {
                        if (isRight) cls += 'border-green-500 bg-green-500/10 text-green-300';
                        else if (isSelected) cls += 'border-red-500 bg-red-500/10 text-red-300';
                        else cls += 'border-white/5 opacity-40 text-white/40';
                    }

<<<<<<< HEAD
          return (
            <button
              key={opt.id}
              onClick={() => !checked && setSelected(opt.id)}
              disabled={checked}
              className={cls}
            >
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-xl border border-current/30 flex items-center justify-center text-xs font-[900] shrink-0 opacity-60">
                  {opt.id}
                </span>
                <span>{getFieldByLang(opt, '', language)}</span>
              </div>
              {checked && isRight && <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />}
              {checked && isSelected && !isRight && <XCircle className="w-5 h-5 text-red-400 shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {checked && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-5 rounded-2xl flex items-start gap-4 ${isCorrect ? 'bg-green-500/8 border border-green-500/25' : 'bg-red-500/8 border border-red-500/25'}`}
        >
          {isCorrect
            ? <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
            : <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />}
          <div className="flex-1">
            <p className={`font-[800] text-sm mb-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {isCorrect ? 'Excellent!' : 'Not quite right'}
            </p>
            <p className="text-white/60 text-[13px] leading-relaxed">
              {isCorrect
                ? getFieldByLang(question, 'explanation', language)
                : `The correct answer is "${getFieldByLang(question.options.find((o) => o.id === question.correct_answer), '', language)}". ${getFieldByLang(question, 'explanation', language) || ''}`}
            </p>
            {!isCorrect && (
              <button
                onClick={() => setContext(`the question: "${getFieldByLang(question, 'text', language)}" in this lesson`)}
                className="mt-3 flex items-center gap-2 px-3 py-2 bg-neon-blue/10 border border-neon-blue/20 rounded-xl text-neon-blue text-[11px] font-[800] hover:bg-neon-blue/20 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" /> Ask COSMOS AI for help
              </button>
=======
                    return (
                        <button
                            key={opt.id}
                            onClick={() => !checked && setSelected(opt.id)}
                            disabled={checked}
                            className={cls}
                        >
                            <div className="flex items-center gap-4">
                                <span className="w-8 h-8 rounded-xl border border-current/30 flex items-center justify-center text-xs font-[900] shrink-0 opacity-60">
                                    {opt.id}
                                </span>
                                <span>{opt.en}</span>
                            </div>
                            {checked && isRight && <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />}
                            {checked && isSelected && !isRight && <XCircle className="w-5 h-5 text-red-400 shrink-0" />}
                        </button>
                    );
                })}
            </div>

            {/* Explanation */}
            {checked && (
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-5 rounded-2xl flex items-start gap-4 ${isCorrect ? 'bg-green-500/8 border border-green-500/25' : 'bg-red-500/8 border border-red-500/25'}`}
                >
                    {isCorrect
                        ? <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                        : <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />}
                    <div className="flex-1">
                        <p className={`font-[800] text-sm mb-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                            {isCorrect ? 'Excellent!' : 'Not quite right'}
                        </p>
                        <p className="text-white/60 text-[13px] leading-relaxed">
                            {isCorrect
                                ? question.explanation_en
                                : `The correct answer is "${question.options.find((o) => o.id === question.correct_answer)?.en}". ${question.explanation_en}`}
                        </p>
                        {!isCorrect && (
                            <button
                                onClick={() => setContext(`the question: "${question.text_en}" in this lesson`)}
                                className="mt-3 flex items-center gap-2 px-3 py-2 bg-neon-blue/10 border border-neon-blue/20 rounded-xl text-neon-blue text-[11px] font-[800] hover:bg-neon-blue/20 transition-colors"
                            >
                                <Sparkles className="w-3.5 h-3.5" /> Ask COSMOS AI for help
                            </button>
                        )}
                    </div>
                </motion.div>
>>>>>>> e71ee2f2c3aec99938d700f4ffb001ea39684039
            )}

            {/* Check button */}
            {!checked && (
                <div className="flex justify-end mt-4">
                    <button
                        onClick={handleCheck}
                        disabled={selected === null}
                        className="px-8 py-4 bg-violet text-white font-[800] rounded-2xl text-sm uppercase tracking-widest hover:bg-violet-dark disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet/20 active:scale-[0.98]"
                    >
                        Check Answer
                    </button>
                </div>
            )}
        </div>
    );
}

function CompletionScreen({ result, lessonTitle, unitId }) {
    const navigate = useNavigate();
    const isAuth = useAuthStore((s) => s.isAuthenticated);

    return (
        <div className="min-h-screen flex items-center justify-center px-4 pt-24 pb-12">
            <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-md w-full"
            >
                <div className="text-center mb-10">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet to-neon-blue mx-auto mb-8 flex items-center justify-center shadow-[0_0_40px_rgba(139,92,246,0.4)]">
                        <Star className="w-12 h-12 text-white" />
                    </div>
                    <h2 className="text-4xl font-[900] text-white tracking-tight mb-3">Lesson Complete!</h2>

                    {isAuth && result ? (
                        <div className="flex items-center justify-center gap-6 mt-6">
                            {result.xp_earned > 0 && (
                                <div className="flex flex-col items-center gap-1">
                                    <div className="flex items-center gap-2 text-2xl font-[900] text-violet-light">
                                        <Zap className="w-6 h-6" /> +{result.xp_earned}
                                    </div>
                                    <p className="text-[10px] font-[800] uppercase tracking-widest text-white/30">XP Earned</p>
                                </div>
                            )}
                            {result.fuel_earned > 0 && (
                                <div className="flex flex-col items-center gap-1">
                                    <div className="flex items-center gap-2 text-2xl font-[900] text-orange-400">
                                        <Fuel className="w-6 h-6" /> +{result.fuel_earned}
                                    </div>
                                    <p className="text-[10px] font-[800] uppercase tracking-widest text-white/30">Fuel</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-white/40 mt-4">
                            <Link to="/register" className="text-violet-light font-[800] hover:underline">Create an account</Link> to save your progress.
                        </p>
                    )}
                </div>

                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => navigate(`/unit/${unitId}`)}
                        className="w-full py-4 rounded-2xl font-[800] text-sm uppercase tracking-widest bg-violet text-white shadow-lg shadow-violet/20 hover:bg-violet-dark transition-all active:scale-[0.98]"
                    >
                        Back to Unit
                    </button>
                    <button
                        onClick={() => navigate('/learn')}
                        className="w-full py-4 rounded-2xl font-[800] text-sm uppercase tracking-widest bg-white/[0.03] border border-white/5 text-white/60 hover:bg-white/[0.08] hover:text-white transition-all"
                    >
                        All Missions
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

// ── Main View ─────────────────────────────────────────────────────────────────

export default function LessonView() {
<<<<<<< HEAD
  const { unitId, lessonId } = useParams();
  const { isAuthenticated } = useAuthStore();
  const { applyLessonResult } = useGamificationStore();
  const { setContext } = useAIStore();
  const { language } = useTranslation();
=======
    const { unitId, lessonId } = useParams();
    const { isAuthenticated } = useAuthStore();
    const { applyLessonResult } = useGamificationStore();
    const { setContext } = useAIStore();
>>>>>>> e71ee2f2c3aec99938d700f4ffb001ea39684039

    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [steps, setSteps] = useState([]);
    const [stepIndex, setStepIndex] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [questionAnswered, setQuestionAnswered] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [result, setResult] = useState(null);
    const [submitting, setSubmitting] = useState(false);

<<<<<<< HEAD
  useEffect(() => {
    api.get(`/courses/lessons/${lessonId}/`)
      .then(({ data }) => {
        setLesson(data);
        setSteps(buildSteps(data.sections || [], data.questions || []));
        setContext(getFieldByLang(data, 'title', language));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
=======
    useEffect(() => {
        api.get(`/courses/lessons/${lessonId}/`)
            .then(({ data }) => {
                setLesson(data);
                setSteps(buildSteps(data.sections || [], data.questions || []));
                setContext(data.title_en);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
>>>>>>> e71ee2f2c3aec99938d700f4ffb001ea39684039

        return () => setContext(undefined);
    }, [lessonId]);

    const currentStep = steps[stepIndex];
    const totalSteps = steps.length;
    const progress = totalSteps ? stepIndex / totalSteps : 0;

    const handleAnswer = (correct) => {
        if (correct) setCorrectCount((c) => c + 1);
        setQuestionAnswered(true);
    };

    const handleNext = async () => {
        if (stepIndex < totalSteps - 1) {
            setStepIndex((i) => i + 1);
            setQuestionAnswered(false);
        } else {
            // Final step — calculate score and submit
            const questionSteps = steps.filter((s) => s.type === 'question');
            const score = questionSteps.length
                ? Math.round((correctCount / questionSteps.length) * 100)
                : 100;

            if (isAuthenticated) {
                setSubmitting(true);
                try {
                    const { data } = await api.post(`/progress/lessons/${lessonId}/complete/`, { score });
                    applyLessonResult(data);
                    setResult(data);
                } catch { /* ignore */ } finally {
                    setSubmitting(false);
                }
            }

            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#8b5cf6', '#00e5ff', '#ffffff'] });
            setCompleted(true);
        }
    };

    const canAdvance = currentStep?.type === 'content' || questionAnswered;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader className="w-8 h-8 text-violet-light animate-spin" />
            </div>
        );
    }

    if (!lesson) {
        return (
            <div className="min-h-screen flex items-center justify-center text-center">
                <div>
                    <h2 className="text-2xl font-bold mb-4 text-white">Lesson not found</h2>
                    <Link to="/learn" className="text-violet-light hover:underline">Return to Academy</Link>
                </div>
            </div>
        );
    }

    if (completed) {
        return <CompletionScreen result={result} lessonTitle={lesson.title_en} unitId={unitId} />;
    }

    return (
        <div className="min-h-screen pt-24 pb-32 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Nav + Progress */}
                <div className="flex items-center gap-6 mb-12">
                    <Link to={`/unit/${unitId}`} className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] transition-colors">
                        <ArrowLeft className="w-5 h-5 text-white/50" />
                    </Link>
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-violet to-neon-blue rounded-full"
                            animate={{ width: `${progress * 100}%` }}
                            transition={{ duration: 0.4 }}
                            style={{ boxShadow: '0 0 10px rgba(139,92,246,0.5)' }}
                        />
                    </div>
                    <span className="text-[11px] font-[800] text-white/30 shrink-0">
                        {stepIndex + 1} / {totalSteps}
                    </span>
                </div>

                {/* Lesson title */}
                <h1 className="text-[clamp(24px,3vw,32px)] font-[900] tracking-tight text-white mb-10 text-center">
                    {lesson.title_en}
                </h1>

                {/* Step content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={stepIndex}
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -24 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white/[0.02] border border-white/5 p-8 md:p-10 rounded-3xl min-h-[320px] relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-48 h-48 bg-violet/5 rounded-full blur-3xl pointer-events-none" />

                        {currentStep?.type === 'content' && (
                            <ContentStep sections={currentStep.sections} />
                        )}
                        {currentStep?.type === 'question' && (
                            <QuestionStep
                                key={currentStep.question.id}
                                question={currentStep.question}
                                onAnswer={handleAnswer}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Footer CTA */}
            <div className="fixed bottom-0 left-0 right-0 p-5 bg-[#05030f]/90 backdrop-blur-xl border-t border-white/5 z-50">
                <div className="max-w-2xl mx-auto flex justify-end">
                    {canAdvance && (
                        <button
                            onClick={handleNext}
                            disabled={submitting}
                            className="flex items-center gap-3 px-8 py-4 bg-violet text-white font-[800] text-sm uppercase tracking-widest rounded-2xl shadow-lg shadow-violet/20 hover:bg-violet-dark disabled:opacity-50 transition-all active:scale-[0.98]"
                        >
                            {submitting ? (
                                <Loader className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    {stepIndex === totalSteps - 1 ? 'Complete' : 'Continue'}
                                    <ChevronRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
<<<<<<< HEAD
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <h2 className="text-2xl font-bold mb-4 text-white">Lesson not found</h2>
          <Link to="/learn" className="text-violet-light hover:underline">Return to Academy</Link>
        </div>
      </div>
    );
  }

  if (completed) {
    return <CompletionScreen result={result} lessonTitle={getFieldByLang(lesson, 'title', language)} unitId={unitId} />;
  }

  return (
    <div className="min-h-screen pt-24 pb-32 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Nav + Progress */}
        <div className="flex items-center gap-6 mb-12">
          <Link to={`/unit/${unitId}`} className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] transition-colors">
            <ArrowLeft className="w-5 h-5 text-white/50" />
          </Link>
          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-violet to-neon-blue rounded-full"
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.4 }}
              style={{ boxShadow: '0 0 10px rgba(139,92,246,0.5)' }}
            />
          </div>
          <span className="text-[11px] font-[800] text-white/30 shrink-0">
            {stepIndex + 1} / {totalSteps}
          </span>
        </div>

        {/* Lesson title */}
        <h1 className="text-[clamp(24px,3vw,32px)] font-[900] tracking-tight text-white mb-10 text-center">
          {getFieldByLang(lesson, 'title', language)}
        </h1>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={stepIndex}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3 }}
            className="bg-white/[0.02] border border-white/5 p-8 md:p-10 rounded-3xl min-h-[320px] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-violet/5 rounded-full blur-3xl pointer-events-none" />

            {currentStep?.type === 'content' && (
              <ContentStep sections={currentStep.sections} language={language} />
            )}
            {currentStep?.type === 'question' && (
              <QuestionStep
                key={currentStep.question.id}
                question={currentStep.question}
                onAnswer={handleAnswer}
                language={language}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-[#05030f]/90 backdrop-blur-xl border-t border-white/5 z-50">
        <div className="max-w-2xl mx-auto flex justify-end">
          {canAdvance && (
            <button
              onClick={handleNext}
              disabled={submitting}
              className="flex items-center gap-3 px-8 py-4 bg-violet text-white font-[800] text-sm uppercase tracking-widest rounded-2xl shadow-lg shadow-violet/20 hover:bg-violet-dark disabled:opacity-50 transition-all active:scale-[0.98]"
            >
              {submitting ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {stepIndex === totalSteps - 1 ? 'Complete' : 'Continue'}
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
=======
>>>>>>> e71ee2f2c3aec99938d700f4ffb001ea39684039
}
