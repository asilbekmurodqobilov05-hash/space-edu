import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Send, MessageCircle, Loader } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';

function Avatar({ url, username }) {
  return url
    ? <img src={url} alt={username} className="w-8 h-8 rounded-lg object-cover border border-white/10 shrink-0" />
    : <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600/40 to-purple-600/40 border border-white/10 flex items-center justify-center shrink-0 text-xs font-bold text-white/70">
        {(username || '?')[0].toUpperCase()}
      </div>;
}

function Message({ msg, isMe }) {
  return (
    <div className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
      <Avatar url={msg.avatar_url} username={msg.username} />
      <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        {!isMe && (
          <span className="text-xs text-white/40 px-1">{msg.first_name || msg.username}</span>
        )}
        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed
          ${isMe ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-white/6 border border-white/8 text-white/90 rounded-bl-sm'}`}>
          {msg.content}
        </div>
        <span className="text-[11px] text-white/25 px-1">
          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}

export default function ChatView() {
  const { user } = useAuthStore();
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);
  const pollRef = useRef(null);

  // Load rooms
  useEffect(() => {
    api.get('/chat/rooms/').then(({ data }) => {
      setRooms(data);
      if (data.length > 0) setActiveRoom(data[0].slug);
    }).finally(() => setLoading(false));
  }, []);

  // Load messages + poll every 5s
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

  // Auto-scroll
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
    <div className="min-h-screen pt-16 flex flex-col max-w-4xl mx-auto px-4">

      <div className="flex items-center gap-3 py-5 border-b border-white/8">
        <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h1 className="font-black text-white">Community Chat</h1>
          {activeRoomName && <p className="text-white/40 text-xs">#{activeRoomName}</p>}
        </div>
        {/* Room tabs */}
        <div className="ml-auto flex gap-2">
          {rooms.map((r) => (
            <button key={r.slug} onClick={() => setActiveRoom(r.slug)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors
                ${activeRoom === r.slug ? 'bg-blue-600 text-white' : 'bg-white/6 text-white/50 hover:bg-white/10'}`}>
              {r.name}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-4 min-h-0" style={{ maxHeight: 'calc(100vh - 220px)' }}>
        {loading ? (
          <div className="flex justify-center py-10"><Loader className="w-6 h-6 text-white/30 animate-spin" /></div>
        ) : messages.length === 0 ? (
          <p className="text-center text-white/20 py-10">No messages yet. Say hello! 👋</p>
        ) : (
          messages.map((msg) => (
            <Message key={msg.id} msg={msg} isMe={msg.username === user?.username} />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={send} className="py-4 border-t border-white/8 flex gap-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Send a message…"
          maxLength={1000}
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 outline-none focus:border-blue-500/50 transition-colors text-sm"
        />
        <button type="submit" disabled={!text.trim() || sending}
          className="w-12 h-12 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 flex items-center justify-center transition-all">
          {sending ? <Loader className="w-4 h-4 animate-spin text-white" /> : <Send className="w-4 h-4 text-white" />}
        </button>
      </form>
    </div>
  );
}
