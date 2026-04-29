import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Star, Crown, Flame } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useGamificationStore } from '@/store/useGamificationStore';

const RANK_STYLES = {
  0: { bg: 'from-amber-500/15 to-amber-400/5',  text: 'text-amber-400',  glow: 'shadow-[0_0_24px_rgba(251,191,36,0.2)]',   icon: <Crown className="w-5 h-5 text-amber-400" /> },
  1: { bg: 'from-slate-400/12 to-slate-300/4',  text: 'text-slate-300',  glow: 'shadow-[0_0_16px_rgba(203,213,225,0.15)]', icon: <Trophy className="w-5 h-5 text-slate-300" /> },
  2: { bg: 'from-amber-700/12 to-amber-600/4',  text: 'text-amber-600',  glow: 'shadow-[0_0_16px_rgba(180,83,9,0.15)]',    icon: <Trophy className="w-5 h-5 text-amber-600" /> },
};

export default function LeaderboardView() {
  const { user } = useAuthStore();
  const { xp, level } = useGamificationStore();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/gamification/leaderboard/')
      .then(({ data }) => setEntries(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const all = entries.map((e) => ({
    id: e.username,
    name: `${e.first_name} ${e.last_name}`.trim() || e.username,
    username: e.username,
    xp: e.xp,
    level: e.level,
    avatar: e.avatar_url,
    isCurrentUser: e.username === user?.username,
  }));

  // If current user not in top, append them
  if (user && !all.find((e) => e.isCurrentUser)) {
    all.push({ id: 'me', name: `${user.first_name} ${user.last_name}`.trim() || user.username, username: user.username, xp, level, avatar: user.avatar_url, isCurrentUser: true });
    all.sort((a, b) => b.xp - a.xp);
  }

  const top3 = all.slice(0, 3);
  const rest = all.slice(3);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">

      <div className="text-center mb-14">
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 18 }}
          className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6"
          style={{ background: 'linear-gradient(135deg,rgba(251,191,36,0.2),rgba(245,158,11,0.08))', border: '1px solid rgba(251,191,36,0.25)', boxShadow: '0 0 40px rgba(251,191,36,0.15)' }}>
          <Trophy className="w-10 h-10 text-amber-400" />
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="text-[clamp(28px,5vw,52px)] font-[900] tracking-[-0.02em] mb-3">
          Global <span className="text-gradient-blue">Leaderboard</span>
        </motion.h1>
        <p className="text-white/40 text-[15px] max-w-sm mx-auto">
          Earn XP through lessons and daily challenges to climb the ranks.
        </p>
      </div>

      {loading ? (
        <div className="text-center text-white/30 py-20">Loading rankings…</div>
      ) : all.length < 3 ? (
        <div className="text-center text-white/30 py-20">Not enough players yet. Be the first!</div>
      ) : (
        <>
          {/* Podium */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="grid grid-cols-3 gap-3 mb-8">
            {[top3[1], top3[0], top3[2]].map((u, podiumIdx) => {
              if (!u) return <div key={podiumIdx} />;
              const rank = podiumIdx === 1 ? 0 : podiumIdx === 0 ? 1 : 2;
              const style = RANK_STYLES[rank];
              const heights = ['h-28', 'h-36', 'h-24'];
              return (
                <div key={u.id} className="flex flex-col items-center gap-3">
                  <img src={u.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.username}`}
                    className="w-12 h-12 rounded-xl border border-white/10" alt={u.name} />
                  <span className={`text-xs font-[700] truncate max-w-[80px] text-center ${style.text}`}>{u.name}</span>
                  <div className={`w-full rounded-xl bg-gradient-to-b ${style.bg} border border-white/8 flex flex-col items-center justify-end pb-3 ${heights[podiumIdx]} ${style.glow}`}>
                    {style.icon}
                    <span className={`text-xs font-[700] mt-1 ${style.text}`}>#{rank + 1}</span>
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* Rankings */}
          <div className="glass rounded-3xl overflow-hidden">
            <div className="grid grid-cols-12 gap-2 px-5 py-3 border-b border-white/6 text-[11px] font-[700] text-white/30 uppercase tracking-wider">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-6">Explorer</div>
              <div className="col-span-2 text-center">Lvl</div>
              <div className="col-span-3 text-right">XP</div>
            </div>
            <div className="divide-y divide-white/5">
              {rest.map((u, i) => (
                <motion.div key={u.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i + 0.3 }}
                  className={`grid grid-cols-12 gap-2 px-5 py-4 items-center transition-colors ${u.isCurrentUser ? 'bg-gradient-to-r from-neon-blue/8 to-transparent border-l-2 border-neon-blue' : 'hover:bg-white/[0.03]'}`}>
                  <div className="col-span-1 text-center text-sm font-[700] text-white/30">{i + 4}</div>
                  <div className="col-span-6 flex items-center gap-3">
                    <img src={u.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.username}`}
                      className="w-8 h-8 rounded-lg border border-white/8 shrink-0" alt={u.name} />
                    <p className={`text-sm font-[700] ${u.isCurrentUser ? 'text-neon-blue' : 'text-white'}`}>{u.name}</p>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="inline-flex items-center gap-1 text-xs font-[700] text-neon-purple">
                      <Star className="w-3 h-3" />{u.level}
                    </span>
                  </div>
                  <div className="col-span-3 text-right font-[700] text-sm font-mono text-neon-blue">
                    {u.xp.toLocaleString()}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
