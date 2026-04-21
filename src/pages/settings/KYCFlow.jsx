import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Bell,
  Shield,
  Plus,
  ListChecks,
  Trash2,
  Pencil,
  Check,
  FileText,
  CloudUpload,
  X,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const field =
  'w-full rounded-[10px] border border-surface-border bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 shadow-sm focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/15';

function Label({ children, htmlFor, required }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 flex items-center gap-0.5 text-sm font-medium text-slate-700">
      {children}
      {required && <span className="text-forest">*</span>}
    </label>
  );
}

function PageHeader({ title }) {
  const navigate = useNavigate();
  return (
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
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{title}</h1>
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
  );
}

const initialLegal = {
  businessName: '',
  regNumber: '',
  incorporationDate: '',
  businessType: 'Private Limited Company',
  registrationType: '',
  ownership: 'Private',
  gpsAddress: '',
  city: '',
  area: '',
  houseNumber: '',
  street: '',
  phoneLocal: '',
  tin: '',
  industry: 'Tech',
  annualTurnover: '',
  sourceOfFunds: '',
  licenseRequired: false,
};

const initialDocs = {
  incorporation: { fileName: 'incorp_cert.pdf', sizeLabel: '2.4 MB', complete: true },
  registration: null,
  renewal: null,
  regulation: null,
};

const DOC_META = {
  incorporation: { label: 'Certificate of incorporation', uploadLabel: 'Certificate of Incorporation', icon: FileText },
  registration: { label: 'Certificate of registration', uploadLabel: 'Certificate of registration', icon: CloudUpload },
  renewal: { label: 'Annual renewal receipt', uploadLabel: 'Annual renewal receipt', icon: ListChecks },
  regulation: { label: 'Business regulation file', uploadLabel: 'Business regulation file', icon: Shield },
};

function StepProgress({ step }) {
  const pct = step === 1 ? 33 : step === 2 ? 66 : 100;
  return (
    <div className="mb-6">
      <div className="mb-1 flex items-center justify-between gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-forest transition-all duration-300" style={{ width: `${pct}%` }} />
        </div>
        <span className="shrink-0 text-xs font-semibold text-slate-500">
          Step {step} of 3
        </span>
      </div>
    </div>
  );
}

function LegalStep({ legal, setLegal, onBack, onNext }) {
  const update = (k) => (e) => setLegal((s) => ({ ...s, [k]: e.target.value }));
  const updateBool = (k) => (e) => setLegal((s) => ({ ...s, [k]: e.target.checked }));

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-900">Legal Information</h2>
        <p className="mt-1 text-sm text-slate-500">Ensure all legal names match your registration documents.</p>
      </div>
      <StepProgress step={1} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="biz-name" required>
            Business name
          </Label>
          <input
            id="biz-name"
            className={field}
            placeholder="e.g. Dexwin Ltd"
            value={legal.businessName}
            onChange={update('businessName')}
          />
        </div>
        <div>
          <Label htmlFor="reg-no" required>
            Registration number
          </Label>
          <input
            id="reg-no"
            className={field}
            placeholder="CRN-9023412"
            value={legal.regNumber}
            onChange={update('regNumber')}
          />
        </div>
        <div>
          <Label htmlFor="inc-date" required>
            Incorporation date
          </Label>
          <input
            id="inc-date"
            type="date"
            className={field}
            value={legal.incorporationDate}
            onChange={update('incorporationDate')}
          />
        </div>
        <div>
          <Label htmlFor="biz-type" required>
            Business type
          </Label>
          <select id="biz-type" className={field} value={legal.businessType} onChange={update('businessType')}>
            <option value="Private Limited Company">Private Limited Company</option>
            <option value="Public Limited Company">Public Limited Company</option>
            <option value="Sole Proprietorship">Sole Proprietorship</option>
            <option value="Partnership">Partnership</option>
          </select>
        </div>
        <div>
          <Label htmlFor="reg-type" required>
            Registration type
          </Label>
          <select id="reg-type" className={field} value={legal.registrationType} onChange={update('registrationType')}>
            <option value="">Select type</option>
            <option value="Limited by shares">Limited by shares</option>
            <option value="Limited by guarantee">Limited by guarantee</option>
            <option value="Unlimited">Unlimited</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <p className="mb-2 text-sm font-medium text-slate-700">Ownership type</p>
          <div className="flex flex-wrap gap-4">
            {['Private', 'Public'].map((v) => (
              <label key={v} className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                <input
                  type="radio"
                  name="ownership"
                  checked={legal.ownership === v}
                  onChange={() => setLegal((s) => ({ ...s, ownership: v }))}
                  className="h-4 w-4 border-surface-border text-forest focus:ring-forest/30"
                />
                {v}
              </label>
            ))}
          </div>
        </div>
        <div>
          <Label htmlFor="gps" required>
            Ghana GPS address
          </Label>
          <input
            id="gps"
            className={field}
            placeholder="e.g. GA-423-1123"
            value={legal.gpsAddress}
            onChange={update('gpsAddress')}
          />
        </div>
        <div>
          <Label htmlFor="city" required>
            City
          </Label>
          <input id="city" className={field} placeholder="e.g. Accra" value={legal.city} onChange={update('city')} />
        </div>
        <div>
          <Label htmlFor="area" required>
            Area
          </Label>
          <input id="area" className={field} placeholder="e.g. Achimota" value={legal.area} onChange={update('area')} />
        </div>
        <div>
          <Label htmlFor="house" required>
            House number
          </Label>
          <input
            id="house"
            className={field}
            placeholder="e.g. H456"
            value={legal.houseNumber}
            onChange={update('houseNumber')}
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="street" required>
            Street
          </Label>
          <input
            id="street"
            className={field}
            placeholder="e.g. Achimota Street"
            value={legal.street}
            onChange={update('street')}
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="phone" required>
            Phone number
          </Label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="flex shrink-0 items-center gap-2 rounded-[10px] border border-surface-border bg-surface-page px-3 py-2.5 text-sm text-slate-600">
              <span className="text-lg leading-none" aria-hidden>
                🇬🇭
              </span>
              <span className="font-medium">GH (+233)</span>
            </div>
            <input
              id="phone"
              className={field}
              placeholder="000 000 000"
              value={legal.phoneLocal}
              onChange={update('phoneLocal')}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="tin" required>
            TIN
          </Label>
          <input id="tin" className={field} placeholder="e.g. 0001234567" value={legal.tin} onChange={update('tin')} />
        </div>
        <div>
          <Label htmlFor="industry" required>
            Industry / Sector
          </Label>
          <select id="industry" className={field} value={legal.industry} onChange={update('industry')}>
            <option value="Tech">Tech</option>
            <option value="Finance">Finance</option>
            <option value="Retail">Retail</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Services">Services</option>
          </select>
        </div>
        <div>
          <Label htmlFor="turnover" required>
            Annual turnover (GHS)
          </Label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-500">₵</span>
            <input
              id="turnover"
              className={`${field} pl-8`}
              placeholder="0.00"
              value={legal.annualTurnover}
              onChange={update('annualTurnover')}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="sof" required>
            Source of funds
          </Label>
          <select id="sof" className={field} value={legal.sourceOfFunds} onChange={update('sourceOfFunds')}>
            <option value="">Select source</option>
            <option value="Business proceeds">Business proceeds</option>
            <option value="Remittances">Remittances</option>
            <option value="Investments">Investments</option>
            <option value="Loans">Loans</option>
          </select>
        </div>
        <div className="sm:col-span-2 flex items-center justify-between gap-4 rounded-[10px] border border-surface-border bg-surface-page px-4 py-3">
          <div>
            <p className="text-sm font-medium text-slate-800">License required</p>
            <p className="text-xs text-slate-500">Does your business require a regulatory license?</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={legal.licenseRequired}
            onClick={() => setLegal((s) => ({ ...s, licenseRequired: !s.licenseRequired }))}
            className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${legal.licenseRequired ? 'bg-forest' : 'bg-slate-200'}`}
          >
            <span
              className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${legal.licenseRequired ? 'left-5' : 'left-0.5'}`}
            />
          </button>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-end gap-3 border-t border-surface-border pt-6">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full border border-surface-border bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-surface-page"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-forest-dark"
        >
          Save & continue
        </button>
      </div>
    </div>
  );
}

function DocRow({ docKey, doc, onPick, onClear }) {
  const meta = DOC_META[docKey];
  const Icon = meta.icon;
  const inputRef = useRef(null);
  const complete = doc?.complete;

  if (complete) {
    return (
      <div className="rounded-xl border border-surface-border bg-white p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
            <FileText size={20} strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-800">
              {doc.fileName}
              <span className="font-normal text-slate-400"> · {doc.sizeLabel}</span>
            </p>
            <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-forest">
              <Check size={14} strokeWidth={2.5} />
              Complete
            </div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-full rounded-full bg-forest" />
            </div>
          </div>
          <button
            type="button"
            onClick={() => onClear(docKey)}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-red-600"
            aria-label="Remove file"
          >
            <Trash2 size={18} strokeWidth={1.75} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 px-4 py-10 text-center transition-colors hover:border-forest/40 hover:bg-emerald-50/30"
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onPick(docKey, f);
          e.target.value = '';
        }}
      />
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm ring-1 ring-surface-border">
        <Icon size={22} strokeWidth={1.5} />
      </div>
      <p className="text-sm font-medium text-slate-800">
        {meta.uploadLabel}
        <span className="text-forest"> *</span>
      </p>
      <p className="text-xs text-slate-500">Click to upload or drag and drop</p>
    </button>
  );
}

function DocumentsStep({ docs, setDocs, onBack, onNext }) {
  const setFile = (key, file) => {
    const mb = (file.size / (1024 * 1024)).toFixed(1);
    setDocs((d) => ({
      ...d,
      [key]: { fileName: file.name, sizeLabel: `${mb} MB`, complete: true },
    }));
  };
  const clearFile = (key) => setDocs((d) => ({ ...d, [key]: null }));

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-900">Business Documents</h2>
        <p className="mt-1 text-sm text-slate-500">Accepted formats: PDF, JPG, PNG. Max 10 MB per file.</p>
      </div>
      <StepProgress step={2} />

      <div className="space-y-4">
        <DocRow docKey="incorporation" doc={docs.incorporation} onPick={setFile} onClear={clearFile} />
        <DocRow docKey="registration" doc={docs.registration} onPick={setFile} onClear={clearFile} />
        <DocRow docKey="renewal" doc={docs.renewal} onPick={setFile} onClear={clearFile} />
        <DocRow docKey="regulation" doc={docs.regulation} onPick={setFile} onClear={clearFile} />
      </div>

      <div className="mt-8 flex flex-wrap justify-end gap-3 border-t border-surface-border pt-6">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full border border-surface-border bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-surface-page"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-forest-dark"
        >
          Save & continue
        </button>
      </div>
    </div>
  );
}

function ReviewRow({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-surface-border py-3 last:border-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
      <span className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</span>
      <span className="text-sm font-semibold text-slate-800 sm:text-right">{value || '—'}</span>
    </div>
  );
}

function ReviewStep({ legal, docs, onBack, onEditLegal, onEditDocs, onSubmit, confirm, setConfirm }) {
  const docKeys = ['incorporation', 'registration', 'renewal', 'regulation'];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-900">Final Review</h2>
        <p className="mt-1 text-sm text-slate-500">
          Please verify all information provided below before submitting your application. Once submitted, your profile will be locked for verification.
        </p>
      </div>
      <StepProgress step={3} />

      <div className="space-y-4">
        <div className="rounded-xl border border-surface-border bg-white p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-slate-900">Business Details</h3>
            <button
              type="button"
              onClick={onEditLegal}
              className="inline-flex items-center gap-1.5 rounded-lg border border-surface-border bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 shadow-sm hover:bg-surface-page"
            >
              <Pencil size={13} strokeWidth={2} />
              Edit
            </button>
          </div>
          <ReviewRow label="Legal entity name" value={legal.businessName} />
          <ReviewRow label="Registration number" value={legal.regNumber} />
          <ReviewRow label="Incorporation date" value={legal.incorporationDate} />
          <ReviewRow label="Company type" value={legal.businessType} />
          <ReviewRow label="Phone number" value={`+233 ${legal.phoneLocal}`.trim()} />
          <ReviewRow label="Ownership structure" value={legal.ownership} />
          <ReviewRow label="Annual turnover (GHS)" value={legal.annualTurnover ? `₵ ${legal.annualTurnover}` : ''} />
          <ReviewRow label="Source of funds" value={legal.sourceOfFunds} />
          <ReviewRow label="Financial license" value={legal.licenseRequired ? 'Required' : 'Not required'} />
        </div>

        <div className="rounded-xl border border-surface-border bg-white p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-slate-900">Uploaded Documents</h3>
            <button
              type="button"
              onClick={onEditDocs}
              className="inline-flex items-center gap-1.5 rounded-lg border border-surface-border bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 shadow-sm hover:bg-surface-page"
            >
              <Pencil size={13} strokeWidth={2} />
              Edit
            </button>
          </div>
          <div className="divide-y divide-surface-border">
            {docKeys.map((k) => {
              const d = docs[k];
              if (!d?.complete) return null;
              return (
                <div key={k} className="flex items-center gap-3 py-3 first:pt-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                    <FileText size={18} strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium capitalize text-slate-500">{DOC_META[k].label}</p>
                    <p className="truncate text-sm font-medium text-slate-800">
                      {d.fileName}
                      <span className="font-normal text-slate-400"> · {d.sizeLabel}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-[10px] border border-surface-border bg-surface-page/50 px-4 py-3">
        <input
          type="checkbox"
          checked={confirm}
          onChange={(e) => setConfirm(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-surface-border text-forest focus:ring-forest/30"
        />
        <span className="text-sm leading-snug text-slate-600">
          I confirm that I have reviewed my information and that all details provided are accurate and valid.
        </span>
      </label>

      <div className="mt-8 flex flex-wrap justify-end gap-3 border-t border-surface-border pt-6">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full border border-surface-border bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-surface-page"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!confirm}
          className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-forest-dark disabled:cursor-not-allowed disabled:opacity-45"
        >
          Save & continue
        </button>
      </div>
    </div>
  );
}

function SuccessModal({ onClose, onViewSubmission }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-slate-900/45 backdrop-blur-[2px]" aria-label="Close" onClick={onClose} />
      <div
        className="relative w-full max-w-md rounded-2xl border border-surface-border bg-white p-6 shadow-2xl sm:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="kyc-success-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
          aria-label="Close"
        >
          <X size={18} />
        </button>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-forest">
          <CheckCircle2 size={28} strokeWidth={2} />
        </div>
        <h2 id="kyc-success-title" className="mt-4 text-lg font-bold text-slate-900 sm:text-xl">
          KYC submitted successfully
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Your application has been sent to Affinity Bank for compliance review. Payment processing will unlock automatically once your account is confirmed.
        </p>
        <div className="mt-8 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-surface-border bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm hover:bg-surface-page"
          >
            Done
          </button>
          <button
            type="button"
            onClick={onViewSubmission}
            className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-forest-dark"
          >
            View submission
          </button>
        </div>
      </div>
    </div>
  );
}

export default function KYCFlow() {
  const navigate = useNavigate();
  const { company, submitKycApplication, simulateKycVerified } = useAuth();
  const [phase, setPhase] = useState('intro');
  const [legal, setLegal] = useState(initialLegal);
  const [docs, setDocs] = useState(initialDocs);
  const [confirmAccurate, setConfirmAccurate] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  if (company?.kycStatus === 'Verified') {
    return (
      <div className="min-h-screen bg-surface-page">
        <PageHeader title="KYC Verification" />
        <div className="mx-auto max-w-lg px-4 py-10 sm:px-6">
          <div className="rounded-xl border border-surface-border bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-forest">
              <CheckCircle2 size={32} strokeWidth={2} />
            </div>
            <h2 className="mt-4 text-lg font-bold text-slate-900">KYC verified</h2>
            <p className="mt-2 text-sm text-slate-600">Your company is cleared for payroll payment processing through Affinity.</p>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="mt-6 rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white hover:bg-forest-dark"
            >
              Back to dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const submitted = company?.kycApplicationSubmitted && company?.kycStatus !== 'Verified';

  if (submitted && !successOpen) {
    return (
      <div className="min-h-screen bg-surface-page">
        <PageHeader title="KYC Verification" />
        <div className="mx-auto max-w-lg px-4 py-10 sm:px-6">
          <div className="rounded-xl border border-surface-border bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-700">
              <Clock size={30} strokeWidth={1.75} />
            </div>
            <h2 className="mt-4 text-lg font-bold text-slate-900">Under review</h2>
            <p className="mt-2 text-sm text-slate-600">
              Affinity Bank is reviewing your KYC submission. You will be notified when your account is confirmed.
            </p>
            <div className="mx-auto mt-6 flex w-full max-w-sm flex-col gap-3">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="w-full rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-forest-dark"
              >
                Back to dashboard
              </button>
              <button
                type="button"
                onClick={() => simulateKycVerified?.()}
                className="w-full rounded-full border border-surface-border bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm hover:bg-surface-page"
              >
                Simulate verified
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleReviewSubmit = () => {
    if (!confirmAccurate) return;
    submitKycApplication?.();
    setSuccessOpen(true);
  };

  const handleSuccessDone = () => {
    setSuccessOpen(false);
    navigate(-1);
  };

  const handleViewSubmission = () => {
    setSuccessOpen(false);
  };

  const intro = phase === 'intro';

  return (
    <div className="min-h-screen bg-surface-page">
      <PageHeader title="KYC Verification" />

      <div className={`mx-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-8 ${intro ? 'max-w-lg' : 'max-w-3xl'}`}>
        {intro ? (
          <div className="rounded-xl border border-surface-border bg-white p-8 text-center shadow-sm sm:p-10">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-surface-border bg-white text-slate-600">
              <Shield size={24} strokeWidth={1.5} />
            </div>
            <h2 className="mt-5 text-xl font-bold text-slate-900">Submit KYC</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Complete your KYC verification to enable payroll payment processing through Affinity. You can still prepare payroll runs while your account is being verified.
            </p>
            <ul className="mt-6 space-y-3 rounded-xl bg-slate-50 px-4 py-4 text-left text-sm">
              <li className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                <span className="text-slate-700">Takes approximately 10–15 minutes to complete</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-violet-500" />
                <span className="text-slate-700">Gather your Certificate of Incorporation & Registration</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-pink-500" />
                <span className="text-slate-700">Affinity review takes 1–3 business days</span>
              </li>
            </ul>
            <button
              type="button"
              onClick={() => setPhase('legal')}
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-forest-dark sm:w-auto sm:px-8"
            >
              <Plus size={18} strokeWidth={2} />
              Start KYC Verification
            </button>
          </div>
        ) : (
          <div className="rounded-xl border border-surface-border bg-white p-6 shadow-sm sm:p-8">
            {phase === 'legal' && (
              <LegalStep
                legal={legal}
                setLegal={setLegal}
                onBack={() => setPhase('intro')}
                onNext={() => setPhase('documents')}
              />
            )}
            {phase === 'documents' && (
              <DocumentsStep
                docs={docs}
                setDocs={setDocs}
                onBack={() => setPhase('legal')}
                onNext={() => setPhase('review')}
              />
            )}
            {phase === 'review' && (
              <ReviewStep
                legal={legal}
                docs={docs}
                confirm={confirmAccurate}
                setConfirm={setConfirmAccurate}
                onBack={() => setPhase('documents')}
                onEditLegal={() => setPhase('legal')}
                onEditDocs={() => setPhase('documents')}
                onSubmit={handleReviewSubmit}
              />
            )}
          </div>
        )}
      </div>

      {successOpen && (
        <SuccessModal
          onClose={handleSuccessDone}
          onViewSubmission={handleViewSubmission}
        />
      )}
    </div>
  );
}
