import { useMemo, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, ChevronDown, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const brandAccent = 'text-brand-600';

function RequiredLabel({ children }) {
  return (
    <span className="text-sm font-medium text-slate-700">
      {children} <span className={brandAccent}>*</span>
    </span>
  );
}

function RegisterLeftPanel() {
  return (
    <div className="relative min-h-[220px] lg:min-h-screen w-full lg:w-[45%] shrink-0 overflow-hidden bg-[#061f18]">
      {/* Fluid wave layers */}
      <div
        className="absolute inset-0 opacity-90"
        style={{
          background: `
            radial-gradient(ellipse 120% 80% at 10% 20%, rgba(20, 184, 166, 0.45) 0%, transparent 55%),
            radial-gradient(ellipse 90% 70% at 85% 15%, rgba(15, 118, 110, 0.5) 0%, transparent 50%),
            radial-gradient(ellipse 100% 60% at 50% 100%, rgba(6, 78, 59, 0.85) 0%, transparent 45%),
            linear-gradient(165deg, #020617 0%, #0a5236 38%, #063d28 72%, #052a1c 100%)
          `,
        }}
      />
      <svg
        className="absolute bottom-0 left-0 w-full h-[55%] text-brand-900/40 pointer-events-none"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          fill="currentColor"
          d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,181.3C960,203,1056,213,1152,197.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </svg>
      <svg
        className="absolute bottom-0 left-0 w-full h-[42%] text-emerald-800/30 pointer-events-none"
        viewBox="0 0 1440 280"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          fill="currentColor"
          d="M0,224L60,213.3C120,203,240,181,360,181.3C480,181,600,203,720,208C840,213,960,203,1080,186.7C1200,171,1320,149,1380,138.7L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
        />
      </svg>

      {/* Step progress */}
      <div className="absolute top-0 left-0 right-0 z-10 flex h-1">
        <div className="w-1/2 bg-emerald-400" />
        <div className="flex-1 bg-white/20" />
      </div>

      {/* Glass card — bottom */}
      <div className="relative z-10 flex flex-col justify-end min-h-[220px] lg:min-h-screen p-6 sm:p-8 lg:p-10 pb-8 lg:pb-12">
        <div className="rounded-2xl border border-white/20 bg-white/10 px-6 py-6 sm:px-8 sm:py-7 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.25)] max-w-xl">
          <h2 className="text-2xl sm:text-3xl lg:text-[1.75rem] xl:text-3xl font-bold text-white leading-tight tracking-tight">
            Comprehensive Payroll Management Platform
          </h2>
          <p className="mt-3 text-sm sm:text-base text-white/90 font-normal leading-relaxed">
            Designed to streamline your payroll processes
          </p>
        </div>
      </div>
    </div>
  );
}

function ContactSalesModal({ onClose }) {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ email: '', phone: '' });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  if (sent)
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} role="presentation" />
        <div className="relative bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm text-center">
          <h3 className="text-base font-semibold text-slate-800 mb-1">We&apos;ll be in touch!</h3>
          <p className="text-sm text-slate-500 mb-5">Our team will contact you within 1 business day.</p>
          <Button variant="primary" onClick={onClose} className="w-full justify-center">
            Done
          </Button>
        </div>
      </div>
    );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} role="presentation" />
      <div className="relative bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
        <h3 className="text-base font-semibold text-slate-800 mb-1">Contact Sales</h3>
        <p className="text-sm text-slate-500 mb-5">Leave your details and we&apos;ll sign your company up for you.</p>
        <div className="space-y-3">
          <Input label="Email Address" type="email" placeholder="you@company.com" value={form.email} onChange={set('email')} />
          <Input label="Phone Number" type="tel" placeholder="+233 24 000 0000" value={form.phone} onChange={set('phone')} />
        </div>
        <Button variant="primary" className="w-full justify-center mt-5" onClick={() => setSent(true)}>
          Request Contact
        </Button>
        <button type="button" onClick={onClose} className="w-full text-center text-xs text-slate-400 mt-3 hover:text-slate-600">
          Cancel
        </button>
      </div>
    </div>
  );
}

function VerifyTopoBg() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <svg className="absolute min-w-full min-h-[140%] -top-[20%] left-0 w-full opacity-[0.45]" viewBox="0 0 800 800" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="verify-topo-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f8fafc" stopOpacity="0" />
            <stop offset="15%" stopColor="#f8fafc" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
          </linearGradient>
        </defs>
        {[
          'M50,680 Q200,620 350,640 T650,600 T950,620',
          'M0,560 Q180,520 400,540 T780,500',
          'M100,440 Q280,400 500,420 T900,380',
          'M40,320 Q220,280 420,300 T800,260',
          'M80,200 Q260,160 480,180 T860,140',
          'M120,720 Q300,660 520,700',
          'M200,600 Q400,560 600,580',
          'M60,480 Q240,440 440,460',
          'M160,360 Q340,320 540,340',
          'M240,240 Q400,200 600,220',
        ].map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="1"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            transform={`translate(${-20 + (i % 3) * 8}, ${(i % 5) * 6})`}
          />
        ))}
        <rect width="100%" height="100%" fill="url(#verify-topo-fade)" />
      </svg>
    </div>
  );
}

function VerifyStep({ email, companyData, onVerified, onBack }) {
  const [digits, setDigits] = useState(() => Array(6).fill(''));
  const [error, setError] = useState('');
  const inputRefs = useRef([]);

  const codeComplete = digits.every((d) => d !== '') && /^\d{6}$/.test(digits.join(''));

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const setDigit = (index, raw) => {
    const d = raw.replace(/\D/g, '').slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = d;
      return next;
    });
    setError('');
    if (d && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
      setDigits((prev) => {
        const next = [...prev];
        next[index - 1] = '';
        return next;
      });
    }
    if (e.key === 'ArrowLeft' && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === 'ArrowRight' && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const next = Array(6).fill('');
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setDigits(next);
    setError('');
    const focusIdx = Math.min(pasted.length, 5);
    inputRefs.current[focusIdx]?.focus();
  };

  const handleVerify = () => {
    if (!codeComplete) {
      setError('Enter the 6-digit code.');
      return;
    }
    onVerified(companyData);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center px-5 py-12 bg-white">
      <VerifyTopoBg />
      <div className="relative z-10 w-full max-w-[420px] text-center">
        <h1 className="text-2xl sm:text-[1.65rem] font-normal text-slate-700 tracking-tight">
          Welcome to <span className="font-bold text-brand-600">dexwin</span> HR
        </h1>

        <div className="mt-8 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 shadow-sm">
            <Mail className="h-6 w-6 text-white" strokeWidth={2} />
          </div>
        </div>

        <p className="mt-10 text-lg font-bold text-slate-800">Please check your email.</p>

        <p className="mt-3 text-sm text-slate-500 leading-relaxed px-1">
          We&apos;ve sent a 6-digit code to <span className="font-semibold text-slate-600">{email}</span>
        </p>

        <div className="mt-10 mx-auto inline-flex flex-col items-stretch">
          <div className="flex justify-center gap-2 sm:gap-3">
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputRefs.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                value={digit}
                placeholder="0"
                onChange={(e) => setDigit(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={handlePaste}
                aria-label={`Digit ${i + 1}`}
                className="h-12 w-10 sm:h-14 sm:w-11 rounded-lg border border-slate-200 bg-white text-center text-base font-medium text-slate-800 shadow-sm placeholder:text-slate-300 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            ))}
          </div>

          {error && <p className="mt-3 text-left text-xs text-red-500">{error}</p>}

          <p className="mt-5 text-left text-sm text-slate-500">
            Didn&apos;t get a code?{' '}
            <button
              type="button"
              className="font-medium text-slate-500 underline decoration-slate-400 underline-offset-2 hover:text-slate-700"
            >
              Click to resend.
            </button>
          </p>
        </div>

        <button
          type="button"
          disabled={!codeComplete}
          onClick={handleVerify}
          className={`mt-8 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold transition-all
            ${
              codeComplete
                ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm'
                : 'cursor-not-allowed bg-slate-200 text-slate-400'
            }`}
        >
          Verify & continue <ArrowRight size={18} strokeWidth={2} />
        </button>

        <button type="button" onClick={onBack} className="mt-10 w-full text-center text-sm font-medium text-brand-600 hover:text-brand-700 hover:underline">
          Back to sign up
        </button>
      </div>
    </div>
  );
}

const fieldClass =
  'w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-800 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 transition-all';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [step, setStep] = useState('form');
  const [showSales, setShowSales] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [dialCode, setDialCode] = useState('+233');
  const [form, setForm] = useState({
    companyName: '',
    email: '',
    phoneNational: '',
    password: '',
  });

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: '' }));
  };

  const passwordOk = (p) =>
    p.length >= 8 && /[A-Za-z]/.test(p) && /\d/.test(p) && /[^A-Za-z0-9]/.test(p);

  const formReady = useMemo(() => {
    return (
      form.companyName.trim().length > 0 &&
      form.email.includes('@') &&
      form.phoneNational.replace(/\D/g, '').length >= 9 &&
      passwordOk(form.password)
    );
  }, [form]);

  const validate = () => {
    const e = {};
    if (!form.companyName.trim()) e.companyName = 'Company name is required.';
    if (!form.email.includes('@')) e.email = 'Enter a valid email address.';
    if (form.phoneNational.replace(/\D/g, '').length < 9) e.phoneNational = 'Enter a valid phone number.';
    if (!passwordOk(form.password)) e.password = 'Use 8+ characters with letters, numbers, and symbols.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setStep('verify');
  };

  const handleVerified = (data) => {
    const digits = data.phoneNational.replace(/\D/g, '');
    const phone = `${dialCode}${digits}`;
    register({ name: data.companyName, email: data.email, phone });
    navigate('/');
  };

  if (step === 'verify') {
    return (
      <>
        <VerifyStep
          email={form.email}
          companyData={{ ...form, phoneNational: form.phoneNational }}
          onVerified={handleVerified}
          onBack={() => setStep('form')}
        />
        {showSales && <ContactSalesModal onClose={() => setShowSales(false)} />}
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white lg:bg-[#fafafa]">
      <RegisterLeftPanel />

      <div className="flex-1 lg:w-[55%] flex items-center justify-center px-6 py-10 sm:px-10 lg:px-16 bg-white lg:bg-[#fafafa]">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-slate-900 mb-1 tracking-tight">Register your company</h1>
          <p className="text-sm text-slate-500 mb-8">Your central hub for seamless payroll management</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="reg-company" className="block mb-1.5">
                <RequiredLabel>Company Name</RequiredLabel>
              </label>
              <input
                id="reg-company"
                type="text"
                placeholder="eg. Dexwin"
                value={form.companyName}
                onChange={set('companyName')}
                className={fieldClass}
              />
              {errors.companyName && <p className="mt-1 text-xs text-red-500">{errors.companyName}</p>}
            </div>

            <div>
              <label htmlFor="reg-email" className="block mb-1.5">
                <RequiredLabel>Business Email</RequiredLabel>
              </label>
              <input
                id="reg-email"
                type="email"
                placeholder="admin@dexwin.net"
                value={form.email}
                onChange={set('email')}
                className={fieldClass}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label className="block mb-1.5">
                <RequiredLabel>Phone Number</RequiredLabel>
              </label>
              <div className="flex gap-2">
                <div className="relative shrink-0 w-[min(9.5rem,42%)]">
                  <select
                    value={dialCode}
                    onChange={(e) => setDialCode(e.target.value)}
                    className={`${fieldClass} appearance-none cursor-pointer pr-9`}
                    aria-label="Country code"
                  >
                    <option value="+233">GH (+233)</option>
                    <option value="+234">NG (+234)</option>
                    <option value="+254">KE (+254)</option>
                    <option value="+1">US (+1)</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    aria-hidden
                  />
                </div>
                <input
                  type="tel"
                  placeholder="(50) 000-0000"
                  value={form.phoneNational}
                  onChange={set('phoneNational')}
                  className={`${fieldClass} flex-1 min-w-0`}
                  aria-invalid={!!errors.phoneNational}
                />
              </div>
              {errors.phoneNational && <p className="mt-1 text-xs text-red-500">{errors.phoneNational}</p>}
            </div>

            <div>
              <label htmlFor="reg-password" className="block mb-1.5">
                <RequiredLabel>Create Password</RequiredLabel>
              </label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter a secure password"
                  value={form.password}
                  onChange={set('password')}
                  className={`${fieldClass} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="mt-1.5 text-xs text-slate-500">Use 8 characters with letters, numbers, and symbols.</p>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={!formReady}
              className={`w-full rounded-xl py-3.5 text-sm font-semibold transition-all mt-1
                ${
                  formReady
                    ? 'bg-brand-700 text-white hover:bg-brand-800 shadow-sm'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
            >
              Create Account
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white lg:bg-[#fafafa] text-xs text-slate-400 font-medium">Or</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowSales(true)}
            className="w-full rounded-xl py-3.5 px-4 text-sm text-slate-600 bg-white border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors"
          >
            Prefer we sign you up?{' '}
            <span className="font-semibold text-brand-700">Contact sales</span>
          </button>

          <p className="text-center text-sm text-slate-500 mt-8">
            Already have an account?{' '}
            <button type="button" onClick={() => navigate('/login')} className="font-semibold text-brand-700 hover:underline">
              Sign in
            </button>
          </p>
        </div>
      </div>

      {showSales && <ContactSalesModal onClose={() => setShowSales(false)} />}
    </div>
  );
}
