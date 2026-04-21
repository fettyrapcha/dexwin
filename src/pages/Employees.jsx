import { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Plus,
  Upload,
  MoreVertical,
  UserPlus,
  ChevronDown,
  Info,
  X,
  Check,
  Send,
  Filter,
  Download,
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const fmt = (n) => `GHS ${Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function exportEmployeesCsv(list) {
  const rows = [['Employee ID', 'Name', 'Title', 'Email', 'Type', 'Status', 'Gross Salary']];
  list.forEach((e) => {
    rows.push([
      e.id,
      e.name,
      e.title,
      e.email ?? '',
      e.type,
      e.status,
      String(e.grossSalary ?? ''),
    ]);
  });
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'dexwin-employees.csv';
  a.click();
  URL.revokeObjectURL(url);
}

const field =
  'w-full rounded-[10px] border border-surface-border bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 shadow-sm focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/15';

function Req({ children }) {
  return (
    <>
      {children} <span className="text-forest">*</span>
    </>
  );
}

const initialForm = () => ({
  firstName: '',
  lastName: '',
  email: '',
  dialCode: '+233',
  phoneNational: '',
  employmentType: 'Full time',
  grossSalary: '',
  paymentFrequency: 'Monthly',
  allowSelfFill: false,
});

function AddEmployeeFlow({ open, onClose, onSave }) {
  const navigate = useNavigate();
  const [step, setStep] = useState('form');
  const [form, setForm] = useState(initialForm);
  const [createdId, setCreatedId] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: '' }));
  };

  const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`.trim();
  const fullPhone = `${form.dialCode}${form.phoneNational.replace(/\D/g, '')}`;
  const reviewEmployment =
    form.employmentType === 'Full time' ? 'Full Time' : form.employmentType === 'Part time' ? 'Part Time' : form.employmentType;

  const validateForm = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim()) e.lastName = 'Required';
    if (!form.email.includes('@')) e.email = 'Valid email required';
    if (form.phoneNational.replace(/\D/g, '').length < 9) e.phoneNational = 'Valid phone required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const mapTypeToEmployee = (t) => {
    if (t === 'Full time') return 'Full-time';
    if (t === 'Part time') return 'Part-time';
    return t;
  };

  const handleFormNext = () => {
    if (!validateForm()) return;
    setStep('review');
  };

  const handleSendInvite = () => {
    const payload = {
      name: fullName,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phone: fullPhone,
      type: mapTypeToEmployee(form.employmentType),
      grossSalary: form.grossSalary,
      paymentFrequency: form.paymentFrequency,
      allowSelfFill: form.allowSelfFill,
    };
    const id = onSave(payload);
    setCreatedId(id);
    setStep('success');
  };

  const handleContinueLater = () => {
    onClose();
  };

  const handleAddOtherDetails = () => {
    onClose();
    if (createdId) navigate(`/employees/${createdId}`);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
        aria-label="Close"
        onClick={onClose}
      />
      <div
        className="relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-surface-border bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header — shared */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-surface-border px-6 py-5">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-surface-border bg-surface-page text-slate-600">
              <UserPlus size={20} strokeWidth={1.75} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Add employee</h2>
              {step === 'form' && (
                <p className="mt-0.5 text-sm text-slate-500">Set up a new team member profile</p>
              )}
              {step === 'review' && (
                <p className="mt-0.5 text-sm text-slate-500">Review details and send invitation to your new team member.</p>
              )}
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
          {step === 'form' && (
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    <Req>First name</Req>
                  </label>
                  <input
                    className={field}
                    placeholder="e.g. Kofi"
                    value={form.firstName}
                    onChange={set('firstName')}
                  />
                  {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    <Req>Last name</Req>
                  </label>
                  <input
                    className={field}
                    placeholder="e.g. Mensah"
                    value={form.lastName}
                    onChange={set('lastName')}
                  />
                  {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  <Req>Email</Req>
                </label>
                <input
                  type="email"
                  className={field}
                  placeholder="kofi.mensah@mail.com"
                  value={form.email}
                  onChange={set('email')}
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  <Req>Phone number(WhatsApp)</Req>
                </label>
                <div className="flex gap-2">
                  <div className="relative w-[min(8.5rem,38%)] shrink-0">
                    <select
                      className={`${field} cursor-pointer appearance-none pr-8`}
                      value={form.dialCode}
                      onChange={set('dialCode')}
                      aria-label="Country code"
                    >
                      <option value="+233">GH(233)</option>
                      <option value="+234">NG(234)</option>
                      <option value="+254">KE(254)</option>
                      <option value="+1">US(1)</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                  <input
                    className={`${field} min-w-0 flex-1`}
                    placeholder="000 000 000"
                    value={form.phoneNational}
                    onChange={set('phoneNational')}
                  />
                </div>
                {errors.phoneNational && <p className="mt-1 text-xs text-red-500">{errors.phoneNational}</p>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Employment type</label>
                  <div className="relative">
                    <select className={`${field} cursor-pointer appearance-none pr-9`} value={form.employmentType} onChange={set('employmentType')}>
                      <option>Full time</option>
                      <option>Contract</option>
                      <option>Part time</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Gross salary</label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500">
                      ₵
                    </span>
                    <input
                      type="text"
                      inputMode="decimal"
                      className={`${field} pl-9`}
                      placeholder="0.00"
                      value={form.grossSalary}
                      onChange={set('grossSalary')}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Payment frequency</label>
                <div className="relative">
                  <select className={`${field} cursor-pointer appearance-none pr-9`} value={form.paymentFrequency} onChange={set('paymentFrequency')}>
                    <option>Monthly</option>
                    <option>Bi-weekly</option>
                    <option>Weekly</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div className="rounded-[10px] border border-surface-border bg-slate-50/80 px-4 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Allow employee to fill in other details</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">They will receive an invite to complete their profile.</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={form.allowSelfFill}
                    onClick={() => setForm((f) => ({ ...f, allowSelfFill: !f.allowSelfFill }))}
                    className={`relative mt-0.5 h-7 w-12 shrink-0 rounded-full transition-colors ${form.allowSelfFill ? 'bg-forest' : 'bg-slate-200'}`}
                  >
                    <span
                      className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${form.allowSelfFill ? 'left-5' : 'left-0.5'}`}
                    />
                  </button>
                </div>
              </div>

              <div className="flex gap-3 rounded-[10px] border border-emerald-100 bg-emerald-50/90 px-4 py-3">
                <Info size={18} className="mt-0.5 shrink-0 text-forest" strokeWidth={2} />
                <p className="text-xs leading-relaxed text-emerald-950">
                  Other details can be added later after creating the employee profile.
                </p>
              </div>
            </div>
          )}

          {step === 'review' && (
            <div className="rounded-[10px] border border-surface-border bg-surface-page/50 p-5">
              <p className="text-sm font-bold text-slate-900">Review before submitting</p>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Full name</dt>
                  <dd className="font-medium text-slate-800">{fullName}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Email</dt>
                  <dd className="break-all text-right font-medium text-slate-800">{form.email.trim()}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Phone</dt>
                  <dd className="font-medium text-slate-800">{fullPhone}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Employment Type</dt>
                  <dd className="font-medium text-slate-800">{reviewEmployment}</dd>
                </div>
              </dl>
              <div className="my-4 border-t border-surface-border" />
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Salary preview</p>
              <dl className="mt-3 space-y-2.5 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Gross Salary</dt>
                  <dd className="font-semibold text-slate-800">{fmt(Number(form.grossSalary) || 0)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Tier 1</dt>
                  <dd className="font-medium text-slate-800">13.0%</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Tier 2</dt>
                  <dd className="font-medium text-slate-800">5.5%</dd>
                </div>
              </dl>
            </div>
          )}

          {step === 'success' && (
            <div className="py-2 text-center sm:px-2">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-forest text-white">
                <Check size={28} strokeWidth={2.5} />
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-900">Invite Sent!</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                <span className="font-bold text-slate-900">{fullName}</span> has been added successfully. An onboarding invite has been sent to{' '}
                <span className="font-bold text-slate-900">{form.email.trim()}</span>.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-surface-border bg-white px-6 py-4">
          {step === 'form' && (
            <div className="flex w-full flex-col-reverse gap-3 sm:flex-row sm:gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full min-w-0 flex-1 rounded-[10px] border border-surface-border bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm transition-colors hover:bg-surface-page"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleFormNext}
                className="w-full min-w-0 flex-1 rounded-[10px] bg-forest px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-forest-dark"
              >
                Add Employee
              </button>
            </div>
          )}
          {step === 'review' && (
            <div className="flex w-full flex-col-reverse gap-3 sm:flex-row sm:gap-3">
              <button
                type="button"
                onClick={() => setStep('form')}
                className="w-full min-w-0 flex-1 rounded-[10px] border border-surface-border bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm transition-colors hover:bg-surface-page"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSendInvite}
                className="inline-flex w-full min-w-0 flex-1 items-center justify-center gap-2 rounded-[10px] bg-forest px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-forest-dark"
              >
                Send Invite
                <Send size={16} strokeWidth={2} className="text-white" />
              </button>
            </div>
          )}
          {step === 'success' && (
            <div className="flex w-full flex-col-reverse gap-3 sm:flex-row sm:gap-3">
              <button
                type="button"
                onClick={handleContinueLater}
                className="w-full min-w-0 flex-1 rounded-[10px] border border-surface-border bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm transition-colors hover:bg-surface-page"
              >
                Continue later
              </button>
              <button
                type="button"
                onClick={handleAddOtherDetails}
                className="w-full min-w-0 flex-1 rounded-[10px] bg-forest px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-forest-dark"
              >
                Add other details
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BulkModal({ open, onClose }) {
  const [preview, setPreview] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const mockPreview = [
    { row: 1, name: 'Ama Sarpong', title: 'Developer', type: 'Full-time', salary: 7000 },
    { row: 2, name: 'Kojo Ntim', title: 'Analyst', type: 'Contract', salary: 5500 },
    { row: 3, name: 'Adwoa Boah', title: 'Designer', type: 'Full-time', salary: 6000 },
    { row: 4, name: 'Yaw Darko', title: 'DevOps', type: 'Full-time', salary: 8000 },
    { row: 5, name: 'Abena Yiadom', title: 'PM', type: 'Full-time', salary: 9500 },
  ];

  return (
    <Modal open={open} onClose={onClose} title="Bulk Upload Employees" width="max-w-2xl">
      <div className="space-y-4">
        <div className="rounded-xl border-2 border-dashed border-slate-200 p-8 text-center">
          <Upload size={24} className="mx-auto mb-2 text-slate-400" />
          <p className="text-sm font-medium text-slate-600">Drop your CSV or Excel file here</p>
          <p className="mt-1 text-xs text-slate-400">Required columns: Name, Title, Employment Type, Gross Salary</p>
          <Button variant="secondary" size="sm" className="mt-3" onClick={() => setPreview(mockPreview)}>
            Choose File
          </Button>
        </div>

        {preview && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase text-slate-500">Preview — first 5 rows</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50">
                    {['Row', 'Name', 'Title', 'Type', 'Salary (GHS)'].map((h) => (
                      <th key={h} className="px-3 py-2 text-left font-medium text-slate-500">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {preview.map((r) => (
                    <tr key={r.row}>
                      <td className="px-3 py-2 text-slate-400">{r.row}</td>
                      <td className="px-3 py-2 font-medium text-slate-700">{r.name}</td>
                      <td className="px-3 py-2 text-slate-600">{r.title}</td>
                      <td className="px-3 py-2">
                        <Badge label={r.type} />
                      </td>
                      <td className="px-3 py-2 text-slate-700">{fmt(r.salary)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <label className="mt-3 flex cursor-pointer items-center gap-2">
              <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="accent-brand-600" />
              <span className="text-xs text-slate-600">I confirm the data above is correct and ready for import.</span>
            </label>
          </div>
        )}
      </div>
      <div className="mt-4 flex justify-end gap-2 border-t border-slate-100 pt-4">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" disabled={!confirmed} onClick={onClose}>
          Upload & Import
        </Button>
      </div>
    </Modal>
  );
}

const toolbarSelect =
  'w-full min-w-0 cursor-pointer appearance-none rounded-[10px] border border-surface-border bg-white py-2.5 pl-9 pr-9 text-sm text-slate-800 shadow-sm focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/15';

export default function Employees() {
  const { completeInviteEmployees, employees, setEmployees } = useAuth();
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [addFlowKey, setAddFlowKey] = useState(0);
  const [showBulk, setShowBulk] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const navigate = useNavigate();

  const departmentOptions = useMemo(() => {
    const fromData = [...new Set(employees.map((e) => e.department).filter(Boolean))].sort();
    return fromData.length ? ['all', ...fromData] : ['all'];
  }, [employees]);

  const filtered = useMemo(() => {
    return employees.filter((e) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        e.name.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q) ||
        (e.email && e.email.toLowerCase().includes(q)) ||
        (e.title && e.title.toLowerCase().includes(q));
      const matchDept =
        deptFilter === 'all' ||
        (e.department && e.department === deptFilter) ||
        (!e.department && deptFilter === 'General');
      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'Active' && e.status === 'Active') ||
        (statusFilter === 'Pending' && e.status === 'Pending') ||
        (statusFilter === 'Full-time' && e.type === 'Full-time') ||
        (statusFilter === 'Contract' && e.type === 'Contract');
      return matchSearch && matchDept && matchStatus;
    });
  }, [employees, search, deptFilter, statusFilter]);

  const deptCount =
    employees.length === 0
      ? 0
      : new Set(employees.map((e) => (e.department && String(e.department).trim()) || 'General')).size;

  const isEmptyRoster = employees.length === 0;

  const handleExport = () => {
    exportEmployeesCsv(employees);
  };

  const handleAdd = (payload) => {
    const maxNum = employees.reduce((m, e) => {
      const n = parseInt(e.id.replace(/\D/g, ''), 10) || 0;
      return Math.max(m, n);
    }, 0);
    const id = `EMP-${String(maxNum + 1).padStart(3, '0')}`;
    const gross = Number(payload.grossSalary) || 0;
    const newEmp = {
      id,
      name: payload.name,
      title: 'New Employee',
      email: payload.email,
      phone: payload.phone,
      type: payload.type,
      status: 'Pending',
      grossSalary: gross,
      tin: '',
      ssnit: null,
      bank: '',
      accountNo: '',
      branch: '',
      startDate: new Date().toISOString().slice(0, 10),
      tier1: 5.5,
      tier2: 5,
      tier3: 0,
      bonus: 0,
      allowances: 0,
      paye: 0,
    };
    setEmployees((prev) => [...prev, newEmp]);
    completeInviteEmployees?.();
    return id;
  };

  const openAddEmployee = () => {
    setAddFlowKey((k) => k + 1);
    setShowAdd(true);
  };

  const subtitle =
    employees.length === 0
      ? '0 employees across 0 departments'
      : `${employees.length} employee${employees.length === 1 ? '' : 's'} across ${deptCount} department${deptCount === 1 ? '' : 's'}`;

  return (
    <div>
      <PageHeader
        title="All Employees"
        subtitle={subtitle}
        actions={
          <>
            <Button variant="secondary" size="sm" icon={Download} onClick={handleExport}>
              Export
            </Button>
            {!isEmptyRoster && (
              <Button variant="secondary" size="sm" icon={Upload} onClick={() => setShowBulk(true)}>
                Bulk Upload
              </Button>
            )}
            <button
              type="button"
              onClick={openAddEmployee}
              className="inline-flex items-center gap-2 rounded-lg bg-forest px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-forest-dark"
            >
              <Plus size={15} strokeWidth={2} />
              Add Employee
            </button>
          </>
        }
      />

      <div className="p-6">
        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, title or email"
              className="w-full rounded-[10px] border border-surface-border bg-white py-2.5 pl-10 pr-3 text-sm text-slate-800 placeholder:text-slate-400 shadow-sm focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/15"
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-3 lg:shrink-0">
            <div className="relative min-w-0 flex-1 sm:min-w-[11rem] sm:max-w-[14rem]">
              <Filter size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className={toolbarSelect}
                aria-label="Department filter"
              >
                {departmentOptions.map((d) => (
                  <option key={d} value={d}>
                    {d === 'all' ? 'All Departments' : d}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
            <div className="relative min-w-0 flex-1 sm:min-w-[11rem] sm:max-w-[14rem]">
              <Filter size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={toolbarSelect}
                aria-label="Status filter"
              >
                <option value="all">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Full-time">Full-time</option>
                <option value="Contract">Contract</option>
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>

        {isEmptyRoster ? (
          <div className="mx-auto max-w-lg rounded-xl border border-surface-border bg-white px-8 py-12 text-center shadow-sm sm:px-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-400">
              <UserPlus size={28} strokeWidth={1.5} />
            </div>
            <h2 className="mt-6 text-lg font-bold text-slate-900">No employee added yet</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Add employees to invite them to the platform and complete payroll setup. You can also import a CSV from the Employees page.
            </p>
            <div className="mx-auto mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:gap-3">
              <button
                type="button"
                onClick={() => setShowBulk(true)}
                className="w-full min-w-0 flex-1 rounded-[10px] border border-surface-border bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm transition-colors hover:bg-surface-page"
              >
                Import CSV
              </button>
              <button
                type="button"
                onClick={openAddEmployee}
                className="inline-flex w-full min-w-0 flex-1 items-center justify-center gap-2 rounded-[10px] bg-forest px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-forest-dark"
              >
                <Plus size={18} strokeWidth={2} />
                Add Employee
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-surface-border bg-white shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-border bg-slate-50/80">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">Employee</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">Employee ID</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">Type</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">Gross Salary</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">Start Date</th>
                  <th className="px-2 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((emp) => (
                  <tr key={emp.id} className="transition-colors hover:bg-slate-50/50">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
                          {emp.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">{emp.name}</p>
                          <p className="text-xs text-slate-400">{emp.title}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-500">{emp.id}</td>
                    <td className="px-5 py-3.5">
                      <Badge label={emp.type} />
                    </td>
                    <td className="px-5 py-3.5 text-sm font-medium text-slate-700">{fmt(emp.grossSalary)}</td>
                    <td className="px-5 py-3.5">
                      <Badge label={emp.status} />
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-500">{emp.startDate}</td>
                    <td className="px-2 py-3.5">
                      <div className="relative">
                        <button
                          type="button"
                          className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                          onClick={() => setOpenMenu(openMenu === emp.id ? null : emp.id)}
                        >
                          <MoreVertical size={15} />
                        </button>
                        {openMenu === emp.id && (
                          <div className="absolute right-0 top-7 z-10 w-36 rounded-xl border border-slate-100 bg-white py-1 shadow-card-hover">
                            <button
                              type="button"
                              className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50"
                              onClick={() => {
                                navigate(`/employees/${emp.id}`);
                                setOpenMenu(null);
                              }}
                            >
                              View Profile
                            </button>
                            <button
                              type="button"
                              className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50"
                              onClick={() => {
                                navigate(`/employees/${emp.id}`);
                                setOpenMenu(null);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50"
                              onClick={() => setOpenMenu(null)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="border-t border-surface-border py-14 text-center text-sm text-slate-500">
                No employees match your filters or search.
              </div>
            )}
          </div>
        )}
      </div>

      <AddEmployeeFlow key={addFlowKey} open={showAdd} onClose={() => setShowAdd(false)} onSave={handleAdd} />
      <BulkModal open={showBulk} onClose={() => setShowBulk(false)} />
    </div>
  );
}
