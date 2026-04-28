import { useState, useRef, useEffect, useCallback, useId } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, X, Trash2, BookOpen, HelpCircle, Microscope } from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import { useAIStore } from "@/store/useAIStore";

const GEMINI_MODEL = "gemini-2.0-flash";
const MAX_HISTORY_TURNS = 24;



/** Stylized Uzbek do'ppi (tubeteika) —” traditional embroidered cap for the tutor avatar */
function UzbekDoppiMark({ className }) {
  const uid = useId().replace(/:/g, "");
  const gradDome = `doppi-dome-${uid}`;
  const gradGold = `doppi-gold-${uid}`;
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id={gradDome} x1="10" y1="8" x2="38" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1e3a5f" />
          <stop offset="0.45" stopColor="#0f2744" />
          <stop offset="1" stopColor="#152d4a" />
        </linearGradient>
        <linearGradient id={gradGold} x1="18" y1="16" x2="30" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fde68a" />
          <stop offset="0.5" stopColor="#fbbf24" />
          <stop offset="1" stopColor="#d97706" />
        </linearGradient>
      </defs>
      {/* Brim */}
      <ellipse cx="24" cy="36.5" rx="17" ry="4.2" fill="#0c1a2e" stroke="#38bdf8" strokeOpacity="0.35" strokeWidth="0.75" />
      <ellipse cx="24" cy="35.8" rx="15" ry="3" fill="#152a45" />
      {/* Crown / dome */}
      <path
        d="M11 33.5C11 22 15.5 14 24 12c8.5 2 13 10 13 21.5v1.5H11v-1.5Z"
        fill={`url(#${gradDome})`}
        stroke="#22d3ee"
        strokeOpacity="0.25"
        strokeWidth="0.6"
      />
      {/* Embroidery band */}
      <path
        d="M12.5 30.5h23"
        stroke="#38bdf8"
        strokeOpacity="0.5"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* Central quatrefoil / gГјll motif (simplified) */}
      <circle cx="24" cy="22" r="5.5" fill="none" stroke={`url(#${gradGold})`} strokeWidth="1.1" opacity="0.95" />
      <path
        d="M24 16.5v11M18.5 22h11"
        stroke={`url(#${gradGold})`}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.9"
      />
      <circle cx="24" cy="22" r="2" fill="#0ea5e9" fillOpacity="0.35" />
      {/* Side pattern hints */}
      <path d="M16 26.5c1.2-2 2.8-3.2 4.5-3.8M32 26.5c-1.2-2-2.8-3.2-4.5-3.8" stroke="#67e8f9" strokeOpacity="0.4" strokeWidth="0.7" strokeLinecap="round" />
      {/* Highlight */}
      <ellipse cx="19" cy="20" rx="2.5" ry="1.8" fill="#ffffff" fillOpacity="0.12" transform="rotate(-25 19 20)" />
    </svg>
  );
}

function buildSystemInstruction(context, mode) {
  const modeBlock =
    mode === "quiz"
      ? `MODE: QUIZ. Invent short multiple-choice or free-recall checks (with answers after the learner tries). Keep difficulty age-appropriate.`
      : mode === "deep"
        ? `MODE: DEEP DIVE. Use precise vocabulary, add formulas where helpful, relate ideas to observatories and measurement (e.g. star catalogs, orbital geometry).`
        : `MODE: EXPLAIN. Start intuitive, then add one layer of detail; use analogies and short bullet steps.`;

  return `You are the Space edu AI tutor —” a senior space-science educator for the bilingual "Space edu" platform (Uzbekistan + international learners, roughly ages 10—“18).

${modeBlock}

CURRENT PAGE TOPIC: ${context || "General space science"}

PEDAGOGY:
1. Be accurate, encouraging, and culturally grounded: when relevant, mention Central Asian contributions (e.g. Mirzo Ulug'bek's Samarkand observatory, Ahmad al-Farg'oniy / Alfraganus and star tables).
2. Prefer Socratic hints before giving full answers; if the learner is stuck, give a clear worked example.
3. Structure longer replies with short headings, numbered steps, and a one-line recap.
4. If the question is off-topic, answer in one sentence then gently steer back to STEM or Uzbek space education context.
5. Never claim to browse the live web unless tools are provided; you are tutoring from general knowledge.`;
}

function messagesToContents(msgs) {
  return msgs.map((m) => ({
    role: m.role === "user" ? ("user") : ("model"),
    parts: [{ text: m.text }],
  }));
}

export default function AskCosmos() {
  const { context } = useAIStore();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("explain");
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Salom / Hello —” I'm your Space edu tutor. Ask about planets, orbits, light, rockets, or how ancient Central Asian astronomers measured the sky. Pick a mode below for quiz-style checks or a deeper dive.",
    },
  ]);

  useEffect(() => {
    if (context && messages.length === 1) {
      setMessages([
        {
          role: "ai",
          text: `You're on —њ${context}". I'm your Space edu tutor —” ask a question, or tap a quick prompt below.`,
        },
      ]);
    }
  }, [context]);

  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const resetChat = useCallback(() => {
    setMessages([
      {
        role: "ai",
        text: "Conversation cleared. What would you like to explore next?",
      },
    ]);
    setQuery("");
  }, []);

  const pushSuggestion = (text) => {
    setQuery(text);
  };

  const handleSend = async () => {
    if (!query.trim()) return;

    const userMessage = query.trim();
    const trimmedHistory = messages.slice(-MAX_HISTORY_TURNS);
    const newMessages = [...trimmedHistory, { role: "user", text: userMessage }];
    setMessages(newMessages);
    setQuery("");
    setIsTyping(true);

    const apiKey = process.env.GEMINI_API_KEY || "";
    if (!apiKey) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Add GEMINI_API_KEY to your .env / environment so the tutor can reach the model. Until then, try the lessons and 3D solar system —” they work offline.",
        },
      ]);
      setIsTyping(false);
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = buildSystemInstruction(context, mode);
      const contents = messagesToContents(newMessages);

      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents,
        config: {
          systemInstruction,
          temperature: mode === "quiz" ? 0.45 : mode === "deep" ? 0.65 : 0.75,
          maxOutputTokens: 2048,
        },
      });

      const aiResponse = response.text || "I couldn't generate a reply. Try rephrasing or shortening your question.";

      setMessages((prev) => [...prev, { role: "ai", text: aiResponse }]);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "The tutor hit an API error (model name, quota, or network). Check your key in AI Studio and try again.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  const suggestions = [
    "Why do planets stay in orbit instead of flying away?",
    "How did Ulug'bek's catalog help later astronomers?",
    "Quiz me on the difference between mass and weight.",
  ];

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_24px_rgba(0,180,216,0.45)] hover:scale-110 transition-transform z-40 border border-white/20 bg-[#0a1020]/90"
        whileHover={{ rotate: 6 }}
        whileTap={{ scale: 0.92 }}
        aria-label="Open Space edu AI tutor (Uzbek do'ppi)"
      >
        <UzbekDoppiMark className="w-9 h-9" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            className="fixed bottom-24 right-4 sm:right-8 w-[min(100vw-2rem,440px)] h-[min(85vh,580px)] glass rounded-2xl border border-cyan-500/25 shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            <div className="p-3 sm:p-4 border-b border-white/10 bg-space-800/90 flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="shrink-0 w-10 h-10 rounded-full bg-[#0a1020] flex items-center justify-center border border-white/10">
                  <UzbekDoppiMark className="w-7 h-7" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-white text-sm sm:text-base leading-tight">Space edu AI tutor</h3>
                  <p className="text-[11px] sm:text-xs text-white/50 truncate">
                    {context ? `Context: ${context}` : "General space & STEM help"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={resetChat}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                  title="Clear conversation"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="px-3 pt-2 flex flex-wrap gap-1.5 border-b border-white/5 bg-space-900/40">
              {(
                [
                  { id: "explain", label: "Explain", Icon: BookOpen },
                  { id: "quiz", label: "Quiz me", Icon: HelpCircle },
                  { id: "deep", label: "Deep dive", Icon: Microscope },
                ]
              ).map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setMode(id)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors ${mode === id
                      ? "bg-cyan-500/20 border-cyan-400/60 text-cyan-100"
                      : "border-white/10 text-white/55 hover:border-white/25 hover:text-white/85"
                    }`}
                >
                  <Icon className="w-3 h-3 opacity-90" />
                  {label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
              {messages.length <= 2 && (
                <div className="flex flex-wrap gap-1.5 pb-1">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => pushSuggestion(s)}
                      className="text-left text-[11px] sm:text-xs px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-white/75 hover:border-cyan-400/40 hover:text-white transition-colors max-w-full"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[92%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === "user"
                        ? "bg-cyan-400 text-space-900 rounded-tr-none font-medium"
                        : "bg-white/10 text-white rounded-tl-none border border-white/5 whitespace-pre-wrap"
                      }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/10 p-3 rounded-2xl rounded-tl-none border border-white/5 flex gap-1">
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6 }}
                      className="w-2 h-2 bg-cyan-300 rounded-full"
                    />
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                      className="w-2 h-2 bg-cyan-300 rounded-full"
                    />
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                      className="w-2 h-2 bg-cyan-300 rounded-full"
                    />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-white/10 bg-space-800/90 space-y-2">
              <div className="flex gap-2">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Ask about orbits, stars, rockets, or history…"
                  disabled={isTyping}
                  rows={2}
                  className="flex-1 resize-none bg-space-900 border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400/70 disabled:opacity-50 min-h-[44px]"
                />
                <button
                  type="button"
                  onClick={() => void handleSend()}
                  disabled={!query.trim() || isTyping}
                  className="w-11 h-11 self-end shrink-0 bg-cyan-400 rounded-xl flex items-center justify-center text-space-900 disabled:opacity-45 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </div>
              <p className="text-[10px] text-white/35">Enter to send В· Shift+Enter for newline В· Multi-turn memory (last {MAX_HISTORY_TURNS} messages)</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}


