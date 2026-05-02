import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/api';
import { Users, BookOpen, ShoppingBag, MessageCircle, Newspaper, Calendar, HelpCircle, Search, Plus, Trash2, Edit, X, Shield, Sun, Moon, ArrowLeft } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const MENU_GROUPS = [
  {
    titleKey: 'platformManagement',
    items: [
      { id: 'dashboard', labelKey: 'dashboard', icon: Shield },
      { id: 'users', labelKey: 'users', icon: Users },
    ]
  },
  {
    titleKey: 'educationContent',
    items: [
      { id: 'spheres', labelKey: 'spheres', icon: BookOpen },
      { id: 'topics', labelKey: 'topics', icon: BookOpen },
      { id: 'lessons', labelKey: 'lessons', icon: BookOpen },
      { id: 'questions', labelKey: 'questions', icon: HelpCircle },
    ]
  },
  {
    titleKey: 'communityStore',
    items: [
      { id: 'market', labelKey: 'market', icon: ShoppingBag },
      { id: 'news', labelKey: 'news', icon: Newspaper },
      { id: 'events', labelKey: 'events', icon: Calendar },
      { id: 'chat', labelKey: 'chat', icon: MessageCircle },
    ]
  }
];
const TABS = MENU_GROUPS.flatMap(g => g.items);

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-slate-900/[0.04] dark:bg-white/[0.04] border border-slate-900/10 dark:border-white/10 rounded-2xl p-5 hover:border-violet/30 transition-all">
      <p className="text-[10px] font-extrabold text-slate-500 dark:text-white/30 uppercase tracking-widest mb-2">{label}</p>
      <p className="text-3xl font-black text-slate-900 dark:text-white">{value}</p>
      {sub && <p className="text-xs text-slate-400 dark:text-white/30 mt-1">{sub}</p>}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white dark:bg-[#1a1b23] border border-slate-900/10 dark:border-white/10 rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-900/5 dark:border-white/5">
          <h3 className="font-black text-lg">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-900/5 dark:hover:bg-white/5 rounded-xl"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', options }) {
  return (
    <div className="flex flex-col gap-1.5 mb-4">
      <label className="text-[10px] font-extrabold text-slate-500 dark:text-white/30 uppercase tracking-widest">{label}</label>
      {type === 'select' ? (
        <select value={value} onChange={e => onChange(e.target.value)} className="bg-slate-50 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-violet/40">
          {options.map(o => <option key={o.value} value={o.value} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{o.label}</option>)}
        </select>
      ) : type === 'textarea' ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} rows={3} className="bg-slate-50 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-violet/40 resize-none" />
      ) : type === 'checkbox' ? (
        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={value} onChange={e => onChange(e.target.checked)} className="accent-violet w-4 h-4" /><span className="text-sm">{value ? 'Yes' : 'No'}</span></label>
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} className="bg-slate-50 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-violet/40" />
      )}
    </div>
  );
}

function DashboardTab({ stats }) {
  const { t } = useTranslation();
  if (!stats) return <p className="text-slate-400">Loading...</p>;
  return (
    <div>
      <h2 className="text-2xl font-black mb-6">{t('admin', 'platformOverview')}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label={t('admin', 'totalUsers')} value={stats.users?.total} sub={`+${stats.users?.new_week}`} />
        <StatCard label={t('admin', 'staff')} value={stats.users?.staff_count} />
        <StatCard label={t('admin', 'lessons')} value={stats.content?.lessons} />
        <StatCard label="Problems" value={stats.content?.problems} />
        <StatCard label={t('admin', 'questions')} value={stats.content?.challenge_questions} />
        <StatCard label={t('admin', 'news')} value={stats.community?.news_articles} />
        <StatCard label={t('admin', 'events')} value={stats.community?.space_events} />
        <StatCard label={t('admin', 'chatMessages')} value={stats.community?.chat_messages} />
      </div>
      <h3 className="font-extrabold text-sm uppercase tracking-widest text-slate-500 dark:text-white/40 mb-3">{t('admin', 'recentUsers')}</h3>
      <div className="bg-slate-900/[0.02] dark:bg-white/[0.02] border border-slate-900/5 dark:border-white/5 rounded-xl overflow-hidden">
        {(stats.recent_users || []).map(u => (
          <div key={u.id} className="flex items-center justify-between px-5 py-3 border-b border-slate-900/5 dark:border-white/5 last:border-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-violet/20 flex items-center justify-center text-xs font-bold">{(u.first_name || u.username)[0].toUpperCase()}</div>
              <div><p className="text-sm font-bold">{u.first_name} {u.last_name}</p><p className="text-[10px] text-slate-400">@{u.username} · {u.email}</p></div>
            </div>
            <div className="flex items-center gap-2">
              {u.is_staff && <span className="text-[9px] font-bold bg-violet/20 text-violet-light px-2 py-0.5 rounded-full">STAFF</span>}
              <span className="text-[10px] text-slate-400">{new Date(u.date_joined).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UsersTab() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');
  const [editing, setEditing] = useState(null);
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQ(q), 300);
    return () => clearTimeout(timer);
  }, [q]);

  const load = () => api.get(`/admin-panel/users/?q=${debouncedQ}`).then(r => setUsers(r.data)).catch(() => {});
  useEffect(() => { load(); }, [debouncedQ]);
  const save = () => { api.patch(`/admin-panel/users/${editing.id}/`, editing).then(() => { setEditing(null); load(); }); };
  const del = (id) => { if (confirm('Delete user?')) api.delete(`/admin-panel/users/${id}/`).then(load); };
  
  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-2xl font-black">{t('admin', 'users')}</h2>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder={t('admin', 'searchUsers')} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-violet/40 text-slate-900 dark:text-white" />
        </div>
      </div>
      <div className="bg-slate-900/[0.02] dark:bg-white/[0.02] border border-slate-900/5 dark:border-white/5 rounded-xl overflow-hidden">
        {users.map(u => (
          <div key={u.id} className="flex items-center justify-between px-5 py-3 border-b border-slate-900/5 dark:border-white/5 last:border-0">
            <div><p className="text-sm font-bold">{u.first_name} {u.last_name} <span className="text-slate-400 font-normal">@{u.username}</span></p><p className="text-[10px] text-slate-400">{u.email}</p></div>
            <div className="flex items-center gap-2">
              {u.is_staff && <span className="text-[9px] font-bold bg-violet/20 text-violet-light px-2 py-0.5 rounded-full">STAFF</span>}
              <button onClick={() => setEditing({...u})} className="p-2 hover:bg-slate-900/5 dark:hover:bg-white/5 rounded-lg"><Edit className="w-3.5 h-3.5 text-slate-400" /></button>
              <button onClick={() => del(u.id)} className="p-2 hover:bg-red-500/10 rounded-lg"><Trash2 className="w-3.5 h-3.5 text-red-400/50" /></button>
            </div>
          </div>
        ))}
      </div>
      {editing && (
        <Modal title={t('admin', 'editUser')} onClose={() => setEditing(null)}>
          <div className="grid grid-cols-2 gap-4">
            <Field label={t('admin', 'firstName')} value={editing.first_name || ''} onChange={v => setEditing({...editing, first_name: v})} />
            <Field label={t('admin', 'lastName')} value={editing.last_name || ''} onChange={v => setEditing({...editing, last_name: v})} />
          </div>
          <Field label={t('admin', 'astronautName')} value={editing.astronaut_name || ''} onChange={v => setEditing({...editing, astronaut_name: v})} />
          <Field label={t('admin', 'bio')} value={editing.bio || ''} onChange={v => setEditing({...editing, bio: v})} type="textarea" />
          <Field label={t('admin', 'language')} value={editing.language || 'uz'} onChange={v => setEditing({...editing, language: v})} type="select" options={[{value:'uz',label:'Uzbek'}, {value:'en',label:'English'}, {value:'ru',label:'Russian'}]} />
          <div className="flex gap-4 mt-2">
            <Field label={t('admin', 'staff')} value={editing.is_staff} onChange={v => setEditing({...editing, is_staff: v})} type="checkbox" />
            <Field label={t('admin', 'active')} value={editing.is_active} onChange={v => setEditing({...editing, is_active: v})} type="checkbox" />
          </div>
          <button onClick={save} className="w-full py-3 bg-violet text-white rounded-xl font-bold text-sm mt-4">{t('admin', 'saveChanges')}</button>
        </Modal>
      )}
    </div>
  );
}

function CrudTab({ title, endpoint, fields, defaultItem }) {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(defaultItem);
  const load = () => api.get(`/admin-panel/${endpoint}/`).then(r => setItems(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);
  const save = () => {
    if (creating) { api.post(`/admin-panel/${endpoint}/`, form).then(() => { setCreating(false); setForm(defaultItem); load(); }); }
    else { api.patch(`/admin-panel/${endpoint}/${editing.id}/`, editing).then(() => { setEditing(null); load(); }); }
  };
  const del = (id) => { if (confirm('Delete?')) api.delete(`/admin-panel/${endpoint}/${id}/`).then(load); };
  const displayField = fields[0]?.name || 'id';
  const subField = fields[1]?.name;
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black">{title}</h2>
        <button onClick={() => { setCreating(true); setForm(defaultItem); }} className="flex items-center gap-2 px-4 py-2 bg-violet text-white rounded-xl text-sm font-bold hover:bg-violet-dark transition-colors"><Plus className="w-4 h-4" />{t('admin', 'addNew')}</button>
      </div>
      <div className="bg-slate-900/[0.02] dark:bg-white/[0.02] border border-slate-900/5 dark:border-white/5 rounded-xl overflow-hidden">
        {items.length === 0 && <p className="p-8 text-center text-slate-400 text-sm">{t('admin', 'noItemsYet')}</p>}
        {items.map(item => (
          <div key={item.id} className="flex items-center justify-between px-5 py-3 border-b border-slate-900/5 dark:border-white/5 last:border-0">
            <div><p className="text-sm font-bold">{item[displayField]?.substring?.(0, 80) || item[displayField]}</p>{subField && <p className="text-[10px] text-slate-400">{item[subField]}</p>}</div>
            <div className="flex items-center gap-2">
              <button onClick={() => setEditing({...item})} className="p-2 hover:bg-slate-900/5 dark:hover:bg-white/5 rounded-lg"><Edit className="w-3.5 h-3.5 text-slate-400" /></button>
              <button onClick={() => del(item.id)} className="p-2 hover:bg-red-500/10 rounded-lg"><Trash2 className="w-3.5 h-3.5 text-red-400/50" /></button>
            </div>
          </div>
        ))}
      </div>
      {(editing || creating) && (
        <Modal title={creating ? t('admin', 'addNew') : title} onClose={() => { setEditing(null); setCreating(false); }}>
          {fields.map(f => (
            <Field key={f.name} label={f.label} type={f.type || 'text'} options={f.options}
              value={(creating ? form : editing)[f.name] ?? ''}
              onChange={v => creating ? setForm({...form, [f.name]: v}) : setEditing({...editing, [f.name]: v})} />
          ))}
          <button onClick={save} className="w-full py-3 bg-violet text-white rounded-xl font-bold text-sm mt-2">{creating ? t('admin', 'create') : t('admin', 'save')}</button>
        </Modal>
      )}
    </div>
  );
}

function ChatTab() {
  const { t } = useTranslation();
  const [rooms, setRooms] = useState([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  useEffect(() => { api.get('/admin-panel/chat-rooms/').then(r => setRooms(r.data)).catch(() => {}); }, []);
  const addRoom = () => {
    if (!name || !slug) return;
    api.post('/admin-panel/chat-rooms/', { name, slug }).then(() => {
      setName(''); setSlug('');
      api.get('/admin-panel/chat-rooms/').then(r => setRooms(r.data));
    });
  };
  return (
    <div>
      <h2 className="text-2xl font-black mb-6">{t('admin', 'chatRooms')}</h2>
      <div className="flex gap-3 mb-6">
        <input value={name} onChange={e => setName(e.target.value)} placeholder={t('admin', 'roomName')} className="bg-slate-50 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 rounded-xl px-4 py-2 text-sm flex-1 focus:outline-none focus:border-violet/40 text-slate-900 dark:text-white" />
        <input value={slug} onChange={e => setSlug(e.target.value)} placeholder={t('admin', 'slug')} className="bg-slate-50 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 rounded-xl px-4 py-2 text-sm w-40 focus:outline-none focus:border-violet/40 text-slate-900 dark:text-white" />
        <button onClick={addRoom} className="px-4 py-2 bg-violet text-white rounded-xl text-sm font-bold"><Plus className="w-4 h-4" /></button>
      </div>
      <div className="bg-slate-900/[0.02] dark:bg-white/[0.02] border border-slate-900/5 dark:border-white/5 rounded-xl overflow-hidden">
        {rooms.map(r => (
          <div key={r.id} className="flex items-center justify-between px-5 py-4 border-b border-slate-900/5 dark:border-white/5 last:border-0">
            <div><p className="font-bold text-sm">{r.name}</p><p className="text-[10px] text-slate-400">#{r.slug}</p></div>
            <span className="text-xs text-slate-400">{r.messages} {t('admin', 'messages')}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const NEWS_FIELDS = [
  { name: 'title_en', label: 'Title (EN)' }, { name: 'title_uz', label: 'Title (UZ)' }, { name: 'title_ru', label: 'Title (RU)' },
  { name: 'summary_en', label: 'Summary (EN)', type: 'textarea' }, { name: 'summary_uz', label: 'Summary (UZ)', type: 'textarea' }, { name: 'summary_ru', label: 'Summary (RU)', type: 'textarea' },
  { name: 'content_en', label: 'Content (EN)', type: 'textarea' }, { name: 'content_uz', label: 'Content (UZ)', type: 'textarea' }, { name: 'content_ru', label: 'Content (RU)', type: 'textarea' },
  { name: 'category', label: 'Category', type: 'select', options: [
    {value:'discovery',label:'Discovery'},{value:'technology',label:'Technology'},{value:'exploration',label:'Exploration'},
    {value:'local',label:'Local'},{value:'science',label:'Science'},{value:'mission',label:'Mission'}
  ]},
  { name: 'source', label: 'Source' }, { name: 'source_url', label: 'Source URL' }, { name: 'is_published', label: 'Published', type: 'checkbox' },
];
const NEWS_DEFAULT = { title_en:'',title_uz:'',title_ru:'',summary_en:'',summary_uz:'',summary_ru:'',content_en:'',content_uz:'',content_ru:'',category:'science',source:'',source_url:'',is_published:true };

const EVENT_FIELDS = [
  { name: 'title_en', label: 'Title (EN)' }, { name: 'title_uz', label: 'Title (UZ)' }, { name: 'title_ru', label: 'Title (RU)' },
  { name: 'description_en', label: 'Description (EN)', type: 'textarea' }, { name: 'description_uz', label: 'Description (UZ)', type: 'textarea' }, { name: 'description_ru', label: 'Description (RU)', type: 'textarea' },
  { name: 'event_date', label: 'Date', type: 'date' }, { name: 'event_time', label: 'Time', type: 'time' },
  { name: 'event_type', label: 'Type', type: 'select', options: [
    {value:'launch',label:'Launch'},{value:'mission',label:'Mission'},{value:'discovery',label:'Discovery'},
    {value:'observation',label:'Observation'},{value:'meteor_shower',label:'Meteor Shower'},{value:'solar_eclipse',label:'Solar Eclipse'},
  ]},
  { name: 'source_url', label: 'Source URL' },
  { name: 'is_featured', label: 'Featured', type: 'checkbox' }, { name: 'is_historical', label: 'Historical', type: 'checkbox' },
];
const EVENT_DEFAULT = { title_en:'',title_uz:'',title_ru:'',description_en:'',description_uz:'',description_ru:'',event_date:'',event_time:'',event_type:'discovery',source_url:'',is_featured:false,is_historical:false };

const Q_FIELDS = [
  { name: 'question', label: 'Question (UZ)', type: 'textarea' }, { name: 'question_en', label: 'Question (EN)', type: 'textarea' }, { name: 'question_ru', label: 'Question (RU)', type: 'textarea' },
  { name: 'category', label: 'Category', type: 'select', options: [
    {value:'physics',label:'Physics'},{value:'astronomy',label:'Astronomy'},{value:'problems',label:'Problems'},{value:'general',label:'General'}
  ]},
  { name: 'difficulty', label: 'Difficulty', type: 'select', options: [{value:'easy',label:'Easy'},{value:'medium',label:'Medium'},{value:'hard',label:'Hard'}]},
  { name: 'correct_answer', label: 'Correct Answer (0-3)', type: 'number' },
  { name: 'explanation', label: 'Explanation', type: 'textarea' },
  { name: 'is_active', label: 'Active', type: 'checkbox' },
];
const Q_DEFAULT = { question:'',question_en:'',question_ru:'',category:'general',difficulty:'medium',options:['','','',''],correct_answer:0,explanation:'',is_active:true };

const SPHERE_FIELDS = [
  { name: 'slug', label: 'Slug' }, { name: 'title', label: 'Title (UZ)' }, { name: 'title_en', label: 'Title (EN)' }, { name: 'title_ru', label: 'Title (RU)' },
  { name: 'description', label: 'Description (UZ)', type: 'textarea' }, { name: 'description_en', label: 'Description (EN)', type: 'textarea' },
  { name: 'link', label: 'Link (Route)' },
  { name: 'color', label: 'Color Hex' }, { name: 'icon', label: 'Icon Name' },
  { name: 'is_active', label: 'Active', type: 'checkbox' },
];
const SPHERE_DEFAULT = { slug:'', title:'', title_en:'', title_ru:'', description:'', description_en:'', link:'', color:'#a78bfa', icon:'BookOpen', is_active:true };

const TOPIC_FIELDS = [
  { name: 'sphere_id', label: 'Sphere ID', type: 'number' }, { name: 'title', label: 'Title (UZ)' }, { name: 'title_en', label: 'Title (EN)' }, { name: 'title_ru', label: 'Title (RU)' },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'color', label: 'Color Hex' },
];
const TOPIC_DEFAULT = { sphere_id:1, title:'', title_en:'', title_ru:'', description:'', color:'' };

const LESSON_FIELDS = [
  { name: 'topic_id', label: 'Topic ID', type: 'number' }, { name: 'name', label: 'Name (UZ)' }, { name: 'name_en', label: 'Name (EN)' }, { name: 'name_ru', label: 'Name (RU)' },
  { name: 'video_url', label: 'Video URL' }, { name: 'content', label: 'Markdown Content', type: 'textarea' },
];
const LESSON_DEFAULT = { topic_id:1, name:'', name_en:'', name_ru:'', video_url:'', content:'' };

const MARKET_FIELDS = [
  { name: 'slug', label: 'Slug' }, { name: 'title_en', label: 'Title (EN)' }, { name: 'title_uz', label: 'Title (UZ)' }, { name: 'title_ru', label: 'Title (RU)' },
  { name: 'description_en', label: 'Description (EN)', type: 'textarea' }, { name: 'description_uz', label: 'Description (UZ)', type: 'textarea' }, { name: 'description_ru', label: 'Description (RU)', type: 'textarea' },
  { name: 'item_type', label: 'Type', type: 'select', options: [
    {value:'spaceship',label:'Spaceship'},{value:'badge',label:'Badge'},{value:'boost',label:'XP Boost'},
    {value:'book',label:'Book'},{value:'rocket_module',label:'Rocket Module'},{value:'satellite',label:'Satellite'},
    {value:'avatar',label:'Avatar'},{value:'theme',label:'Theme'},{value:'tool',label:'Tool'},{value:'other',label:'Other'}
  ]},
  { name: 'price', label: 'Price (UZS)', type: 'number' }, { name: 'cost_fuel', label: 'Cost Fuel', type: 'number' },
  { name: 'stock', label: 'Stock (0=unlimited)', type: 'number' },
  { name: 'is_active', label: 'Active', type: 'checkbox' }, { name: 'is_bestseller', label: 'Bestseller', type: 'checkbox' }
];
const MARKET_DEFAULT = { slug:'', title_en:'', title_uz:'', title_ru:'', description_en:'', description_uz:'', description_ru:'', item_type:'other', price:0, cost_fuel:0, stock:0, is_active:true, is_bestseller:false };

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [tab, setTab] = useState('dashboard');
  const [theme, setTheme] = useState(localStorage.getItem('adminTheme') || 'dark');
  const [stats, setStats] = useState(null);
  const { t } = useTranslation();

  useEffect(() => { localStorage.setItem('adminTheme', theme); }, [theme]);

  useEffect(() => {
    if (!user?.is_staff) { navigate('/'); return; }
    api.get('/admin-panel/dashboard/').then(r => setStats(r.data)).catch(() => navigate('/'));
  }, [user, navigate]);

  if (!user?.is_staff) return null;

  return (
    <div className={`${theme === 'dark' ? 'dark' : ''} relative z-[100]`}>
      <div className="min-h-screen bg-slate-50 dark:bg-[#0b0c10] text-slate-900 dark:text-white transition-colors duration-300">
        <div className="pt-12 pb-12 px-4 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-6">
              <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-400 hover:text-violet transition-colors text-sm font-bold">
                <ArrowLeft className="w-4 h-4" /> {t('admin', 'exit')}
              </button>
              <div className="h-6 w-px bg-slate-200 dark:bg-white/10" />
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-violet" />
                <h1 className="text-xl font-black tracking-tight">{t('admin', 'console')}</h1>
              </div>
            </div>
            <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} className="p-2.5 bg-white dark:bg-white/5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors border border-slate-200 dark:border-white/5 shadow-sm">
              {theme === 'dark' ? <Sun className="w-5 h-5 text-violet-light" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className="w-full md:w-64 shrink-0">
              <div className="bg-white dark:bg-[#1a1b23] border border-slate-200 dark:border-white/5 rounded-2xl p-4 sticky top-24 shadow-sm">
                {MENU_GROUPS.map((group, idx) => (
                  <div key={idx} className="mb-6 last:mb-0">
                    <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3 px-2">{t('admin', group.titleKey)}</h4>
                    <div className="flex flex-col gap-1">
                      {group.items.map(t_item => (
                        <button key={t_item.id} onClick={() => setTab(t_item.id)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold transition-all ${tab === t_item.id ? 'bg-violet text-white shadow-lg shadow-violet/20' : 'text-slate-500 dark:text-white/40 hover:bg-slate-50 dark:hover:bg-white/5'}`}>
                          <t_item.icon className="w-4 h-4" />{t('admin', t_item.labelKey)}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {tab === 'dashboard' && <DashboardTab stats={stats} />}
              {tab === 'users' && <UsersTab />}
              {tab === 'news' && <CrudTab key="news" title="News Articles" endpoint="news" fields={NEWS_FIELDS} defaultItem={NEWS_DEFAULT} />}
              {tab === 'events' && <CrudTab key="events" title="Space Events" endpoint="events" fields={EVENT_FIELDS} defaultItem={EVENT_DEFAULT} />}
              {tab === 'questions' && <CrudTab key="questions" title="Challenge Questions" endpoint="questions" fields={Q_FIELDS} defaultItem={Q_DEFAULT} />}
              {tab === 'spheres' && <CrudTab key="spheres" title="Spheres" endpoint="spheres" fields={SPHERE_FIELDS} defaultItem={SPHERE_DEFAULT} />}
              {tab === 'topics' && <CrudTab key="topics" title="Topics" endpoint="topics" fields={TOPIC_FIELDS} defaultItem={TOPIC_DEFAULT} />}
              {tab === 'lessons' && <CrudTab key="lessons" title="Lessons" endpoint="lessons" fields={LESSON_FIELDS} defaultItem={LESSON_DEFAULT} />}
              {tab === 'market' && <CrudTab key="market" title="Market Items" endpoint="market" fields={MARKET_FIELDS} defaultItem={MARKET_DEFAULT} />}
              {tab === 'chat' && <ChatTab />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
