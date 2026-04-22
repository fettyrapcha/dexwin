import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Search, Building2, Users, Wallet, ChevronRight,
  CheckCircle, Clock, AlertCircle, X, ShieldCheck,
} from 'lucide-react';
import { clients as initialClients } from '../data/mockData';

const fmt = (n) =>
  `GH₵ ${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const industries = [
  'Technology', 'Energy & Utilities', 'Manufacturing', 'Logistics & Supply Chain',
  'Finance & Banking', 'Healthcare', 'Education', 'Retail', 'Agriculture', 'Other',
];

function StatusBadge({ status }) {
  if (status === 'Active')
    return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{status}</span>;
  if (status === 'Pending')
    return <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-100"><span className="h-1.5 w-1.5 rounded-full bg-amber-400" />{status}</span>;
  return <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{status}</span>;
}

function KycBadge({ status }) {
  if (status === 'Verified') return <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium"><CheckCircle size={12} /> Verified</span>;
  if (status === 'Pending') return <span className="flex items-center gap-1 text-xs text-amber-500 font-medium"><Clock size={12} /> KYC Pending</span>;
  return <span className="flex items-center gap-1 text-xs text-red-500 font-medium"><AlertCircle size={12} /> Not started</span>;
}

/* ─── Add Client modal ──────────────────────────────────────────────────── */

const emptyForm = { name: '', contactName: '', email: '', phone: '', tin: '', industry: 'Technology' };

function AddClientModal({ onClose, onAdd }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.contactName.trim()) e.contactName = 'Required';
    if (!form.email.trim()) e.email = 'Required';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onAdd({
      id: `CLT-${String(Date.now()).slice(-4)}`,
      ...form,
      status: 'Pending',
      kycStatus: 'Not Started',
      walletName: form.name,
      walletBalance: 0,
      employeeCount: 0,
      lastPayroll: null,
      createdAt: new Date().toISOString().slice(0, 10),
    });
    onClose();
  };

  const inputClass = (k) =>
    `w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-colors ${errors[k] ? 'border-red-300 bg-red-50' : 'border-surface-border bg-white'}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Building2 size={18} className="text-forest" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">New client</h2>
              <p className="text-xs text-slate-500 mt-0.5">Create a client profile to manage their payroll</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Company name <span className="text-red-400">*</span></label>
            <input className={inputClass('name')} placeholder="e.g. Volta River Authority" value={form.name} onChange={set('name')} />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Contact person <span className="text-red-400">*</span></label>
              <input className={inputClass('contactName')} placeholder="Full name" value={form.contactName} onChange={set('contactName')} />
              {errors.contactName && <p className="text-xs text-red-500 mt-1">{errors.contactName}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Industry</label>
              <select className={inputClass('')} value={form.industry} onChange={set('industry')}>
                {industries.map(i => <option key={i}>{i}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email <span className="text-red-400">*</span></label>
              <input className={inputClass('email')} type="email" placeholder="contact@company.com" value={form.email} onChange={set('email')} />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phone</label>
              <input className={inputClass('phone')} type="tel" placeholder="+233 24 000 0000" value={form.phone} onChange={set('phone')} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">TIN</label>
            <input className={inputClass('tin')} placeholder="C00..." value={form.tin} onChange={set('tin')} />
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs text-slate-500 flex items-start gap-2">
            <Wallet size={14} className="shrink-0 mt-0.5 text-slate-400" />
            A linked wallet will be created automatically using the company name.
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2.5 px-6 py-4 border-t border-slate-100 bg-slate-50/60">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 text-sm font-semibold text-white bg-forest hover:bg-forest-dark rounded-xl transition-colors">
            Create client
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Client card ───────────────────────────────────────────────────────── */

function ClientCard({ client, onClick }) {
  const initials = client.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();

  return (
    <div
      onClick={onClick}
      className="bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-md hover:border-slate-200 transition-all cursor-pointer group"
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-forest/10 flex items-center justify-center text-forest font-bold text-sm shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">{client.name}</p>
            <p className="text-xs text-slate-400 mt-0.5">{client.industry}</p>
          </div>
        </div>
        <StatusBadge status={client.status} />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 gap-3 mb-4">
        <div className="bg-slate-50 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Users size={11} className="text-slate-400" />
            <p className="text-xs text-slate-400">Employees</p>
          </div>
          <p className="text-sm font-bold text-slate-800">{client.employeeCount}</p>
        </div>
      </div>

      {/* Last payroll */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-50">
        {client.lastPayroll ? (
          <div>
            <p className="text-xs text-slate-400">Last payroll</p>
            <p className="text-xs font-semibold text-slate-700 mt-0.5">{client.lastPayroll.period} · {fmt(client.lastPayroll.amount)}</p>
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">No payroll runs yet</p>
        )}
        <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
      </div>
    </div>
  );
}

/* ─── Main Clients page ─────────────────────────────────────────────────── */

export default function Clients() {
  const navigate = useNavigate();
  const [clients, setClients] = useState(initialClients);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAdd, setShowAdd] = useState(false);

  const filtered = clients.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.contactName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: clients.length,
    active: clients.filter(c => c.status === 'Active').length,
    totalEmployees: clients.reduce((s, c) => s + c.employeeCount, 0),
    totalWallet: clients.reduce((s, c) => s + c.walletBalance, 0),
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-slate-900">Clients</h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage client companies and run payroll on their behalf</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 text-sm font-semibold text-white bg-forest hover:bg-forest-dark px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus size={16} /> New client
        </button>
      </div>

      <div className="p-6 space-y-5 max-w-7xl">
        {/* Summary stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total clients', value: stats.total, icon: Building2, color: 'bg-violet-50 text-violet-600' },
            { label: 'Active clients', value: stats.active, icon: CheckCircle, color: 'bg-emerald-50 text-emerald-600' },
            { label: 'Total employees', value: stats.totalEmployees, icon: Users, color: 'bg-sky-50 text-sky-600' },
            { label: 'Total wallet balance', value: fmt(stats.totalWallet), icon: Wallet, color: 'bg-amber-50 text-amber-600' },
          ].map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium text-slate-500">{s.label}</p>
                  <div className={`w-8 h-8 rounded-lg ${s.color} flex items-center justify-center`}>
                    <Icon size={15} />
                  </div>
                </div>
                <p className="text-xl font-bold text-slate-800">{s.value}</p>
              </div>
            );
          })}
        </div>

        {/* Search + filter */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search clients…"
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
            />
          </div>
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
            {['All', 'Active', 'Pending'].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${statusFilter === s ? 'bg-forest text-white' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Client grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <Building2 size={22} className="text-slate-300" />
            </div>
            <p className="text-sm font-medium text-slate-500">No clients found</p>
            <p className="text-xs text-slate-400 mt-1">Try a different search or add a new client</p>
            <button onClick={() => setShowAdd(true)} className="mt-4 text-xs font-semibold text-forest hover:underline flex items-center gap-1">
              <Plus size={12} /> Add first client
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(client => (
              <ClientCard
                key={client.id}
                client={client}
                onClick={() => navigate(`/clients/${client.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {showAdd && (
        <AddClientModal
          onClose={() => setShowAdd(false)}
          onAdd={c => setClients(prev => [c, ...prev])}
        />
      )}
    </div>
  );
}
