import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const set = (k) => (e) => { setForm(f => ({ ...f, [k]: e.target.value })); setError(''); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Please enter your email and password.'); return; }
    login(form.email, form.password);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-[420px] bg-brand-700 flex-col justify-between p-10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <span className="text-white font-bold text-sm">D</span>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">dexwin</span>
        </div>
        <div>
          <p className="text-brand-200 text-sm font-medium mb-3 uppercase tracking-wider">Welcome back</p>
          <h2 className="text-white text-3xl font-bold leading-tight mb-4">
            Your team is<br />waiting for you.
          </h2>
          <p className="text-brand-200 text-sm leading-relaxed">
            Sign in to manage payroll, onboard employees, and keep your organisation running smoothly.
          </p>
        </div>
        <p className="text-brand-300 text-xs">© 2025 Dexwin Technologies Ltd.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center mb-6 lg:hidden">
            <span className="text-brand-600 font-bold text-lg">D</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Sign in</h1>
          <p className="text-sm text-slate-500 mb-8">Welcome back to your Dexwin workspace.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="admin@yourcompany.com"
              value={form.email}
              onChange={set('email')}
            />
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-600">Password</label>
                <button type="button" className="text-xs text-brand-600 hover:underline">Forgot password?</button>
              </div>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Your password"
                  value={form.password}
                  onChange={set('password')}
                  className="w-full px-3 py-2 pr-10 text-sm border border-slate-200 rounded-lg bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                />
                <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}

            <Button type="submit" variant="primary" className="w-full justify-center mt-2">
              Sign In <ArrowRight size={15} />
            </Button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-6">
            Don't have an account?{' '}
            <button onClick={() => navigate('/register')} className="text-brand-600 font-medium hover:underline">Register your company</button>
          </p>

          {/* Demo hint */}
          <div className="mt-8 bg-slate-100 rounded-xl p-3 text-xs text-slate-500">
            <strong className="text-slate-600">Demo:</strong> Enter any email and password to sign in.
          </div>
        </div>
      </div>
    </div>
  );
}
