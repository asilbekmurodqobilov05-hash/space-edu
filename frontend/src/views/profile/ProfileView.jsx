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
  Brain,
  Target,
  Camera,
  Edit3,
  X,
  Gamepad,
  CheckCircle2,
  Heart,
} from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useGamificationStore } from '@/store/useGamificationStore';
import { useLikesStore } from '@/store/useLikesStore';
import { useLearningStore } from '@/store/useLearningStore';

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

// We no longer need local storage for claims except fallback for streak
function loadClaimedIds() { return []; }
function saveClaimedIds(ids) {}

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

function badgeRarityStyle(rarity, isEarned) {
  if (!isEarned) return 'border-white/5 bg-white/5 opacity-50 grayscale';
  switch (rarity) {
    case 'legendary': return 'border-orange-500/40 bg-orange-500/10 shadow-[0_0_15px_rgba(249,115,22,0.15)]';
    case 'epic': return 'border-fuchsia-500/40 bg-fuchsia-500/10 shadow-[0_0_15px_rgba(217,70,239,0.15)]';
    case 'rare': return 'border-cyan-500/40 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.15)]';
    case 'exclusive': return 'border-emerald-500/40 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.15)]';
    case 'common':
    default: return 'border-white/20 bg-white/5 shadow-[0_0_10px_rgba(255,255,255,0.05)]';
  }
}

function badgeRarityText(rarity) {
  switch (rarity) {
    case 'legendary': return 'text-orange-400';
    case 'epic': return 'text-fuchsia-400';
    case 'rare': return 'text-cyan-400';
    case 'exclusive': return 'text-emerald-400';
    case 'common':
    default: return 'text-white/70';
  }
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
  const { likedLessons } = useLikesStore();
  const { completedLessons: localCompletedSlugs, lessonMetadata } = useLearningStore();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState(null);

  const [fullProfile, setFullProfile] = useState(null);
  const [progress, setProgress] = useState({ lessons: [], enrollments: [] });
  const [allBadges, setAllBadges] = useState([]);
  const [showBadgesModal, setShowBadgesModal] = useState(false);
  
  const [claimedMissionIds, setClaimedMissionIds] = useState(loadClaimedIds);
  const [streakDoneToday, setStreakDoneToday] = useState(streakClaimedToday);

  // Editable Profile States
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [astronautName, setAstronautName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showLessonsModal, setShowLessonsModal] = useState(false);
  const [showLikedModal, setShowLikedModal] = useState(false);
  const [showMissionsModal, setShowMissionsModal] = useState(false);

  const showToast = useCallback((msg, isError = false) => {
    setToast({ msg, isError });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const fetchAll = useCallback(async () => {
    const results = await Promise.allSettled([
      api.get('/gamification/profile/full/'),
      api.get('/progress/'),
      api.get('/gamification/badges/all/'),
    ]);

    const [fpRes, pRes, bRes] = results;

    if (fpRes.status === 'fulfilled') {
      const data = fpRes.value.data;
      setFullProfile(data);
      if (data.gamification) syncFromAPI(data.gamification);
    }

    if (pRes.status === 'fulfilled') {
      setProgress(pRes.value.data || { lessons: [], enrollments: [] });
    }

    if (bRes && bRes.status === 'fulfilled') {
      setAllBadges(bRes.value.data || []);
    }
  }, [syncFromAPI]);

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || '');
      setLastName(user.last_name || '');
      setAstronautName(user.astronaut_name || '');
      setBio(user.bio || '');
      setAvatarPreview(user.avatar_url || '');
    }
  }, [user]);

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

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const formData = new FormData();
      formData.append('first_name', firstName);
      formData.append('last_name', lastName);
      formData.append('astronaut_name', astronautName);
      formData.append('bio', bio);
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }
      
      const { data } = await api.patch('/auth/me/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      updateUser(data);
      setIsEditing(false);
      showToast('Identity log saved successfully!');
    } catch (err) {
      showToast('Failed to update profile.', true);
    } finally {
      setSavingProfile(false);
    }
  };

  const lessons = progress?.lessons ?? [];
  const masteredCount = lessons.filter((l) => l.is_mastered).length;
  const hasAnyLesson = lessons.length > 0;
  
  const gamProfile = fullProfile?.gamification || {};
  const inventory = fullProfile?.market?.inventory || [];
  const badges = fullProfile?.badges || [];
  const leaderboardRank = fullProfile?.leaderboard?.rank;
  const leaderboardTotal = fullProfile?.leaderboard?.total_players || 0;
  const quizStats = fullProfile?.quiz || { categories: [], recent: [] };
  const dailyStats = fullProfile?.daily_challenges || {};

  const apiMissions = fullProfile?.missions || [];

  const missions = useMemo(() => {
    return apiMissions.map((item) => {
      const m = item.mission;
      let progress = 0;
      
      switch (m.mission_type) {
        case 'streak':
          progress = streakDoneToday ? 100 : 0;
          break;
        case 'lesson':
          progress = Math.min(100, Math.round((lessons.length / Math.max(1, m.target_value)) * 100));
          break;
        case 'mastery':
          progress = Math.min(100, Math.round((masteredCount / Math.max(1, m.target_value)) * 100));
          break;
        case 'inventory':
          progress = Math.min(100, Math.round((inventory.length / Math.max(1, m.target_value)) * 100));
          break;
        default:
          progress = item.is_completed ? 100 : 0;
      }
      
      return {
        id: m.id,
        slug: m.slug,
        title: m.title_en || m.title_uz,
        description: m.description_en || m.description_uz,
        reward_fuel: m.reward_fuel,
        reward_xp: m.reward_xp,
        progress: item.is_completed ? 100 : progress,
        is_completed: item.is_completed,
        is_daily: m.is_daily,
        mission_type: m.mission_type,
      };
    });
  }, [apiMissions, lessons.length, masteredCount, inventory.length, streakDoneToday]);

  const claimMission = async (mission) => {
    if (mission.is_completed) return;
    if (mission.progress < 100) return;

    if (mission.mission_type === 'streak') {
      try {
        const { data } = await api.post('/gamification/streak/');
        await api.post('/gamification/missions/claim/', { mission_id: mission.id });
        await fetchAll();
        setStreakClaimedToday();
        setStreakDoneToday(true);
        if (data.updated) showToast(`Streak updated! +${(data.fuel_bonus ?? 10) + mission.reward_fuel} fuel`);
        else showToast(`Reward claimed! +${mission.reward_fuel} fuel`);
      } catch {
        showToast('Streak request failed', true);
      }
      return;
    }

    try {
      await api.post('/gamification/missions/claim/', { mission_id: mission.id });
      await fetchAll();
      showToast(`Reward claimed! +${mission.reward_fuel} fuel`);
    } catch {
      showToast('Failed to claim reward.', true);
    }
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

  const apiLessons = progress?.lessons ?? [];
  
  // Merge API lessons with local ones that might not be in API yet
  const completedLessons = useMemo(() => {
    const combined = [...apiLessons];
    localCompletedSlugs.forEach(slug => {
      if (!combined.some(l => l.lesson_slug === slug)) {
        combined.push({
          lesson_slug: slug,
          score: 100,
          is_mastered: true,
          local_only: true
        });
      }
    });
    return combined.filter((l) => l.score != null);
  }, [apiLessons, localCompletedSlugs]);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[100] max-w-sm rounded-xl border px-4 py-3 text-sm shadow-lg ${
            toast.isError ? 'border-red-400/40 bg-red-950/90 text-red-100' : 'border-violet-400/40 bg-space-900/95 text-violet-100'
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
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10 disabled:opacity-50 transition-all"
          >
            {refreshing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
            Refresh Data
          </button>
          <Link
            to="/leaderboard"
            className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-2 text-xs font-semibold text-violet-100 hover:bg-violet-500/20 transition-all"
          >
            <Trophy className="h-3.5 w-3.5" /> Leaderboard
          </Link>
          <Link
            to="/quiz"
            className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-xs font-semibold text-blue-100 hover:bg-blue-500/20 transition-all"
          >
            <Brain className="h-3.5 w-3.5" /> Quiz Hub
          </Link>
        </div>
        {loading && (
          <span className="flex items-center gap-2 text-xs text-white/50">
            <Loader2 className="h-4 w-4 animate-spin" /> Synchronizing...
          </span>
        )}
      </div>

      <section className="relative rounded-3xl border border-violet-400/20 bg-gradient-to-br from-space-900/85 via-[#1a103c]/85 to-[#0b1127]/85 p-5 sm:p-8 shadow-[0_0_50px_rgba(139,92,246,0.12)] mt-8">
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-all z-10"
          >
            <Edit3 className="w-4 h-4" />
            <span className="hidden sm:inline">Edit Profile</span>
          </button>
        )}
        
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 pt-2 sm:pt-0">
          <div className="flex flex-col items-center lg:items-start gap-4 shrink-0">
            {/* Interactive Avatar Area */}
            <div className="relative group h-32 w-32 sm:h-40 sm:w-40 rounded-full overflow-hidden border-[4px] border-violet-400/50 shadow-[0_0_40px_rgba(167,139,250,0.5)] bg-space-800 flex-shrink-0">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-white/20">
                  <UserCircle2 className="h-20 w-20" />
                </div>
              )}
              {/* Overlay (only in edit mode) */}
              {isEditing && (
                <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                  <Camera className="w-8 h-8 text-white mb-1 drop-shadow-md" />
                  <span className="text-[11px] font-bold text-white uppercase tracking-wider drop-shadow-md">Change Photo</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </label>
              )}
            </div>
            
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium border border-violet-300/40 bg-violet-400/10 text-violet-200 uppercase tracking-wide">
              <span className="relative flex w-2 h-2">
                {user ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full w-2 h-2 bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
                  </>
                ) : (
                  <span className="relative inline-flex rounded-full w-2 h-2 bg-gray-500"></span>
                )}
              </span>
              Command Center {user ? 'Online' : 'Offline'}
            </span>

            {/* Streak & Mastery under Avatar */}
            <div className="flex flex-col self-stretch gap-3 mt-4">
              <div className="flex items-center gap-3 bg-black/20 p-3 rounded-2xl border border-white/5 shadow-inner hover:bg-white/5 transition-colors h-16">
                <div className="w-10 h-10 rounded-full border-2 border-orange-400/30 bg-orange-500/10 flex items-center justify-center shadow-inner shrink-0">
                  <Flame className="w-4 h-4 text-orange-400" />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="block text-lg font-black text-white leading-none">{dailyStats.current_streak || streak}</span>
                  <span className="text-[9px] font-bold text-white/50 uppercase tracking-widest mt-1 block">Streak</span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-black/20 p-3 rounded-2xl border border-white/5 shadow-inner hover:bg-white/5 transition-colors h-16">
                <div className="w-10 h-10 rounded-full border-2 border-blue-400/30 bg-blue-500/10 flex items-center justify-center shadow-inner shrink-0">
                  <Brain className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="block text-lg font-black text-white leading-none">{quizStats.total_quizzes || 0}</span>
                  <span className="text-[9px] font-bold text-white/50 uppercase tracking-widest mt-1 block">Mastery</span>
                </div>
              </div>

              <Link to="/space-game" className="flex items-center gap-3 bg-fuchsia-500/10 p-3 rounded-2xl border border-fuchsia-500/20 shadow-[0_0_15px_rgba(217,70,239,0.1)] hover:bg-fuchsia-500/20 hover:border-fuchsia-400/40 hover:shadow-[0_0_25px_rgba(217,70,239,0.25)] transition-all h-16 group relative overflow-hidden mt-1 cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <div className="w-10 h-10 rounded-full border-2 border-fuchsia-400/30 bg-fuchsia-500/20 flex items-center justify-center shadow-inner shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Gamepad className="w-4 h-4 text-fuchsia-300" />
                </div>
                <div className="flex flex-col justify-center relative z-10">
                  <span className="block text-lg font-black text-white leading-none tracking-wide">LAUNCH</span>
                  <span className="text-[9px] font-bold text-fuchsia-300/80 uppercase tracking-widest mt-1 block">Space Run</span>
                </div>
              </Link>
            </div>
          </div>

          <div className="flex-1 w-full space-y-6">
            <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6">
              <div>
                <h1 className="text-3xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-violet-100 to-violet-300 drop-shadow-sm pr-20">
                  {displayName}
                </h1>
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <p className="text-violet-300 flex items-center gap-2 font-medium bg-violet-500/10 border border-violet-400/20 px-4 py-1.5 rounded-full text-sm">
                    <Trophy className="w-4 h-4" /> {title}
                  </p>
                </div>
                {!isEditing && user?.astronaut_name && (
                  <p className="text-sm text-white/50 mt-3 flex items-center gap-1.5 font-medium">
                    <span className="text-violet-400">@</span>{user.astronaut_name}
                  </p>
                )}
              </div>
            </div>

            {/* Profile Content / Edit Mode Toggle */}
            {!isEditing ? (
              <div className="space-y-6">
                {bio ? (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-inner">
                    <h3 className="text-xs font-bold text-violet-200/70 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <UserCircle2 className="w-4 h-4" /> Captain's Log
                    </h3>
                    <p className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">{bio}</p>
                  </div>
                ) : (
                  <div className="bg-black/20 border border-white/5 rounded-2xl p-5 text-center">
                    <p className="text-sm text-white/40 italic">No bio written yet. Tell the galaxy about yourself!</p>
                  </div>
                )}

                <div className="flex flex-col gap-6">
                  {/* Inventory inside Profile */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-inner flex flex-col">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <h3 className="text-xs font-bold text-violet-200/70 uppercase tracking-widest flex items-center gap-2">
                        <Globe2 className="w-4 h-4" /> Garage & Inventory
                      </h3>
                      <Link
                        to="/market"
                        className="text-[10px] font-bold uppercase tracking-wider text-fuchsia-400 hover:text-fuchsia-300 transition-colors bg-fuchsia-400/10 border border-fuchsia-400/20 px-3 py-1.5 rounded-lg shrink-0"
                      >
                        Open Market →
                      </Link>
                    </div>
                    {inventory.length === 0 ? (
                      <p className="text-sm text-white/40 my-auto">No items yet — visit the market.</p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-auto">
                        {inventory.slice(0, 4).map((row) => {
                          const item = row.item;
                          const Icon = pickInventoryIcon(item);
                          const rarity = itemRarity(item?.cost_fuel ?? 0);
                          const titleEn = item?.title_en || item?.slug || 'Item';
                          return (
                            <div
                              key={item?.slug || titleEn}
                              className="rounded-xl border border-white/5 bg-black/20 p-4 hover:bg-white/5 transition-all flex flex-col items-center text-center shadow-inner"
                            >
                              <Icon className="w-8 h-8 text-fuchsia-400 mb-2 drop-shadow-md" />
                              <p className="text-xs font-semibold text-white w-full truncate" title={titleEn}>{titleEn}</p>
                              <span className={`inline-flex mt-1 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${rarityStyle(rarity)}`}>
                                {rarity}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Badges inside Profile */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-inner flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xs font-bold text-violet-200/70 uppercase tracking-widest flex items-center gap-2">
                        <BadgeCheck className="w-4 h-4 text-yellow-400" /> Achieved Badges
                      </h3>
                      <button 
                        onClick={() => setShowBadgesModal(true)}
                        className="text-[10px] font-bold uppercase tracking-widest text-violet-300 hover:text-white transition-colors"
                      >
                        See All
                      </button>
                    </div>
                    {badges.length === 0 ? (
                      <p className="text-sm text-white/40 my-auto">Complete missions to earn badges.</p>
                    ) : (
                      <div className="flex flex-wrap gap-3 mt-auto">
                        {badges.map((ub, i) => {
                          const b = ub.badge || ub;
                          const hint = b.description_en || b.slug || '';
                          return (
                            <div
                              key={b.slug || i}
                              title={hint}
                              className="w-24 sm:w-28 rounded-xl border border-white/5 bg-black/20 p-4 text-center hover:bg-white/5 transition-all flex flex-col items-center justify-center shrink-0 shadow-inner"
                            >
                              <div className="text-3xl mb-2 drop-shadow-md" aria-hidden>
                                {b.icon && b.icon.length <= 4 ? b.icon : '⭐'}
                              </div>
                              <p className="text-[9px] font-bold text-white/70 uppercase tracking-widest line-clamp-2 leading-tight">{b.title_en || b.slug}</p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/5 border border-violet-500/30 rounded-2xl p-5 shadow-[0_0_30px_rgba(139,92,246,0.1)] space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-violet-200 uppercase tracking-widest flex items-center gap-2">
                    <Edit3 className="w-4 h-4" /> Edit Identity
                  </h3>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFirstName(user?.first_name || '');
                      setLastName(user?.last_name || '');
                      setAstronautName(user?.astronaut_name || '');
                      setBio(user?.bio || '');
                      setAvatarFile(null);
                      setAvatarPreview(user?.avatar_url || '');
                    }}
                    className="p-1 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-violet-200/70 ml-1">First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="E.g. Neil"
                      className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all shadow-inner"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-violet-200/70 ml-1">Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="E.g. Armstrong"
                      className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all shadow-inner"
                    />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-violet-200/70 ml-1">Astronaut Call Sign</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-violet-400/60 font-bold">@</span>
                    </div>
                    <input
                      type="text"
                      value={astronautName}
                      onChange={(e) => setAstronautName(e.target.value)}
                      placeholder="E.g. starblazer_99"
                      className="w-full rounded-xl border border-white/10 bg-black/30 pl-8 pr-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-violet-200/70 ml-1">Captain's Log (Bio)</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    maxLength={300}
                    placeholder="Share your cosmic journey, favorite planets, or goals..."
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all shadow-inner resize-none"
                  />
                </div>

                <div className="pt-3 flex flex-wrap sm:flex-nowrap justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFirstName(user?.first_name || '');
                      setLastName(user?.last_name || '');
                      setAstronautName(user?.astronaut_name || '');
                      setBio(user?.bio || '');
                      setAvatarFile(null);
                      setAvatarPreview(user?.avatar_url || '');
                    }}
                    className="w-full sm:w-auto px-6 py-3 text-sm font-bold text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    disabled={savingProfile}
                    className="w-full sm:w-auto relative group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_35px_rgba(139,92,246,0.6)] hover:scale-[1.02] transition-all duration-300 overflow-hidden disabled:opacity-70 disabled:hover:scale-100"
                  >
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                    {savingProfile ? <Loader2 className="h-4 w-4 animate-spin relative z-10" /> : <Save className="h-4 w-4 relative z-10" />}
                    <span className="relative z-10">Save Changes</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-10">
        {/* Column 1: Quiz & Lessons */}
        <div className="flex flex-col gap-6">
          {/* Quiz Performance */}
          <div className="rounded-3xl border border-white/10 bg-space-900/70 p-5">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-400" /> Quiz & Test Performance
            </h2>
            {quizStats.categories?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {quizStats.categories.map((cat) => (
                  <div key={cat.category} className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-all">
                    <p className="text-sm font-medium text-white">{cat.category_name}</p>
                    <p className="text-[11px] text-white/40 mt-0.5">{cat.total_attempts} attempts</p>
                    <div className="mt-3 flex items-end justify-between">
                      <span className="text-xl font-bold text-white">{cat.best_percentage}%</span>
                      <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Best</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-white/40">No quizzes taken yet.</p>
            )}
          </div>

          {/* Completed Lessons */}
          <div className="rounded-3xl border border-white/10 bg-space-900/70 p-5 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Orbit className="w-5 h-5 text-emerald-400" /> Completed Lessons
              </h2>
              {completedLessons.length > 3 && (
                <button 
                  onClick={() => setShowLessonsModal(true)}
                  className="text-[10px] font-bold uppercase tracking-wider text-violet-300 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-lg border border-white/5"
                >
                  See All
                </button>
              )}
            </div>
            {completedLessons.length === 0 ? (
              <p className="text-sm text-white/40">No lesson progress yet — start learning.</p>
            ) : (
              <div className="space-y-3">
                {completedLessons.slice(0, 3).map((row) => {
                  const meta = lessonMetadata[row.lesson_slug];
                  const displayTitle = meta?.title || row.lesson_slug;
                  const displaySubject = meta?.subject || (row.local_only ? 'Lesson' : 'Academy');
                  
                  return (
                    <div
                      key={row.lesson_slug}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4 flex items-center justify-between gap-3 hover:bg-white/10 transition-all"
                    >
                      <div>
                        <p className="font-medium text-white">{displayTitle}</p>
                        <p className="text-xs text-white/50 mt-1">
                          {displaySubject} · Score {row.score}% {row.is_mastered ? '· Mastered' : ''}
                        </p>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${row.is_mastered ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' : 'text-white/70 bg-white/10 border border-white/10'}`}>
                        {row.is_mastered ? 'Mastered' : 'Done'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="mt-auto pt-4">
              <Link to="/learn" className="inline-flex text-xs font-bold uppercase tracking-wider text-white/50 hover:text-white transition-colors">
                Explore Courses →
              </Link>
            </div>
          </div>

          {/* Liked Lessons */}
          <div className="rounded-3xl border border-white/10 bg-space-900/70 p-5 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-400" /> Liked Lessons
              </h2>
              {likedLessons.length > 3 && (
                <button 
                  onClick={() => setShowLikedModal(true)}
                  className="text-[10px] font-bold uppercase tracking-wider text-violet-300 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-lg border border-white/5"
                >
                  See All
                </button>
              )}
            </div>
            {likedLessons.length === 0 ? (
              <p className="text-sm text-white/40">No liked lessons yet.</p>
            ) : (
              <div className="space-y-3">
                {likedLessons.slice(0, 3).map((lesson) => (
                  <Link
                    key={lesson.id}
                    to={lesson.url}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 flex items-center justify-between gap-3 hover:bg-white/10 transition-all block"
                  >
                    <div>
                      <p className="font-medium text-white">{lesson.title}</p>
                      <p className="text-xs text-white/50 mt-1 capitalize">
                        {lesson.subject}
                      </p>
                    </div>
                    <Heart className="w-4 h-4 text-rose-500" fill="#f43f5e" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Missions & Challenges */}
        <div className="flex flex-col gap-6">
          {/* Daily Challenges */}
          <div className="rounded-3xl border border-white/10 bg-space-900/70 p-5">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-400" /> Daily Challenges
            </h2>
            <div className="flex items-center gap-4 text-sm">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 flex-1 hover:bg-white/10 transition-all text-center">
                <span className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-1">Completed</span>
                <span className="font-black text-white text-3xl">{dailyStats.total_completed || 0}</span>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 flex-1 hover:bg-white/10 transition-all text-center">
                <span className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-1">Best Score</span>
                <span className="font-black text-white text-3xl">{dailyStats.best_score || 0}<span className="text-lg text-white/40">/5</span></span>
              </div>
            </div>
          </div>

          {/* Active Missions */}
          <div className="rounded-3xl border border-white/10 bg-space-900/70 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Rocket className="w-5 h-5 text-violet-400" /> Active Missions
              </h2>
              {missions.length > 3 && (
                <button 
                  onClick={() => setShowMissionsModal(true)}
                  className="text-[10px] font-bold uppercase tracking-wider text-violet-300 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-lg border border-white/5"
                >
                  See All
                </button>
              )}
            </div>
            <div className="space-y-4">
              {missions.slice(0, 3).map((mission) => {
                const isDaily = mission.is_daily;
                const progressVal = mission.progress;
                const claimed = mission.is_completed;
                const canClaim = progressVal >= 100 && !claimed;
                
                return (
                  <div key={mission.id} className={`rounded-2xl border ${claimed ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-white/10 bg-white/5'} p-4 hover:bg-white/10 transition-all`}>
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <p className="text-sm font-medium text-white flex items-center gap-2">
                        {claimed && <BadgeCheck className="w-4 h-4 text-emerald-400" />}
                        {mission.title}
                      </p>
                      <span className={`text-xs font-bold ${claimed ? 'text-emerald-400' : 'text-violet-300'}`}>
                        {isDaily ? 'Daily' : claimed ? 'Done' : `${progressVal}%`}
                      </span>
                    </div>
                    {!isDaily && !claimed && (
                      <div className="h-2 rounded-full bg-black/40 overflow-hidden mb-3 border border-white/5">
                        <div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 relative" style={{ width: `${progressVal}%` }}>
                          <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent rounded-t-full" />
                        </div>
                      </div>
                    )}
                    {(isDaily || !claimed) && (
                      <p className="text-xs text-white/50 mb-3 leading-relaxed">{mission.description}</p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <Coins className="w-3.5 h-3.5 text-yellow-400" />
                        <span className="text-xs font-bold text-yellow-400">+{mission.reward_fuel}</span>
                        {mission.reward_xp > 0 && (
                          <span className="text-xs font-bold text-blue-400 ml-1">+{mission.reward_xp} XP</span>
                        )}
                      </div>
                      <button
                        type="button"
                        disabled={claimed || !canClaim}
                        onClick={() => claimMission(mission)}
                        className={`text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl transition-all ${
                          claimed 
                            ? 'text-emerald-400/50 bg-transparent cursor-default' 
                            : canClaim
                              ? 'bg-violet-500 text-white hover:bg-violet-400 hover:-translate-y-0.5 shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                              : 'border border-white/20 bg-white/5 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        {claimed ? 'Claimed' : canClaim ? 'Claim reward' : 'In progress'}
                      </button>
                    </div>
                  </div>
              );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Badges Modal */}
      {showBadgesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowBadgesModal(false)}>
          <div className="relative w-full max-w-2xl bg-space-900 border border-white/10 rounded-3xl p-6 md:p-8 max-h-[85vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setShowBadgesModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors text-white/50 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <BadgeCheck className="w-7 h-7 text-yellow-400" /> All Achievements
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {allBadges.map((b, i) => {
                const isEarned = badges.some((ub) => (ub.badge ? ub.badge.slug : ub.slug) === b.slug);
                return (
                  <div key={b.slug || i} title={b.description_en} className={`rounded-xl border p-4 text-center flex flex-col items-center justify-center min-h-[140px] transition-all ${badgeRarityStyle(b.rarity, isEarned)}`}>
                    <div className="text-4xl mb-3 drop-shadow-md" aria-hidden>
                      {b.icon && b.icon.length <= 4 ? b.icon : '⭐'}
                    </div>
                    <p className={`text-[10px] font-bold uppercase tracking-widest leading-tight mb-1 ${badgeRarityText(b.rarity)}`}>{b.title_en || b.slug}</p>
                    <p className="text-[9px] text-white/60 leading-tight line-clamp-3">{b.description_en}</p>
                  </div>
                );
              })}
            </div>
            {allBadges.length === 0 && (
              <p className="text-center text-white/50 py-10">No achievements available yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Completed Lessons Modal */}
      {showLessonsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowLessonsModal(false)}>
          <div className="relative w-full max-w-2xl bg-space-900 border border-white/10 rounded-3xl p-6 md:p-8 max-h-[85vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setShowLessonsModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors text-white/50 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Orbit className="w-7 h-7 text-emerald-400" /> All Completed Lessons
            </h2>
            <div className="space-y-4">
              {completedLessons.map((row) => {
                const meta = lessonMetadata[row.lesson_slug];
                const displayTitle = meta?.title || row.lesson_slug;
                const displaySubject = meta?.subject || (row.local_only ? 'Lesson' : 'Academy');
                return (
                  <div key={row.lesson_slug} className="rounded-2xl border border-white/10 bg-white/5 p-5 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-lg text-white">{displayTitle}</p>
                      <p className="text-sm text-white/50 mt-1">{displaySubject} · Score {row.score}%</p>
                    </div>
                    <span className={`text-xs px-4 py-1.5 rounded-full font-bold uppercase tracking-widest ${row.is_mastered ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' : 'text-white/70 bg-white/10 border border-white/10'}`}>
                      {row.is_mastered ? 'Mastered' : 'Completed'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Liked Lessons Modal */}
      {showLikedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowLikedModal(false)}>
          <div className="relative w-full max-w-2xl bg-space-900 border border-white/10 rounded-3xl p-6 md:p-8 max-h-[85vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setShowLikedModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors text-white/50 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Heart className="w-7 h-7 text-rose-400" /> Favorite Lessons
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {likedLessons.map((lesson) => (
                <Link
                  key={lesson.id}
                  to={lesson.url}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 flex items-center justify-between gap-3 hover:bg-white/10 transition-all group"
                >
                  <div className="overflow-hidden">
                    <p className="font-semibold text-white group-hover:text-rose-400 transition-colors truncate">{lesson.title}</p>
                    <p className="text-xs text-white/40 mt-1 capitalize">{lesson.subject}</p>
                  </div>
                  <Heart className="w-5 h-5 text-rose-500 shrink-0" fill="#f43f5e" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active Missions Modal */}
      {showMissionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowMissionsModal(false)}>
          <div className="relative w-full max-w-2xl bg-space-900 border border-white/10 rounded-3xl p-6 md:p-8 max-h-[85vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setShowMissionsModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors text-white/50 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Rocket className="w-7 h-7 text-violet-400" /> Mission Log
            </h2>
            <div className="space-y-4">
              {missions.map((mission) => {
                const isDaily = mission.is_daily;
                const progressVal = mission.progress;
                const claimed = mission.is_completed;
                const canClaim = progressVal >= 100 && !claimed;
                return (
                  <div key={mission.id} className={`rounded-2xl border ${claimed ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-white/10 bg-white/5'} p-5 transition-all`}>
                    <div className="flex items-center justify-between gap-4 mb-3">
                      <div>
                        <p className="font-bold text-lg text-white flex items-center gap-2">
                          {claimed && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                          {mission.title}
                        </p>
                        <p className="text-sm text-white/50 mt-1">{mission.description}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className={`text-xs font-black uppercase tracking-widest ${claimed ? 'text-emerald-400' : 'text-violet-400'}`}>
                          {isDaily ? 'Daily' : claimed ? 'Archived' : `${progressVal}%`}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <Coins className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm font-bold text-yellow-400">+{mission.reward_fuel}</span>
                        </div>
                        {mission.reward_xp > 0 && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-blue-400">+{mission.reward_xp} XP</span>
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        disabled={claimed || !canClaim}
                        onClick={() => claimMission(mission)}
                        className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                          claimed 
                            ? 'text-emerald-400/50 bg-transparent' 
                            : canClaim
                              ? 'bg-violet-500 text-white hover:bg-violet-400 shadow-lg'
                              : 'bg-white/5 text-white/20'
                        }`}
                      >
                        {claimed ? 'Claimed' : canClaim ? 'Claim Now' : 'In Progress'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
