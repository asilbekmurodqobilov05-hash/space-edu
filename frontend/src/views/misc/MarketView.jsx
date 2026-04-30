import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Fuel, Check, Lock, Loader, Sparkles, Rocket, Zap, Award } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useGamificationStore } from '@/store/useGamificationStore';
import GlassCard from '@/components/ui/GlassCard';

function ItemCard({ item, owned, onBuy, fuel, buying }) {
  const canAfford = fuel >= item.cost_fuel;
  const isFree = item.cost_fuel === 0;

  const getAccent = () => {
    if (item.item_type === 'spaceship') return '#6366f1';
    if (item.item_type === 'boost') return '#fbbf24';
    return '#a78bfa';
  };

  const accent = getAccent();

  return (
    <GlassCard accent={accent} delay={0} className={`h-full flex flex-col ${!owned && !canAfford ? 'opacity-60' : ''}`}>
      {/* Type badge */}
      <div className="absolute top-6 right-6">
        <span 
          className="text-[9px] font-[800] uppercase tracking-[0.2em] px-2.5 py-1 rounded-full border"
          style={{ 
            color: accent, 
            background: `${accent}15`, 
            borderColor: `${accent}30` 
          }}
        >
          {item.item_type}
        </span>
      </div>

      {/* Image / Icon container */}
      <div className="relative h-40 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center overflow-hidden mb-6 group-hover:border-white/10 transition-colors shadow-inner">
        {item.image_url ? (
          <img src={item.image_url} alt={item.title_en} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        ) : (
          <div className="text-5xl transition-transform duration-500 group-hover:scale-110 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            {item.item_type === 'spaceship' ? '🚀' : item.item_type === 'boost' ? '⚡' : '🏅'}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      </div>

      {/* Info */}
      <div className="flex-1 mb-8">
        <h3 className="text-xl font-[900] text-white tracking-tight mb-2">{item.title_en}</h3>
        <p className="text-white/40 text-[13px] leading-relaxed line-clamp-2">
          {item.description_en}
        </p>
      </div>

      {/* Action footer */}
      <div className="pt-6 border-t border-white/5">
        {owned ? (
          <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-[800] uppercase tracking-widest">
            <Check className="w-4 h-4" /> Collected
          </div>
        ) : (
          <button
            onClick={() => onBuy(item.slug)}
            disabled={!canAfford || buying}
            className={`w-full flex items-center justify-center gap-3 py-3.5 rounded-xl font-[800] text-xs uppercase tracking-widest transition-all
              ${canAfford 
                ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 active:scale-[0.98]' 
                : 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed'}`}
          >
            {buying ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Fuel className="w-4 h-4" />
                {isFree ? 'Claim Free' : `${item.cost_fuel} Fuel`}
                {!canAfford && <Lock className="w-3.5 h-3.5 ml-1 opacity-50" />}
              </>
            )}
          </button>
        )}
      </div>
    </GlassCard>
  );
}

export default function MarketView() {
  const { isAuthenticated } = useAuthStore();

  const [items, setItems] = useState([]);
  const [inventory, setInventory] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(null);
  const [error, setError] = useState('');
  const currentFuel = useGamificationStore((s) => s.fuel);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsRes, inventoryRes] = await Promise.all([
          api.get('/market/items/'),
          isAuthenticated ? api.get('/market/inventory/') : Promise.resolve({ data: [] }),
        ]);
        
        // Handle paginated or non-paginated response
        const itemsData = Array.isArray(itemsRes.data) ? itemsRes.data : itemsRes.data.results || [];
        setItems(itemsData);
        
        setInventory(new Set(inventoryRes.data.map((i) => i.item.slug)));
      } catch (err) {
        setError('Unable to load market data right now.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated]);

  const handleBuy = async (slug) => {
    if (!isAuthenticated) { setError('Sign in to purchase items.'); return; }
    setBuying(slug);
    setError('');
    try {
      await api.post('/market/purchase/', { item_slug: slug });
      setInventory((prev) => new Set([...prev, slug]));
      const { data } = await api.get('/gamification/profile/');
      useGamificationStore.getState().syncFromAPI(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Purchase failed.');
    } finally {
      setBuying(null);
    }
  };

  return (
    <div className="relative min-h-screen pt-32 pb-24 px-4 overflow-hidden">
      {/* Decorative ambient glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[140px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.03) 0%, transparent 70%)' }} />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[140px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(0,229,255,0.03) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
          <div className="text-center md:text-left">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <p className="text-[11px] font-[800] tracking-[0.3em] uppercase text-orange-400 mb-3">Galactic Supply</p>
              <h1 className="text-[clamp(36px,5vw,56px)] font-[900] tracking-tight leading-[1] text-white">Space <span className="text-glow-purple text-violet">Market</span></h1>
              <p className="text-white/40 text-base mt-4 max-w-md font-[500]">Acquire premium equipment and badges using your mission fuel.</p>
            </motion.div>
          </div>

          {/* Balance Display */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="flex items-center gap-6 p-1.5 pr-6 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-xl"
          >
            <div className="w-14 h-14 rounded-[1.1rem] bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <Fuel className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-[900] text-white tracking-tighter">{currentFuel.toLocaleString()}</p>
              <p className="text-[10px] font-[800] uppercase tracking-widest text-orange-400/60">Available Fuel</p>
            </div>
          </motion.div>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-[700] text-center tracking-wide">
            {error}
          </motion.div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader className="w-10 h-10 text-violet-light animate-spin" />
            <p className="text-[11px] font-[800] uppercase tracking-[0.2em] text-white/20">Establishing connection...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-32 bg-white/[0.01] border border-dashed border-white/5 rounded-3xl">
            <p className="text-white/20 font-bold italic">The black market is currently empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {items.map((item, i) => (
              <motion.div
                key={item.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <ItemCard
                  item={item}
                  owned={inventory.has(item.slug)}
                  onBuy={handleBuy}
                  fuel={currentFuel}
                  buying={buying === item.slug}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
