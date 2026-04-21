import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Building2, Users, Wallet, CheckCircle, Clock,
  AlertCircle, Pencil, Play, ChevronRight, Mail, Phone,
  FileText, Shield, Plus, X, Zap, ShieldCheck, DollarSign,
} from 'lucide-react';
import { clients, clientEmployees } from '../data/mockData';

const fmt = (n) =>
  `GH₵ ${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function calcNet(emp) {
  const tier1 = emp.grossSalary * (emp.tier1 / 100);
  const tier2 = emp.grossSalary * (emp.tier2 / 100);
  const net = emp.grossSalary - tier1 - tier2 - (emp.paye || 0) + (emp.bonus || 0) + (emp.allowances || 0);
  return net;
}

function StatusBadge({ status }) {
  if (status === 'Active')
    return <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{status}</span>;
  if (status === 'Pending')
    return <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-100"><span className="h-1.5 w-1.5 rounded-full bg-amber-400" />{status}</span>;
  return <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{status}</span>;
}

/* ─── Edit client modal ─────────────────────────────────────────────────── */

function EditClientModal({ client, onClose, onSave }) {
  const [form, setForm] = useState({
    name: client.name,
    contactName: client.contactName,
    email: client.email,
    phone: client.phone,
    tin: client.tin,
    industry: client.industry,
  });
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const inputClass = 'w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-colors bg-white';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Edit client profile</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"><X size={18} /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Company name</label>
            <input className={inputClass} value={form.name} onChange={set('name')} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Contact person</label>
              <input className={inputClass} value={form.contactName} onChange={set('contactName')} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Industry</label>
              <input className={inputClass} value={form.industry} onChange={set('industry')} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email</label>
              <input className={inputClass} type="email" value={form.email} onChange={set('email')} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phone</label>
              <input className={inputClass} type="tel" value={form.phone} onChange={set('phone')} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">TIN</label>
            <input className={inputClass} value={form.tin} onChange={set('tin')} />
          </div>
        </div>
        <div className="flex justify-end gap-2.5 px-6 py-4 border-t border-slate-100 bg-slate-50/60">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">Cancel</button>
          <button onClick={() => { onSave(form); onClose(); }} className="px-4 py-2 text-sm font-semibold text-white bg-forest hover:bg-forest-dark rounded-xl transition-colors">Save changes</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Run Payroll modal ─────────────────────────────────────────────────── */

function RunPayrollModal({ client, employees, onClose }) {
  const [confirmed, setConfirmed] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  const totals = employees.reduce((acc, e) => {
    const net = calcNet(e);
    return { gross: acc.gross + e.grossSalary, net: acc.net + net };
  }, { gross: 0, net: 0 });

  const handleRun = () => {
    setProcessing(true);
    setTimeout(() => { setProcessing(false); setDone(true); }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={!processing ? onClose : undefined} />
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
        {done ? (
          <div className="flex flex-col items-center text-center py-10 px-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
              <CheckCircle size={28} className="text-forest" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Payroll processed!</h3>
            <p className="text-sm text-slate-500 mb-1">Successfully disbursed {fmt(totals.net)} to {employees.length} employees.</p>
            <p className="text-xs text-slate-400 mb-6">Client: {client.name}</p>
            <button onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-white bg-forest hover:bg-forest-dark rounded-xl transition-colors">Done</button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-forest/10 flex items-center justify-center">
                  <Zap size={16} className="text-forest" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Run payroll</h2>
                  <p className="text-xs text-slate-400 mt-0.5">{client.name}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"><X size={18} /></button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div className="bg-slate-50 rounded-2xl p-4 space-y-2.5">
                {[
                  { label: 'Pay period', value: 'April 2026' },
                  { label: 'Employees', value: employees.length },
                  { label: 'Total gross', value: fmt(totals.gross) },
                  { label: 'Total net (disbursement)', value: fmt(totals.net) },
                ].map(r => (
                  <div key={r.label} className="flex justify-between">
                    <p className="text-xs text-slate-400">{r.label}</p>
                    <p className="text-xs font-semibold text-slate-800">{r.value}</p>
                  </div>
                ))}
                <div className="pt-2 border-t border-slate-100 flex justify-between">
                  <p className="text-sm font-semibold text-slate-700">Wallet balance after</p>
                  <p className="text-sm font-bold text-forest">{fmt(client.walletBalance - totals.net)}</p>
                </div>
              </div>

              {client.kycStatus !== 'Verified' && (
                <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-700">
                  <AlertCircle size={13} className="shrink-0 mt-0.5 text-amber-500" />
                  KYC is not verified. Payroll can be prepared but actual disbursement requires a verified Affinity account.
                </div>
              )}

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} className="accent-forest w-4 h-4" />
                <span className="text-xs text-slate-600 font-medium">I confirm authorisation to process this payroll run for {client.name}</span>
              </label>
            </div>

            <div className="flex justify-end gap-2.5 px-6 py-4 border-t border-slate-100 bg-slate-50/60">
              <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">Cancel</button>
              <button
                disabled={!confirmed || processing}
                onClick={handleRun}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-forest hover:bg-forest-dark rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? <><span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Processing…</> : <><Play size={13} /> Process payroll</>}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Main Client Profile ───────────────────────────────────────────────── */

const TABS = ['Overview', 'Employees', 'Payroll'];

export default function ClientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [clientData, setClientData] = useState(() => clients.find(c => c.id === id) || null);
  const [employees] = useState(clientEmployees[id] || []);
  const [tab, setTab] = useState('Overview');
  const [showEdit, setShowEdit] = useState(false);
  const [showPayroll, setShowPayroll] = useState(false);

  if (!clientData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-slate-500 text-sm">Client not found.</p>
        <button onClick={() => navigate('/clients')} className="text-forest text-sm font-semibold hover:underline flex items-center gap-1"><ArrowLeft size={14} /> Back to clients</button>
      </div>
    );
  }

  const initials = clientData.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  const totalGross = employees.reduce((s, e) => s + e.grossSalary, 0);
  const totalNet = employees.reduce((s, e) => s + calcNet(e), 0);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/clients')} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors">
              <ArrowLeft size={16} /> Clients
            </button>
            <span className="text-slate-200">/</span>
            <p className="text-sm font-semibold text-slate-800 truncate max-w-xs">{clientData.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowEdit(true)} className="flex items-center gap-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-2 rounded-xl transition-colors">
              <Pencil size={13} /> Edit
            </button>
            <button onClick={() => setShowPayroll(true)} className="flex items-center gap-2 text-sm font-semibold text-white bg-forest hover:bg-forest-dark px-4 py-2 rounded-xl transition-colors">
              <Zap size={14} /> Run payroll
            </button>
          </div>
        </div>
      </div>

      {/* Hero card */}
      <div className="px-6 pt-6 pb-0 max-w-6xl">
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden mb-5">
          {/* Green banner */}
          <div className="relative h-20 bg-gradient-to-r from-forest to-emerald-500 overflow-hidden">
            <div className="absolute -top-4 -right-4 w-32 h-32 rounded-full bg-white/10" />
            <div className="absolute -bottom-8 left-1/3 w-40 h-40 rounded-full bg-white/5" />
          </div>

          <div className="px-6 pb-5">
            {/* Avatar overlapping banner */}
            <div className="flex items-end justify-between -mt-6 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-white border-4 border-white shadow-md flex items-center justify-center text-forest font-bold text-lg">
                {initials}
              </div>
              <StatusBadge status={clientData.status} />
            </div>

            <div className="flex items-start justify-between gap-6">
              <div>
                <h1 className="text-xl font-bold text-slate-900">{clientData.name}</h1>
                <p className="text-sm text-slate-400 mt-0.5">{clientData.industry} · Since {clientData.createdAt}</p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Mail size={12} /> {clientData.email}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Phone size={12} /> {clientData.phone}
                  </div>
                </div>
              </div>

              {/* Quick stats */}
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-center">
                  <p className="text-xl font-bold text-slate-800">{clientData.employeeCount}</p>
                  <p className="text-xs text-slate-400">Employees</p>
                </div>
                <div className="w-px h-8 bg-slate-100" />
                <div className="text-center">
                  <p className="text-xl font-bold text-slate-800">{fmt(clientData.walletBalance)}</p>
                  <p className="text-xs text-slate-400">Wallet balance</p>
                </div>
                <div className="w-px h-8 bg-slate-100" />
                <div className="text-center">
                  <p className={`text-sm font-semibold ${clientData.kycStatus === 'Verified' ? 'text-forest' : 'text-amber-600'}`}>
                    {clientData.kycStatus === 'Verified' ? <span className="flex items-center gap-1"><ShieldCheck size={14} /> Verified</span> : <span className="flex items-center gap-1"><Clock size={14} /> {clientData.kycStatus}</span>}
                  </p>
                  <p className="text-xs text-slate-400">KYC status</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex items-center gap-1 border-b border-slate-200 mb-5">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px ${tab === t ? 'border-forest text-forest' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'Overview' && (
          <div className="grid grid-cols-3 gap-5 pb-8">
            {/* Details */}
            <div className="col-span-2 bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-50">
                <h3 className="text-sm font-semibold text-slate-800">Company details</h3>
              </div>
              <div className="divide-y divide-slate-50">
                {[
                  { label: 'Legal name', value: clientData.name },
                  { label: 'Contact person', value: clientData.contactName },
                  { label: 'Email', value: clientData.email },
                  { label: 'Phone', value: clientData.phone },
                  { label: 'TIN', value: clientData.tin || '—' },
                  { label: 'Industry', value: clientData.industry },
                  { label: 'Wallet name', value: clientData.walletName },
                  { label: 'Client ID', value: clientData.id, mono: true },
                  { label: 'Created', value: clientData.createdAt },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between px-5 py-3">
                    <p className="text-xs text-slate-400 w-36 shrink-0">{row.label}</p>
                    <p className={`text-sm font-medium text-slate-700 text-right ${row.mono ? 'font-mono text-xs' : ''}`}>{row.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right col */}
            <div className="space-y-4">
              {/* Payroll summary */}
              <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-50">
                  <h3 className="text-sm font-semibold text-slate-800">Payroll snapshot</h3>
                </div>
                <div className="p-5 space-y-3">
                  {[
                    { label: 'Total gross', value: fmt(totalGross) },
                    { label: 'Total net', value: fmt(totalNet), highlight: true },
                    { label: 'Employees', value: `${employees.length} staff` },
                  ].map(s => (
                    <div key={s.label} className="flex justify-between">
                      <p className="text-xs text-slate-400">{s.label}</p>
                      <p className={`text-sm font-semibold ${s.highlight ? 'text-forest' : 'text-slate-800'}`}>{s.value}</p>
                    </div>
                  ))}
                  {clientData.lastPayroll && (
                    <div className="pt-2 border-t border-slate-50">
                      <p className="text-xs text-slate-400 mb-1">Last payroll</p>
                      <p className="text-xs font-semibold text-slate-700">{clientData.lastPayroll.period}</p>
                      <p className="text-sm font-bold text-slate-800 mt-0.5">{fmt(clientData.lastPayroll.amount)}</p>
                    </div>
                  )}
                </div>
                <div className="px-5 pb-4">
                  <button onClick={() => setShowPayroll(true)} className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-white bg-forest hover:bg-forest-dark py-2.5 rounded-xl transition-colors">
                    <Zap size={12} /> Run payroll now
                  </button>
                </div>
              </div>

              {/* Wallet */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center">
                    <Wallet size={13} className="text-violet-600" />
                  </div>
                  <p className="text-xs font-semibold text-slate-700">Linked wallet</p>
                </div>
                <p className="text-xs text-slate-400 truncate mb-1">{clientData.walletName}</p>
                <p className="text-xl font-bold text-slate-900">{fmt(clientData.walletBalance)}</p>
                <p className="text-xs text-slate-400 mt-0.5">Available balance</p>
              </div>
            </div>
          </div>
        )}

        {tab === 'Employees' && (
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden mb-8">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Employees</h3>
                <p className="text-xs text-slate-400 mt-0.5">{employees.length} staff members under this client</p>
              </div>
              <button className="flex items-center gap-1.5 text-xs font-semibold text-forest bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors">
                <Plus size={12} /> Add employee
              </button>
            </div>
            {employees.length === 0 ? (
              <div className="flex flex-col items-center py-14 text-center">
                <Users size={28} className="text-slate-200 mb-3" />
                <p className="text-sm text-slate-500">No employees yet</p>
                <p className="text-xs text-slate-400 mt-1">Add employees to start running payroll for this client</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {employees.map(emp => {
                  const net = calcNet(emp);
                  return (
                    <div key={emp.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50/60 transition-colors group">
                      <div className="w-8 h-8 rounded-xl bg-forest/10 flex items-center justify-center text-forest font-bold text-xs shrink-0">
                        {emp.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800">{emp.name}</p>
                        <p className="text-xs text-slate-400">{emp.title}</p>
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${emp.type === 'Contract' ? 'bg-violet-50 text-violet-600' : 'bg-sky-50 text-sky-600'}`}>
                        {emp.type}
                      </span>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-slate-400">Gross</p>
                        <p className="text-sm font-semibold text-slate-800">{fmt(emp.grossSalary)}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-slate-400">Net pay</p>
                        <p className="text-sm font-bold text-forest">{fmt(net)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {/* Totals footer */}
            {employees.length > 0 && (
              <div className="flex justify-end gap-8 px-5 py-3 bg-slate-50 border-t border-slate-100 text-xs">
                <div className="text-right">
                  <p className="text-slate-400">Total gross</p>
                  <p className="font-bold text-slate-800">{fmt(totalGross)}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-400">Total net pay</p>
                  <p className="font-bold text-forest">{fmt(totalNet)}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'Payroll' && (
          <div className="space-y-5 pb-8">
            {/* Run payroll CTA */}
            <div className="bg-forest rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/10" />
              <div className="relative">
                <p className="text-sm font-semibold text-white/80 mb-1">Ready to run payroll?</p>
                <p className="text-2xl font-bold mb-4">{fmt(totalNet)} <span className="text-base font-normal text-white/70">to disburse</span></p>
                <button onClick={() => setShowPayroll(true)} className="flex items-center gap-2 text-sm font-semibold text-forest bg-white hover:bg-slate-50 px-4 py-2.5 rounded-xl transition-colors">
                  <Zap size={14} /> Run payroll for {clientData.name}
                </button>
              </div>
            </div>

            {/* History */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-50">
                <h3 className="text-sm font-semibold text-slate-800">Payroll history</h3>
              </div>
              {clientData.lastPayroll ? (
                <div className="divide-y divide-slate-50">
                  {[clientData.lastPayroll].map((run, i) => (
                    <div key={i} className="flex items-center justify-between px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-forest/10 flex items-center justify-center">
                          <DollarSign size={16} className="text-forest" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{run.period}</p>
                          <p className="text-xs text-slate-400">{run.date} · {employees.length} employees</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-800">{fmt(run.amount)}</p>
                        <span className="text-xs font-medium text-forest bg-emerald-50 px-2 py-0.5 rounded-full">Successful</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center py-14 text-center">
                  <FileText size={24} className="text-slate-200 mb-3" />
                  <p className="text-sm text-slate-500">No payroll runs yet</p>
                  <p className="text-xs text-slate-400 mt-1">Run your first payroll to see history here</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {showEdit && (
        <EditClientModal
          client={clientData}
          onClose={() => setShowEdit(false)}
          onSave={(updates) => setClientData(c => ({ ...c, ...updates }))}
        />
      )}

      {showPayroll && (
        <RunPayrollModal
          client={clientData}
          employees={employees}
          onClose={() => setShowPayroll(false)}
        />
      )}
    </div>
  );
}
