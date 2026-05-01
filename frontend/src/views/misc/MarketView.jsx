import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Fuel, Check, Lock, Loader, Search, Menu, X, Star, Percent, Flame, Sparkles, Rocket, Zap, Award, Filter, Tags, ArrowDownUp } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useGamificationStore } from '@/store/useGamificationStore';
import { useTranslation } from '@/hooks/useTranslation';

// ── MOCK DATA ───────────────────────────────────────────────────────────────
const MOCK_ITEMS = [
  { 
    slug: 'quantum-book', 
    title_en: 'Quantum Physics', 
    title_ru: 'Квантовая физика',
    description_en: 'A deep dive into the fundamental laws of the universe, covering entanglement and wave-particle duality.', 
    item_type: 'book', 
    price: 125000,
    original_price: 150000,
    discount_percent: 16,
    is_bestseller: true,
    is_new: false,
    cost_fuel: 150, 
    image_url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000&auto=format&fit=crop',
    specs: { pages: '450', level: 'Intermediate', format: 'Holographic' }
  },
  { 
    slug: 'mars-book', 
    title_en: 'The Martian Chronicles', 
    title_ru: 'Марсианские хроники',
    description_en: 'Ray Bradbury\'s classic exploration of humanity\'s first steps on the Red Planet.', 
    item_type: 'book', 
    price: 85000,
    is_bestseller: false,
    is_new: false,
    cost_fuel: 120, 
    image_url: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=1000&auto=format&fit=crop',
    specs: { pages: '320', level: 'Beginner', format: 'Digital' }
  },
  { 
    slug: 'raptor-engine', 
    title_en: 'Raptor Engine V2', 
    title_ru: 'Двигатель Raptor V2',
    description_en: 'High-performance methalox engine designed for the next generation of interplanetary transport.', 
    item_type: 'rocket_module', 
    price: 12500000,
    original_price: 15000000,
    discount_percent: 16,
    is_bestseller: true,
    is_new: true,
    cost_fuel: 1500, 
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/e/e2/Raptor_Engine_2016.jpg',
    specs: { thrust: '230tf', fuel: 'CH4/LOX', mass: '1600kg' }
  },
  { 
    slug: 'space-helmet', 
    title_en: 'Astra Helmet', 
    title_ru: 'Шлем Astra',
    description_en: 'Next-gen HUD with real-time oxygen monitoring and wide-angle panoramic visor.', 
    item_type: 'other', 
    price: 450000,
    is_bestseller: true,
    is_new: true,
    cost_fuel: 750, 
    image_url: 'https://images.unsplash.com/photo-1541873676947-9ea5d8a31346?q=80&w=1000&auto=format&fit=crop',
    specs: { air: '12h', visor: 'Titanium-Glass', comm: 'Sub-Space' }
  },
  { 
    slug: 'solar-wing', 
    title_en: 'Solar Array Wing', 
    title_ru: 'Солнечная панель',
    description_en: 'High-efficiency gallium arsenide solar panels for continuous power generation in orbit.', 
    item_type: 'satellite', 
    price: 890000,
    original_price: 1100000,
    discount_percent: 19,
    is_bestseller: false,
    is_new: false,
    cost_fuel: 950, 
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/0/07/ISS_Solar_Arrays.jpg',
    specs: { power: '15kW', span: '12m', efficiency: '42%' }
  },
  { 
    slug: 'imaging-sensor', 
    title_en: 'Multi-Spectral Sensor', 
    title_ru: 'Мультиспектральный сенсор',
    description_en: 'Capture high-resolution data across various spectrums for planetary analysis.', 
    item_type: 'satellite', 
    price: 1150000,
    is_bestseller: false,
    is_new: true,
    cost_fuel: 1100, 
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Hubble_Space_Telescope_CGI_render.jpg',
    specs: { res: '0.1m', bands: '12', storage: '100TB' }
  },
  { 
    slug: 'gravity-boots', 
    title_en: 'Mag-Grip Boots', 
    title_ru: 'Магнитные ботинки Mag-Grip',
    description_en: 'Magnetic soles designed for zero-G environments and metallic hull walking.', 
    item_type: 'other', 
    price: 320000,
    original_price: 400000,
    discount_percent: 20,
    is_bestseller: true,
    is_new: false,
    cost_fuel: 550, 
    image_url: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?q=80&w=1000&auto=format&fit=crop',
    specs: { strength: '500N', weight: '2.5kg', battery: '48h' }
  },
  { 
    slug: 'lunar-wheel', 
    title_en: 'Regolith Wheel', 
    title_ru: 'Колесо для реголита',
    description_en: 'Specially engineered mesh wheel for maximum traction on loose lunar and martian soil.', 
    item_type: 'other', 
    price: 250000,
    is_bestseller: false,
    is_new: true,
    cost_fuel: 450, 
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Lunar_Rover_wheel.jpg',
    specs: { material: 'NiTi Mesh', temp: '-150 to 120C', life: '5000km' }
  },
  { 
    slug: 'fuel-tank', 
    title_en: 'Titanium Fuel Tank', 
    title_ru: 'Титановый топливный бак',
    description_en: 'Ultra-lightweight storage for cryogenic propellants with advanced thermal insulation.', 
    item_type: 'rocket_module', 
    price: 780000,
    original_price: 900000,
    discount_percent: 13,
    is_bestseller: false,
    is_new: false,
    cost_fuel: 800, 
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Starship_fuel_tank.jpg/1200px-Starship_fuel_tank.jpg',
    specs: { volume: '500m鲁', pressure: '50bar', alloy: 'Ti-6Al-4V' }
  },
  { 
    slug: 'antenna-high', 
    title_en: 'Ka-Band Antenna', 
    title_ru: 'Антенна Ka-диапазона',
    description_en: 'Long-range communication array for high-bandwidth data transfer across the solar system.', 
    item_type: 'satellite', 
    price: 550000,
    is_bestseller: false,
    is_new: false,
    cost_fuel: 600, 
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/TDRS_satellite_antenna.jpg',
    specs: { freq: '26-40GHz', gain: '55dBi', reach: 'Deep Space' }
  },
  { 
    slug: 'astrophysics-book', 
    title_en: 'Astrophysics 101', 
    title_ru: 'Основы астрофизики',
    description_en: 'Essential knowledge for every space explorer, from stellar evolution to black holes.', 
    item_type: 'book', 
    price: 180000,
    is_bestseller: true,
    is_new: true,
    cost_fuel: 200, 
    image_url: 'https://images.booksense.com/images/154/788/9780393609394.jpg',
    specs: { pages: '280', level: 'Advanced', format: 'Physical' }
  },
  { 
    slug: 'guidance-pc', 
    title_en: 'Nav-Core Mk-III', 
    title_ru: 'Навигационный компьютер Mk-III',
    title_uz: 'Nav-Core Mk-III navigatsiya kompyuteri',
    description_en: 'Advanced guidance computer with AI trajectory plotting and redundant safety systems.', 
    description_ru: 'Усовершенствованный навигационный компьютер с ИИ-построением траекторий и дублирующими системами безопасности.',
    description_uz: 'Sun\'iy intellekt asosida trayektoriya qurish va zaxira xavfsizlik tizimlariga ega ilg\'or navigatsiya kompyuteri.',
    item_type: 'rocket_module', 
    price: 1450000,
    original_price: 1600000,
    discount_percent: 9,
    is_bestseller: false,
    is_new: true,
    cost_fuel: 1200, 
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Apollo_Guidance_Computer_DSKY.jpg',
    specs: { cpu: 'Quantum-X', ram: '2TB', accuracy: '0.001mm' }
  },
];

const formatPrice = (price) => {
  if (price == null) return '—';
  return Number(price).toLocaleString('ru-RU') + ' сум';
};

const getPrice = (item) => item.price ?? item.cost_fuel ?? 0;

function ItemCard({ item, onClick, onBuy, buying }) {
  const getAccent = () => {
    switch (item.item_type) {
      case 'book': return '#3b82f6';
      case 'rocket_module': return '#ef4444';
      case 'satellite': return '#10b981';
      case 'other': return '#f59e0b';
      default: return '#a78bfa';
    }
  };

  const accent = getAccent();
  const { t, language } = useTranslation();
  const title = item[`title_${language.toLowerCase()}`] || item.title_en;

  return (
    <div 
      className="bg-white/[0.03] border border-white/10 rounded-[1.5rem] overflow-hidden flex flex-col group hover:border-white/20 transition-all duration-300 cursor-pointer shadow-[0_4px_24px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
      onClick={() => onClick(item)}
    >
      {/* Image Area - Edge to Edge */}
      <div className="relative h-48 w-full bg-black/40 overflow-hidden">
        {item.image_url ? (
          <img 
            src={item.image_url} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-5xl transition-transform duration-500 group-hover:scale-110">
            {item.item_type === 'book' ? '📖' : item.item_type === 'rocket_module' ? '🚀' : item.item_type === 'satellite' ? '🛰️' : '📦'}
          </div>
        )}
        
        {/* Badges overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {item.discount_percent > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg w-max">
              -{item.discount_percent}%
            </span>
          )}
          {item.is_bestseller && (
            <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg flex items-center gap-1 w-max">
              <Flame className="w-3 h-3" /> {t('market', 'hit')}
            </span>
          )}
          {item.is_new && (
            <span className="bg-cyan-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg flex items-center gap-1 w-max">
              <Sparkles className="w-3 h-3" /> {t('market', 'newBadge')}
            </span>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Price section */}
        <div className="mb-2">
          {item.original_price ? (
            <div className="flex items-end gap-2 flex-wrap">
              <span className="text-xl font-[900] text-red-400 leading-none">{formatPrice(getPrice(item), t)}</span>
              <span className="text-sm font-medium text-white/30 line-through leading-none">{formatPrice(item.original_price, t)}</span>
            </div>
          ) : (
            <span className="text-xl font-[900] text-white leading-none">{formatPrice(getPrice(item), t)}</span>
          )}
        </div>
        
        {/* Title */}
        <h3 className="text-[15px] font-[600] text-white/90 leading-snug line-clamp-2 flex-1 mb-4 group-hover:text-violet-400 transition-colors">
          {title}
        </h3>

        {/* Action Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onBuy(item.slug);
          }}
          disabled={buying}
          className="w-full bg-violet-600 hover:bg-violet-500 text-white py-3 rounded-xl font-[700] text-[13px] flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          {buying ? <Loader className="w-4 h-4 animate-spin" /> : <ShoppingCart className="w-4 h-4" />}
          {t('market', 'inCart')}
        </button>
      </div>
    </div>
  );
}

// Product Modal Component
function ProductModal({ item, onClose, onBuy, buying }) {
  const { t, language } = useTranslation();
  if (!item) return null;
  const title = item[`title_${language.toLowerCase()}`] || item.title_en;
  const description = item[`description_${language.toLowerCase()}`] || item.description_en;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#0f0e13] border border-white/10 rounded-[2rem] overflow-hidden w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row shadow-2xl relative"
        >
          <button onClick={onClose} className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/50 hover:bg-black rounded-full flex items-center justify-center text-white/50 hover:text-white transition-colors backdrop-blur-md">
            <X className="w-5 h-5" />
          </button>

          {/* Left: Image */}
          <div className="w-full md:w-1/2 bg-black relative min-h-[300px]">
            {item.image_url ? (
              <img src={item.image_url} alt={title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl">📦</div>
            )}
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              {item.discount_percent > 0 && <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg w-max">-{item.discount_percent}%</span>}
              {item.is_bestseller && <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 w-max"><Flame className="w-4 h-4" /> {t('market', 'bestSellers').toUpperCase()}</span>}
            </div>
          </div>

          {/* Right: Details */}
          <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-400 bg-violet-400/10 px-3 py-1 rounded-full">
                {item.item_type.replace('_', ' ')}
              </span>
            </div>
            
            <h2 className="text-3xl font-[800] text-white mb-2 leading-tight">{title}</h2>
            <p className="text-white/50 text-sm mb-6">{description}</p>

            <div className="bg-white/[0.03] rounded-2xl p-6 mb-8 border border-white/5">
              {item.original_price && (
                <div className="text-white/40 line-through text-lg font-medium mb-1">
                  {formatPrice(item.original_price, t)}
                </div>
              )}
              <div className="flex items-center gap-4">
                <span className="text-4xl font-[900] text-white">{formatPrice(getPrice(item), t)}</span>
              </div>
              
              <button
                onClick={() => onBuy(item.slug)}
                disabled={buying}
                className="w-full mt-6 bg-violet-600 hover:bg-violet-500 text-white py-4 rounded-xl font-[800] text-[15px] flex items-center justify-center gap-2 transition-all shadow-[0_10px_30px_rgba(124,58,237,0.3)] active:scale-[0.98]"
              >
                {buying ? <Loader className="w-5 h-5 animate-spin" /> : <ShoppingCart className="w-5 h-5" />}
                Добавить в корзину
              </button>
            </div>

            <h4 className="text-sm font-[800] uppercase tracking-wider text-white/40 mb-4">Характеристики</h4>
            <div className="space-y-3">
              {Object.entries(item.specs || {}).map(([key, val]) => (
                <div key={key} className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-sm text-white/50 capitalize">{key}</span>
                  <span className="text-sm font-medium text-white/90">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function MarketView() {
  const { t, language } = useTranslation();
  const { isAuthenticated } = useAuthStore();

  const [items, setItems] = useState([]);
  const [inventory, setInventory] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(null);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('default');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsRes, inventoryRes] = await Promise.all([
          api.get('/market/items/'),
          isAuthenticated ? api.get('/market/inventory/') : Promise.resolve({ data: [] }),
        ]);
        
        // Handle paginated or non-paginated response
        const itemsData = Array.isArray(itemsRes.data) ? itemsRes.data : itemsRes.data.results || [];
        setItems(itemsData.length > 0 ? itemsData : MOCK_ITEMS);
        
        const invData = Array.isArray(inventoryRes.data) ? inventoryRes.data : inventoryRes.data.results || [];
        setInventory(new Set(invData.map((i) => i.item?.slug).filter(Boolean)));
      } catch (err) {
        setItems(MOCK_ITEMS);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated]);

  const handleBuy = async (slug) => {
    if (!isAuthenticated) {
      alert('Please log in to purchase items.');
      return;
    }
    setBuying(slug);
    try {
      await api.post('/market/purchase/', { item_slug: slug });
      setInventory(prev => new Set([...prev, slug]));
      alert('Purchase successful!');
    } catch (err) {
      alert(err.response?.data?.detail || 'Purchase failed.');
    } finally {
      setBuying(null);
    }
  };

  const categories = ['all', ...new Set(items.map(item => item.item_type))];

  // Filtering Logic
  const filteredItems = items
    .filter(item => {
      if (activeCategory !== 'all' && item.item_type !== activeCategory) return false;
      if (searchQuery && !(item.title_en.toLowerCase().includes(searchQuery.toLowerCase()) || (item.title_ru && item.title_ru.toLowerCase().includes(searchQuery.toLowerCase())))) return false;
      if (activeFilter === 'discount' && !item.discount_percent) return false;
      if (activeFilter === 'bestseller' && !item.is_bestseller) return false;
      if (activeFilter === 'new' && !item.is_new) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortOrder === 'price-asc') return getPrice(a) - getPrice(b);
      if (sortOrder === 'price-desc') return getPrice(b) - getPrice(a);
      if (sortOrder === 'discount') return (b.discount_percent || 0) - (a.discount_percent || 0);
      return 0;
    });

  // Derived sections for the Home View
  const bestSellers = items.filter(i => i.is_bestseller).slice(0, 4);
  const wowPrices = items.filter(i => i.discount_percent > 0).sort((a,b) => b.discount_percent - a.discount_percent).slice(0, 4);
  const newModels = items.filter(i => i.is_new).slice(0, 4);
  const forYou = items.slice().sort(() => 0.5 - Math.random()).slice(0, 4);

  const isHomeView = activeCategory === 'all' && activeFilter === 'all' && !searchQuery && sortOrder === 'default';

  return (
    <div className="relative min-h-screen pb-24 bg-[#020106] text-white font-sans pt-0">
      
      {/* Top Header / Nav Area */}
      <div className="sticky top-0 z-50 bg-[#020106]/90 backdrop-blur-xl border-b border-white/5 pt-[100px] pb-4 px-4 sm:px-8">
        <div className="max-w-[1600px] mx-auto flex items-center gap-4 md:gap-8">
          
          <h1 className="text-2xl md:text-3xl font-[900] tracking-tighter text-white shrink-0 hidden sm:block">{t('market', 'title')}</h1>
          
          <button className="shrink-0 bg-violet-600 hover:bg-violet-500 text-white px-5 py-3 rounded-xl font-[800] text-sm flex items-center gap-2 transition-colors">
            <Menu className="w-5 h-5" />
            <span className="hidden sm:inline">{t('market', 'catalog')}</span>
          </button>

          <div className="flex-1 relative">
            <input 
              type="text" 
              placeholder={t('market', 'searchPlaceholder')} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.05] border border-white/10 hover:border-white/20 focus:border-violet-500 rounded-xl py-3 pl-12 pr-4 text-white text-sm font-medium outline-none transition-all placeholder:text-white/30"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button className="shrink-0 relative bg-white/[0.05] hover:bg-white/10 p-3 rounded-xl transition-colors border border-white/5">
            <ShoppingCart className="w-5 h-5 text-white" />
            <span className="absolute -top-1.5 -right-1.5 bg-violet-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">0</span>
          </button>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto relative z-10 px-4 sm:px-8 pt-8">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-48 gap-8">
            <Loader className="w-12 h-12 text-violet-500 animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Left Sidebar: Categories */}
            <aside className="lg:w-64 w-full flex-shrink-0 lg:sticky lg:top-32 hidden lg:block">
              <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
                <h3 className="text-sm font-[800] uppercase tracking-wider text-white/50 mb-6 flex items-center gap-2">
                  <Tags className="w-4 h-4" /> {t('market', 'categories')}
                </h3>
                <div className="flex flex-col gap-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`text-left px-4 py-3 rounded-xl text-[13px] font-[600] transition-all ${
                        activeCategory === category 
                          ? 'bg-violet-600/20 text-violet-400 border border-violet-500/30' 
                          : 'text-white/60 hover:bg-white/5 hover:text-white border border-transparent'
                      }`}
                    >
                      {category === 'all' ? t('market', 'allProducts') : category.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Sidebar logic combined into Left for Yandex style (usually filters are on the left or top) */}
              <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 mt-6">
                <h3 className="text-sm font-[800] uppercase tracking-wider text-white/50 mb-6 flex items-center gap-2">
                  <Filter className="w-4 h-4" /> {t('market', 'filters')}
                </h3>
                <div className="flex flex-col gap-2 mb-8">
                  {[
                    { id: 'all', label: t('market', 'allOffers') },
                    { id: 'bestseller', label: t('market', 'bestSellers') },
                    { id: 'discount', label: t('market', 'onSale') },
                    { id: 'new', label: t('market', 'new') }
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setActiveFilter(f.id)}
                      className={`text-left px-4 py-3 rounded-xl text-[13px] font-[600] transition-all ${
                        activeFilter === f.id 
                          ? 'bg-white/10 text-white border border-white/20' 
                          : 'text-white/60 hover:bg-white/5 hover:text-white border border-transparent'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                <h3 className="text-sm font-[800] uppercase tracking-wider text-white/50 mb-6 flex items-center gap-2">
                  <ArrowDownUp className="w-4 h-4" /> {t('market', 'sort')}
                </h3>
                <div className="flex flex-col gap-2">
                  {[
                    { id: 'default', label: t('market', 'popular') },
                    { id: 'price-asc', label: t('market', 'priceAsc') },
                    { id: 'price-desc', label: t('market', 'priceDesc') },
                    { id: 'discount', label: t('market', 'discountSort') }
                  ].map(s => (
                    <button
                      key={s.id}
                      onClick={() => setSortOrder(s.id)}
                      className={`text-left px-4 py-3 rounded-xl text-[13px] font-[600] transition-all ${
                        sortOrder === s.id 
                          ? 'bg-white/10 text-white border border-white/20' 
                          : 'text-white/60 hover:bg-white/5 hover:text-white border border-transparent'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 w-full min-w-0">
              
              {isHomeView ? (
                /* Home View with Thematic Sections */
                <div className="space-y-16">
                  
                  {/* Section 1: Best Sellers */}
                  <section>
                    <div className="flex items-center gap-3 mb-6">
                      <h2 className="text-2xl font-[900] text-white">{t('market', 'bestSellersSection')}</h2>
                      <Flame className="w-6 h-6 text-orange-500" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                      {bestSellers.map(item => (
                        <ItemCard key={`bs-${item.slug}`} item={item} onClick={setSelectedItem} onBuy={handleBuy} buying={buying === item.slug} />
                      ))}
                    </div>
                  </section>

                  {/* Section 2: For You */}
                  <section>
                    <div className="flex items-center gap-3 mb-6">
                      <h2 className="text-2xl font-[900] text-white">{t('market', 'forYou')}</h2>
                      <Sparkles className="w-6 h-6 text-violet-400" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                      {forYou.map(item => (
                        <ItemCard key={`fy-${item.slug}`} item={item} onClick={setSelectedItem} onBuy={handleBuy} buying={buying === item.slug} />
                      ))}
                    </div>
                  </section>

                  {/* Section 3: WOW Prices */}
                  <section className="bg-gradient-to-r from-red-500/10 to-transparent p-6 -mx-6 rounded-3xl border border-red-500/10">
                    <div className="flex items-center gap-3 mb-6">
                      <h2 className="text-3xl font-[900] text-red-400 italic">{t('market', 'wowPrices')}</h2>
                      <Percent className="w-8 h-8 text-red-500" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                      {wowPrices.map(item => (
                        <ItemCard key={`wow-${item.slug}`} item={item} onClick={setSelectedItem} onBuy={handleBuy} buying={buying === item.slug} />
                      ))}
                    </div>
                  </section>

                  {/* Section 4: New Models */}
                  <section>
                    <div className="flex items-center gap-3 mb-6">
                      <h2 className="text-2xl font-[900] text-white">{t('market', 'newModels')}</h2>
                      <Rocket className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                      {newModels.map(item => (
                        <ItemCard key={`new-${item.slug}`} item={item} onClick={setSelectedItem} onBuy={handleBuy} buying={buying === item.slug} />
                      ))}
                    </div>
                  </section>

                </div>
              ) : (
                /* Search / Filter / Category Grid View */
                <div>
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-[900] text-white">
                      {searchQuery ? `${t('market', 'results')}: "${searchQuery}"` : t('market', 'catalog')}
                    </h2>
                    <span className="text-white/40 text-sm font-medium">{filteredItems.length} {t('market', 'allProducts').toLowerCase()}</span>
                  </div>
                  
                  {filteredItems.length === 0 ? (
                    <div className="text-center py-40 bg-white/[0.01] border border-dashed border-white/10 rounded-3xl">
                      <p className="text-white/40 font-[600] text-lg">{t('market', 'noResults')}</p>
                      <button onClick={() => {setSearchQuery(''); setActiveCategory('all'); setActiveFilter('all');}} className="mt-4 text-violet-400 hover:text-violet-300 font-bold">{t('market', 'resetFilters')}</button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                      {filteredItems.map(item => (
                        <ItemCard key={item.slug} item={item} onClick={setSelectedItem} onBuy={handleBuy} buying={buying === item.slug} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </main>

          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedItem && (
        <ProductModal 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
          onBuy={handleBuy} 
          buying={buying === selectedItem.slug} 
        />
      )}
    </div>
  );
}
