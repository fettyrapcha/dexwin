import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Download,
  AlertTriangle,
  Pencil,
  X,
  ChevronDown,
  ChevronUp,
  Plus,
  Calendar,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Check,
  Wallet,
  Users,
  UserSquare,
  ArrowLeft,
  Bell,
  Trash2,
  Loader2,
  ArrowRight,
  Banknote,
  CheckCircle2,
  Lock,
  Info,
  MoreVertical,
  Clock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';

const fmt = (n) => `GHS ${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtGh = (n) =>
  `GH₵ ${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const years = ['2026', '2025', '2024'];

function calcNet(emp) {
  const tier1 = emp.grossSalary * (emp.tier1 / 100);
  const tier2 = emp.grossSalary * (emp.tier2 / 100);
  const tier3 = emp.grossSalary * ((emp.tier3 || 0) / 100);
  const net = emp.grossSalary - tier1 - tier2 - tier3 - (emp.paye || 0) + (emp.bonus || 0) + (emp.allowances || 0);
  return { tier1, tier2, tier3, paye: emp.paye || 0, net };
}

function accountStatus(emp) {
  if (!emp.bank || !emp.accountNo) return 'Missing Details';
  if (emp.status === 'Pending') return 'Invalid';
  return 'Valid';
}

const MOCK_RUNS = [
  {
    id: 'PR-001',
    period: 'Oct 01 - Oct 31, 2023',
    payType: 'Regular Salary',
    empType: 'All Employee',
    total: 142500,
    employees: 48,
    failed: 0,
    status: 'Paid',
  },
  {
    id: 'PR-002',
    period: 'Sep 01 - Sep 30, 2023',
    payType: 'Performance Bonus',
    empType: 'Department Heads',
    total: 28500,
    employees: 12,
    failed: 0,
    status: 'Paid',
  },
  {
    id: 'PR-003',
    period: 'Aug 01 - Aug 31, 2023',
    payType: 'Regular Salary',
    empType: 'All Employee',
    total: 138200,
    employees: 46,
    failed: 2,
    status: 'Failed',
  },
  {
    id: 'PR-004',
    period: 'Jul 01 - Jul 31, 2023',
    payType: 'Regular Salary',
    empType: 'Interns',
    total: 8400,
    employees: 8,
    failed: 0,
    status: 'In progress',
  },
];

/* ─── Edit payroll modal (from review table) ───────────────────────────── */

function EditPayrollModal({ emp, onClose, onSave }) {
  const [form, setForm] = useState({
    grossSalary: emp.grossSalary,
    bonus: emp.bonus || 0,
    allowances: emp.allowances || 0,
    paye: emp.paye || 0,
    tier1: emp.tier1,
    tier2: emp.tier2,
    tier3: emp.tier3 || 0,
  });
  const [showDeductions, setShowDeductions] = useState(false);
  const num = (v) => parseFloat(v) || 0;
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const preview = calcNet({ ...emp, ...Object.fromEntries(Object.entries(form).map(([k, v]) => [k, num(v)])) });
  const isContract = emp.type === 'Contract';

  return (
    <Modal open onClose={onClose} title={`Edit payroll — ${emp.name}`} width="max-w-xl">
      <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-sm font-bold text-brand-700">
          {emp.name.split(' ').map((n) => n[0]).join('')}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">{emp.name}</p>
          <p className="text-xs text-slate-400">
            {emp.title} · <Badge label={emp.type} />
          </p>
        </div>
      </div>
      <div className="space-y-5">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-600">Gross salary (GHS)</label>
          <input
            type="number"
            value={form.grossSalary}
            onChange={set('grossSalary')}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Bonus (GHS)</label>
            <input
              type="number"
              value={form.bonus}
              onChange={set('bonus')}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Allowances (GHS)</label>
            <input
              type="number"
              value={form.allowances}
              onChange={set('allowances')}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </div>
        {!isContract ? (
          <div>
            <button
              type="button"
              onClick={() => setShowDeductions((s) => !s)}
              className="mb-2 flex w-full items-center gap-2 text-left text-xs font-semibold text-slate-600"
            >
              {showDeductions ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              Deductions & contributions
            </button>
            {showDeductions && (
              <div className="grid grid-cols-3 gap-3 rounded-xl bg-slate-50 p-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-500">PAYE (GHS)</label>
                  <input
                    type="number"
                    value={form.paye}
                    onChange={set('paye')}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-500">Tier 1 (%)</label>
                  <input type="number" step="0.5" value={form.tier1} onChange={set('tier1')} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-500">Tier 2 (%)</label>
                  <input type="number" step="0.5" value={form.tier2} onChange={set('tier2')} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" />
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-400">Contract employees are exempt from PAYE and tier deductions.</p>
        )}
        <div className="rounded-2xl border border-brand-100 bg-brand-50 p-4">
          <p className="mb-3 text-xs font-semibold text-brand-700">Projected net pay</p>
          <div className="flex justify-between border-t border-brand-100 pt-2">
            <span className="text-sm font-semibold text-brand-800">Net pay</span>
            <span className="text-sm font-bold text-brand-700">{fmt(preview.net)}</span>
          </div>
        </div>
      </div>
      <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-surface-border bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => {
            onSave(emp.id, Object.fromEntries(Object.entries(form).map(([k, v]) => [k, parseFloat(v) || 0])));
            onClose();
          }}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Save changes
        </button>
      </div>
    </Modal>
  );
}

const field = 'w-full rounded-[10px] border border-surface-border bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/15';

function RunPayrollModal({ open, onClose, onConfirm }) {
  const [month, setMonth] = useState('March');
  const [year, setYear] = useState('2026');
  const [groupMode, setGroupMode] = useState('all');
  const [typeFilter, setTypeFilter] = useState('Full-time');

  useEffect(() => {
    if (open) {
      setMonth('March');
      setYear('2026');
      setGroupMode('all');
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" aria-label="Close" onClick={onClose} />
      <div
        className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-surface-border bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="run-payroll-title"
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-surface-border px-6 py-5">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-surface-border bg-surface-page text-slate-600">
              <Wallet size={20} strokeWidth={1.75} />
            </div>
            <div>
              <h2 id="run-payroll-title" className="text-lg font-bold text-slate-900">
                Run Payroll
              </h2>
              <p className="mt-0.5 text-sm text-slate-500">Step 1: Configure your payroll cycle and groups.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          <p className="mb-2 text-xs font-medium text-slate-500">Pay period</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <select value={month} onChange={(e) => setMonth(e.target.value)} className={`${field} cursor-pointer appearance-none pr-9`}>
                {months.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
            <div className="relative">
              <select value={year} onChange={(e) => setYear(e.target.value)} className={`${field} cursor-pointer appearance-none pr-9`}>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <p className="mb-3 mt-6 text-xs font-medium text-slate-500">Employee Group</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setGroupMode('all')}
              className={`relative flex gap-3 rounded-xl border-2 p-4 text-left transition-colors ${
                groupMode === 'all' ? 'border-forest bg-emerald-50/40' : 'border-surface-border bg-white hover:border-slate-300'
              }`}
            >
              <Users size={22} className="shrink-0 text-slate-500" strokeWidth={1.5} />
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800">All Employees</p>
                <p className="mt-0.5 text-xs text-slate-500">Include everyone on the roster</p>
              </div>
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                  groupMode === 'all' ? 'border-forest bg-forest text-white' : 'border-slate-300 bg-white'
                }`}
              >
                {groupMode === 'all' ? <Check size={12} strokeWidth={3} /> : null}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setGroupMode('type')}
              className={`relative flex gap-3 rounded-xl border-2 p-4 text-left transition-colors ${
                groupMode === 'type' ? 'border-forest bg-emerald-50/40' : 'border-surface-border bg-white hover:border-slate-300'
              }`}
            >
              <UserSquare size={22} className="shrink-0 text-slate-500" strokeWidth={1.5} />
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800">Employee Type</p>
                <p className="mt-0.5 text-xs text-slate-500">Full-time or contract only</p>
              </div>
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                  groupMode === 'type' ? 'border-forest bg-forest text-white' : 'border-slate-300 bg-white'
                }`}
              >
                {groupMode === 'type' ? <Check size={12} strokeWidth={3} /> : null}
              </span>
            </button>
          </div>
          {groupMode === 'type' && (
            <div className="relative mt-3">
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className={`${field} cursor-pointer appearance-none pr-9`}>
                <option value="Full-time">Full-time</option>
                <option value="Contract">Contract</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-surface-border bg-white px-6 py-4">
          <div className="flex w-full flex-col-reverse gap-3 sm:flex-row sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full min-w-0 flex-1 rounded-full border border-surface-border bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-surface-page"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onConfirm({ month, year, groupMode, typeFilter })}
              className="w-full min-w-0 flex-1 rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-forest-dark"
            >
              Confirm transfer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    Paid: 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200',
    'In progress': 'bg-slate-100 text-slate-700 ring-1 ring-slate-200',
    Failed: 'bg-red-50 text-red-700 ring-1 ring-red-200',
    Processing: 'bg-amber-50 text-amber-800 ring-1 ring-amber-200',
    Pending: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${map[status] || map.Pending}`}>
      {status === 'In progress' && <Loader2 size={12} className="animate-spin" />}
      {status === 'Paid' && <Check size={12} strokeWidth={3} />}
      {status === 'Failed' && <X size={12} strokeWidth={2.5} />}
      {status}
    </span>
  );
}

/** Per-line disbursement status for Step 3 (after Proceed to payment, KYC verified). */
function paymentDisbursementStatus(emp, indexInRun) {
  const acc = accountStatus(emp);
  if (acc === 'Invalid') return 'Failed';
  if (acc === 'Missing Details') return 'Pending';
  const cycle = ['Paid', 'Paid', 'Processing', 'Pending', 'Paid', 'Failed'];
  return cycle[indexInRun % cycle.length];
}

function PaymentLineStatusPill({ status }) {
  const map = {
    Paid: 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200',
    Failed: 'bg-red-50 text-red-700 ring-1 ring-red-200',
    Processing: 'bg-amber-50 text-amber-800 ring-1 ring-amber-200',
    Pending: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${map[status] || map.Pending}`}>
      {status === 'Paid' && <Check size={12} strokeWidth={3} />}
      {status === 'Failed' && <X size={12} strokeWidth={2.5} />}
      {(status === 'Processing' || status === 'Pending') && <Clock size={12} strokeWidth={2} />}
      {status}
    </span>
  );
}

function AccountPill({ status }) {
  const map = {
    Valid: 'bg-emerald-50 text-emerald-800',
    Invalid: 'bg-red-50 text-red-700',
    'Missing Details': 'bg-amber-50 text-amber-800',
  };
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${map[status]}`}>{status}</span>;
}

function KycRequiredForPaymentModal({ open, onClose, onSavePayroll, navigate }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]" aria-label="Close" onClick={onClose} />
      <div
        className="relative w-full max-w-md rounded-2xl border border-surface-border bg-white p-6 shadow-2xl sm:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="kyc-payroll-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          aria-label="Close"
        >
          <X size={18} strokeWidth={2} />
        </button>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-forest">
          <CheckCircle2 size={26} strokeWidth={2} />
        </div>
        <h2 id="kyc-payroll-modal-title" className="mt-4 pr-8 text-lg font-bold text-slate-900 sm:text-xl">
          Complete KYC to process payments
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Your payroll is prepared and ready. KYC verification is required before funds can be disbursed.
        </p>
        <ul className="mt-6 space-y-4 border-t border-surface-border pt-6">
          <li className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-forest">
              <Check size={16} strokeWidth={2.5} />
            </span>
            <span className="text-sm font-medium text-slate-800">Payroll prepared</span>
          </li>
          <li className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-forest">
              <Check size={16} strokeWidth={2.5} />
            </span>
            <span className="text-sm font-medium text-slate-800">Payroll reviewed &amp; confirmed</span>
          </li>
          <li className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <Lock size={16} strokeWidth={2} />
            </span>
            <span className="text-sm font-medium text-slate-500">Complete KYC</span>
          </li>
          <li className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <Lock size={16} strokeWidth={2} />
            </span>
            <span className="text-sm font-medium text-slate-500">Process payment</span>
          </li>
        </ul>
        <div className="mt-8 flex w-full flex-col-reverse gap-3 sm:flex-row sm:gap-3">
          <button
            type="button"
            onClick={() => {
              onSavePayroll();
              onClose();
            }}
            className="w-full min-w-0 flex-1 rounded-full border border-surface-border bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-surface-page"
          >
            Save payroll
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              navigate('/settings/kyc');
            }}
            className="w-full min-w-0 flex-1 rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-forest-dark"
          >
            Complete KYC now
          </button>
        </div>
      </div>
    </div>
  );
}

function PayrollReviewStep({ company, runConfig, employees, onBack, onProceed, setEmployees, navigate }) {
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [editingEmp, setEditingEmp] = useState(null);
  const [showKycModal, setShowKycModal] = useState(false);
  const [progressPct] = useState(65);

  const kycVerified = company?.kycStatus === 'Verified';

  const scoped = useMemo(() => {
    let list = [...employees];
    if (runConfig.groupMode === 'type') {
      list = list.filter((e) => e.type === runConfig.typeFilter);
    }
    return list;
  }, [employees, runConfig]);

  const failedCount = useMemo(() => scoped.filter((e) => accountStatus(e) === 'Invalid').length, [scoped]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return scoped.filter((e) => {
      const st = accountStatus(e);
      const matchTab = tab === 'all' || (tab === 'invalid' && st === 'Invalid') || (tab === 'missing' && st === 'Missing Details');
      const matchQ = !q || e.name.toLowerCase().includes(q) || (e.email && e.email.toLowerCase().includes(q));
      return matchTab && matchQ;
    });
  }, [scoped, tab, search]);

  const totalNet = scoped.reduce((s, e) => s + calcNet(e).net, 0);

  const exportCsv = () => {
    const rows = [['Name', 'Gross', 'Tier1', 'Tier2', 'Bonus', 'Account Status', 'Net']];
    filtered.forEach((e) => {
      const c = calcNet(e);
      rows.push([e.name, String(e.grossSalary), String(c.tier1), String(c.tier2), String(e.bonus || 0), accountStatus(e), String(c.net)]);
    });
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'payroll-review.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = (id, updates) => {
    setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  return (
    <div className="min-h-screen bg-surface-page">
      <header className="flex items-start justify-between border-b border-surface-border bg-white px-6 py-5 sm:px-8">
        <div className="flex items-start gap-4">
          <button
            type="button"
            onClick={onBack}
            className="mt-0.5 inline-flex items-center gap-2 rounded-[10px] border border-surface-border bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm hover:bg-surface-page"
          >
            <ArrowLeft size={16} strokeWidth={2} />
            Back
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Payroll</h1>
          </div>
        </div>
        <button
          type="button"
          className="rounded-[10px] border border-surface-border bg-white p-2.5 text-slate-500 hover:bg-surface-page hover:text-slate-700"
          aria-label="Notifications"
        >
          <Bell size={20} strokeWidth={1.75} />
        </button>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Review Payroll</h2>
          <p className="mt-1 text-sm text-slate-500">Step 2: Verify employee earnings and statutory deductions</p>
        </div>

        {failedCount > 0 && (
          <div className="mb-6 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50/80 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                <AlertTriangle size={18} />
              </div>
              <p className="text-sm font-medium text-red-900">
                {failedCount} failed payment{failedCount === 1 ? '' : 's'} need retry
              </p>
            </div>
            <button
              type="button"
              className="shrink-0 rounded-[10px] bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700"
            >
              Retry all failed
            </button>
          </div>
        )}

        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-500">Progress</span>
              <span className="text-xs font-semibold text-forest">{progressPct}% Complete</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-forest transition-all" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-surface-border bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-surface-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">Team members</h3>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-forest">{scoped.length}</span>
            </div>
            <button
              type="button"
              onClick={exportCsv}
              className="inline-flex items-center justify-center gap-2 self-start rounded-[10px] bg-forest px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-forest-dark sm:self-auto"
            >
              <Download size={14} strokeWidth={2} />
              Export Payroll
            </button>
          </div>

          <div className="flex flex-col gap-3 border-b border-surface-border px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-1 rounded-lg bg-slate-100/80 p-1">
              {[
                { id: 'all', label: 'All employee' },
                { id: 'invalid', label: 'Invalid' },
                { id: 'missing', label: 'Missing Details' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                    tab === t.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="relative min-w-0 sm:max-w-xs sm:flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="name, account status"
                className="w-full rounded-[10px] border border-surface-border py-2 pl-9 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/15"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-surface-border bg-slate-50/80 text-left text-xs font-semibold text-slate-500">
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Gross</th>
                  <th className="px-5 py-3">Tier 1</th>
                  <th className="px-5 py-3">Tier 2</th>
                  <th className="px-5 py-3">Bonus</th>
                  <th className="px-5 py-3">Account Status</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-sm text-slate-500">
                      No team members match this view.{' '}
                      <button type="button" className="font-semibold text-brand-600 hover:underline" onClick={() => navigate('/employees')}>
                        Add employees
                      </button>
                    </td>
                  </tr>
                ) : (
                  filtered.map((emp) => {
                    const c = calcNet(emp);
                    const st = accountStatus(emp);
                    return (
                      <tr key={emp.id} className="hover:bg-slate-50/50">
                        <td className="px-5 py-3.5">
                          <p className="font-medium text-slate-800">{emp.name}</p>
                          <p className="text-xs text-slate-400">{emp.id}</p>
                        </td>
                        <td className="px-5 py-3.5 font-medium text-slate-700">{fmt(emp.grossSalary)}</td>
                        <td className="px-5 py-3.5 text-slate-600">{emp.type === 'Contract' ? '—' : fmt(c.tier1)}</td>
                        <td className="px-5 py-3.5 text-slate-600">{emp.type === 'Contract' ? '—' : fmt(c.tier2)}</td>
                        <td className="px-5 py-3.5 text-brand-600">{emp.bonus ? fmt(emp.bonus) : '—'}</td>
                        <td className="px-5 py-3.5">
                          <AccountPill status={st} />
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex justify-end gap-1">
                            <button type="button" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-red-600" aria-label="Remove">
                              <Trash2 size={16} strokeWidth={1.75} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingEmp(emp)}
                              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                              aria-label="Edit"
                            >
                              <Pencil size={16} strokeWidth={1.75} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-surface-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">
              Estimated net for this run: <span className="font-semibold text-slate-800">{fmt(totalNet)}</span>
            </p>
            <div className="flex w-full max-w-md flex-col-reverse gap-3 sm:ml-auto sm:flex-row sm:gap-3">
              <button
                type="button"
                onClick={onBack}
                className="w-full min-w-0 flex-1 rounded-full border border-surface-border bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-surface-page"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => {
                  if (kycVerified) onProceed();
                  else setShowKycModal(true);
                }}
                className="w-full min-w-0 flex-1 rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-forest-dark"
              >
                Proceed to payment
              </button>
            </div>
          </div>
        </div>
      </div>

      <KycRequiredForPaymentModal
        open={showKycModal}
        onClose={() => setShowKycModal(false)}
        onSavePayroll={() => {}}
        navigate={navigate}
      />

      {editingEmp && <EditPayrollModal emp={editingEmp} onClose={() => setEditingEmp(null)} onSave={handleSave} />}
    </div>
  );
}

function PayrollPaymentVerifyStep({ runConfig, employees, onBack, onDone, navigate }) {
  const [progressPct] = useState(65);
  const [statusOverrides, setStatusOverrides] = useState({});

  const scoped = useMemo(() => {
    let list = [...employees];
    if (runConfig.groupMode === 'type') {
      list = list.filter((e) => e.type === runConfig.typeFilter);
    }
    return list;
  }, [employees, runConfig]);

  const [selected, setSelected] = useState(() => new Set());

  const rows = useMemo(
    () =>
      scoped.map((emp, i) => {
        const base = paymentDisbursementStatus(emp, i);
        const payStatus = statusOverrides[emp.id] ?? base;
        return { emp, payStatus, net: calcNet(emp).net };
      }),
    [scoped, statusOverrides],
  );

  useEffect(() => {
    setSelected(new Set(scoped.map((e) => e.id)));
  }, [scoped]);

  const failedRetryCount = rows.filter((r) => r.payStatus === 'Failed').length;

  const allSelected = rows.length > 0 && rows.every((r) => selected.has(r.emp.id));
  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(rows.map((r) => r.emp.id)));
  };
  const toggleOne = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleRetryAllFailed = () => {
    setStatusOverrides((prev) => {
      const next = { ...prev };
      scoped.forEach((emp, i) => {
        const base = paymentDisbursementStatus(emp, i);
        const current = next[emp.id] ?? base;
        if (current === 'Failed') next[emp.id] = 'Processing';
      });
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-surface-page">
      <header className="flex items-start justify-between border-b border-surface-border bg-white px-6 py-5 sm:px-8">
        <div className="flex items-start gap-4">
          <button
            type="button"
            onClick={onBack}
            className="mt-0.5 inline-flex items-center gap-2 rounded-[10px] border border-surface-border bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm hover:bg-surface-page"
          >
            <ArrowLeft size={16} strokeWidth={2} />
            Back
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Payroll</h1>
          </div>
        </div>
        <button
          type="button"
          className="rounded-[10px] border border-surface-border bg-white p-2.5 text-slate-500 hover:bg-surface-page hover:text-slate-700"
          aria-label="Notifications"
        >
          <Bell size={20} strokeWidth={1.75} />
        </button>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Run payroll</h2>
          <p className="mt-1 text-sm text-slate-500">Step 3: Verify employee earnings and statutory deductions</p>
        </div>

        {failedRetryCount > 0 && (
          <div className="mb-6 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                <Info size={18} strokeWidth={2} />
              </div>
              <p className="text-sm font-medium text-red-900">
                {failedRetryCount} failed payment{failedRetryCount === 1 ? '' : 's'} need retry
              </p>
            </div>
            <button
              type="button"
              onClick={handleRetryAllFailed}
              className="shrink-0 rounded-[10px] bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700"
            >
              Retry all failed
            </button>
          </div>
        )}

        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-500">Progress</span>
              <span className="text-xs font-semibold text-forest">{progressPct}% Complete</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-forest transition-all" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-surface-border bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-surface-border px-5 py-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">Team members</h3>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-forest">{scoped.length}</span>
            </div>
            <button
              type="button"
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              aria-label="More options"
            >
              <MoreVertical size={18} strokeWidth={2} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-surface-border bg-slate-50/80 text-left text-xs font-semibold text-slate-500">
                  <th className="w-12 px-5 py-3">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleAll}
                      className="h-4 w-4 rounded border-slate-300 text-forest focus:ring-forest/25"
                      aria-label="Select all"
                    />
                  </th>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Net Salary</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-12 text-center text-sm text-slate-500">
                      No team members in this run.{' '}
                      <button type="button" className="font-semibold text-forest hover:underline" onClick={() => navigate('/employees')}>
                        Add employees
                      </button>
                    </td>
                  </tr>
                ) : (
                  rows.map(({ emp, payStatus, net }) => (
                    <tr key={emp.id} className="hover:bg-slate-50/50">
                      <td className="px-5 py-3.5">
                        <input
                          type="checkbox"
                          checked={selected.has(emp.id)}
                          onChange={() => toggleOne(emp.id)}
                          className="h-4 w-4 rounded border-slate-300 text-forest focus:ring-forest/25"
                          aria-label={`Select ${emp.name}`}
                        />
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-slate-800">{emp.name}</p>
                      </td>
                      <td className="px-5 py-3.5 font-medium text-slate-800">{fmt(net)}</td>
                      <td className="px-5 py-3.5">
                        <PaymentLineStatusPill status={payStatus} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-surface-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={onBack}
              className="w-full min-w-0 rounded-full border border-surface-border bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-surface-page sm:w-auto sm:px-6"
            >
              Back
            </button>
            <button
              type="button"
              onClick={onDone}
              className="w-full min-w-0 rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-forest-dark sm:w-auto sm:px-8"
            >
              Confirm payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main payroll list + flow ──────────────────────────────────────────── */

export default function Payroll() {
  const navigate = useNavigate();
  const { employees, setEmployees, company } = useAuth();
  const [flow, setFlow] = useState('list');
  const [runConfig, setRunConfig] = useState({ month: 'March', year: '2026', groupMode: 'all', typeFilter: 'Full-time' });
  const [showRunModal, setShowRunModal] = useState(false);
  const [runTab, setRunTab] = useState('all');
  const [searchRuns, setSearchRuns] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 4;

  const monthlyTotal = useMemo(() => employees.reduce((s, e) => s + calcNet(e).net, 0), [employees]);

  const upcomingLabel = `${runConfig.month} ${runConfig.year}`;

  const filteredRuns = useMemo(() => {
    let r = [...MOCK_RUNS];
    if (runTab === 'Paid') r = r.filter((x) => x.status === 'Paid');
    if (runTab === 'Failed') r = r.filter((x) => x.status === 'Failed');
    const q = searchRuns.toLowerCase();
    if (q) r = r.filter((x) => x.period.toLowerCase().includes(q) || x.payType.toLowerCase().includes(q) || x.empType.toLowerCase().includes(q));
    return r;
  }, [runTab, searchRuns]);

  const totalPages = Math.max(1, Math.ceil(filteredRuns.length / perPage));
  const pageRows = filteredRuns.slice((page - 1) * perPage, page * perPage);

  if (flow === 'paymentVerify') {
    return (
      <PayrollPaymentVerifyStep
        key={`${runConfig.month}-${runConfig.year}-${runConfig.groupMode}-${runConfig.typeFilter}`}
        runConfig={runConfig}
        employees={employees}
        onBack={() => setFlow('review')}
        onDone={() => setFlow('list')}
        navigate={navigate}
      />
    );
  }

  if (flow === 'review') {
    return (
      <PayrollReviewStep
        company={company}
        runConfig={runConfig}
        employees={employees}
        onBack={() => setFlow('list')}
        onProceed={() => setFlow('paymentVerify')}
        setEmployees={setEmployees}
        navigate={navigate}
      />
    );
  }

  return (
    <div className="min-h-full bg-surface-page">
      <div className="border-b border-surface-border bg-white px-6 py-5 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Payroll</h1>
            <p className="mt-1 text-sm text-slate-500">Prepare, review, and process salary payments for your team.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowRunModal(true)}
            className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-forest-dark"
          >
            <Plus size={18} strokeWidth={2} />
            Start new run
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="grid gap-4 lg:grid-cols-5">
          <div className="rounded-xl border border-surface-border bg-white p-5 shadow-sm lg:col-span-3">
            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-forest">
                <Calendar size={22} strokeWidth={1.75} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Upcoming Deadline</p>
                <p className="mt-1 text-sm font-bold text-slate-900">Next payroll run: {upcomingLabel}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Estimated total disbursement for <span className="font-semibold text-slate-800">{employees.length}</span> employee
                  {employees.length === 1 ? '' : 's'} is {fmtGh(monthlyTotal)} across all departments.
                </p>
                <button type="button" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-forest hover:underline">
                  Preview calculations
                  <ArrowRight size={14} strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-xl bg-forest p-6 text-white shadow-sm lg:col-span-2">
            <Banknote className="pointer-events-none absolute -right-4 -bottom-4 h-28 w-28 text-white/10" strokeWidth={1} />
            <p className="relative text-[10px] font-semibold uppercase tracking-widest text-white/80">Total monthly payroll</p>
            <p className="relative mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{fmtGh(monthlyTotal)}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-sky-100 bg-sky-50/80 px-4 py-3 text-xs text-sky-800">
          <AlertTriangle size={14} className="mt-0.5 shrink-0 text-sky-600" />
          KYC verification and an active Affinity account are required to initiate actual payment. You may prepare payroll runs without completing KYC.
        </div>

        <div className="overflow-hidden rounded-xl border border-surface-border bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-surface-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-1 rounded-lg bg-slate-100/80 p-1">
              {[
                { id: 'all', label: 'All runs' },
                { id: 'Paid', label: 'Paid' },
                { id: 'Failed', label: 'Failed' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setRunTab(t.id);
                    setPage(1);
                  }}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                    runTab === t.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
              <div className="relative min-w-0 flex-1 sm:max-w-xs">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={searchRuns}
                  onChange={(e) => {
                    setSearchRuns(e.target.value);
                    setPage(1);
                  }}
                  placeholder="status, date, employee type…"
                  className="w-full rounded-[10px] border border-surface-border py-2 pl-9 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/15"
                />
              </div>
              <button
                type="button"
                className="inline-flex shrink-0 items-center gap-2 rounded-[10px] border border-surface-border bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-surface-page"
              >
                <Filter size={16} strokeWidth={1.75} />
                Filters
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-sm">
              <thead>
                <tr className="border-b border-surface-border bg-slate-50/80 text-left text-xs font-semibold text-slate-500">
                  <th className="px-5 py-3">Pay Period</th>
                  <th className="px-5 py-3">Employee type</th>
                  <th className="px-5 py-3">Total Disbursed</th>
                  <th className="px-5 py-3">Employees</th>
                  <th className="px-5 py-3">Failed</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pageRows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-slate-800">{row.period}</p>
                      <p className="text-xs text-slate-500">{row.payType}</p>
                    </td>
                    <td className="px-5 py-3.5 text-slate-700">{row.empType}</td>
                    <td className="px-5 py-3.5 font-medium text-slate-800">{fmtGh(row.total)}</td>
                    <td className="px-5 py-3.5 text-slate-600">{row.employees}</td>
                    <td className="px-5 py-3.5 text-slate-600">{row.failed}</td>
                    <td className="px-5 py-3.5">
                      <StatusPill status={row.status} />
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {row.status === 'In progress' && (
                        <button type="button" className="text-sm font-bold text-forest hover:underline">
                          Review Run
                        </button>
                      )}
                      {row.status === 'Paid' && (
                        <div className="flex justify-end gap-3 text-xs font-semibold">
                          <button type="button" className="text-slate-600 hover:text-slate-900">
                            Download
                          </button>
                          <button type="button" className="text-slate-600 hover:text-slate-900">
                            View
                          </button>
                        </div>
                      )}
                      {row.status === 'Failed' && (
                        <button type="button" className="text-sm font-bold text-red-600 hover:underline">
                          Retry
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col items-center justify-between gap-3 border-t border-surface-border px-5 py-4 sm:flex-row">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="inline-flex items-center gap-1 rounded-lg border border-surface-border px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-surface-page disabled:opacity-40"
            >
              <ChevronLeft size={14} /> Previous
            </button>
            <div className="flex flex-wrap items-center justify-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  className={`min-w-[2rem] rounded-lg px-2 py-1 text-xs font-semibold ${
                    n === page ? 'bg-forest text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="inline-flex items-center gap-1 rounded-lg border border-surface-border px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-surface-page disabled:opacity-40"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <RunPayrollModal
        open={showRunModal}
        onClose={() => setShowRunModal(false)}
        onConfirm={(cfg) => {
          setRunConfig(cfg);
          setShowRunModal(false);
          setFlow('review');
        }}
      />
    </div>
  );
}
