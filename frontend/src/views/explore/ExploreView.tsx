import { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Rocket, Sparkles, User, Globe, Download, X, ArrowRight } from "lucide-react";
import html2canvas from "html2canvas";
import { useUserStore } from "@/store/useUserStore";
import { Link } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";

function traineeIdFromName(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return `SE-${(h % 10000).toString().padStart(4, "0")}`;
}

export default function ExploreView() {
  const { t } = useTranslation();
  const { astronautName, setAstronautName } = useUserStore();
  const [nameInput, setNameInput] = useState(astronautName);
  const [showCard, setShowCard] = useState(!!astronautName);
  const cardRef = useRef<HTMLDivElement>(null);
  const displayName = astronautName || nameInput.trim();
  const traineeId = useMemo(() => (displayName ? traineeIdFromName(displayName) : "SE-0000"), [displayName]);

  // Quiz State
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Planet Builder State
  const [showPlanetBuilder, setShowPlanetBuilder] = useState(false);
  const [planetConfig, setPlanetConfig] = useState({
    size: 150,
    color1: "#00f3ff",
    color2: "#b537f2",
    atmosphere: 20,
    rings: false,
  });

  const quizQuestions = [
    {
      q: "How do you handle high-pressure situations?",
      options: [
        "Stay calm and analyze",
        "Panic",
        "Ask for help immediately",
        "Ignore it",
      ],
      correct: 0,
    },
    {
      q: "Are you comfortable in confined spaces?",
      options: [
        "Yes, I love cozy spots",
        "Not at all",
        "For a short time",
        "Only with a window",
      ],
      correct: 0,
    },
    {
      q: "How is your physical fitness?",
      options: ["Excellent", "Average", "Poor", "I prefer sitting"],
      correct: 0,
    },
    {
      q: "Can you eat freeze-dried food for months?",
      options: [
        "Absolutely",
        "Maybe with hot sauce",
        "No way",
        "Only ice cream",
      ],
      correct: 0,
    },
    {
      q: "How well do you work in a team?",
      options: [
        "I'm a team player",
        "I prefer working alone",
        "I like to lead",
        "I follow orders",
      ],
      correct: 0,
    },
  ];

  const handleQuizAnswer = (idx: number) => {
    if (idx === quizQuestions[quizStep].correct)
      setQuizScore((prev) => prev + 1);
    if (quizStep < quizQuestions.length - 1) {
      setQuizStep((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleGenerateCard = () => {
    if (nameInput.trim()) {
      setAstronautName(nameInput.trim());
      setShowCard(true);
    }
  };

  const handleDownloadCard = async () => {
    if (cardRef.current) {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#050511",
        scale: 2,
      });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `astronaut-card-${astronautName}.png`;
      link.click();
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          {t('explore', 'title')}{" "}
          <span className="text-glow-purple text-neon-purple">{t('explore', 'titleHighlight')}</span>
        </motion.h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          {t('explore', 'subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Quiz Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="glass p-8 rounded-3xl relative overflow-hidden group flex flex-col"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-neon-blue/20 rounded-full blur-2xl group-hover:bg-neon-blue/30 transition-colors" />
          <Sparkles className="w-10 h-10 text-neon-blue mb-6" />
          <h2 className="text-2xl font-bold mb-4">
            {t('explore', 'quizTitle')}
          </h2>
          <p className="text-gray-300 mb-8 flex-grow">
            {t('explore', 'quizDesc')}
          </p>
          <button
            onClick={() => {
              setShowQuiz(true);
              setQuizStep(0);
              setQuizScore(0);
              setQuizFinished(false);
            }}
            className="px-6 py-3 bg-neon-blue/20 text-neon-blue border border-neon-blue/50 rounded-full font-medium hover:bg-neon-blue hover:text-space-900 transition-all box-glow-blue self-start"
          >
            {t('explore', 'startQuiz')}
          </button>
        </motion.div>

        {/* Mini Game Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass p-8 rounded-3xl relative overflow-hidden group flex flex-col"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-neon-purple/20 rounded-full blur-2xl group-hover:bg-neon-purple/30 transition-colors" />
          <Globe className="w-10 h-10 text-neon-purple mb-6" />
          <h2 className="text-2xl font-bold mb-4">{t('explore', 'builderTitle')}</h2>
          <p className="text-gray-300 mb-8 flex-grow">
            {t('explore', 'builderDesc')}
          </p>
          <button
            onClick={() => setShowPlanetBuilder(true)}
            className="px-6 py-3 bg-neon-purple/20 text-neon-purple border border-neon-purple/50 rounded-full font-medium hover:bg-neon-purple hover:text-white transition-all box-glow-purple self-start"
          >
            {t('explore', 'openBuilder')}
          </button>
        </motion.div>

        {/* 3D Solar System Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass p-8 rounded-3xl relative overflow-hidden group flex flex-col"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/20 rounded-full blur-2xl group-hover:bg-yellow-500/30 transition-colors" />
          <Globe className="w-10 h-10 text-yellow-400 mb-6" />
          <h2 className="text-2xl font-bold mb-4">{t('explore', 'solarSystemTitle')}</h2>
          <p className="text-gray-300 mb-8 flex-grow">
            {t('explore', 'solarSystemDesc')}
          </p>
          <Link
            to="/3d-solar-system"
            className="px-6 py-3 bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 rounded-full font-medium hover:bg-yellow-500 hover:text-space-900 transition-all box-glow-blue self-start flex items-center gap-2"
          >
            {t('explore', 'launch3DView')} <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>

      {/* Astronaut Card Generator */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="glass p-8 md:p-12 rounded-3xl text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/5 to-neon-purple/5" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <Rocket className="w-12 h-12 mx-auto text-white mb-6" />
          <h2 className="text-3xl font-bold mb-4">
            {t('explore', 'generateCardTitle')}
          </h2>
          <p className="text-gray-300 mb-8">
            {t('explore', 'generateCardDesc')}
          </p>

          {!showCard ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="text"
                placeholder={t('explore', 'enterName')}
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="px-6 py-3 rounded-full bg-space-800 border border-white/20 focus:outline-none focus:border-neon-blue text-white w-full sm:w-64"
              />
              <button
                onClick={handleGenerateCard}
                className="px-8 py-3 bg-white text-space-900 font-bold rounded-full hover:bg-gray-200 transition-colors"
              >
                {t('explore', 'generate')}
              </button>
            </div>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-8 flex flex-col items-center"
            >
              <div
                ref={cardRef}
                className="w-full max-w-sm bg-gradient-to-br from-space-800 to-space-900 border border-neon-blue/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(0,243,255,0.2)] text-left relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-neon-blue to-neon-purple" />
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-space-700 flex items-center justify-center border-2 border-neon-blue">
                    <User className="w-8 h-8 text-neon-blue" />
                  </div>
                  <div>
                    <p className="text-xs text-neon-blue uppercase tracking-wider font-bold">
                      {t('explore', 'official')}
                    </p>
                    <h3 className="text-xl font-bold text-white">
                      {astronautName}
                    </h3>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-gray-400">{t('explore', 'role')}</span>
                    <span className="text-white font-medium">
                      {t('explore', 'roleValue')}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-gray-400">{t('explore', 'destination')}</span>
                    <span className="text-white font-medium">{t('explore', 'destinationValue')}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-gray-400">{t('explore', 'id')}</span>
                    <span className="text-neon-purple font-mono">{traineeId}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleDownloadCard}
                  className="flex items-center gap-2 px-6 py-2 bg-neon-blue/20 text-neon-blue rounded-full hover:bg-neon-blue hover:text-space-900 transition-colors"
                >
                  <Download className="w-4 h-4" /> {t('explore', 'downloadCard')}
                </button>
                <button
                  onClick={() => {
                    setShowCard(false);
                    setNameInput("");
                    setAstronautName("");
                  }}
                  className="px-6 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {t('explore', 'createAnother')}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {showQuiz && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-900/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="glass p-8 rounded-3xl max-w-lg w-full relative"
            >
              <button
                onClick={() => setShowQuiz(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>

              {!quizFinished ? (
                <>
                  <div className="mb-8">
                    <p className="text-neon-blue font-bold mb-2">
                      {t('explore', 'question')} {quizStep + 1} {t('explore', 'of')} {quizQuestions.length}
                    </p>
                    <h3 className="text-2xl font-bold">
                      {quizQuestions[quizStep].q}
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {quizQuestions[quizStep].options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuizAnswer(idx)}
                        className="w-full text-left p-4 rounded-xl border border-white/10 hover:bg-white/10 hover:border-neon-blue transition-all"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Sparkles className="w-16 h-16 text-neon-blue mx-auto mb-4" />
                  <h3 className="text-3xl font-bold mb-2">{t('explore', 'quizComplete')}</h3>
                  <p className="text-xl mb-6">
                    {t('explore', 'youScored')} {quizScore} {t('explore', 'outOf')} {quizQuestions.length}
                  </p>
                  <p className="text-gray-300 mb-8">
                    {quizScore >= 4
                      ? t('explore', 'quizPass')
                      : t('explore', 'quizFail')}
                  </p>
                  <button
                    onClick={() => setShowQuiz(false)}
                    className="px-8 py-3 bg-neon-blue text-space-900 font-bold rounded-full hover:bg-white transition-colors"
                  >
                    {t('explore', 'close')}
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}

        {showPlanetBuilder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-900/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="glass p-8 rounded-3xl max-w-4xl w-full relative flex flex-col md:flex-row gap-8"
            >
              <button
                onClick={() => setShowPlanetBuilder(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Controls */}
              <div className="w-full md:w-1/2 space-y-6">
                <h3 className="text-2xl font-bold mb-6">{t('explore', 'planetBuilder')}</h3>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    {t('explore', 'size')}
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="250"
                    value={planetConfig.size}
                    onChange={(e) =>
                      setPlanetConfig({
                        ...planetConfig,
                        size: Number(e.target.value),
                      })
                    }
                    className="w-full accent-neon-purple"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      {t('explore', 'color1')}
                    </label>
                    <input
                      type="color"
                      value={planetConfig.color1}
                      onChange={(e) =>
                        setPlanetConfig({
                          ...planetConfig,
                          color1: e.target.value,
                        })
                      }
                      className="w-full h-10 rounded cursor-pointer bg-transparent border border-white/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      {t('explore', 'color2')}
                    </label>
                    <input
                      type="color"
                      value={planetConfig.color2}
                      onChange={(e) =>
                        setPlanetConfig({
                          ...planetConfig,
                          color2: e.target.value,
                        })
                      }
                      className="w-full h-10 rounded cursor-pointer bg-transparent border border-white/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    {t('explore', 'atmosphere')}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={planetConfig.atmosphere}
                    onChange={(e) =>
                      setPlanetConfig({
                        ...planetConfig,
                        atmosphere: Number(e.target.value),
                      })
                    }
                    className="w-full accent-neon-blue"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="rings"
                    checked={planetConfig.rings}
                    onChange={(e) =>
                      setPlanetConfig({
                        ...planetConfig,
                        rings: e.target.checked,
                      })
                    }
                    className="w-5 h-5 accent-neon-blue"
                  />
                  <label htmlFor="rings" className="text-white">
                    {t('explore', 'toggleRings')}
                  </label>
                </div>
              </div>

              {/* Preview */}
              <div className="w-full md:w-1/2 flex items-center justify-center bg-space-900/50 rounded-2xl p-8 min-h-[300px] relative overflow-hidden">
                <div
                  className="rounded-full relative"
                  style={{
                    width: `${planetConfig.size}px`,
                    height: `${planetConfig.size}px`,
                    background: `linear-gradient(45deg, ${planetConfig.color1}, ${planetConfig.color2})`,
                    boxShadow: `0 0 ${planetConfig.atmosphere}px ${planetConfig.atmosphere / 2}px ${planetConfig.color1}80, inset -20px -20px 40px rgba(0,0,0,0.5)`,
                    transition: "all 0.3s ease",
                  }}
                >
                  {planetConfig.rings && (
                    <div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[50%] border-[8px] border-white/20"
                      style={{
                        width: `${planetConfig.size * 1.8}px`,
                        height: `${planetConfig.size * 0.4}px`,
                        transform: "translate(-50%, -50%) rotate(20deg)",
                        boxShadow: `0 0 10px ${planetConfig.color2}40`,
                      }}
                    />
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
