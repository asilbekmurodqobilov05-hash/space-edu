import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Calendar, RefreshCw, Loader, Newspaper } from 'lucide-react';
import api from '@/lib/api';
import GlassCard from '@/components/ui/GlassCard';

const SPACE_FACTS = [
  'A day on Venus is longer than its year.',
  'Neutron stars can spin 600 times per second.',
  'The Milky Way galaxy is about 100,000 light-years wide.',
  'One million Earths could fit inside the Sun.',
  'The footprints left on the Moon will last millions of years.',
  'Space is completely silent — there is no medium for sound to travel.',
  'The largest known star (UY Scuti) is 1,700 times wider than the Sun.',
  'Olympus Mons on Mars is the tallest volcano in the solar system at 22 km.',
  'Light from the Sun takes 8 minutes and 20 seconds to reach Earth.',
  'Saturn would float in water — it is less dense than water.',
];

const CATEGORY_COLORS = {
  discovery:   { text: 'text-yellow-400',  bg: 'bg-yellow-400/10',  border: 'border-yellow-400/30' },
  technology:  { text: 'text-neon-blue',   bg: 'bg-neon-blue/10',   border: 'border-neon-blue/30' },
  exploration: { text: 'text-green-400',   bg: 'bg-green-400/10',   border: 'border-green-400/30' },
  local:       { text: 'text-violet-light', bg: 'bg-violet/10',      border: 'border-violet/30' },
  science:     { text: 'text-pink-400',    bg: 'bg-pink-400/10',    border: 'border-pink-400/30' },
  mission:     { text: 'text-orange-400',  bg: 'bg-orange-400/10',  border: 'border-orange-400/30' },
};

function NewsCard({ article, index }) {
  const color = CATEGORY_COLORS[article.category] || CATEGORY_COLORS.science;
  const date = new Date(article.published_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      layout
    >
      <GlassCard delay={0} className="h-full flex flex-col group cursor-default">
        {/* Image */}
        <div className="relative h-44 -mx-7 -mt-7 mb-6 rounded-t-[1.4rem] overflow-hidden bg-white/[0.03]">
          {article.image_url ? (
            <img
              src={article.image_url}
              alt={article.title_en}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Newspaper className="w-12 h-12 text-white/5" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-[10px] font-[800] uppercase tracking-widest border ${color.text} ${color.bg} ${color.border}`}>
              {article.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-2 text-[11px] text-white/30 font-[600] mb-3">
            <Calendar className="w-3.5 h-3.5" />
            {date}
            {article.source && <span className="ml-auto text-white/20">{article.source}</span>}
          </div>

          <h3 className="text-lg font-[800] text-white leading-snug mb-3 group-hover:text-violet-light transition-colors line-clamp-2">
            {article.title_en}
          </h3>
          <p className="text-white/40 text-[13px] leading-relaxed flex-1 line-clamp-3">
            {article.summary_en}
          </p>

          {article.source_url && (
            <a
              href={article.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 pt-5 border-t border-white/5 flex items-center gap-2 text-[11px] font-[800] uppercase tracking-wider text-white/30 hover:text-violet-light transition-colors"
            >
              Read Full Story <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
}

export default function NewsView() {
  const [articles, setArticles] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [fact, setFact] = useState(() => SPACE_FACTS[Math.floor(Math.random() * SPACE_FACTS.length)]);

  useEffect(() => {
    api.get('/news/')
      .then(({ data }) => {
        const list = Array.isArray(data) ? data : data.results || [];
        setArticles(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...Array.from(new Set(articles.map((a) => a.category)))];
  const filtered = activeCategory === 'All' ? articles : articles.filter((a) => a.category === activeCategory);

  return (
    <div className="relative min-h-screen pt-32 pb-24 px-4 overflow-hidden">
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[140px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(0,229,255,0.03) 0%, transparent 70%)' }} />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[140px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.03) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-[11px] font-[800] tracking-[0.3em] uppercase text-neon-blue mb-3">Mission Dispatch</p>
            <h1 className="text-[clamp(36px,5vw,56px)] font-[900] tracking-tight text-white leading-[1]">
              Space <span className="text-glow-purple text-violet">News</span>
            </h1>
            <p className="text-white/40 mt-4 max-w-md font-[500]">
              Latest discoveries, launches, and breakthroughs from across the cosmos.
            </p>
          </motion.div>

          {/* Daily Fact */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-sm p-5 rounded-2xl bg-white/[0.02] border border-white/5 border-l-2 border-l-neon-blue/50"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-[800] uppercase tracking-[0.2em] text-neon-blue">Daily Fact</p>
              <button
                onClick={() => setFact(SPACE_FACTS[Math.floor(Math.random() * SPACE_FACTS.length)])}
                className="text-white/20 hover:text-white/60 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            <p className="text-white/60 text-[13px] leading-relaxed">{fact}</p>
          </motion.div>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-[10px] font-[800] uppercase tracking-widest transition-all ${
                activeCategory === cat
                  ? 'bg-violet text-white shadow-lg shadow-violet/20'
                  : 'bg-white/[0.03] border border-white/5 text-white/40 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader className="w-8 h-8 text-violet-light animate-spin" />
            <p className="text-[10px] font-[800] uppercase tracking-widest text-white/20">Loading dispatches...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32 border border-dashed border-white/5 rounded-3xl">
            <p className="text-white/20 font-bold italic">No articles in this category yet.</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <AnimatePresence>
              {filtered.map((article, i) => (
                <NewsCard key={article.id} article={article} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
