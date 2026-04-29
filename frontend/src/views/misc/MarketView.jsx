import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Fuel, Check, Lock, Loader } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useGamificationStore } from '@/store/useGamificationStore';

function ItemCard({ item, owned, onBuy, fuel, buying }) {
  const canAfford = fuel >= item.cost_fuel;
  const isFree = item.cost_fuel === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white/4 border rounded-2xl p-5 flex flex-col gap-4 transition-colors
        ${owned ? 'border-green-500/25' : canAfford ? 'border-white/10 hover:border-white/20' : 'border-white/6 opacity-70'}`}
    >
      {/* Image */}
      <div className="h-32 rounded-xl bg-white/4 flex items-center justify-center overflow-hidden border border-white/6">
        {item.image_url
          ? <img src={item.image_url} alt={item.title_en} className="w-full h-full object-cover" />
          : <span className="text-4xl">{item.item_type === 'spaceship' ? '🚀' : item.item_type === 'boost' ? '⚡' : '🏅'}</span>
        }
      </div>

      {/* Info */}
      <div className="flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-white text-sm">{item.title_en}</h3>
          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold
            ${item.item_type === 'spaceship' ? 'bg-blue-500/15 text-blue-400' :
              item.item_type === 'boost' ? 'bg-yellow-500/15 text-yellow-400' :
              'bg-purple-500/15 text-purple-400'}`}>
            {item.item_type}
          </span>
        </div>
        <p className="text-white/40 text-xs">{item.description_en}</p>
      </div>

      {/* Action */}
      {owned ? (
        <div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
          <Check className="w-4 h-4" /> Owned
        </div>
      ) : (
        <button
          onClick={() => onBuy(item.slug)}
          disabled={!canAfford || buying}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all
            ${canAfford ? 'bg-orange-500/15 hover:bg-orange-500/25 text-orange-400 border border-orange-500/25' :
              'bg-white/4 text-white/25 border border-white/8 cursor-not-allowed'}`}
        >
          {buying ? <Loader className="w-4 h-4 animate-spin" /> : <Fuel className="w-4 h-4" />}
          {isFree ? 'Free' : `${item.cost_fuel} Fuel`}
          {!canAfford && !buying && <Lock className="w-3 h-3" />}
        </button>
      )}
    </motion.div>
  );
}

export default function MarketView() {
  const { isAuthenticated } = useAuthStore();
  const { fuel, spend_fuel } = useGamificationStore();

  const [items, setItems] = useState([]);
  const [inventory, setInventory] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(null);
  const [error, setError] = useState('');
  const currentFuel = useGamificationStore((s) => s.fuel);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: itemsData }, inventoryRes] = await Promise.all([
          api.get('/market/items/'),
          isAuthenticated ? api.get('/market/inventory/') : Promise.resolve({ data: [] }),
        ]);
        setItems(itemsData);
        setInventory(new Set(inventoryRes.data.map((i) => i.item.slug)));
      } catch { /* show empty */ } finally {
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
      // Sync fuel from API
      const { data } = await api.get('/gamification/profile/');
      useGamificationStore.getState().syncFromAPI(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Purchase failed.');
    } finally {
      setBuying(null);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">

      {/* Header */}
      <div className="text-center mb-12">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="w-16 h-16 mx-auto rounded-2xl bg-orange-500/15 border border-orange-500/25 flex items-center justify-center mb-5">
          <ShoppingCart className="w-8 h-8 text-orange-400" />
        </motion.div>
        <h1 className="text-4xl font-black text-white mb-2">Space Market</h1>
        <p className="text-white/40 text-sm max-w-sm mx-auto">Spend your fuel on ships, boosts and badges</p>

        {/* Fuel balance */}
        <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full">
          <Fuel className="w-4 h-4 text-orange-400" />
          <span className="text-orange-400 font-bold">{currentFuel}</span>
          <span className="text-white/40 text-sm">fuel available</span>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm text-center">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader className="w-8 h-8 text-white/30 animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <p className="text-center text-white/25 py-20">No items in the market yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <ItemCard
              key={item.slug}
              item={item}
              owned={inventory.has(item.slug)}
              onBuy={handleBuy}
              fuel={currentFuel}
              buying={buying === item.slug}
            />
          ))}
        </div>
      )}
    </div>
  );
}
