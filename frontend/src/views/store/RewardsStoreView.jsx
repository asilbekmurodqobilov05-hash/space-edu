import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Coins,
  Crown,
  Flame,
  Loader2,
  Lock,
  Rocket,
  ShieldCheck,
  Sparkles,
  Star,
  Unlock,
  X,
  Zap,
  BookOpen,
  Code2,
  GraduationCap,
  MessageSquare,
  Trophy,
  CheckCircle2,
  AlertCircle,
  Gamepad2,
} from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useGamificationStore } from '@/store/useGamificationStore';
import { useTranslation } from '@/hooks/useTranslation';

// ── Icon mapping (backend sends icon string, we map to Lucide component) ─────
const ICON_MAP = {
  BookOpen, Code2, GraduationCap, MessageSquare, Trophy,
  Zap, Crown, Rocket, Gamepad2, Star, Sparkles, ShieldCheck,
};

// ── Reward tiers ──────────────────────────────────────────────────────────────
const TIER_CONFIG = {
  common: {
    label: 'Common',
    color: 'from-slate-400 to-slate-500',
    border: 'border-white/10',
    glow: '',
    badge: 'bg-white/10 text-white/70',
    ring: 'ring-white/10',
  },
  rare: {
    label: 'Rare',
    color: 'from-cyan-400 to-blue-500',
    border: 'border-cyan-500/30',
    glow: 'shadow-[0_0_30px_rgba(34,211,238,0.12)]',
    badge: 'bg-cyan-500/15 text-cyan-300',
    ring: 'ring-cyan-400/20',
  },
  epic: {
    label: 'Epic',
    color: 'from-violet-400 to-fuchsia-500',
    border: 'border-fuchsia-500/30',
    glow: 'shadow-[0_0_30px_rgba(217,70,239,0.15)]',
    badge: 'bg-fuchsia-500/15 text-fuchsia-300',
    ring: 'ring-fuchsia-400/20',
  },
  legendary: {
    label: 'Legendary',
    color: 'from-amber-400 to-orange-500',
    border: 'border-orange-500/30',
    glow: 'shadow-[0_0_30px_rgba(249,115,22,0.15)]',
    badge: 'bg-orange-500/15 text-orange-300',
    ring: 'ring-orange-400/20',
  },
};

// Using translation keys via a hook directly in the component for the categories array.
// See active usage in component below.

// ── Toast component ───────────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-8 right-8 z-[200] max-w-sm"
    >
      <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl border backdrop-blur-xl shadow-2xl ${
        type === 'success'
          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-200'
          : 'bg-red-500/15 border-red-500/30 text-red-200'
      }`}>
        {type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
        <p className="text-sm font-medium flex-1">{message}</p>
        <button onClick={onClose} className="text-white/40 hover:text-white"><X className="w-4 h-4" /></button>
      </div>
    </motion.div>
  );
}

// ── Reward Card ───────────────────────────────────────────────────────────────
function RewardCard({ reward, owned, onPurchase, purchasing, userCoins }) {
  const tier = TIER_CONFIG[reward.tier] || TIER_CONFIG.common;
  const Icon = ICON_MAP[reward.icon] || Star;
  const canAfford = userCoins >= reward.cost;
  const features = Array.isArray(reward.features) ? reward.features : [];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`group relative rounded-[1.5rem] border overflow-hidden transition-all duration-300 ${tier.border} ${tier.glow} ${owned ? 'bg-white/[0.04]' : 'bg-white/[0.02] hover:bg-white/[0.05]'}`}
    >
      {/* Gradient accent line */}
      <div className={`h-1 w-full bg-gradient-to-r ${tier.color}`} />

      <div className="p-6 flex flex-col h-full">
        {/* Header row */}
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tier.color} flex items-center justify-center shadow-lg ring-1 ${tier.ring}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${tier.badge}`}>
            {tier.label}
          </span>
        </div>

        {/* Title & description */}
        <h3 className="text-[15px] font-bold text-white mb-1.5 leading-tight group-hover:text-white transition-colors">
          {reward.title_en}
        </h3>
        <p className="text-[12px] text-white/45 leading-relaxed mb-4 line-clamp-2 flex-1">
          {reward.description_en}
        </p>

        {/* Feature pills */}
        {features.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {features.map((f) => (
              <span key={f} className="text-[9px] font-bold uppercase tracking-wider text-white/40 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                {f}
              </span>
            ))}
          </div>
        )}

        {/* Price & Action */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-amber-400" />
            <span className="text-lg font-black text-white tabular-nums">{reward.cost}</span>
            <span className="text-[10px] text-white/30 font-bold uppercase tracking-wider">{t('store', 'coins')}</span>
          </div>

          {owned ? (
            <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <Unlock className="w-3.5 h-3.5" /> {t('store', 'unlocked')}
            </span>
          ) : (
            <button
              onClick={() => onPurchase(reward)}
              disabled={purchasing || !canAfford}
              className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl transition-all active:scale-[0.97] ${
                canAfford
                  ? `bg-gradient-to-r ${tier.color} text-white shadow-lg hover:shadow-xl hover:scale-[1.02]`
                  : 'bg-white/5 text-white/30 border border-white/5 cursor-not-allowed'
              }`}
            >
              {purchasing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : canAfford ? (
                <Rocket className="w-3.5 h-3.5" />
              ) : (
                <Lock className="w-3.5 h-3.5" />
              )}
              {canAfford ? t('store', 'unlock') : t('store', 'needMore')}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Confirmation Modal ────────────────────────────────────────────────────────
function ConfirmModal({ reward, userCoins, onConfirm, onCancel, purchasing }) {
  if (!reward) return null;
  const tier = TIER_CONFIG[reward.tier] || TIER_CONFIG.common;
  const Icon = ICON_MAP[reward.icon] || Star;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-md rounded-3xl border bg-[#0c0a14] p-8 shadow-2xl ${tier.border} ${tier.glow}`}
      >
        <div className="text-center mb-6">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tier.color} flex items-center justify-center mx-auto mb-4 shadow-xl ring-2 ${tier.ring}`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-1">{t('store', 'unlockPrompt').replace('{item}', reward.title_en)}</h3>
          <p className="text-sm text-white/50">{reward.description_en}</p>
        </div>

        <div className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/60">{t('store', 'yourBalance')}</span>
            <div className="flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-white">{userCoins}</span>
            </div>
          </div>
          <div className="h-px bg-white/5 my-3" />
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/60">{t('store', 'cost')}</span>
            <span className="font-bold text-red-400">-{reward.cost}</span>
          </div>
          <div className="h-px bg-white/5 my-3" />
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-white/80">{t('store', 'remaining')}</span>
            <div className="flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-white">{userCoins - reward.cost}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 font-bold text-sm hover:bg-white/5 transition-colors"
          >
            {t('store', 'cancel')}
          </button>
          <button
            onClick={() => onConfirm(reward)}
            disabled={purchasing}
            className={`flex-1 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r ${tier.color} shadow-lg hover:shadow-xl transition-all active:scale-[0.97] flex items-center justify-center gap-2`}
          >
            {purchasing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            {t('store', 'confirm')}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function RewardsStoreView() {
  const { isAuthenticated } = useAuthStore();
  const fuel = useGamificationStore((s) => s.fuel);
  const syncFromAPI = useGamificationStore((s) => s.syncFromAPI);
  const { t, i18n } = useTranslation();

  const CATEGORIES = [
    { id: 'all', label: t('store', 'allRewards'), icon: Sparkles },
    { id: 'tests', label: t('store', 'mockTests'), icon: GraduationCap },
    { id: 'mentor', label: t('store', 'mentorship'), icon: MessageSquare },
    { id: 'content', label: t('store', 'premiumContent'), icon: BookOpen },
    { id: 'game', label: t('store', 'gameItems'), icon: Gamepad2 },
  ];

  const [products, setProducts] = useState([]);
  const [purchasedSlugs, setPurchasedSlugs] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [confirmReward, setConfirmReward] = useState(null);
  const [purchasing, setPurchasing] = useState(false);
  const [toast, setToast] = useState(null);

  const userCoins = fuel;

  // Fetch products + user purchases
  useEffect(() => {
    const load = async () => {
      try {
        const [prodRes, purchRes] = await Promise.allSettled([
          api.get('/gamification/rewards/'),
          isAuthenticated ? api.get('/gamification/rewards/purchases/') : Promise.resolve({ data: [] }),
        ]);

        if (prodRes.status === 'fulfilled') {
          setProducts(prodRes.value.data || []);
        }
        if (purchRes.status === 'fulfilled') {
          const data = Array.isArray(purchRes.value.data) ? purchRes.value.data : [];
          setPurchasedSlugs(new Set(data.map((p) => p.product?.slug).filter(Boolean)));
        }
      } catch { /* silent */ }
      finally { setLoading(false); }
    };
    load();
  }, [isAuthenticated]);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const handlePurchase = async (reward) => {
    if (!isAuthenticated) {
      showToast(t('store', 'loginToUnlock'), 'error');
      return;
    }
    if (userCoins < reward.cost) {
      showToast(t('store', 'notEnoughCoins'), 'error');
      return;
    }

    setPurchasing(true);
    try {
      const res = await api.post('/gamification/rewards/buy/', { slug: reward.slug });

      // Sync fuel from server response
      if (res.data.fuel !== undefined) {
        syncFromAPI({ fuel: res.data.fuel });
      }

      setPurchasedSlugs((prev) => new Set([...prev, reward.slug]));
      setConfirmReward(null);
      showToast(t('store', 'purchaseSuccess').replace('{item}', reward.title_en), 'success');
    } catch (err) {
      showToast(err.response?.data?.detail || t('store', 'purchaseFailed'), 'error');
    } finally {
      setPurchasing(false);
    }
  };

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter((r) => r.category === activeCategory);

  const unlockedCount = products.filter((r) => purchasedSlugs.has(r.slug)).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

      {/* Hero Header */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-bold uppercase tracking-widest mb-6"
        >
          <Star className="w-3.5 h-3.5" /> {t('store', 'premiumRewards')}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-violet-100 to-violet-300 mb-3"
        >
          {t('store', 'title')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-white/40 max-w-lg mx-auto text-sm leading-relaxed"
        >
          {t('store', 'description')}
        </motion.p>
      </div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap items-center justify-center gap-4 mb-10"
      >
        <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl px-5 py-3">
          <Coins className="w-5 h-5 text-amber-400" />
          <div>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">{t('store', 'balance')}</p>
            <p className="text-xl font-black text-amber-200 tabular-nums">{userCoins}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-5 py-3">
          <Unlock className="w-5 h-5 text-emerald-400" />
          <div>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">{t('store', 'unlocked')}</p>
            <p className="text-xl font-black text-emerald-200 tabular-nums">{unlockedCount}<span className="text-sm text-white/30">/{products.length}</span></p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-violet-500/10 border border-violet-500/20 rounded-2xl px-5 py-3">
          <Flame className="w-5 h-5 text-violet-400" />
          <div>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">{t('store', 'available')}</p>
            <p className="text-xl font-black text-violet-200 tabular-nums">{products.length - unlockedCount}</p>
          </div>
        </div>
      </motion.div>

      {/* Category Tabs */}
      <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
        {CATEGORIES.map((cat) => {
          const CatIcon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                isActive
                  ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                  : 'bg-white/5 text-white/40 border border-white/5 hover:bg-white/10 hover:text-white/70'
              }`}
            >
              <CatIcon className="w-3.5 h-3.5" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Rewards Grid */}
      <AnimatePresence mode="popLayout">
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          {filteredProducts.map((reward) => (
            <RewardCard
              key={reward.slug}
              reward={reward}
              owned={purchasedSlugs.has(reward.slug)}
              onPurchase={() => setConfirmReward(reward)}
              purchasing={purchasing && confirmReward?.slug === reward.slug}
              userCoins={userCoins}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {filteredProducts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-white/30 text-sm">{t('store', 'noRewards')}</p>
        </div>
      )}

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmReward && (
          <ConfirmModal
            reward={confirmReward}
            userCoins={userCoins}
            onConfirm={handlePurchase}
            onCancel={() => setConfirmReward(null)}
            purchasing={purchasing}
          />
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
}
