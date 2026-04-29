import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Battery, Check, Lock, Filter, Tag, ArrowUpDown } from 'lucide-react';
import { useGamificationStore } from '@/store/useGamificationStore';
import { useTranslation } from '@/hooks/useTranslation';

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
        </div>

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



