import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Eye, EyeOff, Rocket, ShieldCheck } from 'lucide-react';
import api from '@/lib/api';

import { useAuthStore } from '@/store/useAuthStore';
import { useGamificationStore } from '@/store/useGamificationStore';
import GlassCard from '@/components/ui/GlassCard';

export default function LoginView() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((s) => s.login);
  const syncFromAPI = useGamificationStore((s) => s.syncFromAPI);
  const from = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login/', form);
      login(data.user, data.access, data.refresh);

      try {
        const { data: gam } = await api.get('/gamification/profile/');
        syncFromAPI(gam);
      } catch { /* non-critical */ }

      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Decorative ambient glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[140px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)' }} />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[140px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(0,229,255,0.03) 0%, transparent 70%)' }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[440px] relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <motion.div 
            initial={{ y: -20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 mb-6 p-2 px-4 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-xl"
          >
            <Rocket className="w-6 h-6 text-violet-light" />
            <span className="text-xl font-[900] tracking-tighter text-white">Space edu</span>
          </motion.div>
          <h1 className="text-4xl font-[900] text-white tracking-tight mb-3">Welcome <span className="text-glow-purple text-violet">Back</span></h1>
          <p className="text-white/30 text-sm font-[500]">Enter your credentials to re-enter mission control</p>
        </div>

        <GlassCard accent="#8b5cf6" className="!p-8 sm:!p-10 shadow-2xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Email */}
            <div className="flex flex-col gap-2.5">
              <label className="text-[10px] font-[800] text-white/30 uppercase tracking-[0.2em] ml-1">Email Address</label>
              <input
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                placeholder="cosmonaut@cosmos.uz"
                className="bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-white/20 outline-none focus:border-violet/40 focus:bg-white/[0.06] transition-all text-sm"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2.5">
              <label className="text-[10px] font-[800] text-white/30 uppercase tracking-[0.2em] ml-1">Security Key</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 pr-14 text-white placeholder-white/20 outline-none focus:border-violet/40 focus:bg-white/[0.06] transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/60 transition-colors"
                >
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-xs font-[700] text-center"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full py-4 rounded-2xl font-[800] text-sm uppercase tracking-widest text-white overflow-hidden transition-all active:scale-[0.98]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet to-indigo opacity-100 group-hover:opacity-90 transition-opacity" />
              <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(255,255,255,0.2)]" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Launch Mission <Rocket className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </span>
            </button>

            <div className="mt-4 pt-6 border-t border-white/5 text-center">
              <p className="text-white/30 text-xs font-[600]">
                New to the academy?{' '}
                <Link to="/register" className="text-violet-light hover:text-white font-[800] transition-colors">
                  Initialize Profile
                </Link>
              </p>
            </div>
          </form>
        </GlassCard>

        {/* Footer info */}
        <div className="mt-12 flex items-center justify-center gap-2 text-white/10 uppercase text-[9px] font-[800] tracking-[0.4em]">
          <ShieldCheck className="w-3 h-3" /> Encrypted Connection
        </div>
      </motion.div>
    </div>
  );
}

function Loader({ className }) {
  return (
    <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}
