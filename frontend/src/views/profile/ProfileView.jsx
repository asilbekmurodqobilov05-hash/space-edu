import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  BadgeCheck,
  Coins,
  Flame,
  Globe2,
  Loader2,
  Orbit,
  Package,
  RefreshCw,
  Rocket,
  Save,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserCircle2,
} from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useGamificationStore } from '@/store/useGamificationStore';

const CLAIMS_KEY = 'space-edu-profile-mission-claims';
const STREAK_CLAIM_DAY_KEY = 'space-edu-profile-streak-claim-day';

function streakClaimedToday() {
  try {
    return localStorage.getItem(STREAK_CLAIM_DAY_KEY) === new Date().toDateString();
  } catch {
    return false;
  }
}

function setStreakClaimedToday() {
  try {
    localStorage.setItem(STREAK_CLAIM_DAY_KEY, new Date().toDateString());
  } catch { /* ignore */ }
}

function loadClaimedIds() {
  try {
    const raw = localStorage.getItem(CLAIMS_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveClaimedIds(ids) {
  localStorage.setItem(CLAIMS_KEY, JSON.stringify(ids));
}

function asArray(v) {
  return Array.isArray(v) ? v : [];
}

/** Backend: level = floor(sqrt(xp / 100)) + 1 */
function xpSegment(level) {
  const minXp = Math.max(0, (level - 1) ** 2 * 100);
  const nextXp = level ** 2 * 100;
  return { minXp, nextXp };
}

function xpBarPercent(xp, level) {
  const { minXp, nextXp } = xpSegment(level);
  if (nextXp <= minXp) return 100;
  return Math.min(100, Math.round(((xp - minXp) / (nextXp - minXp)) * 100));
}

function rarityStyle(rarity) {
  if (rarity === 'Legendary') return 'text-orange-300 border-orange-400/40 bg-orange-500/10';
  if (rarity === 'Epic') return 'text-fuchsia-300 border-fuchsia-400/40 bg-fuchsia-500/10';
  return 'text-cyan-300 border-cyan-400/40 bg-cyan-500/10';
}

function itemRarity(cost) {
  if (cost >= 400) return 'Legendary';
  if (cost >= 200) return 'Epic';
  return 'Rare';
}

const ICON_FALLBACK = {
  suit: ShieldCheck,
  thruster: Rocket,
  base: Orbit,
  scanner: Sparkles,
};

function pickInventoryIcon(item) {
  const slug = (item?.slug || '').toLowerCase();
  const t = (item?.item_type || '').toLowerCase();
  if (slug.includes('suit') || t.includes('suit')) return ICON_FALLBACK.suit;
  if (slug.includes('thruster') || t.includes('thruster')) return ICON_FALLBACK.thruster;
  if (slug.includes('base') || t.includes('base')) return ICON_FALLBACK.base;
  if (slug.includes('scan') || t.includes('scan')) return ICON_FALLBACK.scanner;
  return Package;
}

export default function ProfileView() {
  const { user, updateUser } = useAuthStore();
  const syncFromAPI = useGamificationStore((s) => s.syncFromAPI);
  const careerTrack = useGamificationStore((s) => s.careerTrack);

  const [bio, setBio] = useState('');
  const [savingBio, setSavingBio] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState(null);

  const [gamProfile, setGamProfile] = useState(null);
  const [badges, setBadges] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [progress, setProgress] = useState({ lessons: [], enrollments: [] });
  const [leaderboardRank, setLeaderboardRank] = useState(null);
  const [leaderboardTotal, setLeaderboardTotal] = useState(0);
  const [claimedMissionIds, setClaimedMissionIds] = useState(loadClaimedIds);
  const [streakDoneToday, setStreakDoneToday] = useState(streakClaimedToday);

  const showToast = useCallback((msg, isError = false) => {
    setToast({ msg, isError });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const fetchAll = useCallback(async () => {
    const results = await Promise.allSettled([
      api.get('/gamification/profile/'),
      api.get('/gamification/badges/'),
      api.get('/market/inventory/'),
      api.get('/progress/'),
      api.get('/gamification/leaderboard/'),
    ]);

    const [gRes, bRes, iRes, pRes, lRes] = results;

    if (gRes.status === 'fulfilled') {
      const gp = gRes.value.data && typeof gRes.value.data === 'object' ? gRes.value.data : null;
      setGamProfile(gp);
      if (gp) syncFromAPI(gp);
    }

    if (bRes.status === 'fulfilled') setBadges(asArray(bRes.value.data));
    if (iRes.status === 'fulfilled') setInventory(asArray(iRes.value.data));
    if (pRes.status === 'fulfilled') {
      const pdata = pRes.value.data && typeof pRes.value.data === 'object' ? pRes.value.data : {};
      setProgress({
        lessons: asArray(pdata.lessons),
        enrollments: asArray(pdata.enrollments),
      });
    }

    if (lRes.status === 'fulfilled') {
      const list = asArray(lRes.value.data);
      setLeaderboardTotal(list.length);
      const me = useAuthStore.getState().user?.username;
      const idx = list.findIndex((e) => e && e.username === me);
      setLeaderboardRank(idx >= 0 ? idx + 1 : null);
    }
  }, [syncFromAPI]);

  useEffect(() => {
    setBio(user?.bio ?? '');
  }, [user?.bio]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        await fetchAll();
      } catch {
        if (!cancelled) showToast('Could not load profile data', true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [fetchAll, showToast]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchAll();
      showToast('Data refreshed');
    } catch {
      showToast('Refresh failed', true);
    } finally {
      setRefreshing(false);
    }
  };

  const handleSaveBio = async () => {
    setSavingBio(true);
    try {
      const { data } = await api.patch('/auth/me/', { bio });
      updateUser(data);
      showToast('Profile saved');
    } catch {
      showToast('Save failed — check connection or login', true);
    } finally {
      setSavingBio(false);
    }
  };

  const lessons = asArray(progress?.lessons);
  const masteredCount = lessons.filter((l) => l && l.is_mastered).length;
  const hasAnyLesson = lessons.length > 0;

  const missions = useMemo(() => {
    return [
      {
        id: 'streak-bonus',
        title: 'Daily streak bonus',
        description: 'Sends POST /gamification/streak/ (+10 fuel when the server updates streak)',
        progress: streakDoneToday ? 100 : 0,
        isStreak: true,
      },
      {
        id: 'first-lesson',
        title: 'Complete your first lesson',
        progress: hasAnyLesson ? 100 : 0,
        isStreak: false,
      },
      {
        id: 'master-one',
        title: 'Master a lesson (score ≥ 70%)',
        progress: masteredCount >= 1 ? 100 : 0,
        isStreak: false,
      },
      {
        id: 'inventory-two',
        title: 'Own 2 shop items',
        progress: Math.min(100, inventory.length >= 2 ? 100 : inventory.length * 50),
        isStreak: false,
      },
    ];
  }, [hasAnyLesson, masteredCount, inventory.length, streakDoneToday]);

  const claimMission = async (mission) => {
    if (mission.isStreak) {
      if (streakDoneToday) return;
      try {
        const { data } = await api.post('/gamification/streak/');
        await fetchAll();
        setStreakClaimedToday();
        setStreakDoneToday(true);
        if (data.updated) showToast(`Streak updated! +${data.fuel_bonus ?? 10} fuel`);
        else showToast('Streak already logged today — data refreshed');
      } catch {
        showToast('Streak request failed', true);
      }
      return;
    }

    if (claimedMissionIds.includes(mission.id)) return;
    if (mission.progress < 100) return;

    const next = [...claimedMissionIds, mission.id];
    setClaimedMissionIds(next);
    saveClaimedIds(next);
    showToast('Reward claimed — keep exploring!');
  };

  const xp = gamProfile?.xp ?? 0;
  const level = gamProfile?.level ?? 1;
  const fuel = gamProfile?.fuel ?? 0;
  const streak = gamProfile?.streak ?? 0;
  const xpPct = xpBarPercent(xp, level);
  const { minXp, nextXp } = xpSegment(level);

  const displayName = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.username || 'Cadet';
  const title = `Level ${level}: Galactic Explorer`;

  const rankLabel = leaderboardRank != null
    ? `#${leaderboardRank}${leaderboardTotal ? ` of ${leaderboardTotal}` : ''}`
    : leaderboardTotal ? '100+' : '—';

  const percentile = leaderboardRank != null && leaderboardTotal > 0
    ? `Top ${Math.max(1, Math.round((leaderboardRank / leaderboardTotal) * 100))}%`
    : '—';

  const completedLessons = asArray(lessons).filter((l) => l && l.score != null);
  const topInterest = user?.astronaut_name
    || gamProfile?.skills?.focus
    || careerTrack
    || 'Astronomy and Space Tech';
  const completedNow = completedLessons.slice(0, 5);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[100] max-w-sm rounded-xl border px-4 py-3 text-sm shadow-lg ${
            toast.isError ? 'border-red-400/40 bg-red-950/90 text-red-100' : 'border-cyan-400/40 bg-space-900/95 text-cyan-100'
          }`}
        >
          {toast.msg}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10 disabled:opacity-50"
          >
            {refreshing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
            Refresh from server
          </button>
          <Link
            to="/leaderboard"
            className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-100 hover:bg-cyan-500/20"
          >
            <Trophy className="h-3.5 w-3.5" /> Leaderboard
          </Link>
          <Link
            to="/market"
            className="inline-flex items-center gap-2 rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 px-4 py-2 text-xs font-semibold text-fuchsia-100 hover:bg-fuchsia-500/20"
          >
            <Coins className="h-3.5 w-3.5" /> Market
          </Link>
        </div>
        {loading && (
          <span className="flex items-center gap-2 text-xs text-white/50">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading…
          </span>
        )}
      </div>

      <section className="rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-space-900/85 via-[#130a2e]/85 to-[#0b1127]/85 p-5 sm:p-8 shadow-[0_0_50px_rgba(6,182,212,0.12)]">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="flex flex-col items-center lg:items-start gap-4 w-full lg:w-auto">
            <div className="h-28 w-28 sm:h-36 sm:w-36 rounded-full overflow-hidden border-4 border-cyan-300/60 shadow-[0_0_35px_rgba(34,211,238,0.45)] bg-white/5">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-white/30">
                  <UserCircle2 className="h-16 w-16" />
                </div>
              )}
            </div>
            <span className="px-3 py-1 rounded-full text-xs border border-cyan-300/40 bg-cyan-400/10 text-cyan-200">
              Command Center Active
            </span>
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold text-white">{displayName}</h1>
              <p className="text-cyan-200 mt-1 flex items-center gap-2">
                <Trophy className="w-4 h-4" /> {title}
              </p>
              {user?.astronaut_name && (
                <p className="text-sm text-white/50 mt-1">@{user.username} · {user.astronaut_name}</p>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-300">About Me</p>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                maxLength={300}
                className="w-full rounded-2xl border border-white/15 bg-black/25 px-4 py-3 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleSaveBio}
                  disabled={savingBio}
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/15 px-4 py-2 text-xs font-semibold text-emerald-100 hover:bg-emerald-500/25 disabled:opacity-50"
                >
                  {savingBio ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                  Save bio (API)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                <p className="text-[11px] text-white/50">First name</p>
                <p className="text-sm text-white font-medium">{user?.first_name || '—'}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                <p className="text-[11px] text-white/50">Last name</p>
                <p className="text-sm text-white font-medium">{user?.last_name || '—'}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                <p className="text-[11px] text-white/50">Interest</p>
                <p className="text-sm text-cyan-200 font-medium">{topInterest}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                <p className="text-[11px] text-white/50">Current rank</p>
                <p className="text-sm text-yellow-200 font-medium">{rankLabel}</p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm text-gray-300 mb-2">
                <span>XP Progress</span>
                <span>{xp} / {nextXp} XP (level {level})</span>
              </div>
              <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  key={xp}
                  initial={{ width: 0 }}
                  animate={{ width: `${xpPct}%` }}
                  transition={{ duration: 0.9 }}
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500"
                />
              </div>
              <p className="text-[11px] text-white/40 mt-1">Segment start: {minXp} XP</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-space-900/70 p-5">
          <h2 className="text-xl font-semibold text-white mb-4">My Profile Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              <p className="text-[11px] text-white/50">Ism</p>
              <p className="text-sm text-white font-medium">{user?.first_name || '—'}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              <p className="text-[11px] text-white/50">Familya</p>
              <p className="text-sm text-white font-medium">{user?.last_name || '—'}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              <p className="text-[11px] text-white/50">Darajasi (Level)</p>
              <p className="text-sm text-cyan-200 font-medium">Level {level}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              <p className="text-[11px] text-white/50">Top rating</p>
              <p className="text-sm text-yellow-200 font-medium">{rankLabel} · {percentile}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 sm:col-span-2">
              <p className="text-[11px] text-white/50">Nimaga qiziqadi</p>
              <p className="text-sm text-fuchsia-200 font-medium">{topInterest}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 sm:col-span-2">
              <p className="text-[11px] text-white/50">Description</p>
              <p className="text-sm text-white/90 whitespace-pre-wrap">{bio?.trim() || 'Description kiritilmagan'}</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-space-900/70 p-5">
          <h2 className="text-xl font-semibold text-white mb-4">Hozirda tugatganlari</h2>
          {completedNow.length === 0 ? (
            <p className="text-sm text-white/40">Hali yakunlangan lesson yo‘q.</p>
          ) : (
            <div className="space-y-2.5">
              {completedNow.filter(Boolean).map((row) => (
                <div key={row.lesson_slug} className="rounded-xl border border-emerald-400/25 bg-emerald-500/10 px-3 py-2">
                  <p className="text-xs text-emerald-100 font-medium">{row.lesson_slug}</p>
                  <p className="text-[11px] text-emerald-200/80">Score: {row.score}% {row.is_mastered ? '· Mastered' : ''}</p>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 text-xs text-white/60">
            Coins/Fuel: <span className="text-yellow-200 font-semibold">{Number(fuel).toLocaleString()}</span>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <button
          type="button"
          onClick={handleRefresh}
          className="rounded-2xl border border-yellow-400/25 bg-yellow-500/10 p-4 text-left hover:bg-yellow-500/15 transition"
        >
          <p className="text-sm text-yellow-200/90">Space Fuel (balance)</p>
          <p className="mt-1 text-3xl font-bold text-yellow-300 flex items-center gap-2">
            <Coins className="w-7 h-7" /> {fuel.toLocaleString()}
          </p>
          <p className="text-[10px] text-yellow-200/60 mt-2">Tap card to refresh</p>
        </button>
        <div className="rounded-2xl border border-cyan-400/25 bg-cyan-500/10 p-4">
          <p className="text-sm text-cyan-200/90">Leaderboard rank</p>
          <p className="mt-1 text-2xl font-bold text-cyan-100">{rankLabel}</p>
          <p className="text-xs text-cyan-200/70 mt-1">{percentile} in galaxy</p>
        </div>
        <div className="rounded-2xl border border-orange-400/25 bg-orange-500/10 p-4">
          <p className="text-sm text-orange-200/90">Daily streak</p>
          <p className="mt-1 text-3xl font-bold text-orange-300 flex items-center gap-2">
            <Flame className="w-7 h-7" /> {streak} days
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
        <div className="rounded-2xl border border-white/10 bg-space-900/70 p-4">
          <p className="text-xs text-white/60">Completed lessons</p>
          <p className="mt-1 text-2xl font-bold text-emerald-200">{completedLessons.length}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-space-900/70 p-4">
          <p className="text-xs text-white/60">Mastered lessons</p>
          <p className="mt-1 text-2xl font-bold text-cyan-200">{masteredCount}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-space-900/70 p-4">
          <p className="text-xs text-white/60">Coins / Fuel</p>
          <p className="mt-1 text-2xl font-bold text-yellow-200">{Number(fuel).toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-space-900/70 p-4">
          <p className="text-xs text-white/60">Top rating</p>
          <p className="mt-1 text-2xl font-bold text-fuchsia-200">{percentile}</p>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
        <div className="rounded-3xl border border-white/10 bg-space-900/70 p-5">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Rocket className="w-5 h-5 text-cyan-300" /> Missions (live + API)
          </h2>
          <div className="space-y-4">
            {missions.map((mission) => {
              const progressVal = mission.isStreak ? (streakDoneToday ? 100 : 0) : mission.progress;
              const done = mission.progress >= 100;
              const claimed = mission.isStreak ? streakDoneToday : claimedMissionIds.includes(mission.id);
              return (
                <div key={mission.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <p className="text-sm text-gray-200">{mission.title}</p>
                    <span className="text-xs text-cyan-200">{mission.isStreak ? 'API' : `${progressVal}%`}</span>
                  </div>
                  {!mission.isStreak && (
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden mb-3">
                      <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500" style={{ width: `${progressVal}%` }} />
                    </div>
                  )}
                  {mission.isStreak && (
                    <p className="text-[11px] text-white/40 mb-3">{mission.description}</p>
                  )}
                  <button
                    type="button"
                    disabled={claimed || (!mission.isStreak && !done)}
                    onClick={() => claimMission(mission)}
                    className="text-xs px-3 py-1.5 rounded-full border border-cyan-300/40 disabled:opacity-45 disabled:cursor-not-allowed hover:bg-cyan-400/20 transition"
                  >
                    {claimed ? (mission.isStreak ? 'Done today' : 'Claimed') : mission.isStreak ? 'Claim streak (POST)' : 'Claim reward'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-space-900/70 p-5">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-fuchsia-300" /> Inventory (API)
          </h2>
          {inventory.length === 0 ? (
            <p className="text-sm text-white/40 mb-4">No items yet — visit the market.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {inventory.filter(Boolean).map((row) => {
                const item = row.item;
                if (!item) return null;
                const Icon = pickInventoryIcon(item);
                const rarity = itemRarity(item?.cost_fuel ?? 0);
                const titleEn = item?.title_en || item?.slug || 'Item';
                return (
                  <div
                    key={item?.slug || titleEn}
                    className="rounded-2xl border border-white/10 bg-black/25 p-4 hover:-translate-y-0.5 transition"
                  >
                    <Icon className="w-7 h-7 text-cyan-300 mb-2" />
                    <p className="text-sm font-semibold text-white">{titleEn}</p>
                    <span className={`inline-flex mt-2 text-xs px-2 py-1 rounded-full border ${rarityStyle(rarity)}`}>
                      {rarity}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
          <Link
            to="/market"
            className="mt-4 inline-flex text-xs text-fuchsia-300 underline-offset-2 hover:underline"
          >
            Open market →
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
        <div className="rounded-3xl border border-white/10 bg-space-900/70 p-5">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Orbit className="w-5 h-5 text-emerald-300" /> Completed lessons (API)
          </h2>
          {completedLessons.length === 0 ? (
            <p className="text-sm text-white/40">No lesson progress yet — start learning.</p>
          ) : (
            <div className="space-y-3">
              {completedLessons.filter(Boolean).map((row) => (
                <div
                  key={row.lesson_slug}
                  className="rounded-2xl border border-emerald-400/25 bg-emerald-500/10 p-4 flex items-center justify-between gap-3"
                >
                  <div>
                    <p className="font-medium text-white">{row.lesson_slug}</p>
                    <p className="text-xs text-emerald-200 mt-1">
                      Score {row.score}% {row.is_mastered ? '· Mastered' : ''}
                    </p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full border border-emerald-300/50 text-emerald-200 bg-emerald-400/10">
                    {row.is_mastered ? '100% Mastered' : 'Done'}
                  </span>
                </div>
              ))}
            </div>
          )}
          <Link to="/learn" className="mt-4 inline-flex text-xs text-emerald-300 underline-offset-2 hover:underline">
            Go to courses →
          </Link>
        </div>

        <div className="rounded-3xl border border-white/10 bg-space-900/70 p-5">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <BadgeCheck className="w-5 h-5 text-yellow-300" /> Badges (API)
          </h2>
          {badges.length === 0 ? (
            <p className="text-sm text-white/40">No badges yet — complete missions and lessons.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {badges.filter(Boolean).map((ub, i) => {
                const b = ub.badge || ub;
                if (!b) return null;
                const hint = b.description_en || b.slug || '';
                return (
                  <div
                    key={b.slug || i}
                    title={hint}
                    className="rounded-2xl border border-yellow-300/30 bg-yellow-500/10 p-3 text-center hover:shadow-[0_0_24px_rgba(250,204,21,0.25)] transition"
                  >
                    <div className="text-2xl mb-1" aria-hidden>
                      {b.icon && b.icon.length <= 4 ? b.icon : '⭐'}
                    </div>
                    <p className="text-xs font-medium text-yellow-100 line-clamp-2">{b.title_en || b.slug}</p>
                  </div>
                );
              })}
            </div>
          )}
          <div className="mt-4 rounded-2xl border border-blue-400/30 bg-blue-500/10 p-3 text-sm text-blue-100 flex flex-wrap items-center gap-2">
            <UserCircle2 className="w-4 h-4 shrink-0" />
            <span>
              Leaderboard: {leaderboardRank != null ? `#${leaderboardRank}` : 'Not in top 100'}
              {leaderboardTotal ? ` · board size ${leaderboardTotal}` : ''}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
