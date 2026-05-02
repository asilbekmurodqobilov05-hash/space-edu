import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Send, MessageCircle, Loader, Users, Hash } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import GlassCard from '@/components/ui/GlassCard';
import { useTranslation } from '@/hooks/useTranslation';

function Avatar({ url, username }) {
  return url
    ? <img src={url} alt={username} className="w-10 h-10 rounded-xl object-cover border border-white/10 shrink-0" />
    : <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet/40 to-neon-blue/40 border border-white/10 flex items-center justify-center shrink-0 text-sm font-black text-white/70">
        {(username || '?')[0].toUpperCase()}
      </div>;
}

function Message({ msg, isMe }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: isMe ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-end gap-3 ${isMe ? 'flex-row-reverse' : ''}`}
    >
      {!isMe && <Avatar url={msg.avatar_url} username={msg.username} />}
      <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1.5`}>
        {!isMe && (
          <span className="text-[10px] font-[800] text-white/30 px-2 tracking-widest uppercase">
            {msg.first_name || msg.username}
          </span>
        )}
        <div className={`px-5 py-3 rounded-2xl text-[14px] leading-relaxed shadow-lg
          ${isMe 
            ? 'bg-violet text-white rounded-br-sm shadow-violet/10' 
            : 'bg-white/5 border border-white/8 text-white/90 rounded-bl-sm shadow-black/20 backdrop-blur-md'}`}>
          {msg.content}
        </div>
        <span className="text-[9px] font-[700] text-white/20 px-2 tracking-tighter">
          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </motion.div>
  );
}

export default function ChatView() {
  const { user } = useAuthStore();
  const { t, i18n } = useTranslation();
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);
  const pollRef = useRef(null);

  useEffect(() => {
    api.get('/chat/rooms/').then(({ data }) => {
      setRooms(data);
      if (data.length > 0) setActiveRoom(data[0].slug);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!activeRoom) return;
    const load = () =>
      api.get(`/chat/rooms/${activeRoom}/messages/`)
        .then(({ data }) => setMessages(data))
        .catch(() => {});
    load();
    pollRef.current = setInterval(load, 5000);
    return () => clearInterval(pollRef.current);
  }, [activeRoom]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (e) => {
    e.preventDefault();
    if (!text.trim() || !activeRoom || sending) return;
    setSending(true);
    try {
      const { data } = await api.post(`/chat/rooms/${activeRoom}/messages/`, { content: text.trim() });
      setMessages((prev) => [...prev, data]);
      setText('');
    } catch { /* ignore */ } finally {
      setSending(false);
    }
  };

  const activeRoomName = rooms.find((r) => r.slug === activeRoom)?.name || '';

  return (
    <div className="relative min-h-screen pt-24 pb-12 px-4 overflow-hidden flex flex-col items-center">
      {/* Ambient glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[140px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%)' }} />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[140px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(0,229,255,0.03) 0%, transparent 70%)' }} />

      <div className="w-full max-w-5xl flex-1 flex flex-col relative z-10">
        
        {/* Header Glass Box */}
        <GlassCard accent="#8b5cf6" delay={0} className="!p-4 mb-4">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 rounded-2xl bg-violet/10 border border-violet/20 flex items-center justify-center shadow-lg shadow-violet/10">
                <MessageCircle className="w-6 h-6 text-violet-light" />
              </div>
              <div>
                <h1 className="text-xl font-[900] text-white tracking-tight">{t('chat', 'title')} <span className="text-glow-purple text-violet">{t('chat', 'titleHighlight')}</span></h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <Hash className="w-3 h-3 text-white/30" />
                  <span className="text-[10px] font-[800] text-white/40 uppercase tracking-widest">{activeRoomName || t('chat', 'selectingRoom')}</span>
                </div>
              </div>
            </div>

            {/* Room selector tabs */}
            <div className="flex gap-2 p-1 rounded-xl bg-white/[0.03] border border-white/5">
              {rooms.map((r) => (
                <button 
                  key={r.slug} 
                  onClick={() => setActiveRoom(r.slug)}
                  className={`px-4 py-2 rounded-lg text-[10px] font-[900] uppercase tracking-widest transition-all
                    ${activeRoom === r.slug 
                      ? 'bg-violet text-white shadow-lg shadow-violet/20' 
                      : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                >
                  {r.name}
                </button>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Chat Area Glass Box */}
        <GlassCard accent="#6366f1" delay={0.1} className="flex-1 !p-0 overflow-hidden flex flex-col min-h-[500px]">
          <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-6 custom-scrollbar scroll-smooth">
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 opacity-20">
                <Loader className="w-8 h-8 animate-spin" />
                <p className="text-[10px] font-[800] uppercase tracking-widest">{t('chat', 'initializing')}</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 opacity-20">
                <Users className="w-10 h-10" />
                <p className="text-[10px] font-[800] uppercase tracking-widest">{t('chat', 'quietChannel')}</p>
              </div>
            ) : (
              messages.map((msg) => (
                <Message key={msg.id} msg={msg} isMe={msg.username === user?.username} />
              ))
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white/[0.02] border-t border-white/5">
            <form onSubmit={send} className="flex gap-3">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t('chat', 'composePlaceholder')}
                maxLength={1000}
                className="flex-1 bg-white/[0.04] border border-white/10 rounded-2xl px-6 py-4 text-white text-[14px] placeholder-white/20 outline-none focus:border-violet/40 focus:bg-white/[0.06] transition-all"
              />
              <button 
                type="submit" 
                disabled={!text.trim() || sending}
                className="w-14 h-14 rounded-2xl bg-violet hover:bg-violet-dark disabled:opacity-30 disabled:grayscale flex items-center justify-center shadow-lg shadow-violet/20 transition-all active:scale-[0.95]"
              >
                {sending ? <Loader className="w-5 h-5 animate-spin text-white" /> : <Send className="w-5 h-5 text-white" />}
              </button>
            </form>
          </div>
        </GlassCard>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(139,92,246,0.3); }
      `}</style>
    </div>
  );
}
