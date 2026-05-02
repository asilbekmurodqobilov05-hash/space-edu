import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Star, Crown, Flame, Shield, Target } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useGamificationStore } from '@/store/useGamificationStore';
import { useTranslation } from '@/hooks/useTranslation';
import GlassCard from '@/components/ui/GlassCard';

const RANK_STYLES = {
  0: { bg: 'from-amber-500/20 to-amber-400/5',  text: 'text-amber-400',  glow: 'shadow-[0_0_30px_rgba(251,191,36,0.2)]',   icon: <Crown className="w-6 h-6 text-amber-400" /> },
  1: { bg: 'from-slate-400/15 to-slate-300/4',  text: 'text-slate-300',  glow: 'shadow-[0_0_20px_rgba(203,213,225,0.15)]', icon: <Trophy className="w-6 h-6 text-slate-300" /> },
  2: { bg: 'from-amber-700/15 to-amber-600/4',  text: 'text-amber-600',  glow: 'shadow-[0_0_20px_rgba(180,83,9,0.15)]',    icon: <Trophy className="w-6 h-6 text-amber-600" /> },
};

export default function LeaderboardView() {
  const { user } = useAuthStore();
  const { xp, level } = useGamificationStore();
  const { t, i18n } = useTranslation();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/gamification/leaderboard/')
      .then(({ data }) => {
        setEntries(Array.isArray(data) ? data : (data.results || data.leaderboard || []));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const all = (Array.isArray(entries) ? entries : []).map((e) => ({
    id: e.username,
    name: `${e.first_name || ''} ${e.last_name || ''}`.trim() || e.username,
    username: e.username,
    xp: e.xp,
    level: e.level,
    avatar: e.avatar_url,
    isCurrentUser: e.username === user?.username,
  }));

  if (user && !all.find((e) => e.isCurrentUser)) {
    all.push({ id: 'me', name: `${user.first_name} ${user.last_name}`.trim() || user.username, username: user.username, xp, level, avatar: user.avatar_url, isCurrentUser: true });
    all.sort((a, b) => b.xp - a.xp);
  }

  const top3 = all.slice(0, 3);
  const rest = all.slice(3);

  return (
    <div className="relative min-h-screen pt-32 pb-24 px-4 overflow-hidden">
      {/* Decorative ambient glows */}
      <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[140px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)' }} />
      <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[140px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(0,229,255,0.03) 0%, transparent 70%)' }} />

      <div className="max-w-3xl mx-auto relative z-10">
        
        <div className="text-center mb-16">
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-8 relative"
            style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)', boxShadow: '0 0 40px rgba(139,92,246,0.15)' }}>
            <div className="absolute inset-0 rounded-3xl blur-[10px] bg-violet/20 animate-pulse" />
            <Trophy className="w-10 h-10 text-violet relative z-10" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-[clamp(32px,6vw,56px)] font-[900] tracking-tight mb-4">
            {t('leaderboard', 'title')} <span className="text-glow-purple text-violet">{t('leaderboard', 'titleHighlight')}</span>
          </motion.h1>
          <p className="text-white/40 text-[16px] font-[500] max-w-sm mx-auto leading-relaxed">
            {t('leaderboard', 'subtitle')}
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-8 h-8 border-2 border-violet/30 border-t-violet rounded-full animate-spin" />
            <p className="text-[10px] font-[800] uppercase tracking-widest text-white/20">{t('leaderboard', 'syncing')}</p>
          </div>
        ) : all.length < 3 ? (
          <div className="text-center text-white/30 py-20 font-[700] italic">{t('leaderboard', 'noPioneers')}</div>
        ) : (
          <>
            {/* Podium */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="grid grid-cols-3 gap-4 mb-12 items-end">
              {[top3[1], top3[0], top3[2]].map((u, podiumIdx) => {
                if (!u) return <div key={podiumIdx} />;
                const rank = podiumIdx === 1 ? 0 : podiumIdx === 0 ? 1 : 2;
                const style = RANK_STYLES[rank];
                const heights = ['h-32', 'h-44', 'h-28'];
                return (
                  <div key={u.id} className="flex flex-col items-center gap-4 group">
                    <div className="relative">
                      <img src={u.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.username}`}
                        className="w-14 h-14 rounded-2xl border-2 border-white/10 shadow-2xl relative z-10 object-cover" alt={u.name} />
                      <div className="absolute inset-0 rounded-2xl bg-violet/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span className={`text-[11px] font-[800] truncate max-w-full text-center uppercase tracking-wider ${style.text}`}>{u.name}</span>
                    <div className={`w-full rounded-2xl bg-gradient-to-b ${style.bg} border border-white/5 flex flex-col items-center justify-end pb-4 transition-all hover:scale-[1.02] ${heights[podiumIdx]} ${style.glow}`}>
                      <div className="mb-auto pt-4">{style.icon}</div>
                      <span className={`text-sm font-[900] ${style.text}`}>#{rank + 1}</span>
                      <span className="text-[9px] font-[700] text-white/40 uppercase tracking-widest mt-1">{u.xp.toLocaleString()} {t('leaderboard', 'xpPoints')}</span>
                    </div>
                  </div>
                );
              })}
            </motion.div>

            {/* Rankings List */}
            <GlassCard delay={0.3} className="overflow-hidden !p-0">
              <div className="grid grid-cols-12 gap-2 px-8 py-5 border-b border-white/5 bg-white/[0.02] text-[10px] font-[800] text-white/30 uppercase tracking-[0.2em]">
                <div className="col-span-1 text-center">#</div>
                <div className="col-span-6">{t('leaderboard', 'explorer')}</div>
                <div className="col-span-2 text-center">{t('leaderboard', 'level')}</div>
                <div className="col-span-3 text-right">{t('leaderboard', 'experience')}</div>
              </div>
              <div className="divide-y divide-white/5">
                {rest.map((u, i) => (
                  <motion.div key={u.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i + 0.4 }}
                    className={`grid grid-cols-12 gap-2 px-8 py-5 items-center transition-all ${u.isCurrentUser ? 'bg-violet/10 border-l-4 border-violet shadow-inner' : 'hover:bg-white/[0.02]'}`}>
                    <div className="col-span-1 text-center text-xs font-[800] text-white/20">{i + 4}</div>
                    <div className="col-span-6 flex items-center gap-4">
                      <img src={u.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.username}`}
                        className="w-10 h-10 rounded-xl border border-white/5 shadow-lg shrink-0" alt={u.name} />
                      <div>
                        <p className={`text-sm font-[800] ${u.isCurrentUser ? 'text-violet-light' : 'text-white'}`}>{u.name}</p>
                        <p className="text-[10px] text-white/20 font-[600]">@explorer_{u.username}</p>
                      </div>
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet/10 border border-violet/20 text-[11px] font-[800] text-violet-light">
                        <Star className="w-3.5 h-3.5" />{u.level}
                      </span>
                    </div>
                    <div className="col-span-3 text-right">
                      <p className="text-sm font-[900] text-white tracking-tight">{u.xp.toLocaleString()}</p>
                      <p className="text-[9px] font-[800] text-white/20 uppercase tracking-widest">{t('leaderboard', 'xpPoints')}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* User Self-Rank Footer if not in list */}
              <div className="p-4 bg-black/40 border-t border-white/5 flex items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-violet-light/40" />
                  <span className="text-[10px] font-[800] text-white/20 uppercase tracking-[0.3em]">{t('leaderboard', 'secureProtocol')}</span>
                </div>
              </div>
            </GlassCard>
          </>
        )}
      </div>
    </div>
  );
}
