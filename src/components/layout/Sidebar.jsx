import { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileSpreadsheet,
  Wallet,
  ArrowLeftRight,
  ClipboardList,
  LifeBuoy,
  Settings,
  Check,
  Circle,
  ChevronsUpDown,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function DexwinLogoMark() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden className="shrink-0 drop-shadow-sm">
      <path fill="#0b8558" d="M16 3 L29 11.5 L16 20 L3 11.5 Z" />
      <path fill="#096E47" d="M16 20 L29 11.5 L29 23.5 L16 29 Z" />
      <path fill="#075a3a" d="M16 20 L3 11.5 L3 23.5 L16 29 Z" />
      <path fill="#1a9d6a" opacity="0.35" d="M16 3 L22 7.5 L16 12 L10 7.5 Z" />
    </svg>
  );
}

function NavRow({ to, end, icon, label, badge, active }) {
  const Icon = icon;
  return (
    <NavLink
      to={to}
      end={end}
      className={`flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-medium transition-colors
        ${active ? 'bg-[#F3F4F6] text-slate-800' : 'text-slate-600 hover:bg-[#F9FAFB] hover:text-slate-800'}`}
    >
      <Icon size={18} strokeWidth={1.75} className={active ? 'text-forest' : 'text-slate-400'} />
      <span className="flex-1">{label}</span>
      {badge != null && (
        <span className="min-w-[1.25rem] rounded-full bg-[#E5E7EB] px-1.5 py-0.5 text-center text-xs font-semibold text-slate-600">
          {badge}
        </span>
      )}
    </NavLink>
  );
}

function NavRowLink({ to, end = false, icon, label, badge, active }) {
  return <NavRow to={to} end={end} icon={icon} label={label} badge={badge} active={active} />;
}

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, company, logout, employees } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const path = location.pathname;
  const activeExact = (p) => path === p;
  const activeEmployees = path === '/employees' || path.startsWith('/employees/');
  const activeSettings = path.startsWith('/settings');

  const profileSaved = company?.companyProfileSaved === true;
  const inviteDone = company?.inviteCompleted === true;
  const kycDone = company?.kycStatus === 'Verified';
  const onboardingTotal = 4;
  const checklist = [
    { id: 'reg', label: 'Company registration', done: true },
    { id: 'prof', label: 'Company profile', done: profileSaved },
    { id: 'inv', label: 'Invite employee', done: inviteDone },
    { id: 'kyc', label: 'Complete company KYC', done: kycDone },
  ];
  const onboardingDone = checklist.filter((c) => c.done).length;
  const pct = Math.round((onboardingDone / onboardingTotal) * 100);
  const onboardingFullyComplete =
    onboardingDone >= onboardingTotal || company?.onboardingComplete === true;

  const companyLabel = company?.name || 'Dexwin';
  const emailLabel = user?.email || 'admin@dexwin.net';

  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex w-[260px] flex-col border-r border-surface-border bg-white">
      {/* Logo */}
      <div className="flex h-[4.25rem] items-center gap-2.5 border-b border-surface-border px-5">
        <DexwinLogoMark />
        <span className="text-lg font-bold tracking-tight text-slate-900">DexwinHR</span>
      </div>

      <nav className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3 pb-3 pt-4 scrollbar-thin">
        <div className="space-y-0.5">
          <NavRowLink to="/" end={true} icon={LayoutDashboard} label="Dashboard" active={activeExact('/')} />
          <NavRowLink
            to="/employees"
            icon={Users}
            label="All Employees"
            badge={employees.length > 0 ? employees.length : undefined}
            active={activeEmployees}
          />
          <NavRowLink to="/payroll" icon={FileSpreadsheet} label="Run Payroll" active={activeExact('/payroll')} />
          <NavRowLink to="/wallet" icon={Wallet} label="Wallets" active={activeExact('/wallet')} />
          <NavRowLink to="/transactions" icon={ArrowLeftRight} label="Transactions" active={activeExact('/transactions')} />
          <NavRowLink to="/audit-log" icon={ClipboardList} label="Audit Log" active={activeExact('/audit-log')} />
        </div>

        <div className="mt-auto flex flex-col gap-6 border-t border-transparent pt-6">
          <div className="space-y-0.5">
            <a
              href="mailto:support@dexwin.net"
              className="flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-[#F9FAFB] hover:text-slate-800"
            >
              <LifeBuoy size={18} strokeWidth={1.75} className="text-slate-400" />
              <span>Support</span>
            </a>
            <NavRowLink to="/settings/company" icon={Settings} label="Settings" active={activeSettings} />
          </div>

          {!onboardingFullyComplete && (
            <div className="rounded-xl border border-surface-border bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold text-slate-800">Complete onboarding</p>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>
                  {onboardingDone}/{onboardingTotal}
                </span>
                <span className="font-medium text-forest">{pct}%</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#E5E7EB]">
                <div className="h-full rounded-full bg-forest transition-all" style={{ width: `${pct}%` }} />
              </div>
              <ul className="mt-4 space-y-3">
                {checklist.map((row) => (
                  <li key={row.id} className="flex items-start gap-2.5 text-xs text-slate-600">
                    {row.done ? (
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-forest text-white">
                        <Check size={10} strokeWidth={3} />
                      </span>
                    ) : (
                      <Circle size={16} className="mt-0.5 shrink-0 text-slate-300" strokeWidth={1.5} />
                    )}
                    <span className={row.done ? 'text-slate-500 line-through' : ''}>{row.label}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => navigate('/settings/onboarding')}
                className="mt-4 w-full rounded-[10px] border border-surface-border bg-white py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:bg-[#F9FAFB]"
              >
                Continue setup
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Workspace footer */}
      <div ref={menuRef} className="relative border-t border-surface-border p-3">
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="flex w-full items-center gap-2 rounded-[10px] px-2 py-2 text-left transition-colors hover:bg-[#F9FAFB]"
        >
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-slate-800">{companyLabel}</p>
            <p className="truncate text-[11px] text-slate-500">{emailLabel}</p>
          </div>
          <ChevronsUpDown size={16} className="shrink-0 text-slate-400" />
        </button>
        {menuOpen && (
          <div className="absolute bottom-full left-3 right-3 mb-1 rounded-lg border border-surface-border bg-white py-1 shadow-lg">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium text-slate-600 hover:bg-[#F9FAFB]"
            >
              <LogOut size={14} /> Sign out
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
