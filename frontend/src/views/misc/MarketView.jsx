<<<<<<< HEAD
import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Battery, Check, Lock, Filter, Tag, ArrowUpDown } from 'lucide-react';
=======
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Fuel, Check, Lock, Loader } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
>>>>>>> 19217f396fae14b5ff58dd59c373b59f0d366ec2
import { useGamificationStore } from '@/store/useGamificationStore';

<<<<<<< HEAD
const marketItems = [
  {
    id: 'mini_mars',
    nameKey: 'miniMars',
    descKey: 'miniMarsDesc',
    cost: 150,
    category: 'Artifacts',
    image: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'astro_book',
    nameKey: 'astroBook',
    descKey: 'astroBookDesc',
    cost: 50,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'telescope_upgrade',
    nameKey: 'telescopeUpgrade',
    descKey: 'telescopeUpgradeDesc',
    cost: 300,
    category: 'Equipment',
    image: 'https://images.unsplash.com/photo-1518066000714-58c45f1a2c0a?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'space_suit_patch',
    nameKey: 'spaceSuitPatch',
    descKey: 'spaceSuitPatchDesc',
    cost: 100,
    category: 'Artifacts',
    image: 'https://images.unsplash.com/photo-1584972208009-159e4b788787?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'mini_iss',
    nameKey: 'miniIss',
    descKey: 'miniIssDesc',
    cost: 500,
    category: 'Artifacts',
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'rocket_blueprint',
    nameKey: 'rocketBlueprint',
    descKey: 'rocketBlueprintDesc',
    cost: 200,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'oxygen_tank',
    nameKey: 'oxygenTank',
    descKey: 'oxygenTankDesc',
    cost: 80,
    category: 'Equipment',
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'lunar_sample',
    nameKey: 'lunarSample',
    descKey: 'lunarSampleDesc',
    cost: 400,
    category: 'Artifacts',
    image: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80&w=600',
  },
];

const CATEGORIES = ['All', 'Artifacts', 'Books', 'Equipment'];

export default function MarketView() {
  const { fuel, inventory, buyItem } = useGamificationStore();
  const { t } = useTranslation();

  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [maxPrice, setMaxPrice] = useState(500);

  const filteredItems = useMemo(() => {
    let items = [...marketItems];
    
    // Category filter
    if (activeCategory !== 'All') {
      items = items.filter(item => item.category === activeCategory);
    }

    // Price filter
    items = items.filter(item => item.cost <= maxPrice);

    // Sorting
    if (sortBy === 'price-low') items.sort((a, b) => a.cost - b.cost);
    if (sortBy === 'price-high') items.sort((a, b) => b.cost - a.cost);
    if (sortBy === 'name') items.sort((a, b) => t('market', a.nameKey).localeCompare(t('market', b.nameKey)));

    return items;
  }, [activeCategory, sortBy, maxPrice, t]);

  const handleBuy = (itemId, cost) => buyItem(itemId, cost);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <p className="text-violet-400 text-sm font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            {t('market', 'hub')}
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t('market', 'title')}{' '}
            <span className="text-violet-400">{t('market', 'titleHighlight')}</span>
          </h1>
          <p className="mt-3 text-white/70 text-base max-w-xl leading-relaxed">
            {t('market', 'subtitle')}
          </p>
=======
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
>>>>>>> 19217f396fae14b5ff58dd59c373b59f0d366ec2
        </div>
        <p className="text-white/40 text-xs">{item.description_en}</p>
      </div>

<<<<<<< HEAD
        <div className="glass rounded-2xl px-5 py-4 border border-violet-500/25 flex items-center gap-4 shrink-0 bg-violet-500/5">
          <Battery className="w-8 h-8 text-violet-400" />
          <div>
            <p className="text-xs text-white/50 font-semibold uppercase">{t('market', 'availableFuel')}</p>
            <p className="text-2xl font-bold text-white">
              {fuel} <span className="text-violet-400 text-lg font-semibold">{t('market', 'units')}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8">
        {/* Left Side: Categories */}
        <aside className="lg:col-span-2 space-y-6">
          <div>
            <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
              <Tag className="w-4 h-4 text-violet-400" />
              Categories
            </h3>
            <div className="flex flex-wrap lg:flex-col gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all text-left border ${
                    activeCategory === cat
                      ? 'bg-violet-600 text-white border-violet-400 shadow-[0_0_20px_rgba(139,92,246,0.3)]'
                      : 'bg-black/40 text-white/60 border-white/5 hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Center: Products Grid */}
        <main className="lg:col-span-8">
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
              {filteredItems.map((item, index) => {
                const isOwned = inventory.includes(item.id);
                const canAfford = fuel >= item.cost;

                return (
                  <motion.article
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className={`rounded-2xl border overflow-hidden flex flex-col bg-black/40 backdrop-blur-sm transition-all hover:border-violet-500/40 group ${
                      isOwned ? 'border-violet-400/50' : canAfford ? 'border-white/10' : 'border-white/5 opacity-75'
                    }`}
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={item.image}
                        alt={t('market', item.nameKey)}
                        className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                          !canAfford && !isOwned ? 'grayscale opacity-50' : ''
                        }`}
                      />
                      <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-bold text-violet-300 border border-white/10">
                        {item.category}
                      </div>
                    </div>
                    <div className="p-4 flex flex-col flex-1 gap-3">
                      <div>
                        <h2 className="text-base font-bold text-white truncate">{t('market', item.nameKey)}</h2>
                        <p className="text-white/50 text-xs mt-1 line-clamp-2 h-8 leading-relaxed">
                          {t('market', item.descKey)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-xs mt-auto pt-2 border-t border-white/5">
                        <span className="text-white/40">{t('market', 'priceLabel')}</span>
                        <div className="flex items-center gap-1">
                          <Battery className="w-3 h-3 text-violet-400" />
                          <span className="font-bold text-white">{item.cost}</span>
                        </div>
                      </div>
                      {isOwned ? (
                        <div className="flex items-center justify-center gap-1.5 text-white text-xs font-bold py-2 rounded-lg bg-violet-600/20 border border-violet-400/30">
                          <Check className="w-3.5 h-3.5 text-violet-400" />
                          {t('market', 'acquired')}
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleBuy(item.id, item.cost)}
                          disabled={!canAfford}
                          className={`w-full py-2 rounded-lg font-bold text-xs transition-all ${
                            canAfford
                              ? 'bg-violet-600 text-white hover:bg-violet-500 hover:scale-[1.02] active:scale-[0.98]'
                              : 'bg-black/20 text-white/30 border border-white/10 cursor-not-allowed flex items-center justify-center gap-1.5'
                          }`}
                        >
                          {canAfford ? (
                            t('market', 'purchase')
                          ) : (
                            <>
                              <Lock className="w-3 h-3" />
                              {t('market', 'insufficient')}
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </motion.article>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-white/30">
              <ShoppingCart className="w-16 h-16 mb-4 opacity-10" />
              <p className="text-lg font-medium">No items found</p>
              <button onClick={() => { setActiveCategory('All'); setMaxPrice(500); }} className="mt-4 text-violet-400 hover:underline text-sm">
                Reset filters
              </button>
            </div>
          )}
        </main>

        {/* Right Side: Filters */}
        <aside className="lg:col-span-2 space-y-8">
          <section>
            <h3 className="text-white font-bold mb-5 flex items-center gap-2 text-sm uppercase tracking-wider">
              <Filter className="w-4 h-4 text-violet-400" />
              Refine
            </h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold text-white/60">Max Price</label>
                  <span className="text-xs font-mono text-violet-400">{maxPrice} Units</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="10"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-violet-600 bg-white/10 rounded-lg h-1.5 appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-white/60 block mb-3">Sort By</label>
                <div className="relative group">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/80 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                  >
                    <option value="default" className="bg-black">Recommended</option>
                    <option value="price-low" className="bg-black">Price: Low to High</option>
                    <option value="price-high" className="bg-black">Price: High to Low</option>
                    <option value="name" className="bg-black">Name: A-Z</option>
                  </select>
                  <ArrowUpDown className="w-4 h-4 text-white/30 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none group-hover:text-violet-400 transition-colors" />
                </div>
              </div>
            </div>
          </section>

          <section className="p-5 rounded-2xl border border-white/5 bg-black/40">
            <h4 className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-3">Shopping Tip</h4>
            <p className="text-xs text-white/60 leading-relaxed italic">
              "Complete daily challenges to earn more fuel for the store."
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}



=======
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
>>>>>>> 19217f396fae14b5ff58dd59c373b59f0d366ec2
