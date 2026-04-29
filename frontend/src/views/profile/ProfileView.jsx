import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { User, Zap, Fuel, Flame, Star, Shield, Edit2, Check, X, LogOut, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useGamificationStore } from '@/store/useGamificationStore';
import GlassCard from '@/components/ui/GlassCard';

const XP_PER_LEVEL = (lvl) => Math.pow(lvl - 1, 2) * 100;

function XpBar({ xp, level }) {
  const current = xp - XP_PER_LEVEL(level);
  const needed = XP_PER_LEVEL(level + 1) - XP_PER_LEVEL(level);
  const pct = Math.min(100, Math.round((current / needed) * 100));
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between text-[11px] font-[700] uppercase tracking-wider text-white/30">
        <span>Level {level}</span>
        <span>{current} / {needed} XP</span>
        <span>Level {level + 1}</span>
      </div>
      <div className="h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full bg-gradient-to-r from-violet to-violet-light"
          style={{ boxShadow: '0 0 12px rgba(139,92,246,0.6)' }}
        />
      </div>
    </div>
  );
}

function StatItem({ icon: Icon, label, value, color }) {
  return (
    <GlassCard accent={color} delay={0} className="!p-5 flex flex-col gap-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" 
        style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div>
        <p className="text-2xl font-[900] text-white tracking-tight">{value}</p>
        <p className="text-[10px] font-[800] uppercase tracking-[0.2em] text-white/30 mt-1">{label}</p>
      </div>
    </GlassCard>
  );
}

function BadgeItem({ badge, i }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.05 }}
      className="group relative flex flex-col items-center p-4 rounded-2xl bg-white/[0.02] border border-white/5 transition-all hover:bg-white/[0.05] hover:border-violet/30"
    >
      <div className="text-3xl mb-3 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] transition-transform group-hover:scale-110">
        {badge.icon}
      </div>
      <p className="text-[11px] font-[800] text-white text-center line-clamp-1">{badge.title_en}</p>
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-b from-transparent to-violet/5 pointer-events-none" />
    </motion.div>
  );
}

export default function ProfileView() {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuthStore();
  const { xp, level, fuel, streak, badges: localBadges, syncFromAPI } = useGamificationStore();

  const [gamProfile, setGamProfile] = useState(null);
  const [apiBadges, setApiBadges] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ astronaut_name: '', language: 'en' });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/gamification/profile/'),
      api.get('/gamification/badges/'),
    ]).then(([{ data: gam }, { data: bdg }]) => {
      syncFromAPI(gam);
      setGamProfile(gam);
      setApiBadges(bdg);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const startEdit = () => {
    setEditForm({
      astronaut_name: user?.astronaut_name || '',
      language: user?.language || 'en',
    });
    setEditing(true);
  };

  const saveEdit = async () => {
    setSaving(true);
    try {
      const { data } = await api.patch('/auth/me/', editForm);
      updateUser(data);
      setEditing(false);
    } catch { /* ignore */ } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try { await api.post('/auth/logout/', { refresh: useAuthStore.getState().refreshToken }); } catch { /* ignore */ }
    logout();
    navigate('/login');
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete your account? This cannot be undone.')) return;
    await api.delete('/auth/delete/');
    logout();
    navigate('/register');
  };

  const displayBadges = apiBadges.length > 0 ? apiBadges : localBadges;
  const displayXp = gamProfile?.xp ?? xp;
  const displayLevel = gamProfile?.level ?? level;
  const displayFuel = gamProfile?.fuel ?? fuel;
  const displayStreak = gamProfile?.streak ?? streak;

  return (
    <div className="relative min-h-screen pt-32 pb-24 px-4 overflow-hidden">
      {/* Decorative ambient glows */}
      <div className="fixed top-[-15%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[140px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)' }} />
      
      <div className="max-w-3xl mx-auto relative z-10">
        
        {/* Header card */}
        <GlassCard accent="#8b5cf6" delay={0} className="mb-8 !p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
            {/* Avatar container */}
            <div className="relative group">
              <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-violet/20 to-violet-deep/20 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden shadow-2xl">
                {user?.avatar_url
                  ? <img src={user.avatar_url} alt="avatar" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                  : <User className="w-12 h-12 text-white/20" />
                }
              </div>
              <div className="absolute -inset-2 rounded-[2rem] border border-violet/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>

            {/* Info section */}
            <div className="flex-1 text-center sm:text-left min-w-0">
              {!editing ? (
                <>
                  <div className="flex items-center justify-center sm:justify-start gap-3 mb-1">
                    <h1 className="text-3xl font-[900] text-white tracking-tight">
                      {user?.first_name} {user?.last_name}
                    </h1>
                    <button onClick={startEdit} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <Edit2 className="w-3.5 h-3.5 text-white/40 hover:text-white" />
                    </button>
                  </div>
                  <p className="text-violet-light font-[700] text-sm tracking-wide">@{user?.username}</p>
                  
                  {user?.astronaut_name && (
                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet/10 border border-violet/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet animate-pulse" />
                      <span className="text-[11px] font-[800] uppercase tracking-wider text-violet-pale">{user.astronaut_name}</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col gap-3 mt-2">
                  <input
                    value={editForm.astronaut_name}
                    onChange={(e) => setEditForm((f) => ({ ...f, astronaut_name: e.target.value }))}
                    placeholder="Astronaut Alias"
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-violet/50 transition-colors"
                  />
                  <div className="flex gap-2">
                    <select
                      value={editForm.language}
                      onChange={(e) => setEditForm((f) => ({ ...f, language: e.target.value }))}
                      className="flex-1 bg-[#0d0a1e] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-violet/50"
                    >
                      <option value="en">English</option>
                      <option value="uz">O'zbek</option>
                      <option value="ru">Русский</option>
                    </select>
                    <button onClick={saveEdit} disabled={saving} className="px-5 rounded-xl bg-violet hover:bg-violet-dark text-white font-bold text-sm transition-all shadow-lg shadow-violet/20">
                      {saving ? '...' : 'Save'}
                    </button>
                    <button onClick={() => setEditing(false)} className="px-5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 text-sm font-bold">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-white/5">
            <XpBar xp={displayXp} level={displayLevel} />
          </div>
        </GlassCard>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatItem icon={Star}  label="Rank"   value={displayLevel}   color="#fbbf24" />
          <StatItem icon={Zap}   label="XP"     value={displayXp.toLocaleString()}   color="#a78bfa" />
          <StatItem icon={Fuel}  label="Fuel"   value={displayFuel}    color="#f97316" />
          <StatItem icon={Flame} label="Streak" value={`${displayStreak}d`} color="#ef4444" />
        </div>

        {/* Badges Section */}
        <GlassCard accent="#c084fc" delay={0.1} className="mb-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-violet/10 border border-violet/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-violet-light" />
            </div>
            <div>
              <h2 className="text-lg font-[900] text-white">Achievements</h2>
              <p className="text-[10px] font-[700] uppercase tracking-widest text-white/30">{displayBadges.length} earned</p>
            </div>
          </div>
          
          {displayBadges.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-white/5 rounded-2xl">
              <p className="text-white/20 text-sm font-[600]">Complete missions to earn badges</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
              {displayBadges.map((b, i) => (
                <BadgeItem key={b.badge?.slug || b.id || i} badge={b.badge || b} i={i} />
              ))}
            </div>
          )}
        </GlassCard>

        {/* Account Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleLogout}
            className="flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 text-white font-[800] text-xs uppercase tracking-widest transition-all"
          >
            <LogOut className="w-4 h-4" /> Sign Out from Earth
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 hover:border-red-500/20 text-red-500/60 hover:text-red-500 font-[800] text-xs uppercase tracking-widest transition-all"
          >
            <Trash2 className="w-4 h-4" /> Abort Mission
          </button>
        </div>
      </div>
    </div>
  );
}
