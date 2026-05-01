import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/api';
import { Users, BookOpen, ShoppingBag, MessageCircle, Newspaper, Calendar, HelpCircle, ChevronRight, Search, Plus, Trash2, Edit, X, Check, Shield } from 'lucide-react';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: Shield },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'news', label: 'News', icon: Newspaper },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'questions', label: 'Questions', icon: HelpCircle },
  { id: 'courses', label: 'Courses', icon: BookOpen },
  { id: 'chat', label: 'Chat Rooms', icon: MessageCircle },
];

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 hover:border-violet/30 transition-all">
      <p className="text-[10px] font-[800] text-white/30 uppercase tracking-widest mb-2">{label}</p>
      <p className="text-3xl font-[900] text-white">{value}</p>
      {sub && <p className="text-xs text-white/30 mt-1">{sub}</p>}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-space-800 border border-white/10 rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h3 className="font-[900] text-lg">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', options }) {
  return (
    <div className="flex flex-col gap-1.5 mb-4">
      <label className="text-[10px] font-[800] text-white/30 uppercase tracking-widest">{label}</label>
      {type === 'select' ? (
        <select value={value} onChange={e => onChange(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet/40">
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : type === 'textarea' ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} rows={3} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet/40 resize-none" />
      ) : type === 'checkbox' ? (
        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={value} onChange={e => onChange(e.target.checked)} className="accent-violet w-4 h-4" /><span className="text-sm">{value ? 'Yes' : 'No'}</span></label>
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet/40" />
      )}
    </div>
  );
}

// ═══ TAB PANELS ═══

function DashboardTab({ stats }) {
  if (!stats) return <p className="text-white/30">Loading...</p>;
  return (
    <div>
      <h2 className="text-2xl font-[900] mb-6">Platform Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Users" value={stats.users?.total} sub={`+${stats.users?.new_week} this week`} />
        <StatCard label="Staff" value={stats.users?.staff_count} />
        <StatCard label="Lessons" value={stats.content?.lessons} />
        <StatCard label="Problems" value={stats.content?.problems} />
        <StatCard label="Questions" value={stats.content?.challenge_questions} />
        <StatCard label="News Articles" value={stats.community?.news_articles} />
        <StatCard label="Events" value={stats.community?.space_events} />
        <StatCard label="Chat Messages" value={stats.community?.chat_messages} />
      </div>
      <h3 className="font-[800] text-sm uppercase tracking-widest text-white/40 mb-3">Recent Users</h3>
      <div className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden">
        {(stats.recent_users || []).map(u => (
          <div key={u.id} className="flex items-center justify-between px-5 py-3 border-b border-white/5 last:border-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-violet/20 flex items-center justify-center text-xs font-bold">{(u.first_name || u.username)[0].toUpperCase()}</div>
              <div><p className="text-sm font-bold">{u.first_name} {u.last_name}</p><p className="text-[10px] text-white/30">@{u.username} · {u.email}</p></div>
            </div>
            <div className="flex items-center gap-2">
              {u.is_staff && <span className="text-[9px] font-bold bg-violet/20 text-violet-light px-2 py-0.5 rounded-full">STAFF</span>}
              <span className="text-[10px] text-white/20">{new Date(u.date_joined).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UsersTab() {
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState(null);
  const load = () => api.get(`/admin-panel/users/?q=${q}`).then(r => setUsers(r.data)).catch(() => {});
  useEffect(() => { load(); }, [q]);
  const save = () => { api.patch(`/admin-panel/users/${editing.id}/`, editing).then(() => { setEditing(null); load(); }); };
  const del = (id) => { if (confirm('Delete user?')) api.delete(`/admin-panel/users/${id}/`).then(load); };
  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-2xl font-[900]">Users</h2>
        <div className="flex-1 relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" /><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search users..." className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-violet/40" /></div>
      </div>
      <div className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden">
        {users.map(u => (
          <div key={u.id} className="flex items-center justify-between px-5 py-3 border-b border-white/5 last:border-0">
            <div><p className="text-sm font-bold">{u.first_name} {u.last_name} <span className="text-white/30">@{u.username}</span></p><p className="text-[10px] text-white/30">{u.email}</p></div>
            <div className="flex items-center gap-2">
              {u.is_staff && <span className="text-[9px] font-bold bg-violet/20 text-violet-light px-2 py-0.5 rounded-full">STAFF</span>}
              <button onClick={() => setEditing({...u})} className="p-2 hover:bg-white/5 rounded-lg"><Edit className="w-3.5 h-3.5 text-white/40" /></button>
              <button onClick={() => del(u.id)} className="p-2 hover:bg-red-500/10 rounded-lg"><Trash2 className="w-3.5 h-3.5 text-red-400/50" /></button>
            </div>
          </div>
        ))}
      </div>
      {editing && (
        <Modal title="Edit User" onClose={() => setEditing(null)}>
          <Field label="First Name" value={editing.first_name} onChange={v => setEditing({...editing, first_name: v})} />
          <Field label="Last Name" value={editing.last_name} onChange={v => setEditing({...editing, last_name: v})} />
          <Field label="Staff" value={editing.is_staff} onChange={v => setEditing({...editing, is_staff: v})} type="checkbox" />
          <Field label="Active" value={editing.is_active} onChange={v => setEditing({...editing, is_active: v})} type="checkbox" />
          <button onClick={save} className="w-full py-3 bg-violet rounded-xl font-bold text-sm mt-2">Save Changes</button>
        </Modal>
      )}
    </div>
  );
}

function CrudTab({ title, endpoint, fields, defaultItem }) {
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
        <h2 className="text-2xl font-[900]">{title}</h2>
        <button onClick={() => { setCreating(true); setForm(defaultItem); }} className="flex items-center gap-2 px-4 py-2 bg-violet rounded-xl text-sm font-bold hover:bg-violet-dark transition-colors"><Plus className="w-4 h-4" />Add New</button>
      </div>
      <div className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden">
        {items.length === 0 && <p className="p-8 text-center text-white/20 text-sm">No items yet</p>}
        {items.map(item => (
          <div key={item.id} className="flex items-center justify-between px-5 py-3 border-b border-white/5 last:border-0">
            <div><p className="text-sm font-bold">{item[displayField]?.substring?.(0, 80) || item[displayField]}</p>{subField && <p className="text-[10px] text-white/30">{item[subField]}</p>}</div>
            <div className="flex items-center gap-2">
              <button onClick={() => setEditing({...item})} className="p-2 hover:bg-white/5 rounded-lg"><Edit className="w-3.5 h-3.5 text-white/40" /></button>
              <button onClick={() => del(item.id)} className="p-2 hover:bg-red-500/10 rounded-lg"><Trash2 className="w-3.5 h-3.5 text-red-400/50" /></button>
            </div>
          </div>
        ))}
      </div>
      {(editing || creating) && (
        <Modal title={creating ? `New ${title}` : `Edit ${title}`} onClose={() => { setEditing(null); setCreating(false); }}>
          {fields.map(f => (
            <Field key={f.name} label={f.label} type={f.type || 'text'} options={f.options}
              value={(creating ? form : editing)[f.name] ?? ''}
              onChange={v => creating ? setForm({...form, [f.name]: v}) : setEditing({...editing, [f.name]: v})} />
          ))}
          <button onClick={save} className="w-full py-3 bg-violet rounded-xl font-bold text-sm mt-2">{creating ? 'Create' : 'Save'}</button>
        </Modal>
      )}
    </div>
  );
}

function CoursesTab() {
  const [spheres, setSpheres] = useState([]);
  useEffect(() => { api.get('/admin-panel/spheres/').then(r => setSpheres(r.data)).catch(() => {}); }, []);
  return (
    <div>
      <h2 className="text-2xl font-[900] mb-6">Courses Overview</h2>
      <p className="text-white/30 text-sm mb-4">Manage detailed course content in Django Admin → <a href="http://localhost:8000/admin/courses/" target="_blank" className="text-violet-light underline">Open Django Admin</a></p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {spheres.map(s => (
          <div key={s.id} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:border-violet/30 transition-all">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-[800]" style={{ color: s.color }}>{s.title}</h3>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${s.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{s.is_active ? 'ACTIVE' : 'INACTIVE'}</span>
            </div>
            <div className="flex gap-4 text-xs text-white/40">
              <span>{s.topics_count} topics</span><span>{s.lessons_count} lessons</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatTab() {
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
      <h2 className="text-2xl font-[900] mb-6">Chat Rooms</h2>
      <div className="flex gap-3 mb-6">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Room name" className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm flex-1 focus:outline-none focus:border-violet/40" />
        <input value={slug} onChange={e => setSlug(e.target.value)} placeholder="slug" className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm w-40 focus:outline-none focus:border-violet/40" />
        <button onClick={addRoom} className="px-4 py-2 bg-violet rounded-xl text-sm font-bold"><Plus className="w-4 h-4" /></button>
      </div>
      <div className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden">
        {rooms.map(r => (
          <div key={r.id} className="flex items-center justify-between px-5 py-4 border-b border-white/5 last:border-0">
            <div><p className="font-bold text-sm">{r.name}</p><p className="text-[10px] text-white/30">#{r.slug}</p></div>
            <span className="text-xs text-white/30">{r.messages} messages</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══ MAIN ═══

const NEWS_FIELDS = [
  { name: 'title_en', label: 'Title (EN)' }, { name: 'title_uz', label: 'Title (UZ)' }, { name: 'title_ru', label: 'Title (RU)' },
  { name: 'summary_en', label: 'Summary (EN)', type: 'textarea' }, { name: 'summary_uz', label: 'Summary (UZ)', type: 'textarea' },
  { name: 'category', label: 'Category', type: 'select', options: [
    {value:'discovery',label:'Discovery'},{value:'technology',label:'Technology'},{value:'exploration',label:'Exploration'},
    {value:'local',label:'Local'},{value:'science',label:'Science'},{value:'mission',label:'Mission'}
  ]},
  { name: 'source', label: 'Source' }, { name: 'is_published', label: 'Published', type: 'checkbox' },
];
const NEWS_DEFAULT = { title_en:'',title_uz:'',title_ru:'',summary_en:'',summary_uz:'',summary_ru:'',category:'science',source:'',is_published:true };

const EVENT_FIELDS = [
  { name: 'title_en', label: 'Title (EN)' }, { name: 'title_uz', label: 'Title (UZ)' }, { name: 'title_ru', label: 'Title (RU)' },
  { name: 'description_en', label: 'Description (EN)', type: 'textarea' }, { name: 'description_uz', label: 'Description (UZ)', type: 'textarea' },
  { name: 'event_date', label: 'Date', type: 'date' },
  { name: 'event_type', label: 'Type', type: 'select', options: [
    {value:'launch',label:'Launch'},{value:'mission',label:'Mission'},{value:'discovery',label:'Discovery'},
    {value:'observation',label:'Observation'},{value:'meteor_shower',label:'Meteor Shower'},{value:'solar_eclipse',label:'Solar Eclipse'},
  ]},
  { name: 'is_featured', label: 'Featured', type: 'checkbox' },
];
const EVENT_DEFAULT = { title_en:'',title_uz:'',title_ru:'',description_en:'',description_uz:'',description_ru:'',event_date:'',event_type:'discovery',is_featured:false };

const Q_FIELDS = [
  { name: 'question', label: 'Question (UZ)', type: 'textarea' }, { name: 'question_en', label: 'Question (EN)', type: 'textarea' },
  { name: 'category', label: 'Category', type: 'select', options: [
    {value:'physics',label:'Physics'},{value:'astronomy',label:'Astronomy'},{value:'problems',label:'Problems'},{value:'general',label:'General'}
  ]},
  { name: 'difficulty', label: 'Difficulty', type: 'select', options: [{value:'easy',label:'Easy'},{value:'medium',label:'Medium'},{value:'hard',label:'Hard'}]},
  { name: 'correct_answer', label: 'Correct Answer (0-3)', type: 'number' },
  { name: 'explanation', label: 'Explanation', type: 'textarea' },
  { name: 'is_active', label: 'Active', type: 'checkbox' },
];
const Q_DEFAULT = { question:'',question_en:'',category:'general',difficulty:'medium',options:['','','',''],correct_answer:0,explanation:'',is_active:true };

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [tab, setTab] = useState('dashboard');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!user?.is_staff) { navigate('/'); return; }
    api.get('/admin-panel/dashboard/').then(r => setStats(r.data)).catch(() => navigate('/'));
  }, [user, navigate]);

  if (!user?.is_staff) return null;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-8 h-8 text-violet" />
          <div><h1 className="text-3xl font-[900] tracking-tight">Admin Panel</h1><p className="text-xs text-white/30">UZ COSMOS Management Dashboard</p></div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-56 shrink-0 hidden md:block">
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-2 sticky top-24">
              {TABS.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-[700] transition-all ${tab === t.id ? 'bg-violet/20 text-violet-light' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
                  <t.icon className="w-4 h-4" />{t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile tabs */}
          <div className="md:hidden flex gap-2 overflow-x-auto pb-4 mb-4 w-full">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold ${tab === t.id ? 'bg-violet text-white' : 'bg-white/5 text-white/40'}`}>{t.label}</button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {tab === 'dashboard' && <DashboardTab stats={stats} />}
            {tab === 'users' && <UsersTab />}
            {tab === 'news' && <CrudTab title="News Articles" endpoint="news" fields={NEWS_FIELDS} defaultItem={NEWS_DEFAULT} />}
            {tab === 'events' && <CrudTab title="Space Events" endpoint="events" fields={EVENT_FIELDS} defaultItem={EVENT_DEFAULT} />}
            {tab === 'questions' && <CrudTab title="Challenge Questions" endpoint="questions" fields={Q_FIELDS} defaultItem={Q_DEFAULT} />}
            {tab === 'courses' && <CoursesTab />}
            {tab === 'chat' && <ChatTab />}
          </div>
        </div>
      </div>
    </div>
  );
}
