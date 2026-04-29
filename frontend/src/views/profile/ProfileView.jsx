import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { User, Zap, Fuel, Flame, Star, Shield, Edit2, Check, X, LogOut, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useGamificationStore } from '@/store/useGamificationStore';

const XP_PER_LEVEL = (lvl) => Math.pow(lvl - 1, 2) * 100;

function XpBar({ xp, level }) {
  const current = xp - XP_PER_LEVEL(level);
  const needed = XP_PER_LEVEL(level + 1) - XP_PER_LEVEL(level);
  const pct = Math.min(100, Math.round((current / needed) * 100));
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-xs text-white/40">
        <span>Level {level}</span>
        <span>{current} / {needed} XP</span>
        <span>Level {level + 1}</span>
      </div>
      <div className="h-2 bg-white/8 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
        />
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white/4 border border-white/8 rounded-2xl p-4 flex flex-col gap-2">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="text-xs text-white/40 font-semibold uppercase tracking-wide">{label}</p>
    </div>
  );
}

function BadgeCard({ badge }) {
  return (
    <div className="bg-white/4 border border-white/8 rounded-2xl p-3 flex flex-col items-center gap-2 text-center">
      <div className="text-2xl">{badge.icon}</div>
      <p className="text-xs font-bold text-white">{badge.title_en}</p>
      <p className="text-xs text-white/30">{badge.description_en}</p>
    </div>
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
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">

      {/* Header card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/4 border border-white/10 rounded-3xl p-6 mb-6"
      >
        <div className="flex items-start gap-5">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600/30 to-purple-600/30 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
            {user?.avatar_url
              ? <img src={user.avatar_url} alt="avatar" className="w-full h-full object-cover" />
              : <User className="w-10 h-10 text-white/40" />
            }
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            {!editing ? (
              <>
                <h1 className="text-xl font-black text-white truncate">
                  {user?.first_name} {user?.last_name}
                </h1>
                <p className="text-white/40 text-sm">@{user?.username}</p>
                {user?.astronaut_name && (
                  <p className="text-blue-400 text-sm font-semibold mt-1">✦ {user.astronaut_name}</p>
                )}
                <p className="text-white/30 text-xs mt-1">{user?.email}</p>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <input
                  value={editForm.astronaut_name}
                  onChange={(e) => setEditForm((f) => ({ ...f, astronaut_name: e.target.value }))}
                  placeholder="Astronaut name"
                  className="bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-blue-500/60"
                />
                <select
                  value={editForm.language}
                  onChange={(e) => setEditForm((f) => ({ ...f, language: e.target.value }))}
                  className="bg-slate-900 border border-white/15 rounded-xl px-3 py-2 text-white text-sm outline-none"
                >
                  <option value="en">English</option>
                  <option value="uz">O'zbek</option>
                  <option value="ru">Русский</option>
                </select>
              </div>
            )}
          </div>

          {/* Edit / Save buttons */}
          <div className="flex gap-2 shrink-0">
            {!editing ? (
              <button onClick={startEdit} className="w-9 h-9 rounded-xl bg-white/6 hover:bg-white/10 flex items-center justify-center transition-colors">
                <Edit2 className="w-4 h-4 text-white/60" />
              </button>
            ) : (
              <>
                <button onClick={saveEdit} disabled={saving} className="w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-500 flex items-center justify-center transition-colors">
                  <Check className="w-4 h-4 text-white" />
                </button>
                <button onClick={() => setEditing(false)} className="w-9 h-9 rounded-xl bg-white/6 hover:bg-white/10 flex items-center justify-center transition-colors">
                  <X className="w-4 h-4 text-white/60" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* XP bar */}
        <div className="mt-5">
          <XpBar xp={displayXp} level={displayLevel} />
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6"
      >
        <StatCard icon={Star}  label="Level"  value={displayLevel}   color="bg-yellow-500/15 text-yellow-400" />
        <StatCard icon={Zap}   label="XP"     value={displayXp.toLocaleString()}   color="bg-blue-500/15 text-blue-400" />
        <StatCard icon={Fuel}  label="Fuel"   value={displayFuel}    color="bg-orange-500/15 text-orange-400" />
        <StatCard icon={Flame} label="Streak" value={`${displayStreak}d`} color="bg-red-500/15 text-red-400" />
      </motion.div>

      {/* Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/4 border border-white/8 rounded-3xl p-5 mb-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-purple-400" />
          <h2 className="font-bold text-white">Badges</h2>
          <span className="text-white/30 text-sm ml-auto">{displayBadges.length} earned</span>
        </div>
        {displayBadges.length === 0 ? (
          <p className="text-white/25 text-sm text-center py-6">
            Complete lessons and challenges to earn badges
          </p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {displayBadges.map((b, i) => (
              <BadgeCard key={b.badge?.slug || b.id || i} badge={b.badge || b} />
            ))}
          </div>
        )}
      </motion.div>

      {/* Account actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex gap-3"
      >
        <button
          onClick={handleLogout}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/4 border border-white/8 hover:bg-white/8 text-white/60 hover:text-white font-semibold text-sm transition-all"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
        <button
          onClick={handleDelete}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-500/8 border border-red-500/15 hover:bg-red-500/15 text-red-400 font-semibold text-sm transition-all"
        >
          <Trash2 className="w-4 h-4" /> Delete Account
        </button>
      </motion.div>
    </div>
  );
}
