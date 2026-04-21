import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wallet as WalletIcon,
  ArrowRight,
  Bell,
  Copy,
  CheckCircle,
  Building2,
  Upload,
  MoreVertical,
  Activity,
  X,
  Info,
  Plus,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { company as mockCompany } from '../data/mockData';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { Input } from '../components/ui/Input';

const STORAGE_KEY = 'dexwin_wallet_ui';

const AFFINITY_ACCOUNT_RAW = '0123456789012345';
const AFFINITY_ACCOUNT_DISPLAY = '0123 4567 8901 2345';

const DEFAULT_MAIN = 234567;
const DEMO_PAYROLL_AFTER_ACTIVATE = 142500;
const DEFAULT_PROJECTED_PAYROLL = 135000;

function fmtGh(n) {
  return `GH₵ ${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fmtGhs(n) {
  return `GHS ${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function affinityDisplayName(name) {
  if (!name) return 'Dexwin Tech Ltd';
  return name.replace(/Technologies\s+Ltd\.?/i, 'Tech Ltd').trim();
}

function loadPersisted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      return {
        payrollActivated: Boolean(p.payrollActivated),
        mainBalance: typeof p.mainBalance === 'number' ? p.mainBalance : DEFAULT_MAIN,
        payrollBalance: typeof p.payrollBalance === 'number' ? p.payrollBalance : 0,
        payrollThreshold: typeof p.payrollThreshold === 'number' ? p.payrollThreshold : 5000,
      };
    }
  } catch {
    /* ignore */
  }
  return {
    payrollActivated: false,
    mainBalance: DEFAULT_MAIN,
    payrollBalance: 0,
    payrollThreshold: 5000,
  };
}

function writeWalletPersist(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

const RECENT_ACTIVITY = [
  { id: 1, title: 'Wallet Funding', meta: 'Oct 24, 2023 • 10:45 AM', amount: 50000, sign: '+', status: 'Completed' },
  { id: 2, title: 'Monthly Payroll Disbursement', meta: 'Oct 20, 2023 • 09:00 AM', amount: 128400, sign: '-', status: 'Completed' },
  { id: 3, title: 'Wallet Funding', meta: 'Oct 01, 2023 • 14:12 PM', amount: 50000, sign: '+', status: 'Completed' },
];

function MoveBalanceToPayrollModal({ open, onClose, mainBalance, payrollBalance, onConfirm }) {
  const [step, setStep] = useState(1);
  const [amountStr, setAmountStr] = useState('');

  useEffect(() => {
    if (open) {
      setStep(1);
      setAmountStr('');
    }
  }, [open]);

  if (!open) return null;

  const amount = parseFloat(String(amountStr).replace(/[^0-9.]/g, '')) || 0;
  const canReview = amount > 0 && amount <= mainBalance;

  const handleReview = () => {
    if (!canReview) return;
    setStep(2);
  };

  const handleConfirm = () => {
    if (!canReview) return;
    onConfirm(amount);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[85] flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-slate-900/45 backdrop-blur-[2px]" aria-label="Close" onClick={onClose} />
      <div
        className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-surface-border bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby={step === 1 ? 'move-balance-title' : 'confirm-transfer-title'}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 px-6 pt-6">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-surface-border bg-surface-page text-slate-600">
              <WalletIcon size={20} strokeWidth={1.75} />
            </div>
            <div className="min-w-0 pr-4">
              {step === 1 ? (
                <>
                  <h2 id="move-balance-title" className="text-lg font-bold text-slate-900">
                    Move balance to Payroll wallet
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Move funds from your main Affinity account into your payroll wallet.
                  </p>
                </>
              ) : (
                <>
                  <h2 id="confirm-transfer-title" className="text-lg font-bold text-slate-900">
                    Confirm transfer
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">Review the details before moving funds.</p>
                </>
              )}
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
          {step === 1 ? (
            <>
              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1 rounded-xl border border-surface-border bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold text-slate-600">From: Main account</p>
                  <p className="mt-2 text-lg font-bold text-slate-900">{fmtGhs(mainBalance)}</p>
                  <div className="mt-3 border-t border-slate-100 pt-2">
                    <p className="text-xs text-slate-400">Available balance</p>
                  </div>
                </div>
                <div className="flex shrink-0 justify-center py-1 sm:py-0">
                  <ArrowRight className="rotate-90 text-slate-400 sm:rotate-0" size={22} strokeWidth={1.75} aria-hidden />
                </div>
                <div className="min-w-0 flex-1 rounded-xl border border-emerald-200 bg-[#E6F4EA]/90 p-4 shadow-sm">
                  <p className="text-xs font-semibold text-slate-600">To: Payroll wallet</p>
                  <p className="mt-2 text-lg font-bold text-slate-900">{fmtGhs(payrollBalance)}</p>
                  <div className="mt-3 border-t border-emerald-200/80 pt-2">
                    <p className="text-xs text-slate-500">Current balance</p>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <label htmlFor="transfer-amount" className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Amount to transfer
                </label>
                <input
                  id="transfer-amount"
                  className="w-full rounded-xl border border-surface-border bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/15"
                  value={amountStr}
                  onChange={(e) => setAmountStr(e.target.value)}
                  placeholder="GHS 0.00"
                  inputMode="decimal"
                />
                {!canReview && amountStr.trim() !== '' && (
                  <p className="mt-1.5 text-xs text-red-600">Enter an amount greater than 0 and not more than your available balance.</p>
                )}
              </div>

              <div className="mt-5 flex gap-2 rounded-xl border border-emerald-100 bg-emerald-50/90 px-3 py-3">
                <Info size={16} className="mt-0.5 shrink-0 text-forest" strokeWidth={2} />
                <p className="text-xs leading-relaxed text-emerald-900">
                  Transfers between your accounts are instant. The payroll wallet balance will update immediately.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1 rounded-xl border border-surface-border bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold text-slate-600">From: Main account</p>
                  <p className="mt-2 text-lg font-bold text-slate-900">{fmtGhs(mainBalance)}</p>
                  <div className="mt-3 border-t border-slate-100 pt-2">
                    <p className="text-xs text-slate-400">Available balance</p>
                  </div>
                </div>
                <div className="flex shrink-0 justify-center py-1 sm:py-0">
                  <ArrowRight className="rotate-90 text-slate-400 sm:rotate-0" size={22} strokeWidth={1.75} aria-hidden />
                </div>
                <div className="min-w-0 flex-1 rounded-xl border border-emerald-200 bg-[#E6F4EA]/90 p-4 shadow-sm">
                  <p className="text-xs font-semibold text-slate-600">To: Payroll wallet</p>
                  <p className="mt-2 text-lg font-bold text-slate-900">{fmtGhs(payrollBalance)}</p>
                  <div className="mt-3 border-t border-emerald-200/80 pt-2">
                    <p className="text-xs text-slate-500">Current balance</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between gap-4 border-t border-surface-border pt-5">
                <span className="text-sm font-medium text-slate-900">You are transferring</span>
                <span className="text-base font-bold text-forest">{fmtGhs(amount)}</span>
              </div>
            </>
          )}
        </div>

        <div className="flex shrink-0 gap-3 border-t border-surface-border px-6 py-4">
          {step === 1 ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="min-h-[48px] flex-1 rounded-full border border-surface-border bg-white py-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-surface-page"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReview}
                disabled={!canReview}
                className="min-h-[48px] flex-1 rounded-full bg-forest py-3 text-sm font-semibold text-white shadow-sm hover:bg-forest-dark disabled:cursor-not-allowed disabled:opacity-45"
              >
                Review transfer
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="min-h-[48px] flex-1 rounded-full border border-surface-border bg-white py-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-surface-page"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="min-h-[48px] flex-1 rounded-full bg-forest py-3 text-sm font-semibold text-white shadow-sm hover:bg-forest-dark"
              >
                Confirm transfer
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ToggleDesignatePayroll({ activated, onRequestActivate }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={activated}
      onClick={() => {
        if (!activated) onRequestActivate();
      }}
      className={`flex w-full items-center justify-between gap-4 rounded-xl border border-surface-border bg-white px-4 py-3 text-left transition-colors ${
        activated ? 'cursor-default' : 'cursor-pointer hover:bg-slate-50/80'
      }`}
    >
      <span className="text-sm font-medium text-slate-700">Designate this account as my payroll wallet.</span>
      <span
        className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors ${
          activated ? 'bg-forest' : 'bg-slate-200'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
            activated ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </span>
    </button>
  );
}

function ActivatePayrollWalletModal({ open, onClose, sourceName, currentBalanceGhs, initialThreshold, onActivate }) {
  const [thresholdInput, setThresholdInput] = useState(String(initialThreshold));

  useEffect(() => {
    if (open) setThresholdInput(String(initialThreshold));
  }, [open, initialThreshold]);

  if (!open) return null;

  const num = () => parseFloat(String(thresholdInput).replace(/[^0-9.]/g, '')) || 0;

  return (
    <div className="fixed inset-0 z-[85] flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-slate-900/45 backdrop-blur-[2px]" aria-label="Close" onClick={onClose} />
      <div
        className="relative flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-surface-border bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="activate-wallet-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 px-6 pt-6">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-surface-border bg-surface-page text-slate-600">
              <WalletIcon size={20} strokeWidth={1.75} />
            </div>
            <h2 id="activate-wallet-title" className="pt-1 text-lg font-bold text-slate-900">
              Activate payroll wallet
            </h2>
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
          <div className="relative rounded-xl border border-surface-border bg-slate-50/80 p-4">
            <button type="button" className="absolute right-3 top-3 text-slate-400 hover:text-slate-600" aria-label="Info">
              <Info size={16} strokeWidth={2} />
            </button>
            <p className="text-xs font-semibold text-slate-500">Source Account</p>
            <p className="mt-1 text-sm font-bold text-slate-900">{sourceName}</p>
          </div>

          <div className="mt-4 rounded-xl border border-surface-border bg-white p-4">
            <p className="text-xs font-semibold text-slate-500">Current Balance</p>
            <p className="mt-1 text-lg font-bold text-forest">{fmtGhs(currentBalanceGhs)}</p>
          </div>

          <div className="mt-4">
            <label htmlFor="payroll-threshold" className="mb-1.5 block text-xs font-semibold text-slate-700">
              Low-balance alert — Payroll Wallet
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
                GHS
              </span>
              <input
                id="payroll-threshold"
                className="w-full rounded-xl border border-surface-border bg-white py-2.5 pl-14 pr-3 text-sm font-medium text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/15"
                value={thresholdInput}
                onChange={(e) => setThresholdInput(e.target.value)}
                placeholder="0.00"
                inputMode="decimal"
              />
            </div>
          </div>

          <div className="mt-4 flex gap-2 rounded-xl border border-emerald-100 bg-emerald-50/90 px-3 py-3">
            <Bell size={16} className="mt-0.5 shrink-0 text-forest" strokeWidth={2} />
            <p className="text-xs leading-relaxed text-emerald-900">Alerts are sent via dashboard notification and email.</p>
          </div>
        </div>

        <div className="flex shrink-0 gap-3 border-t border-surface-border px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[48px] flex-1 rounded-full border border-surface-border bg-white py-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-surface-page"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onActivate(num())}
            className="min-h-[48px] flex-1 rounded-full bg-forest py-3 text-sm font-semibold text-white shadow-sm hover:bg-forest-dark"
          >
            Activate payroll wallet
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Wallet() {
  const navigate = useNavigate();
  const { company: authCompany } = useAuth();
  const kycVerified = authCompany?.kycStatus === 'Verified';
  const persisted = loadPersisted();

  const [payrollActivated, setPayrollActivated] = useState(persisted.payrollActivated);
  const [mainBalance, setMainBalance] = useState(persisted.mainBalance);
  const [payrollBalance, setPayrollBalance] = useState(persisted.payrollBalance);
  const [payrollThreshold, setPayrollThreshold] = useState(persisted.payrollThreshold);

  const [showActivate, setShowActivate] = useState(false);
  const [showFund, setShowFund] = useState(false);
  const [showMove, setShowMove] = useState(false);
  const [showThreshold, setShowThreshold] = useState(false);
  const [copied, setCopied] = useState(false);

  const persist = useCallback(() => {
    writeWalletPersist({
      payrollActivated,
      mainBalance,
      payrollBalance,
      payrollThreshold,
    });
  }, [payrollActivated, mainBalance, payrollBalance, payrollThreshold]);

  useEffect(() => {
    persist();
  }, [persist]);

  const accountLegalName = affinityDisplayName(authCompany?.name || mockCompany.name);

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(AFFINITY_ACCOUNT_RAW);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openActivate = () => setShowActivate(true);

  const handleActivateConfirm = (thresholdAmt) => {
    setPayrollThreshold(thresholdAmt > 0 ? thresholdAmt : 5000);
    setPayrollBalance(DEMO_PAYROLL_AFTER_ACTIVATE);
    setPayrollActivated(true);
    setShowActivate(false);
  };

  const bankAcct = `${AFFINITY_ACCOUNT_RAW.slice(0, 10)}… (${mockCompany.name})`;

  return (
    <div className="min-h-full bg-surface-page">
      <PageHeader
        title="Wallets"
        subtitle={
          kycVerified
            ? 'Manage your Affinity account, fund your payroll wallet, and monitor balances.'
            : 'Complete KYC verification to unlock your Affinity wallet and payroll funding.'
        }
        actions={
          kycVerified ? (
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-[10px] border border-surface-border bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition-colors hover:bg-surface-page"
            >
              <Upload size={16} strokeWidth={1.75} />
              Export Report
            </button>
          ) : null
        }
      />

      {!kycVerified ? (
        <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
          <div className="flex justify-center">
            <div className="w-full max-w-lg rounded-2xl border border-surface-border bg-white px-8 py-12 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[10px] border border-amber-100 bg-amber-50 text-amber-700">
                <ShieldCheck size={28} strokeWidth={1.75} />
              </div>
              <h2 className="mt-5 text-lg font-bold text-slate-900">Verify your organisation to use wallets</h2>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-600">
                Affinity account details, balances, and payroll wallet features are available after KYC is completed and approved.
              </p>
              <button
                type="button"
                onClick={() => navigate('/settings/kyc')}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-forest-dark"
              >
                Complete KYC
                <ArrowRight size={18} strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
      <ActivatePayrollWalletModal
        open={showActivate}
        onClose={() => setShowActivate(false)}
        sourceName={accountLegalName}
        currentBalanceGhs={mainBalance}
        initialThreshold={payrollThreshold}
        onActivate={handleActivateConfirm}
      />

      <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Affinity business account */}
        <div className="overflow-hidden rounded-2xl border border-surface-border bg-white shadow-sm">
          <div className="grid gap-6 p-6 lg:grid-cols-2 lg:items-stretch lg:gap-8 lg:p-8">
            <div className="min-w-0 space-y-5">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-forest">
                  <Building2 size={22} strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Affinity Business Account</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="font-mono text-lg font-bold tracking-wide text-slate-900 sm:text-xl">{AFFINITY_ACCOUNT_DISPLAY}</span>
                    <button
                      type="button"
                      onClick={handleCopyAccount}
                      className="inline-flex items-center gap-1 rounded-lg border border-surface-border px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-surface-page"
                    >
                      {copied ? <CheckCircle size={14} className="text-forest" /> : <Copy size={14} />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-medium text-slate-500">Account Name</p>
                      <p className="mt-0.5 text-sm font-semibold text-slate-900">{accountLegalName}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500">Bank</p>
                      <p className="mt-0.5 text-sm font-semibold text-slate-900">Affinity Bank Ghana</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex min-h-[140px] flex-col justify-between gap-4">
              <div className="relative flex-1 overflow-hidden rounded-2xl bg-forest px-6 py-6 text-white shadow-inner">
                <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10" />
                <div className="pointer-events-none absolute -bottom-10 right-10 h-36 w-36 rounded-full bg-white/5" />
                <p className="relative text-xs font-medium text-white/80">Main account balance</p>
                <p className="relative mt-2 text-3xl font-bold tracking-tight">{fmtGh(mainBalance)}</p>
              </div>
              <ToggleDesignatePayroll activated={payrollActivated} onRequestActivate={openActivate} />
            </div>
          </div>
        </div>

        {!payrollActivated ? (
          <div className="flex justify-center">
            <div className="w-full max-w-lg rounded-2xl border border-surface-border bg-white px-8 py-12 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[10px] border border-surface-border bg-surface-page text-slate-400">
                <WalletIcon size={28} strokeWidth={1.5} />
              </div>
              <h2 className="mt-5 text-lg font-bold text-slate-900">No payroll wallet activation</h2>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-600">
                Designate your Affinity account as a payroll wallet to enable salary disbursements.
              </p>
              <button
                type="button"
                onClick={openActivate}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-forest-dark"
              >
                Activate payroll wallet
                <ArrowRight size={18} strokeWidth={2} />
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="overflow-hidden rounded-2xl border border-surface-border bg-white shadow-sm">
                <div className="flex items-start justify-between gap-3 border-b border-surface-border px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-forest">
                      <WalletIcon size={18} strokeWidth={1.75} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">Payroll Wallet Balance</h3>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowThreshold(true)}
                      className="rounded-full border border-surface-border bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-surface-page"
                    >
                      Update threshold
                    </button>
                    <button
                      type="button"
                      className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                      aria-label="More options"
                    >
                      <MoreVertical size={18} strokeWidth={2} />
                    </button>
                  </div>
                </div>
                <div className="px-5 py-6">
                  <p className="text-3xl font-bold tracking-tight text-slate-900">{fmtGhs(payrollBalance)}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                    <span className="font-medium">Low-balance alert:</span>
                    <span className="font-semibold text-slate-800">{fmtGhs(payrollThreshold)}</span>
                    <button
                      type="button"
                      onClick={() => setShowThreshold(true)}
                      className="font-semibold text-forest hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  {payrollBalance < payrollThreshold && (
                    <p className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-amber-700">
                      <Bell size={12} /> Below your alert threshold
                    </p>
                  )}
                </div>
                <div className="flex justify-end border-t border-surface-border px-5 py-4">
                  <button
                    type="button"
                    onClick={() => setShowMove(true)}
                    className="inline-flex items-center gap-2 rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-forest-dark"
                  >
                    <Plus size={18} strokeWidth={2} />
                    Top up wallet
                  </button>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-surface-border bg-white shadow-sm">
                <div className="flex items-center gap-2 border-b border-surface-border px-5 py-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-forest">
                    <Activity size={18} strokeWidth={1.75} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Projected next payroll</h3>
                </div>
                <div className="px-5 py-8">
                  <p className="text-3xl font-bold tracking-tight text-slate-900">{fmtGhs(DEFAULT_PROJECTED_PAYROLL)}</p>
                  <p className="mt-3 text-sm font-medium text-slate-500">April, 2026</p>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-surface-border bg-white shadow-sm">
              <div className="flex flex-col gap-3 border-b border-surface-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-sm font-bold text-slate-900">Recent wallet activity</h3>
                <button
                  type="button"
                  onClick={() => navigate('/transactions')}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-forest hover:underline"
                >
                  View all transactions
                  <ChevronRight size={16} strokeWidth={2} />
                </button>
              </div>
              <ul className="divide-y divide-slate-100">
                {RECENT_ACTIVITY.map((row) => (
                  <li key={row.id} className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{row.title}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{row.meta}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 sm:justify-end">
                      <span
                        className={`text-sm font-bold ${row.sign === '+' ? 'text-forest' : 'text-slate-800'}`}
                      >{`${row.sign} ${fmtGhs(row.amount)}`}</span>
                      <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-forest ring-1 ring-emerald-100">
                        {row.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-surface-border bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-800">Fund main account</h3>
              <p className="mt-1 text-xs text-slate-500">
                Transfer to your Affinity virtual account. Balance updates when funds are received.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl bg-surface-page p-4">
                <p className="min-w-0 flex-1 font-mono text-sm font-semibold text-slate-800">{bankAcct}</p>
                <Button variant="secondary" size="sm" onClick={() => setShowFund(true)}>
                  View instructions
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      <Modal open={showFund} onClose={() => setShowFund(false)} title="Fund Account">
        <p className="text-sm text-slate-600">
          To fund your Affinity account, make a bank transfer to:
          <br />
          <strong className="text-slate-800">{bankAcct}</strong>
        </p>
        <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/80 p-4 text-xs text-emerald-900">
          Your balance updates automatically once the transfer is received by Affinity.
        </div>
        <div className="mt-4 flex justify-end border-t border-slate-100 pt-4">
          <Button variant="secondary" onClick={() => setShowFund(false)}>
            Close
          </Button>
        </div>
      </Modal>

      <MoveBalanceToPayrollModal
        open={showMove}
        onClose={() => setShowMove(false)}
        mainBalance={mainBalance}
        payrollBalance={payrollBalance}
        onConfirm={(amt) => {
          setMainBalance((b) => b - amt);
          setPayrollBalance((b) => b + amt);
        }}
      />

      <Modal open={showThreshold} onClose={() => setShowThreshold(false)} title="Payroll wallet — low balance alert">
        <p className="mb-4 text-xs text-slate-500">You&apos;ll receive an alert when the payroll wallet balance falls at or below this amount.</p>
        <Input
          label="Threshold (GHS)"
          type="number"
          value={payrollThreshold}
          onChange={(e) => setPayrollThreshold(Number(e.target.value))}
        />
        <div className="mt-4 flex justify-end gap-2 border-t border-slate-100 pt-4">
          <Button variant="secondary" onClick={() => setShowThreshold(false)}>
            Cancel
          </Button>
          <Button variant="primary" className="!bg-forest hover:!bg-forest-dark" onClick={() => setShowThreshold(false)}>
            Save
          </Button>
        </div>
      </Modal>
        </>
      )}
    </div>
  );
}
