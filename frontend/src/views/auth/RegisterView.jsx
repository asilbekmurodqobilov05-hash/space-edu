import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Eye, EyeOff, Rocket } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';

const FIELDS = [
  { name: 'first_name',     label: 'First Name',    type: 'text',     placeholder: 'Alisher' },
  { name: 'last_name',      label: 'Last Name',     type: 'text',     placeholder: 'Navoi' },
  { name: 'email',          label: 'Email',         type: 'email',    placeholder: 'cosmonaut@cosmos.uz' },
  { name: 'date_of_birth',  label: 'Date of Birth', type: 'date',     placeholder: '' },
  { name: 'password',       label: 'Password',      type: 'password', placeholder: '8+ characters' },
  { name: 'password2',      label: 'Confirm',       type: 'password', placeholder: 'Repeat password' },
];

export default function RegisterView() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '',
    date_of_birth: '', password: '', password2: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: undefined, detail: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      const { data } = await api.post('/auth/register/', form);
      login(data.user, data.access, data.refresh);
      navigate('/');
    } catch (err) {
      setErrors(err.response?.data || { detail: 'Registration failed.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-600/5 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-600/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Rocket className="w-8 h-8 text-purple-400" />
            <span className="text-2xl font-black text-white">UZ COSMOS</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Join the Academy</h1>
          <p className="text-white/40 text-sm">Begin your cosmic journey</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/4 border border-white/10 rounded-3xl p-8 backdrop-blur-sm flex flex-col gap-4"
        >
          {FIELDS.map(({ name, label, type, placeholder }) => (
            <div key={name} className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wide">{label}</label>
              <div className="relative">
                <input
                  name={name}
                  type={(type === 'password' && showPass) ? 'text' : type}
                  autoComplete={name === 'password2' ? 'new-password' : name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none transition-all
                    ${errors[name] ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-purple-500/60 focus:bg-white/8'}`}
                />
                {type === 'password' && (
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                )}
              </div>
              {errors[name] && (
                <p className="text-red-400 text-xs">{errors[name][0] || errors[name]}</p>
              )}
            </div>
          ))}

          {errors.detail && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
              {errors.detail}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-1 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'Creating account…' : 'Start Mission'}
          </button>

          <p className="text-center text-white/40 text-sm">
            Already a cosmonaut?{' '}
            <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
