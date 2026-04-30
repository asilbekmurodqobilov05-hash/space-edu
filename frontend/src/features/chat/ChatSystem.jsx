import { useState, useRef, useEffect, useCallback, useId } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Send, X, Trash2, BookOpen, HelpCircle, Microscope, 
  MessageCircle, MessageSquare, User, Users, 
  Sparkles, Search, MoreVertical, Paperclip, Smile
} from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import { useAIStore } from "@/store/useAIStore";
import { useAuthStore } from "@/store/useAuthStore";

const GEMINI_MODEL = "gemini-2.0-flash";
const MAX_HISTORY_TURNS = 24;

// --- MOCK DATA ---
const MOCK_CONTACTS = [
  { id: 1, name: "Azizbek Astronomer", lastMsg: "Check out the new telescope data!", time: "10:24 AM", status: 'online' },
  { id: 2, name: "Zuhra Physics", lastMsg: "Did you solve the orbit problem?", time: "Yesterday", status: 'offline' },
  { id: 3, name: "Space Explorer", lastMsg: "Welcome to the cosmos!", time: "2 days ago", status: 'online' },
  { id: 4, name: "Mirzo Ulug'bek", lastMsg: "The stars never lie.", time: "3 days ago", status: 'away' },
];

const MOCK_MESSAGES = {
  1: [
    { id: 1, role: 'user', text: "Hello Azizbek! How's the observatory?", time: "10:20 AM" },
    { id: 2, role: 'contact', text: "It's great! Check out the new telescope data!", time: "10:24 AM" },
  ],
  2: [
    { id: 1, role: 'contact', text: "Did you solve the orbit problem?", time: "Yesterday" },
  ],
  3: [
    { id: 1, role: 'contact', text: "Welcome to the cosmos!", time: "2 days ago" },
  ],
  4: [
    { id: 1, role: 'contact', text: "The stars never lie.", time: "3 days ago" },
  ],
};

// --- COMPONENTS ---

function UzbekDoppiMark({ className }) {
  const uid = useId().replace(/:/g, "");
  const gradDome = `doppi-dome-${uid}`;
  const gradGold = `doppi-gold-${uid}`;
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
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
      <ellipse cx="24" cy="36.5" rx="17" ry="4.2" fill="#0c1a2e" stroke="#38bdf8" strokeOpacity="0.35" strokeWidth="0.75" />
      <ellipse cx="24" cy="35.8" rx="15" ry="3" fill="#152a45" />
      <path d="M11 33.5C11 22 15.5 14 24 12c8.5 2 13 10 13 21.5v1.5H11v-1.5Z" fill={`url(#${gradDome})`} stroke="#22d3ee" strokeOpacity="0.25" strokeWidth="0.6" />
      <path d="M12.5 30.5h23" stroke="#38bdf8" strokeOpacity="0.5" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="24" cy="22" r="5.5" fill="none" stroke={`url(#${gradGold})`} strokeWidth="1.1" opacity="0.95" />
      <path d="M24 16.5v11M18.5 22h11" stroke={`url(#${gradGold})`} strokeWidth="1" strokeLinecap="round" opacity="0.9" />
      <circle cx="24" cy="22" r="2" fill="#0ea5e9" fillOpacity="0.35" />
      <path d="M16 26.5c1.2-2 2.8-3.2 4.5-3.8M32 26.5c-1.2-2-2.8-3.2-4.5-3.8" stroke="#67e8f9" strokeOpacity="0.4" strokeWidth="0.7" strokeLinecap="round" />
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

export default function ChatSystem() {
  const { context, isSupportOpen, setIsSupportOpen } = useAIStore();
  const { user } = useAuthStore();
  const [activeWindow, setActiveWindow] = useState(null); // 'support' or 'chat'
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (isSupportOpen) {
      setActiveWindow('support');
      setIsSupportOpen(false);
    }
  }, [isSupportOpen, setIsSupportOpen]);

  // Support Chat State
  const [supportQuery, setSupportQuery] = useState("");
  const [supportMode, setSupportMode] = useState("explain");
  const [supportMessages, setSupportMessages] = useState([
    {
      role: "ai",
      text: "Salom / Hello —” I'm your Space edu tutor. Ask about planets, orbits, light, rockets, or how ancient Central Asian astronomers measured the sky. Pick a mode below for quiz-style checks or a deeper dive.",
    },
  ]);
  const [isTypingSupport, setIsTypingSupport] = useState(false);
  const supportEndRef = useRef(null);

  // Direct Chat State
  const [selectedContact, setSelectedContact] = useState(MOCK_CONTACTS[0]);
  const [chatQuery, setChatQuery] = useState("");
  const chatEndRef = useRef(null);

  const scrollToBottomSupport = () => {
    supportEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToBottomChat = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (activeWindow === 'support') scrollToBottomSupport();
  }, [supportMessages, isTypingSupport, activeWindow]);

  useEffect(() => {
    if (activeWindow === 'chat') scrollToBottomChat();
  }, [selectedContact, activeWindow]);

  const handleSupportSend = async () => {
    if (!supportQuery.trim()) return;

    const userMessage = supportQuery.trim();
    const newMessages = [...supportMessages, { role: "user", text: userMessage }];
    setSupportMessages(newMessages);
    setSupportQuery("");
    setIsTypingSupport(true);

    const apiKey = process.env.GEMINI_API_KEY || "";
    if (!apiKey) {
      setSupportMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Add GEMINI_API_KEY to your .env / environment so the tutor can reach the model.",
        },
      ]);
      setIsTypingSupport(false);
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = buildSystemInstruction(context, supportMode);
      const contents = messagesToContents(newMessages);

      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents,
        config: {
          systemInstruction,
          temperature: supportMode === "quiz" ? 0.45 : supportMode === "deep" ? 0.65 : 0.75,
          maxOutputTokens: 2048,
        },
      });

      const aiResponse = response.text || "I couldn't generate a reply. Try rephrasing or shortening your question.";
      setSupportMessages((prev) => [...prev, { role: "ai", text: aiResponse }]);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      setSupportMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "The tutor hit an API error. Please try again later.",
        },
      ]);
    } finally {
      setIsTypingSupport(false);
    }
  };

  const handleChatSend = () => {
    if (!chatQuery.trim()) return;
    // In a real app, we'd send this to the backend
    setChatQuery("");
    scrollToBottomChat();
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4">
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="glass rounded-2xl p-2 shadow-2xl border border-white/10 flex flex-col gap-1 min-w-[160px]"
            >
              <button
                onClick={() => { setActiveWindow('chat'); setMenuOpen(false); }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-sm font-medium"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo/20 flex items-center justify-center text-indigo">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <span>Chat</span>
              </button>
              <button
                onClick={() => { setActiveWindow('support'); setMenuOpen(false); }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-sm font-medium"
              >
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span>Support Chat</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={toggleMenu}
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_24px_rgba(139,92,246,0.4)] hover:scale-110 transition-transform border border-white/20 bg-indigo/90"
          whileHover={{ rotate: 5 }}
          whileTap={{ scale: 0.92 }}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-7 h-7" />}
        </motion.button>
      </div>

      {/* Support Chat Window (Existing AI Tutor Logic) */}
      <AnimatePresence>
        {activeWindow === 'support' && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            className="fixed bottom-24 right-4 sm:right-8 w-[min(100vw-2rem,440px)] h-[min(85vh,580px)] glass rounded-2xl border border-cyan-500/25 shadow-2xl flex flex-col z-[101] overflow-hidden"
          >
            <div className="p-4 border-b border-white/10 bg-space-800/90 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-space-900 flex items-center justify-center border border-white/10">
                  <UzbekDoppiMark className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Space Edu AI Support</h3>
                  <p className="text-[10px] text-white/50 uppercase tracking-widest">Always online</p>
                </div>
              </div>
              <button onClick={() => setActiveWindow(null)} className="p-2 text-white/40 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-3 py-2 flex gap-1.5 border-b border-white/5 bg-space-900/40">
              {[
                { id: "explain", label: "Explain", Icon: BookOpen },
                { id: "quiz", label: "Quiz me", Icon: HelpCircle },
                { id: "deep", label: "Deep dive", Icon: Microscope },
              ].map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => setSupportMode(id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border transition-all ${
                    supportMode === id ? "bg-cyan-500/20 border-cyan-400/60 text-cyan-100" : "border-white/10 text-white/50 hover:border-white/25"
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {supportMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    msg.role === "user" ? "bg-indigo text-white rounded-tr-none" : "bg-white/5 border border-white/10 text-white rounded-tl-none"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTypingSupport && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none border border-white/10 flex gap-1">
                    <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                    <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                    <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                  </div>
                </div>
              )}
              <div ref={supportEndRef} />
            </div>

            <div className="p-4 border-t border-white/10 bg-space-800/90">
              <div className="flex gap-2">
                <input
                  value={supportQuery}
                  onChange={(e) => setSupportQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSupportSend()}
                  placeholder="Ask your tutor anything..."
                  className="flex-1 bg-space-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400/50"
                />
                <button
                  onClick={handleSupportSend}
                  disabled={!supportQuery.trim() || isTypingSupport}
                  className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center text-white disabled:opacity-30 transition-opacity"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Direct Chat Window (Large Half Page) */}
      <AnimatePresence>
        {activeWindow === 'chat' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed top-0 right-0 w-full md:w-1/2 h-full glass z-[200] shadow-2xl flex border-l border-white/10"
          >
            {/* Sidebar */}
            <div className="w-20 md:w-80 border-r border-white/5 flex flex-col bg-space-900/50">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h2 className="hidden md:block font-black text-xl tracking-tighter uppercase">Messages</h2>
                <User className="w-6 h-6 text-white/40" />
              </div>
              <div className="p-4 hidden md:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input 
                    placeholder="Search contacts..." 
                    className="w-full bg-white/5 border border-white/5 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-indigo/50"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto scrollbar-hide">
                {MOCK_CONTACTS.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className={`w-full p-4 md:p-6 flex items-center gap-4 hover:bg-white/5 transition-all relative ${
                      selectedContact?.id === contact.id ? 'bg-white/5' : ''
                    }`}
                  >
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-indigo/20 flex items-center justify-center border border-white/10 text-indigo font-bold">
                        {contact.name[0]}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-space-900 ${
                        contact.status === 'online' ? 'bg-green-500' : contact.status === 'away' ? 'bg-yellow-500' : 'bg-gray-500'
                      }`} />
                    </div>
                    <div className="hidden md:block flex-1 text-left min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-sm truncate">{contact.name}</h4>
                        <span className="text-[10px] text-white/30 whitespace-nowrap">{contact.time}</span>
                      </div>
                      <p className="text-xs text-white/40 truncate">{contact.lastMsg}</p>
                    </div>
                    {selectedContact?.id === contact.id && (
                      <motion.div layoutId="activeContact" className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-indigo rounded-r-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col relative overflow-hidden">
              <div className="p-6 border-b border-white/5 bg-space-800/30 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 font-bold border border-white/10">
                    {selectedContact?.name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">{selectedContact?.name}</h3>
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${selectedContact?.status === 'online' ? 'bg-green-500' : 'bg-white/20'}`} />
                      <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold">
                        {selectedContact?.status === 'online' ? 'Active now' : 'Offline'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setActiveWindow(null)} className="p-2.5 rounded-xl hover:bg-white/5 text-white/40 hover:text-white transition-all">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {(MOCK_MESSAGES[selectedContact.id] || []).map((msg, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={idx} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-3`}
                  >
                    {msg.role !== 'user' && (
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] text-white/30 border border-white/5 shrink-0">
                        {selectedContact.name[0]}
                      </div>
                    )}
                    <div className={`max-w-[70%] group`}>
                      <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-xl ${
                        msg.role === 'user' 
                          ? 'bg-indigo text-white rounded-br-none shadow-indigo/20' 
                          : 'bg-white/5 border border-white/10 text-white/90 rounded-bl-none'
                      }`}>
                        {msg.text}
                      </div>
                      <div className={`mt-2 text-[9px] font-bold text-white/20 uppercase tracking-widest ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                        {msg.time}
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <div className="p-6 border-t border-white/5 bg-space-900/50">
                <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-4 py-2 focus-within:border-indigo/50 transition-colors">
                  <button className="p-2 text-white/20 hover:text-indigo transition-colors"><Paperclip className="w-4 h-4" /></button>
                  <input
                    value={chatQuery}
                    onChange={(e) => setChatQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleChatSend()}
                    placeholder={`Message ${selectedContact?.name}...`}
                    className="flex-1 bg-transparent py-3 text-sm text-white focus:outline-none"
                  />
                  <button className="p-2 text-white/20 hover:text-indigo transition-colors"><Smile className="w-4 h-4" /></button>
                  <button 
                    onClick={handleChatSend}
                    disabled={!chatQuery.trim()}
                    className="w-10 h-10 bg-indigo rounded-xl flex items-center justify-center text-white disabled:opacity-20 transition-all hover:scale-105 active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
