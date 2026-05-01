import { useState, useRef, useEffect, useId } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Send, X, BookOpen, HelpCircle, Microscope,
  MessageCircle, MessageSquare, Search, Smile, Sparkles
} from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import { useAIStore } from "@/store/useAIStore";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/api";

const GEMINI_MODEL = "gemini-2.0-flash";

function UzbekDoppiMark({ className }) {
  const uid = useId().replace(/:/g, "");
  const gD = `dd-${uid}`, gG = `dg-${uid}`;
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <linearGradient id={gD} x1="10" y1="8" x2="38" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1e3a5f" /><stop offset="0.45" stopColor="#0f2744" /><stop offset="1" stopColor="#152d4a" />
        </linearGradient>
        <linearGradient id={gG} x1="18" y1="16" x2="30" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fde68a" /><stop offset="0.5" stopColor="#fbbf24" /><stop offset="1" stopColor="#d97706" />
        </linearGradient>
      </defs>
      <ellipse cx="24" cy="36.5" rx="17" ry="4.2" fill="#0c1a2e" stroke="#38bdf8" strokeOpacity="0.35" strokeWidth="0.75" />
      <ellipse cx="24" cy="35.8" rx="15" ry="3" fill="#152a45" />
      <path d="M11 33.5C11 22 15.5 14 24 12c8.5 2 13 10 13 21.5v1.5H11v-1.5Z" fill={`url(#${gD})`} stroke="#22d3ee" strokeOpacity="0.25" strokeWidth="0.6" />
      <path d="M12.5 30.5h23" stroke="#38bdf8" strokeOpacity="0.5" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="24" cy="22" r="5.5" fill="none" stroke={`url(#${gG})`} strokeWidth="1.1" opacity="0.95" />
      <path d="M24 16.5v11M18.5 22h11" stroke={`url(#${gG})`} strokeWidth="1" strokeLinecap="round" opacity="0.9" />
      <circle cx="24" cy="22" r="2" fill="#0ea5e9" fillOpacity="0.35" />
    </svg>
  );
}

function buildSystemInstruction(context, mode) {
  const m = mode === "quiz" ? `MODE: QUIZ. Short multiple-choice or recall checks.`
    : mode === "deep" ? `MODE: DEEP DIVE. Precise vocabulary, formulas, observatories.`
      : `MODE: EXPLAIN. Intuitive, then detail; analogies and bullet steps.`;
  return `You are the Space edu AI tutor for "Space edu" platform (Uzbekistan + international, ages 10-18).\n${m}\nCURRENT TOPIC: ${context || "General space science"}\nBe accurate, encouraging. Mention Central Asian contributions when relevant. Prefer Socratic hints. Structure with headings and numbered steps.`;
}

function messagesToContents(msgs) {
  return msgs.map((m) => ({ role: m.role === "user" ? "user" : "model", parts: [{ text: m.text }] }));
}

export default function ChatSystem() {
  const { context, isSupportOpen, setIsSupportOpen } = useAIStore();
  const { user } = useAuthStore();
  const [activeWindow, setActiveWindow] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => { if (isSupportOpen) { setActiveWindow('support'); setIsSupportOpen(false); } }, [isSupportOpen, setIsSupportOpen]);

  // ── Support Chat State ──
  const [supportQuery, setSupportQuery] = useState("");
  const [supportMode, setSupportMode] = useState("explain");
  const [supportMessages, setSupportMessages] = useState([{ role: "ai", text: "Salom / Hello — I'm your Space edu tutor. Ask about planets, orbits, light, rockets, or how ancient Central Asian astronomers measured the sky." }]);
  const [isTypingSupport, setIsTypingSupport] = useState(false);
  const supportEndRef = useRef(null);

  // ── DM State ──
  const [conversations, setConversations] = useState([]);
  const [activeConvo, setActiveConvo] = useState(null);
  const [dmMessages, setDmMessages] = useState([]);
  const [dmText, setDmText] = useState("");
  const [dmSending, setDmSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const chatEndRef = useRef(null);
  const pollRef = useRef(null);
  const searchTimerRef = useRef(null);

  useEffect(() => { if (activeWindow === 'support') supportEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [supportMessages, isTypingSupport, activeWindow]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [dmMessages]);

  // Load conversations when chat opens
  useEffect(() => {
    if (activeWindow === 'chat' && user) {
      api.get('/chat/dm/conversations/').then(({ data }) => setConversations(data)).catch(() => { });
    }
    return () => clearInterval(pollRef.current);
  }, [activeWindow, user]);

  // Load & poll messages for active conversation
  useEffect(() => {
    clearInterval(pollRef.current);
    if (!activeConvo) { setDmMessages([]); return; }
    const load = () => api.get(`/chat/dm/conversations/${activeConvo.id}/messages/`).then(({ data }) => setDmMessages(data)).catch(() => { });
    load();
    pollRef.current = setInterval(load, 3000);
    return () => clearInterval(pollRef.current);
  }, [activeConvo]);

  // User search with debounce
  useEffect(() => {
    clearTimeout(searchTimerRef.current);
    if (searchQuery.trim().length < 2) { setSearchResults([]); return; }
    setSearching(true);
    searchTimerRef.current = setTimeout(() => {
      api.get(`/chat/dm/users/?q=${encodeURIComponent(searchQuery.trim())}`).then(({ data }) => setSearchResults(data)).catch(() => { }).finally(() => setSearching(false));
    }, 400);
  }, [searchQuery]);

  const startConvoWith = async (userId) => {
    try {
      const { data } = await api.post('/chat/dm/conversations/start/', { user_id: userId });
      setSearchQuery("");
      setSearchResults([]);
      // Refresh conversations list and select new one
      const { data: convos } = await api.get('/chat/dm/conversations/');
      setConversations(convos);
      setActiveConvo(data);
    } catch { /* ignore */ }
  };

  const sendDm = async (e) => {
    e?.preventDefault();
    if (!dmText.trim() || !activeConvo || dmSending) return;
    setDmSending(true);
    try {
      const { data } = await api.post(`/chat/dm/conversations/${activeConvo.id}/messages/`, { content: dmText.trim() });
      setDmMessages((prev) => [...prev, data]);
      setDmText("");
      // Refresh conversation list to update last message
      api.get('/chat/dm/conversations/').then(({ data: c }) => setConversations(c)).catch(() => { });
    } catch { /* ignore */ } finally { setDmSending(false); }
  };

  const handleSupportSend = async () => {
    if (!supportQuery.trim()) return;
    const userMessage = supportQuery.trim();
    const newMessages = [...supportMessages, { role: "user", text: userMessage }];
    setSupportMessages(newMessages);
    setSupportQuery("");
    setIsTypingSupport(true);
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
    if (!apiKey) { setSupportMessages((p) => [...p, { role: "ai", text: "Add GEMINI_API_KEY to .env." }]); setIsTypingSupport(false); return; }
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({ model: GEMINI_MODEL, contents: messagesToContents(newMessages), config: { systemInstruction: buildSystemInstruction(context, supportMode), temperature: supportMode === "quiz" ? 0.45 : supportMode === "deep" ? 0.65 : 0.75, maxOutputTokens: 2048 } });
      setSupportMessages((p) => [...p, { role: "ai", text: response.text || "I couldn't generate a reply." }]);
    } catch { setSupportMessages((p) => [...p, { role: "ai", text: "API error. Please try again later." }]); } finally { setIsTypingSupport(false); }
  };

  const otherName = activeConvo?.other_user ? (activeConvo.other_user.first_name || activeConvo.other_user.username) : '';

  return (
    <>
      {/* ── Floating Button ── */}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4">
        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.9 }} className="glass rounded-2xl p-2 shadow-2xl border border-white/10 flex flex-col gap-1 min-w-[160px]">
              <button onClick={() => { setActiveWindow('chat'); setMenuOpen(false); }} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-sm font-medium">
                <div className="w-8 h-8 rounded-lg bg-indigo/20 flex items-center justify-center text-indigo"><MessageSquare className="w-4 h-4" /></div>
                <span>Chat</span>
              </button>
              <button onClick={() => { setActiveWindow('support'); setMenuOpen(false); }} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-sm font-medium">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400"><Sparkles className="w-4 h-4" /></div>
                <span>Support Chat</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button onClick={() => setMenuOpen(!menuOpen)} className="w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_24px_rgba(139,92,246,0.4)] hover:scale-110 transition-transform border border-white/20 bg-indigo/90" whileHover={{ rotate: 5 }} whileTap={{ scale: 0.92 }}>
          {menuOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-7 h-7" />}
        </motion.button>
      </div>

      {/* ── Support Chat Window ── */}
      <AnimatePresence>
        {activeWindow === 'support' && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.96 }} className="fixed bottom-24 right-4 sm:right-8 w-[min(100vw-2rem,440px)] h-[min(85vh,580px)] glass rounded-2xl border border-cyan-500/25 shadow-2xl flex flex-col z-[101] overflow-hidden">
            <div className="p-4 border-b border-white/10 bg-space-800/90 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-space-900 flex items-center justify-center border border-white/10"><UzbekDoppiMark className="w-7 h-7" /></div>
                <div><h3 className="font-bold text-white text-base">Space Edu AI Support</h3><p className="text-[10px] text-white/50 uppercase tracking-widest">Always online</p></div>
              </div>
              <button onClick={() => setActiveWindow(null)} className="p-2 text-white/40 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="px-3 py-2 flex gap-1.5 border-b border-white/5 bg-space-900/40">
              {[{ id: "explain", label: "Explain", Icon: BookOpen }, { id: "quiz", label: "Quiz me", Icon: HelpCircle }, { id: "deep", label: "Deep dive", Icon: Microscope }].map(({ id, label, Icon }) => (
                <button key={id} onClick={() => setSupportMode(id)} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border transition-all ${supportMode === id ? "bg-cyan-500/20 border-cyan-400/60 text-cyan-100" : "border-white/10 text-white/50 hover:border-white/25"}`}><Icon className="w-3 h-3" />{label}</button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {supportMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === "user" ? "bg-indigo text-white rounded-tr-none" : "bg-white/5 border border-white/10 text-white rounded-tl-none"}`}>{msg.text}</div>
                </div>
              ))}
              {isTypingSupport && (<div className="flex justify-start"><div className="bg-white/5 p-3 rounded-2xl rounded-tl-none border border-white/10 flex gap-1"><motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1.5 h-1.5 bg-cyan-400 rounded-full" /><motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-cyan-400 rounded-full" /><motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-cyan-400 rounded-full" /></div></div>)}
              <div ref={supportEndRef} />
            </div>
            <div className="p-4 border-t border-white/10 bg-space-800/90">
              <div className="flex gap-2">
                <input value={supportQuery} onChange={(e) => setSupportQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSupportSend()} placeholder="Ask your tutor anything..." className="flex-1 bg-space-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400/50" />
                <button onClick={handleSupportSend} disabled={!supportQuery.trim() || isTypingSupport} className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center text-white disabled:opacity-30 transition-opacity"><Send className="w-4 h-4" /></button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>~

      {/* ── Direct Chat Window ── */}
      <AnimatePresence>
        {activeWindow === 'chat' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="fixed top-0 right-0 w-full md:w-1/2 h-full glass z-[200] shadow-2xl flex border-l border-white/10">
            {/* Sidebar */}
            <div className="w-20 md:w-80 border-r border-white/5 flex flex-col bg-space-900/50">
              <div className="p-4 md:p-6 border-b border-white/5 flex items-center justify-between">
                <h2 className="hidden md:block font-black text-xl tracking-tighter uppercase">Messages</h2>
                <MessageSquare className="w-5 h-5 text-white/40 md:hidden" />
              </div>
              {/* Search */}
              <div className="p-3 md:p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search users..." className="w-full bg-white/5 border border-white/5 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-indigo/50" />
                </div>
                {/* Search Results Dropdown */}
                {searchResults.length > 0 && (
                  <div className="mt-2 bg-space-900 border border-white/10 rounded-xl overflow-hidden shadow-xl max-h-48 overflow-y-auto">
                    {searchResults.map((u) => (
                      <button key={u.id} onClick={() => startConvoWith(u.id)} className="w-full p-3 flex items-center gap-3 hover:bg-white/5 transition-colors text-left">
                        <div className="w-8 h-8 rounded-xl bg-indigo/20 flex items-center justify-center border border-white/10 text-indigo font-bold text-xs shrink-0">
                          {u.avatar_url ? <img src={u.avatar_url} alt="" className="w-full h-full rounded-xl object-cover" /> : (u.first_name || u.username)[0].toUpperCase()}
                        </div>
                        <div className="hidden md:block min-w-0">
                          <p className="text-sm font-bold truncate">{u.first_name} {u.last_name}</p>
                          <p className="text-[10px] text-white/30">@{u.username}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {searching && <p className="text-[10px] text-white/30 mt-2 text-center">Searching...</p>}
              </div>
              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto scrollbar-hide">
                {conversations.length === 0 && !searchQuery && (
                  <div className="p-6 text-center text-white/20 text-xs">Search for a user to start chatting</div>
                )}
                {conversations.map((convo) => {
                  const other = convo.other_user;
                  if (!other) return null;
                  const name = other.first_name || other.username;
                  return (
                    <button key={convo.id} onClick={() => setActiveConvo(convo)} className={`w-full p-4 md:p-5 flex items-center gap-3 hover:bg-white/5 transition-all relative ${activeConvo?.id === convo.id ? 'bg-white/5' : ''}`}>
                      <div className="relative shrink-0">
                        <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-indigo/20 flex items-center justify-center border border-white/10 text-indigo font-bold overflow-hidden">
                          {other.avatar_url ? <img src={other.avatar_url} alt="" className="w-full h-full object-cover" /> : name[0].toUpperCase()}
                        </div>
                        {convo.unread_count > 0 && <div className="absolute -top-1 -right-1 w-4 h-4 bg-violet rounded-full text-[9px] font-black flex items-center justify-center">{convo.unread_count}</div>}
                      </div>
                      <div className="hidden md:block flex-1 text-left min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-sm truncate">{name}</h4>
                          {convo.last_message && <span className="text-[9px] text-white/20 whitespace-nowrap">{new Date(convo.last_message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
                        </div>
                        {convo.last_message && <p className="text-[10px] text-white/30 truncate">{convo.last_message.is_mine ? 'You: ' : ''}{convo.last_message.content}</p>}
                      </div>
                      {activeConvo?.id === convo.id && <motion.div layoutId="activeContact" className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-indigo rounded-r-full" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col relative overflow-hidden">
              <div className="p-4 md:p-6 border-b border-white/5 bg-space-800/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {activeConvo?.other_user ? (
                    <>
                      <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 font-bold border border-white/10 overflow-hidden">
                        {activeConvo.other_user.avatar_url ? <img src={activeConvo.other_user.avatar_url} alt="" className="w-full h-full object-cover" /> : (otherName[0] || '?').toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm">{otherName}</h3>
                        <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold">@{activeConvo.other_user.username}</span>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-white/30">Select a conversation</p>
                  )}
                </div>
                <button onClick={() => setActiveWindow(null)} className="p-2.5 rounded-xl hover:bg-white/5 text-white/40 hover:text-white transition-all"><X className="w-5 h-5" /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
                {!activeConvo && <div className="flex-1 flex items-center justify-center h-full text-white/15 text-xs font-bold uppercase tracking-widest">Search and select a user to start</div>}
                {activeConvo && dmMessages.length === 0 && <div className="text-center text-white/20 text-xs py-12">No messages yet. Say hello! 👋</div>}
                {dmMessages.map((msg) => {
                  const isMe = msg.sender_id === user?.id;
                  return (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                      {!isMe && (
                        <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-[10px] text-white/30 border border-white/5 shrink-0 overflow-hidden">
                          {msg.sender_avatar_url ? <img src={msg.sender_avatar_url} alt="" className="w-full h-full object-cover" /> : (msg.sender_first_name || msg.sender_username)[0].toUpperCase()}
                        </div>
                      )}
                      <div className="max-w-[70%]">
                        <div className={`p-3 md:p-4 rounded-2xl text-sm leading-relaxed shadow-xl ${isMe ? 'bg-indigo text-white rounded-br-none shadow-indigo/20' : 'bg-white/5 border border-white/10 text-white/90 rounded-bl-none'}`}>{msg.content}</div>
                        <div className={`mt-1 text-[9px] font-bold text-white/15 tracking-tighter ${isMe ? 'text-right' : 'text-left'}`}>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                    </motion.div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>

              {activeConvo && (
                <div className="p-4 md:p-6 border-t border-white/5 bg-space-900/50">
                  <form onSubmit={sendDm} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-2 focus-within:border-indigo/50 transition-colors">
                    <input value={dmText} onChange={(e) => setDmText(e.target.value)} placeholder={`Message ${otherName}...`} className="flex-1 bg-transparent py-3 text-sm text-white focus:outline-none" />
                    <button type="submit" disabled={!dmText.trim() || dmSending} className="w-10 h-10 bg-indigo rounded-xl flex items-center justify-center text-white disabled:opacity-20 transition-all hover:scale-105 active:scale-95"><Send className="w-4 h-4" /></button>
                  </form>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
