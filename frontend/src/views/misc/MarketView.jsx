import { motion } from 'motion/react';
import { ShoppingCart, Battery, Check, Lock } from 'lucide-react';
import { useGamificationStore } from '@/store/useGamificationStore';
import { useTranslation } from '@/hooks/useTranslation';

const marketItems = [
  {
    id: 'mini_mars',
    nameKey: 'miniMars',
    descKey: 'miniMarsDesc',
    cost: 150,
    image: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'astro_book',
    nameKey: 'astroBook',
    descKey: 'astroBookDesc',
    cost: 50,
    image: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'telescope_upgrade',
    nameKey: 'telescopeUpgrade',
    descKey: 'telescopeUpgradeDesc',
    cost: 300,
    image: 'https://images.unsplash.com/photo-1518066000714-58c45f1a2c0a?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'space_suit_patch',
    nameKey: 'spaceSuitPatch',
    descKey: 'spaceSuitPatchDesc',
    cost: 100,
    image: 'https://images.unsplash.com/photo-1584972208009-159e4b788787?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'mini_iss',
    nameKey: 'miniIss',
    descKey: 'miniIssDesc',
    cost: 500,
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'rocket_blueprint',
    nameKey: 'rocketBlueprint',
    descKey: 'rocketBlueprintDesc',
    cost: 200,
    image: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&q=80&w=600',
  },
];

export default function MarketView() {
  const { fuel, inventory, buyItem } = useGamificationStore();
  const { t } = useTranslation();

  const handleBuy = (itemId, cost) => {
    buyItem(itemId, cost);
  };

  const steps = [t('market', 'simpleStep1'), t('market', 'simpleStep2'), t('market', 'simpleStep3')];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div>
          <p className="text-orange-400 text-sm font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            {t('market', 'hub')}
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t('market', 'title')}{' '}
            <span className="text-orange-400">{t('market', 'titleHighlight')}</span>
          </h1>
          <p className="mt-3 text-white/70 text-base max-w-xl leading-relaxed">
            {t('market', 'subtitle')}
          </p>
        </div>

        <div className="glass rounded-2xl px-5 py-4 border border-orange-500/25 flex items-center gap-4 shrink-0">
          <Battery className="w-8 h-8 text-orange-400" />
          <div>
            <p className="text-xs text-white/50 font-semibold uppercase">{t('market', 'availableFuel')}</p>
            <p className="text-2xl font-bold text-white">
              {fuel} <span className="text-orange-400 text-lg font-semibold">{t('market', 'units')}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="mb-10 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <p className="text-sm font-bold text-white mb-3">{t('market', 'simpleHowTitle')}</p>
        <ol className="space-y-2 text-sm text-white/75 list-decimal list-inside">
          {steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {marketItems.map((item, index) => {
          const isOwned = inventory.includes(item.id);
          const canAfford = fuel >= item.cost;

          return (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`rounded-2xl border overflow-hidden flex flex-col bg-space-900/40 ${
                isOwned ? 'border-green-500/35' : canAfford ? 'border-white/12' : 'border-white/8 opacity-75'
              }`}
            >
              <div className="relative h-36">
                <img
                  src={item.image}
                  alt={t('market', item.nameKey)}
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover ${!canAfford && !isOwned ? 'grayscale opacity-55' : ''}`}
                />
              </div>
              <div className="p-4 flex flex-col flex-1 gap-3">
                <div>
                  <h2 className="text-lg font-bold text-white">{t('market', item.nameKey)}</h2>
                  <p className="text-white/60 text-sm mt-1 leading-snug">{t('market', item.descKey)}</p>
                </div>
                <div className="flex items-center justify-between text-sm mt-auto pt-1">
                  <span className="text-white/45">{t('market', 'priceLabel')}</span>
                  <span className="font-mono font-bold text-orange-300">{item.cost}</span>
                </div>
                {isOwned ? (
                  <div className="flex items-center justify-center gap-2 text-green-400 font-semibold py-2.5 rounded-xl bg-green-500/10 border border-green-500/25">
                    <Check className="w-4 h-4" />
                    {t('market', 'acquired')}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleBuy(item.id, item.cost)}
                    disabled={!canAfford}
                    className={`w-full py-2.5 rounded-xl font-bold text-sm transition-colors ${
                      canAfford
                        ? 'bg-orange-500 text-white hover:bg-orange-400'
                        : 'bg-white/5 text-white/35 border border-white/10 cursor-not-allowed flex items-center justify-center gap-2'
                    }`}
                  >
                    {canAfford ? (
                      t('market', 'purchase')
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
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
    </div>
  );
}

