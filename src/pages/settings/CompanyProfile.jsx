import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Bell,
  ImagePlus,
  FileText,
  Check,
  Plus,
  Info,
  ChevronDown,
  X,
} from 'lucide-react';
import { company as mockCompany } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

const field =
  'w-full rounded-[10px] border border-surface-border bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 shadow-sm focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/15';

function Label({ children, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-slate-700">
      {children}
    </label>
  );
}

function TierPill({ children, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
        active
          ? 'border-forest bg-forest text-white'
          : 'border-forest bg-white text-forest hover:bg-emerald-50'
      }`}
    >
      {active ? <Check size={12} strokeWidth={3} /> : <Plus size={12} strokeWidth={2.5} />}
      {children}
    </button>
  );
}

function OrderRow({ n, title, badge }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-surface-border py-4 last:border-0">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest text-sm font-bold text-white">
          {n}
        </span>
        <span className="text-sm font-medium text-slate-800">{title}</span>
      </div>
      <span
        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
          badge === 'Tax' ? 'bg-amber-50 text-amber-800' : 'border border-surface-border bg-white text-slate-600'
        }`}
      >
        {badge}
      </span>
    </div>
  );
}

function CompanyProfileSavedModal({ onClose, onContinueLater, onAddEmployee }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/45 backdrop-blur-[2px]"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-md rounded-2xl border border-surface-border bg-white p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="company-profile-saved-title"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          aria-label="Close"
        >
          <X size={18} strokeWidth={2} />
        </button>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
          <Check size={24} className="text-forest" strokeWidth={2.5} />
        </div>
        <h2 id="company-profile-saved-title" className="mt-5 pr-8 text-lg font-bold text-slate-900 sm:text-xl">
          Company profile saved
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Your tax details and pension tier preferences have been saved. You can now invite employees and assign role holders.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            onClick={onAddEmployee}
            className="flex-1 rounded-[10px] bg-forest px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-forest-dark"
          >
            Add employee
          </button>
          <button
            type="button"
            onClick={onContinueLater}
            className="flex-1 rounded-[10px] border border-surface-border bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm transition-colors hover:bg-surface-page"
          >
            Continue later
          </button>
        </div>
      </div>
    </div>
  );
}

export function CompanyProfileForm({ cancelTo }) {
  const navigate = useNavigate();
  const { completeCompanyProfile } = useAuth();
  const [successOpen, setSuccessOpen] = useState(false);
  const [form, setForm] = useState({
    tin: mockCompany.tin || '',
    ssnit: mockCompany.ssnit || '',
    trusteeTier2: '',
    trusteeTier3: '',
    tier3Contribution: '',
    payeAuto: true,
    tier1: true,
    tier2: true,
    tier3: false,
  });
  const [logoName, setLogoName] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const toggle = (k) => () => setForm((f) => ({ ...f, [k]: !f[k] }));

  /** Tier 2 requires Tier 1: enabling Tier 2 forces Tier 1 on; disabling Tier 1 clears Tier 2. */
  const toggleTier1 = () =>
    setForm((f) => {
      if (f.tier1) return { ...f, tier1: false, tier2: false };
      return { ...f, tier1: true };
    });

  const toggleTier2 = () =>
    setForm((f) => {
      if (f.tier2) return { ...f, tier2: false };
      return { ...f, tier2: true, tier1: true };
    });

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    setLogoName(f ? f.name : '');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) setLogoName(f.name);
  };

  const handleSave = () => {
    completeCompanyProfile();
    setSuccessOpen(true);
  };

  const dismissSuccess = () => setSuccessOpen(false);

  const handleContinueLater = () => {
    setSuccessOpen(false);
    navigate(cancelTo != null ? cancelTo : '/');
  };

  const handleAddEmployee = () => {
    setSuccessOpen(false);
    navigate('/employees');
  };

  const handleCancel = () => {
    if (cancelTo != null) navigate(cancelTo);
    else navigate(-1);
  };

  const allTiersOn = form.tier1 && form.tier2 && form.tier3;
  const allTiersOff = !form.tier1 && !form.tier2 && !form.tier3;

  const selectAllTiers = () => setForm((f) => ({ ...f, tier1: true, tier2: true, tier3: true }));
  const deselectAllTiers = () => setForm((f) => ({ ...f, tier1: false, tier2: false, tier3: false }));

  return (
    <div className="space-y-8">
      {successOpen && (
        <CompanyProfileSavedModal
          onClose={dismissSuccess}
          onContinueLater={handleContinueLater}
          onAddEmployee={handleAddEmployee}
        />
      )}
      <section>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="co-tin">Company TIN</Label>
            <input
              id="co-tin"
              className={field}
              placeholder="e.g. C002345678"
              value={form.tin}
              onChange={set('tin')}
            />
          </div>
          <div>
            <Label htmlFor="co-ssnit">SSNIT Number</Label>
            <input
              id="co-ssnit"
              className={field}
              placeholder="e.g. G-00123456-7"
              value={form.ssnit}
              onChange={set('ssnit')}
            />
          </div>
        </div>
      </section>

      <section>
        <Label>Company Logo</Label>
        <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-stretch">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-dashed border-surface-border bg-surface-page">
            <ImagePlus size={28} className="text-slate-400" strokeWidth={1.5} />
          </div>
          <div
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && fileRef.current?.click()}
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`flex flex-1 cursor-pointer flex-col items-center justify-center rounded-[10px] border border-dashed px-4 py-8 text-center transition-colors ${
              dragOver
                ? 'border-forest bg-emerald-50/50'
                : 'border-surface-border bg-surface-page hover:border-forest/40 hover:bg-emerald-50/30'
            }`}
          >
            <input ref={fileRef} type="file" accept=".svg,.png,.jpg,.jpeg,.gif" className="hidden" onChange={handleFile} />
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-forest">Click to upload</span> or drag and drop
            </p>
            <p className="mt-1 text-xs text-slate-500">SVG, PNG, JPG or GIF (max. 800×400px)</p>
            {logoName && <p className="mt-2 truncate text-xs font-medium text-forest">{logoName}</p>}
          </div>
        </div>
      </section>

      <section className="rounded-[10px] border border-surface-border bg-slate-50/60 p-4 sm:p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] border border-surface-border bg-white text-slate-500">
            <FileText size={20} strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-900">P.A.Y.E Automatic Calculation</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Automatically calculate Pay-As-You-Earn tax based on national regulation schedules.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={form.payeAuto}
            onClick={toggle('payeAuto')}
            className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${form.payeAuto ? 'bg-forest' : 'bg-slate-200'}`}
          >
            <span
              className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${form.payeAuto ? 'left-5' : 'left-0.5'}`}
            />
          </button>
        </div>
      </section>

      <section>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Additional statutory deductions</p>
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={selectAllTiers}
              disabled={allTiersOn}
              className="font-semibold text-forest hover:underline disabled:cursor-not-allowed disabled:text-slate-300 disabled:no-underline"
            >
              Select all
            </button>
            <span className="text-slate-300" aria-hidden>
              |
            </span>
            <button
              type="button"
              onClick={deselectAllTiers}
              disabled={allTiersOff}
              className="font-semibold text-slate-600 hover:text-forest hover:underline disabled:cursor-not-allowed disabled:text-slate-300 disabled:no-underline"
            >
              Deselect all
            </button>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <TierPill active={form.tier1} onClick={toggleTier1}>
            Tier 1
          </TierPill>
          <TierPill active={form.tier2} onClick={toggleTier2}>
            Tier 2
          </TierPill>
          <TierPill active={form.tier3} onClick={toggle('tier3')}>
            Tier 3
          </TierPill>
        </div>

        {(form.tier2 || form.tier3) && (
          <div className="mt-6 space-y-8 border-t border-surface-border pt-6">
            {form.tier2 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tier 2 partner setup</p>
                <div className="mt-2">
                  <Label htmlFor="co-trustee-t2">Tier 2 partner</Label>
                  <p className="mb-2 text-xs leading-relaxed text-slate-500">
                    Your employees&apos; 5% Tier 2 contributions will be remitted to this trustee every month.
                  </p>
                  <div className="relative">
                    <select
                      id="co-trustee-t2"
                      className={`${field} cursor-pointer appearance-none pr-10`}
                      value={form.trusteeTier2}
                      onChange={set('trusteeTier2')}
                    >
                      <option value="">Select trustee</option>
                      <option value="enterprise">Enterprise Trustees Ghana</option>
                      <option value="axis">Axis Pensions Trust</option>
                      <option value="best">Best Pensions Trust</option>
                      <option value="npra">NPRA Licensed Trustee (Generic)</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
              </div>
            )}

            {form.tier3 && (
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tier 3 partner setup</p>
                  <div className="mt-2">
                    <Label htmlFor="co-trustee-t3">Tier 3 partner</Label>
                    <p className="mb-2 text-xs leading-relaxed text-slate-500">
                      Tier 3 is voluntary. Does your company operate a Tier 3 scheme for additional retirement savings?
                    </p>
                    <div className="relative">
                      <select
                        id="co-trustee-t3"
                        className={`${field} cursor-pointer appearance-none pr-10`}
                        value={form.trusteeTier3}
                        onChange={set('trusteeTier3')}
                      >
                        <option value="">Select trustee</option>
                        <option value="enterprise">Enterprise Trustees Ghana</option>
                        <option value="axis">Axis Pensions Trust</option>
                        <option value="best">Best Pensions Trust</option>
                        <option value="npra">NPRA Licensed Trustee (Generic)</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="co-tier3-pct" className="mb-1.5 block text-sm font-medium text-slate-700">
                    Tier 3 contribution value (Up to 16.5%) <span className="text-red-500">*</span>
                  </label>
                  <div className="flex overflow-hidden rounded-[10px] border border-surface-border bg-white shadow-sm focus-within:border-forest focus-within:ring-2 focus-within:ring-forest/15">
                    <input
                      id="co-tier3-pct"
                      type="text"
                      inputMode="decimal"
                      placeholder="e.g. 15.5"
                      value={form.tier3Contribution}
                      onChange={set('tier3Contribution')}
                      className="min-w-0 flex-1 border-0 bg-transparent px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0"
                    />
                    <span className="flex items-center border-l border-surface-border bg-surface-page px-3 text-sm font-medium text-slate-500">
                      %
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                    Applied to each employee&apos;s gross salary after Tier 1 and Tier 2 deductions.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      <section>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Calculation order</p>
        <div className="mt-1 rounded-[10px] border border-surface-border bg-white px-4">
          <OrderRow n={1} title="Tier 1, 2 & 3 Social Security" badge="Pre-tax" />
          <OrderRow n={2} title="Taxable Bonuses & Allowances" badge="Pre-tax" />
          <OrderRow n={3} title="P.A.Y.E Calculation" badge="Tax" />
        </div>
      </section>

      <div className="flex gap-3 rounded-[10px] border border-emerald-100 bg-emerald-50/80 px-4 py-3">
        <Info size={18} className="mt-0.5 shrink-0 text-forest" strokeWidth={2} />
        <p className="text-xs leading-relaxed text-emerald-950">
          You can update your pension partners at any time from{' '}
          <strong className="font-semibold">Settings → Company profile.</strong>
        </p>
      </div>

      <div className="flex flex-wrap justify-end gap-3 border-t border-surface-border pt-6">
        <button
          type="button"
          onClick={handleCancel}
          className="rounded-[10px] border border-surface-border bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-surface-page"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="rounded-[10px] bg-forest px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-forest-dark"
        >
          Save & Complete
        </button>
      </div>
    </div>
  );
}

export default function CompanyProfile() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface-page">
      <header className="flex items-start justify-between border-b border-surface-border bg-white px-6 py-5 sm:px-8">
        <div className="flex items-start gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-0.5 inline-flex items-center gap-2 rounded-[10px] border border-surface-border bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition-colors hover:bg-surface-page"
          >
            <ArrowLeft size={16} strokeWidth={2} />
            Back
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Company profile</h1>
          </div>
        </div>
        <button
          type="button"
          className="rounded-[10px] border border-surface-border bg-white p-2.5 text-slate-500 transition-colors hover:bg-surface-page hover:text-slate-700"
          aria-label="Notifications"
        >
          <Bell size={20} strokeWidth={1.75} />
        </button>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="rounded-xl border border-surface-border bg-white p-6 shadow-sm sm:p-8">
          <CompanyProfileForm />
        </div>
      </div>
    </div>
  );
}
