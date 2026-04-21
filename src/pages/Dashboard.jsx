import {
  Users,
  Wallet,
  ShieldCheck,
  Building2,
  CreditCard,
  UserPlus,
  ChevronRight,
  Bell,
  Plus,
  Download,
  ClipboardList,
  Hourglass,
  Check,
  TrendingDown,
} from 'lucide-react';
import { transactions, company as mockCompany } from '../data/mockData';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const fmtGh = (n) =>
  `GH₵ ${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function shortCompanyName(name) {
  if (!name) return 'your company';
  return name.replace(/\bTechnologies\s+Ltd\.?\b/gi, 'Tech').replace(/\s+Ltd\.?$/i, '').trim();
}

function TxTableStatus({ status }) {
  if (status === 'Successful') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-forest ring-1 ring-emerald-100">
        <Check size={12} strokeWidth={3} />
        Successful
      </span>
    );
  }
  if (status === 'In progress') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
        In progress
      </span>
    );
  }
  return (
    <span className="inline-flex rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 ring-1 ring-red-100">{status}</span>
  );
}

function OperationalDashboard({ navigate, user, companyName, employees }) {
  const firstName = user?.name?.trim()?.split(/\s+/)?.[0] || 'there';
  const coShort = shortCompanyName(companyName);

  const totalPayrollDisbursed = transactions
    .filter((t) => t.type === 'Payroll Disbursement' && t.status === 'Successful')
    .reduce((s, t) => s + (t.amount || 0), 0);

  const employeesPaidDisplay = employees.length * 39;

  const pendingPayments = transactions.filter((t) => t.status !== 'Successful' && t.status !== 'Failed').length;
  const failedPayments = transactions.filter((t) => t.status === 'Failed').length;

  const payrollWalletBalance = 316986;

  const tableRows = transactions.map((t, i) => {
    const d = new Date(`${t.date}T${String(9 + (i % 3)).padStart(2, '0')}:${String(10 + i * 7).padStart(2, '0')}:00`);
    const dateTime = d.toLocaleString('en-GB', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    const typeLabel = t.type === 'Wallet Top-up' ? 'Wallet top-up' : 'Payroll disbursement';
    const walletLabel = t.wallet === 'Main Account' ? 'Main Wallet' : t.wallet || 'Payroll Wallet';
    const status = i === 0 ? 'In progress' : t.status;
    return {
      id: t.id,
      dateTime,
      typeLabel,
      ref: `REF: ${t.ref || t.id}`,
      walletLabel,
      amount: t.amount,
      status,
    };
  });

  return (
    <div className="min-h-screen bg-surface-page">
      <div className="border-b border-surface-border bg-white px-6 py-6 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              {`Welcome back, ${firstName} 👋. Here's a snapshot of ${coShort}'s HR status.`}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3 self-start">
            <button
              type="button"
              onClick={() => navigate('/employees')}
              className="inline-flex items-center gap-2 rounded-full bg-forest px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-forest-dark"
            >
              <Plus size={18} strokeWidth={2} />
              Add Employee
            </button>
            <button
              type="button"
              className="rounded-[10px] border border-surface-border bg-white p-2.5 text-slate-500 transition-colors hover:bg-surface-page hover:text-slate-700"
              aria-label="Notifications"
            >
              <Bell size={20} strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-5 p-6 lg:p-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative overflow-hidden rounded-2xl bg-forest p-5 text-white shadow-sm">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
            <div className="relative flex items-start justify-between gap-3">
              <p className="text-xs font-medium uppercase tracking-wide text-white/80">Total Payroll Disbursed</p>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
                <Users size={18} className="text-white" strokeWidth={1.75} />
              </div>
            </div>
            <p className="relative mt-4 text-2xl font-bold tracking-tight">{fmtGh(totalPayrollDisbursed)}</p>
          </div>

          <div className="rounded-2xl border border-surface-border bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs font-medium text-slate-500">Employees Paid</p>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-forest">
                <Users size={18} strokeWidth={1.75} />
              </div>
            </div>
            <p className="mt-4 text-2xl font-bold text-slate-900">{employeesPaidDisplay}</p>
          </div>

          <div className="rounded-2xl border border-surface-border bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs font-medium text-slate-500">Pending Payment</p>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <Hourglass size={18} strokeWidth={1.75} />
              </div>
            </div>
            <p className="mt-4 text-2xl font-bold text-slate-900">{pendingPayments}</p>
          </div>

          <div className="rounded-2xl border border-surface-border bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs font-medium text-slate-500">Failed Payment</p>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500">
                <ClipboardList size={18} strokeWidth={1.75} />
              </div>
            </div>
            <p className="mt-4 text-2xl font-bold text-slate-900">{failedPayments}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-surface-border bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-forest">
              <Wallet size={22} strokeWidth={1.75} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Payroll Wallet</h2>
              <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{fmtGh(payrollWalletBalance)}</p>
              <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                <TrendingDown size={14} className="text-slate-400" />
                10% Current operating balance
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-surface-border bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-surface-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Recent Transaction</h2>
              <p className="mt-0.5 text-xs text-slate-500">Logs of latest transaction records only</p>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest hover:underline"
            >
              <Download size={16} strokeWidth={2} />
              Download Report
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead>
                <tr className="border-b border-surface-border bg-slate-50/80 text-left text-xs font-semibold text-slate-500">
                  <th className="px-5 py-3">Date &amp; Time</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Recipient/Reference</th>
                  <th className="px-5 py-3">Source Wallet</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tableRows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/60">
                    <td className="whitespace-nowrap px-5 py-3.5 text-slate-700">{row.dateTime}</td>
                    <td className="px-5 py-3.5 text-slate-800">{row.typeLabel}</td>
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-600">{row.ref}</td>
                    <td className="px-5 py-3.5 text-slate-700">{row.walletLabel}</td>
                    <td className="px-5 py-3.5 font-semibold text-slate-800">{fmtGh(row.amount)}</td>
                    <td className="px-5 py-3.5">
                      <TxTableStatus status={row.status} />
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex justify-end gap-3 text-xs font-semibold">
                        <button type="button" className="text-forest hover:underline">
                          Download
                        </button>
                        <button type="button" className="text-slate-600 hover:text-slate-900">
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function WelcomeBannerDecor() {
  return (
    <div className="pointer-events-none absolute inset-y-0 right-0 w-[min(52%,380px)] overflow-hidden opacity-[0.22]" aria-hidden>
      <svg className="h-full w-full text-black" viewBox="0 0 200 140" preserveAspectRatio="xMaxYMid slice">
        <path d="M120 10c40 20 60 50 55 90" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <path d="M140 0c35 28 52 58 48 100" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M160 5c28 32 42 62 38 105" fill="none" stroke="currentColor" strokeWidth="0.8" />
        <path d="M175 20c22 30 34 55 30 88" fill="none" stroke="currentColor" strokeWidth="0.8" />
        <path d="M100 130c50-15 85-45 95-85" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
    </div>
  );
}

function DashboardPageHeader({ title, subtitle }) {
  return (
    <div className="flex items-start justify-between border-b border-surface-border bg-white px-8 py-7">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
      <button
        type="button"
        className="rounded-[10px] border border-surface-border bg-white p-2.5 text-slate-500 transition-colors hover:bg-surface-page hover:text-slate-700"
        aria-label="Notifications"
      >
        <Bell size={20} strokeWidth={1.75} />
      </button>
    </div>
  );
}

function EmptyDashboard({ companyName, navigate }) {
  const { company: authCompany, employees } = useAuth();
  const profileSaved = authCompany?.companyProfileSaved === true;
  const kycDone = authCompany?.kycStatus === 'Verified';
  const employeesDone = Array.isArray(employees) && employees.length > 0;

  const setupTotal = 3;
  const setupDone = [profileSaved, kycDone, employeesDone].filter(Boolean).length;
  const setupPct = Math.round((setupDone / setupTotal) * 100);

  const checklist = [
    {
      title: 'Company Profile',
      desc: "Setup your organisation's details and payroll preferences.",
      path: '/settings/company',
      icon: Building2,
      done: profileSaved,
    },
    {
      title: 'Complete KYC & Submit to Affinity',
      desc: 'Submit KYC documents to activate your Affinity account to enable payroll payment',
      path: '/settings/kyc',
      icon: ShieldCheck,
      done: kycDone,
    },
    {
      title: 'Add Employees',
      desc: 'Add employees individually or import via CSV.',
      path: '/employees',
      icon: UserPlus,
      done: employeesDone,
    },
  ];

  const overviewRows = [
    { label: 'Last Disbursement', value: '(-)' },
    { label: 'Employee Paid', value: '0' },
    { label: 'Wallet Balance', value: 'GHS 0' },
    { label: 'Pending Payment', value: '0' },
    { label: 'Failed Payment', value: '0' },
  ];

  return (
    <div className="min-h-screen bg-surface-page">
      <DashboardPageHeader title="Dashboard" subtitle={`${companyName}-Super Admin`} />

      <div className="mx-auto max-w-5xl space-y-5 px-6 py-6 lg:px-8 lg:py-8">
        <div className="relative overflow-hidden rounded-xl border border-surface-border bg-forest text-white shadow-sm">
          <WelcomeBannerDecor />
          <div className="relative px-6 py-7 sm:px-8 sm:py-8">
            <h2 className="text-xl font-bold sm:text-2xl">Welcome to Dexwin! 👋</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/85">
              Your workspace is ready. Complete the steps below to set up payroll and start paying your team.
            </p>
            <div className="mt-8 max-w-xl">
              <div className="mb-2 flex justify-between text-xs text-white/80">
                <span>Setup progress</span>
                <span className="font-semibold text-white">
                  {setupDone}/{setupTotal} steps
                </span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-white/20">
                <div className="h-full rounded-full bg-emerald-400 transition-all" style={{ width: `${Math.max(setupPct, 3)}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-5">
          <div className="rounded-xl border border-surface-border bg-white lg:col-span-3">
            <div className="border-b border-surface-border px-6 py-5">
              <h3 className="text-sm font-bold text-slate-900">Onboarding checklist</h3>
              <p className="mt-1 text-xs text-slate-500">Complete all steps to unlock payroll disbursements.</p>
            </div>
            <div className="divide-y divide-surface-border">
              {checklist.map((row) => {
                const Icon = row.icon;
                const done = row.done === true;
                return (
                  <div
                    key={row.title}
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate(row.path)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        navigate(row.path);
                      }
                    }}
                    className="flex w-full cursor-pointer gap-4 px-6 py-5 text-left transition-colors hover:bg-slate-50/80"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-surface-border bg-slate-50 text-slate-500">
                      <Icon size={18} strokeWidth={1.75} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-900">{row.title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-500">{row.desc}</p>
                    </div>
                    <div className="shrink-0 self-center">
                      {done ? (
                        <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-forest ring-1 ring-emerald-100">
                          Done
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(row.path);
                          }}
                          className="inline-flex items-center gap-0.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-100 transition-colors hover:bg-amber-100"
                        >
                          Pending
                          <ChevronRight size={14} strokeWidth={2} className="text-amber-700" aria-hidden />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-surface-border bg-white p-6 lg:col-span-2">
            <h3 className="text-sm font-semibold text-slate-900">Payroll Overview</h3>
            <div className="mt-5 space-y-3.5">
              {overviewRows.map((r) => (
                <div key={r.label} className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-slate-500">{r.label}</span>
                  <span className="font-semibold text-slate-600">{r.value}</span>
                </div>
              ))}
            </div>
            <p className="mt-6 border-t border-surface-border pt-4 text-xs text-slate-500">Stats unlock after first payroll run.</p>
          </div>
        </div>

        <div className="rounded-xl border border-surface-border bg-white">
          <div className="border-b border-surface-border px-6 py-5">
            <h3 className="text-sm font-semibold text-slate-900">Recent Transactions</h3>
            <p className="mt-1 text-xs text-slate-500">Logs of latest workspace changes.</p>
          </div>
          <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-[10px] border border-surface-border bg-surface-page">
              <CreditCard size={22} className="text-slate-400" strokeWidth={1.5} />
            </div>
            <p className="mt-4 text-sm font-bold text-slate-800">No transaction history.</p>
            <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-slate-500">
              Transactions will appear here once your account is activated and your first payroll is processed.
            </p>
            <button
              type="button"
              onClick={() => navigate('/settings/kyc')}
              className="mt-6 rounded-[10px] bg-forest px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-forest-dark"
            >
              Submit KYC
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, company: authCompany, employees } = useAuth();
  const companyName = authCompany?.name || mockCompany.name;

  const fullyOnboarded =
    authCompany &&
    authCompany.companyProfileSaved === true &&
    authCompany.kycStatus === 'Verified' &&
    employees.length > 0;

  const isNew = authCompany && !fullyOnboarded;

  if (isNew) return <EmptyDashboard companyName={companyName} navigate={navigate} />;

  return (
    <OperationalDashboard navigate={navigate} user={user} companyName={companyName} employees={employees} />
  );
}
