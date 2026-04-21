import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit2,
  DollarSign,
  ShieldCheck,
  Phone,
  Building2,
  CreditCard,
  User,
  X,
  RefreshCw,
  FileText,
  Info,
  UserPlus,
  Banknote,
  ChevronDown,
  Plus,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

const fmt = (n) => `GHS ${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const activity = [
  { date: 'Apr 30, 2025', event: 'Salary paid — April 2025', type: 'pay' },
  { date: 'Mar 30, 2025', event: 'Salary paid — March 2025', type: 'pay' },
  { date: 'Jan 15, 2025', event: 'Profile updated by Super Admin', type: 'update' },
  { date: 'Jan 15, 2025', event: 'Employee onboarded', type: 'start' },
];

const activityIcon = { pay: DollarSign, update: FileText, start: User };
const activityColor = {
  pay: 'bg-emerald-50 text-forest ring-1 ring-emerald-100',
  update: 'bg-amber-50 text-amber-600 ring-1 ring-amber-100',
  start: 'bg-emerald-50/80 text-emerald-700 ring-1 ring-emerald-100',
};

const GH_BANKS = [
  'GCB Bank',
  'Ecobank',
  'Fidelity Bank',
  'Stanbic Bank',
  'Cal Bank',
  'Access Bank',
  'Absa Bank',
  'UBA',
];

const GH_BRANCHES = [
  'Accra Main',
  'Osu',
  'Tema',
  'Airport',
  'Accra Central',
  'Legon',
  'North Legon',
  'Kumasi Central',
  'Takoradi',
];

const inputClass =
  'w-full rounded-xl border border-surface-border bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/15';
const selectClass = `${inputClass} cursor-pointer appearance-none pr-10`;

function Req({ children }) {
  return (
    <>
      {children}
      <span className="text-forest"> *</span>
    </>
  );
}

function splitName(name) {
  const parts = (name || '').trim().split(/\s+/);
  if (parts.length === 0) return { firstName: '', lastName: '' };
  if (parts.length === 1) return { firstName: parts[0], lastName: '' };
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
}

function localGhPhone(phone) {
  if (!phone) return '';
  return phone.replace(/^\+233\s*/, '').trim();
}

function combineGhPhone(local) {
  const digits = (local || '').trim();
  if (!digits) return '';
  return `+233 ${digits}`;
}

function ProfileHeroDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/90 via-teal-500/85 to-brand-700/95" />
      <svg className="absolute -right-8 bottom-0 h-[120%] w-[55%] text-white/25" viewBox="0 0 200 120" preserveAspectRatio="xMaxYMid meet">
        <path d="M120 10c40 20 60 50 55 90" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <path d="M140 0c35 28 52 58 48 100" fill="none" stroke="currentColor" strokeWidth="1.1" />
        <path d="M100 130c50-15 85-45 95-85" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <path d="M40 100c25-35 55-55 95-50" fill="none" stroke="currentColor" strokeWidth="0.9" opacity="0.7" />
      </svg>
    </div>
  );
}

function InfoRow({ label, value, mono }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-surface-border py-3.5 last:border-0">
      <p className="w-40 shrink-0 text-xs font-medium text-slate-500">{label}</p>
      <p className={`text-right text-sm font-semibold text-slate-800 ${mono ? 'font-mono text-xs' : ''}`}>{value || '—'}</p>
    </div>
  );
}

const TABS = ['Profile', 'Payroll', 'Bank & Tax'];

function employmentLabel(type) {
  if (!type) return '—';
  if (type === 'Full-time') return 'Full time';
  return type;
}

function formatStartDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function SelectChevron() {
  return <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />;
}

function EmployeePersonalEditModal({ open, emp, onClose, onSave }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneLocal, setPhoneLocal] = useState('');
  const [title, setTitle] = useState('');
  const [employmentType, setEmploymentType] = useState('Full time');
  const [startDate, setStartDate] = useState('');
  const [location, setLocation] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

  useEffect(() => {
    if (!open || !emp) return;
    const { firstName: fn, lastName: ln } = splitName(emp.name);
    setFirstName(fn);
    setLastName(ln);
    setEmail(emp.email || '');
    setPhoneLocal(localGhPhone(emp.phone));
    setTitle(emp.title || '');
    setEmploymentType(emp.type === 'Contract' ? 'Contract' : 'Full time');
    setStartDate(emp.startDate || '');
    setLocation(emp.location || '');
    setDateOfBirth(emp.dateOfBirth || '');
  }, [open, emp]);

  if (!open) return null;

  const handleSave = () => {
    const name = `${firstName.trim()} ${lastName.trim()}`.trim();
    const type = employmentType === 'Contract' ? 'Contract' : 'Full-time';
    onSave({
      name,
      email: email.trim(),
      phone: combineGhPhone(phoneLocal),
      title: title.trim(),
      type,
      startDate: startDate || emp.startDate,
      location: location.trim() || undefined,
      dateOfBirth: dateOfBirth || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-[85] flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-slate-900/45 backdrop-blur-[2px]" aria-label="Close" onClick={onClose} />
      <div
        className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-surface-border bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="personal-edit-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 px-6 pt-6">
          <div className="flex min-w-0 gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-surface-border bg-surface-page text-slate-600">
              <UserPlus size={20} strokeWidth={1.75} />
            </div>
            <div className="min-w-0">
              <h2 id="personal-edit-title" className="text-lg font-bold text-slate-900">
                Personal Details
              </h2>
              <p className="mt-0.5 text-sm text-slate-500">Update employee personal information</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                <Req>First name</Req>
              </label>
              <input className={inputClass} value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="e.g. Kofi" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                <Req>Last name</Req>
              </label>
              <input className={inputClass} value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="e.g. Mensah" />
            </div>
          </div>
          <div className="mt-4">
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              <Req>Email</Req>
            </label>
            <input className={inputClass} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="kofi.mensah@mail.com" />
          </div>
          <div className="mt-4">
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              <Req>Phone number (WhatsApp)</Req>
            </label>
            <div className="flex gap-2">
              <div className="relative w-[7.5rem] shrink-0">
                <input
                  readOnly
                  tabIndex={-1}
                  className={`${inputClass} cursor-default bg-slate-50 text-slate-600`}
                  value="GH (233)"
                  aria-label="Country code"
                />
              </div>
              <input
                className={`${inputClass} flex-1`}
                value={phoneLocal}
                onChange={(e) => setPhoneLocal(e.target.value)}
                placeholder="000 000 000"
              />
            </div>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">Title</label>
              <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Project Manager" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">Employment type</label>
              <div className="relative">
                <select className={selectClass} value={employmentType} onChange={(e) => setEmploymentType(e.target.value)}>
                  <option value="Full time">Full time</option>
                  <option value="Contract">Contract</option>
                </select>
                <SelectChevron />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">Start Date</label>
            <div className="relative">
              <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input type="date" className={`${inputClass} pr-10`} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">Location</label>
              <input className={inputClass} value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. north legon" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">Date of birth</label>
              <div className="relative">
                <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input type="date" className={`${inputClass} pr-10`} value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 gap-3 border-t border-surface-border bg-white px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[48px] flex-1 rounded-full border border-surface-border bg-white py-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-surface-page"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="min-h-[48px] flex-1 rounded-full bg-forest py-3 text-sm font-semibold text-white shadow-sm hover:bg-forest-dark"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function EmployeePayrollEditModal({ open, emp, onClose, onSave }) {
  const [grossSalary, setGrossSalary] = useState('');
  const [allowances, setAllowances] = useState('');
  const [bonus, setBonus] = useState('');
  const [showBonusRow, setShowBonusRow] = useState(false);

  useEffect(() => {
    if (!open || !emp) return;
    setGrossSalary(String(emp.grossSalary ?? ''));
    setAllowances(String(emp.allowances ?? 0));
    setBonus(String(emp.bonus ?? 0));
    setShowBonusRow((emp.bonus || 0) > 0);
  }, [open, emp]);

  if (!open) return null;

  const num = (v) => parseFloat(String(v).replace(/,/g, '')) || 0;

  const handleSave = () => {
    onSave({
      grossSalary: num(grossSalary),
      allowances: num(allowances),
      bonus: showBonusRow ? num(bonus) : 0,
    });
  };

  return (
    <div className="fixed inset-0 z-[85] flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-slate-900/45 backdrop-blur-[2px]" aria-label="Close" onClick={onClose} />
      <div
        className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-surface-border bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="payroll-edit-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 px-6 pt-6">
          <div className="flex min-w-0 gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-surface-border bg-surface-page text-slate-600">
              <Banknote size={20} strokeWidth={1.75} />
            </div>
            <div className="min-w-0">
              <h2 id="payroll-edit-title" className="text-lg font-bold text-slate-900">
                Payroll
              </h2>
              <p className="mt-0.5 text-sm text-slate-500">Update employee payroll information</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">Gross salary</label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500">₵</span>
              <input
                className={`${inputClass} pl-8`}
                inputMode="decimal"
                value={grossSalary}
                onChange={(e) => setGrossSalary(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">Compensation type</label>
              <input className={inputClass} readOnly value="Allowances" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">Amount</label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500">₵</span>
                <input
                  className={`${inputClass} pl-8`}
                  inputMode="decimal"
                  value={allowances}
                  onChange={(e) => setAllowances(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
          {!showBonusRow ? (
            <button
              type="button"
              onClick={() => setShowBonusRow(true)}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-forest hover:underline"
            >
              <Plus size={16} strokeWidth={2} />
              Add Bonuses &amp; allowances
            </button>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">Compensation type</label>
                <input className={inputClass} readOnly value="Bonus" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">Amount</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500">₵</span>
                  <input
                    className={`${inputClass} pl-8`}
                    inputMode="decimal"
                    value={bonus}
                    onChange={(e) => setBonus(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex shrink-0 gap-3 border-t border-surface-border bg-white px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[48px] flex-1 rounded-full border border-surface-border bg-white py-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-surface-page"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="min-h-[48px] flex-1 rounded-full bg-forest py-3 text-sm font-semibold text-white shadow-sm hover:bg-forest-dark"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function EmployeeBankTaxEditModal({ open, emp, onClose, onSave }) {
  const [bank, setBank] = useState('');
  const [accountNo, setAccountNo] = useState('');
  const [branch, setBranch] = useState('');
  const [tin, setTin] = useState('');
  const [ssnit, setSsnit] = useState('');

  const bankOptions = useMemo(() => {
    const set = new Set(GH_BANKS);
    if (emp?.bank) set.add(emp.bank);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [emp?.bank]);

  const branchOptions = useMemo(() => {
    const set = new Set(GH_BRANCHES);
    if (emp?.branch) set.add(emp.branch);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [emp?.branch]);

  useEffect(() => {
    if (!open || !emp) return;
    setBank(emp.bank || '');
    setAccountNo(emp.accountNo || '');
    setBranch(emp.branch || '');
    setTin(emp.tin || '');
    setSsnit(emp.ssnit || '');
  }, [open, emp]);

  if (!open) return null;

  const handleSave = () => {
    onSave({
      bank: bank.trim(),
      accountNo: accountNo.trim(),
      branch: branch.trim(),
      tin: tin.trim(),
      ssnit: ssnit.trim() || null,
    });
  };

  return (
    <div className="fixed inset-0 z-[85] flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-slate-900/45 backdrop-blur-[2px]" aria-label="Close" onClick={onClose} />
      <div
        className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-surface-border bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="bank-edit-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 px-6 pt-6">
          <div className="flex min-w-0 gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-surface-border bg-surface-page text-slate-600">
              <Building2 size={20} strokeWidth={1.75} />
            </div>
            <div className="min-w-0">
              <h2 id="bank-edit-title" className="text-lg font-bold text-slate-900">
                Bank &amp; Tax
              </h2>
              <p className="mt-0.5 text-sm text-slate-500">Update employee bank &amp; tax information</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">Bank Name</label>
              <div className="relative">
                <select className={selectClass} value={bank} onChange={(e) => setBank(e.target.value)}>
                  <option value="">Select bank</option>
                  {bankOptions.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                <SelectChevron />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">Account Number</label>
              <input className={inputClass} value={accountNo} onChange={(e) => setAccountNo(e.target.value)} placeholder="e.g. 564323456789765" />
            </div>
          </div>
          <div className="mt-4">
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">Account Branch</label>
            <div className="relative">
              <select className={selectClass} value={branch} onChange={(e) => setBranch(e.target.value)}>
                <option value="">Select bank branch</option>
                {branchOptions.map((br) => (
                  <option key={br} value={br}>
                    {br}
                  </option>
                ))}
              </select>
              <SelectChevron />
            </div>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">Ghana Card Number/Tax ID (TIN)</label>
              <input className={inputClass} value={tin} onChange={(e) => setTin(e.target.value)} placeholder="GHA-34567890-5" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">SSNIT</label>
              <input className={inputClass} value={ssnit} onChange={(e) => setSsnit(e.target.value)} placeholder="567890876543" />
            </div>
          </div>
        </div>

        <div className="flex shrink-0 gap-3 border-t border-surface-border bg-white px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[48px] flex-1 rounded-full border border-surface-border bg-white py-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-surface-page"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="min-h-[48px] flex-1 rounded-full bg-forest py-3 text-sm font-semibold text-white shadow-sm hover:bg-forest-dark"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EmployeeProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { employees, setEmployees } = useAuth();
  const [activeTab, setActiveTab] = useState('Profile');
  const [editOpen, setEditOpen] = useState(false);
  const [editKind, setEditKind] = useState('Profile');

  const emp = employees.find((e) => e.id === id);

  const patchEmployee = (updates) => {
    setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
    setEditOpen(false);
  };

  if (!emp) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-6 py-16">
        <div className="max-w-sm text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-surface-border bg-white text-slate-400 shadow-sm">
            <User size={28} strokeWidth={1.5} />
          </div>
          <h1 className="mt-5 text-lg font-bold text-slate-900">Employee not found</h1>
          <p className="mt-2 text-sm text-slate-600">This employee is not in your roster, or the link may be invalid.</p>
          <Button variant="primary" className="mt-6" onClick={() => navigate('/employees')}>
            Back to All Employees
          </Button>
        </div>
      </div>
    );
  }

  const tier1Amt = emp.grossSalary * (emp.tier1 / 100);
  const tier2Amt = emp.grossSalary * (emp.tier2 / 100);
  const tier3Amt = emp.grossSalary * ((emp.tier3 || 0) / 100);
  const netPay = emp.grossSalary - tier1Amt - tier2Amt - tier3Amt - (emp.paye || 0) + (emp.bonus || 0) + (emp.allowances || 0);
  const totalDeductions = (emp.paye || 0) + tier1Amt + tier2Amt + tier3Amt;
  const isContract = emp.type === 'Contract';

  const inviteBadge =
    emp.status === 'Pending'
      ? { label: 'Invited', className: 'bg-amber-50 text-amber-800 ring-1 ring-amber-200' }
      : emp.status === 'Active'
        ? { label: 'Active', className: 'bg-emerald-50 text-forest ring-1 ring-emerald-100' }
        : { label: emp.status, className: 'bg-slate-100 text-slate-700 ring-1 ring-slate-200' };

  const openEdit = () => {
    setEditKind(activeTab);
    setEditOpen(true);
  };

  return (
    <div className="min-h-full bg-surface-page">
      {editOpen && editKind === 'Profile' && (
        <EmployeePersonalEditModal open emp={emp} onClose={() => setEditOpen(false)} onSave={patchEmployee} />
      )}
      {editOpen && editKind === 'Payroll' && (
        <EmployeePayrollEditModal open emp={emp} onClose={() => setEditOpen(false)} onSave={patchEmployee} />
      )}
      {editOpen && editKind === 'Bank & Tax' && (
        <EmployeeBankTaxEditModal open emp={emp} onClose={() => setEditOpen(false)} onSave={patchEmployee} />
      )}

      <div className="border-b border-surface-border bg-white px-6 py-5 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4">
          <button
            type="button"
            onClick={() => navigate('/employees')}
            className="inline-flex w-fit items-center gap-2 rounded-[10px] border border-surface-border bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition-colors hover:bg-surface-page"
          >
            <ArrowLeft size={16} strokeWidth={2} />
            Back
          </button>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Employee Profile</h1>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="relative overflow-hidden rounded-2xl border border-surface-border shadow-card">
          <div className="relative h-36 sm:h-40">
            <ProfileHeroDecor />
          </div>
        </div>

        <div className="relative z-[1] -mt-10 rounded-2xl border border-surface-border bg-white p-6 shadow-card sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{emp.name}</h2>
              <p className="mt-1.5 text-sm text-slate-600">{emp.email}</p>
              <span className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${inviteBadge.className}`}>
                {inviteBadge.label}
              </span>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-[10px] px-3 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
              >
                <X size={16} strokeWidth={2} />
                Deactivate link
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-[10px] border border-surface-border bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-surface-page"
              >
                <RefreshCw size={16} strokeWidth={2} />
                Re-send Invite
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-t-2xl border border-b-0 border-surface-border bg-white px-3 sm:px-5">
          <div className="flex flex-col gap-3 border-b border-surface-border sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <nav className="flex flex-wrap gap-0" aria-label="Profile sections">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-4 py-3.5 text-sm font-semibold transition-colors sm:px-5 ${
                    activeTab === tab ? 'text-forest' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-forest sm:left-5 sm:right-5" />
                  )}
                </button>
              ))}
            </nav>
            <button
              type="button"
              onClick={openEdit}
              className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-[10px] border border-surface-border bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-surface-page sm:self-auto"
            >
              <Edit2 size={16} strokeWidth={2} />
              Edit
            </button>
          </div>
        </div>

        <div className="rounded-b-2xl border border-t-0 border-surface-border bg-white px-4 py-6 shadow-sm sm:px-6 sm:py-8 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
            <div className="min-w-0 space-y-6 lg:col-span-2">
              {activeTab === 'Profile' && (
                <>
                  <section className="overflow-hidden rounded-xl border border-surface-border bg-white shadow-sm">
                    <div className="border-b border-surface-border px-5 py-4">
                      <h3 className="text-sm font-bold text-slate-900">Personal information</h3>
                      <p className="mt-1 text-xs text-slate-500">Update employee personal details here.</p>
                    </div>
                    <div className="px-5 pb-1">
                      <InfoRow label="Full Name" value={emp.name} />
                      <InfoRow label="Role/Title" value={emp.title} />
                      <InfoRow label="Employment type" value={employmentLabel(emp.type)} />
                      <InfoRow label="Status" value={emp.status} />
                      <InfoRow label="Start date" value={formatStartDate(emp.startDate)} />
                      <InfoRow label="Employee ID" value={emp.id} mono />
                      {emp.location ? <InfoRow label="Location" value={emp.location} /> : null}
                      {emp.dateOfBirth ? <InfoRow label="Date of birth" value={emp.dateOfBirth} /> : null}
                    </div>
                  </section>

                  <section className="overflow-hidden rounded-xl border border-surface-border bg-white shadow-sm">
                    <div className="border-b border-surface-border px-5 py-4">
                      <h3 className="text-sm font-bold text-slate-900">Contact information</h3>
                      <p className="mt-1 text-xs text-slate-500">Employee&apos;s contact information</p>
                    </div>
                    <div className="px-5 pb-1">
                      <InfoRow label="Phone number" value={emp.phone} />
                      <InfoRow label="Email" value={emp.email} />
                    </div>
                  </section>
                </>
              )}

              {activeTab === 'Payroll' && (
                <div className="space-y-6">
                  <section className="overflow-hidden rounded-xl border border-surface-border bg-white shadow-sm">
                    <div className="flex items-center gap-2 border-b border-surface-border px-5 py-4">
                      <DollarSign size={16} className="text-slate-400" strokeWidth={1.75} />
                      <h3 className="text-sm font-bold text-slate-900">Salary breakdown</h3>
                    </div>
                    <div className="px-5 pb-1">
                      <InfoRow label="Gross salary" value={fmt(emp.grossSalary)} />
                      <InfoRow label="Bonus" value={fmt(emp.bonus)} />
                      <InfoRow label="Allowances" value={fmt(emp.allowances)} />
                    </div>
                  </section>

                  <section className="overflow-hidden rounded-xl border border-surface-border bg-white shadow-sm">
                    <div className="flex items-center gap-2 border-b border-surface-border px-5 py-4">
                      <ShieldCheck size={16} className="text-slate-400" strokeWidth={1.75} />
                      <h3 className="text-sm font-bold text-slate-900">Deductions</h3>
                      {isContract && <span className="ml-auto text-xs font-normal text-slate-400">Not applicable — contract</span>}
                    </div>
                    {isContract ? (
                      <div className="px-5 py-8 text-center">
                        <p className="text-sm text-slate-500">Contract employees are exempt from PAYE and SSNIT contributions.</p>
                      </div>
                    ) : (
                      <div className="px-5 pb-1">
                        <InfoRow label="PAYE tax" value={fmt(emp.paye)} />
                        <InfoRow label={`Tier 1 (${emp.tier1}%)`} value={fmt(tier1Amt)} />
                        <InfoRow label={`Tier 2 (${emp.tier2}%)`} value={fmt(tier2Amt)} />
                        <InfoRow label={`Tier 3 (${emp.tier3 || 0}%)`} value={tier3Amt ? fmt(tier3Amt) : '—'} />
                      </div>
                    )}
                  </section>

                  <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-5">
                    <p className="mb-3 text-xs font-bold text-forest">Net pay calculation</p>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Gross salary</span>
                        <span className="font-semibold text-slate-800">{fmt(emp.grossSalary)}</span>
                      </div>
                      {!isContract && (
                        <div className="flex justify-between">
                          <span className="text-slate-600">− Total deductions</span>
                          <span className="font-semibold text-red-600">− {fmt(totalDeductions)}</span>
                        </div>
                      )}
                      {emp.bonus > 0 && (
                        <div className="flex justify-between">
                          <span className="text-slate-600">+ Bonus</span>
                          <span className="font-semibold text-forest">+ {fmt(emp.bonus)}</span>
                        </div>
                      )}
                      {emp.allowances > 0 && (
                        <div className="flex justify-between">
                          <span className="text-slate-600">+ Allowances</span>
                          <span className="font-semibold text-forest">+ {fmt(emp.allowances)}</span>
                        </div>
                      )}
                      <div className="flex justify-between border-t border-emerald-100 pt-2">
                        <span className="text-sm font-bold text-slate-900">Estimated net pay</span>
                        <span className="text-sm font-bold text-forest">{fmt(netPay)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Bank & Tax' && (
                <div className="space-y-6">
                  <section className="overflow-hidden rounded-xl border border-surface-border bg-white shadow-sm">
                    <div className="flex items-center gap-2 border-b border-surface-border px-5 py-4">
                      <Building2 size={16} className="text-slate-400" strokeWidth={1.75} />
                      <h3 className="text-sm font-bold text-slate-900">Bank account</h3>
                    </div>
                    <div className="px-5 pb-1">
                      <InfoRow label="Bank name" value={emp.bank} />
                      <InfoRow label="Account number" value={emp.accountNo} mono />
                      <InfoRow label="Branch" value={emp.branch} />
                    </div>
                  </section>

                  <section className="overflow-hidden rounded-xl border border-surface-border bg-white shadow-sm">
                    <div className="flex items-center gap-2 border-b border-surface-border px-5 py-4">
                      <CreditCard size={16} className="text-slate-400" strokeWidth={1.75} />
                      <h3 className="text-sm font-bold text-slate-900">Tax & compliance</h3>
                    </div>
                    <div className="px-5 pb-1">
                      <InfoRow label="TIN" value={emp.tin} mono />
                      <InfoRow label="SSNIT number" value={emp.ssnit || '—'} mono />
                    </div>
                  </section>
                </div>
              )}
            </div>

            <aside className="min-w-0 space-y-5 lg:col-span-1">
              <section className="overflow-hidden rounded-xl border border-surface-border bg-white shadow-sm">
                <div className="border-b border-surface-border px-5 py-4">
                  <h3 className="text-sm font-bold text-slate-900">Activity</h3>
                  <p className="mt-1 text-xs text-slate-500">Recent payroll & profile events</p>
                </div>
                <div className="px-5 py-4">
                  {activity.map((a, i) => {
                    const Icon = activityIcon[a.type] || User;
                    const color = activityColor[a.type] || 'bg-slate-100 text-slate-500';
                    return (
                      <div key={`${a.event}-${i}`} className="relative flex gap-3 pb-5 last:pb-0">
                        {i < activity.length - 1 && (
                          <div className="absolute left-[15px] top-9 bottom-0 w-px bg-slate-100" aria-hidden />
                        )}
                        <div className={`relative z-[1] flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${color}`}>
                          <Icon size={14} strokeWidth={2} />
                        </div>
                        <div className="min-w-0 flex-1 pt-0.5">
                          <p className="text-xs font-semibold leading-snug text-slate-800">{a.event}</p>
                          <p className="mt-1 text-xs text-slate-500">{a.date}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              <div className="flex gap-3 rounded-xl border border-sky-100 bg-sky-50/90 p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                  <Info size={18} strokeWidth={2} />
                </div>
                <p className="text-xs leading-relaxed text-sky-800">
                  Employees see a read-only version of this profile and can submit change requests to admin.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
