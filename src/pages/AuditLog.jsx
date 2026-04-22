import { useState, useMemo } from 'react';
import {
  Search, Download, Filter, ChevronDown,
  LogIn, LogOut, Users, FileSpreadsheet,
  Wallet, Settings, Building2, Shield,
  UserPlus, UserMinus, Pencil, Play,
  CheckCircle, XCircle, RefreshCw, Key,
} from 'lucide-react';

/* ─── mock audit events ─────────────────────────────────────────────────── */

const EVENTS = [
  { id: 'AUD-001', ts: '2026-04-22 09:41:03', actor: 'Super Admin', actorEmail: 'admin@dexwinpay.com', category: 'Auth',     action: 'Login',                  target: 'admin@dexwinpay.com',          detail: 'Successful login from Chrome on macOS',           ip: '154.160.5.12',  status: 'Success' },
  { id: 'AUD-002', ts: '2026-04-22 09:45:18', actor: 'Super Admin', actorEmail: 'admin@dexwinpay.com', category: 'Payroll',  action: 'Run payroll',             target: 'April 2026',                   detail: 'Payroll run initiated for 6 employees · GH₵ 44,740.00', ip: '154.160.5.12',  status: 'Success' },
  { id: 'AUD-003', ts: '2026-04-22 09:46:02', actor: 'Super Admin', actorEmail: 'admin@dexwinpay.com', category: 'Payroll',  action: 'Approve payroll',         target: 'April 2026',                   detail: 'Payroll approved and sent to bank for processing', ip: '154.160.5.12',  status: 'Success' },
  { id: 'AUD-004', ts: '2026-04-22 10:02:30', actor: 'Adjoa Barimah', actorEmail: 'adjoa@dexwinpay.com', category: 'Employee', action: 'Edit employee',         target: 'Kofi Boateng (EMP-003)',        detail: 'Updated gross salary from GH₵ 6,000 to GH₵ 6,200', ip: '154.160.8.44',  status: 'Success' },
  { id: 'AUD-005', ts: '2026-04-22 10:15:50', actor: 'Adjoa Barimah', actorEmail: 'adjoa@dexwinpay.com', category: 'Employee', action: 'Add employee',          target: 'Nana Yaw Owusu (EMP-005)',     detail: 'New employee profile created',                    ip: '154.160.8.44',  status: 'Success' },
  { id: 'AUD-006', ts: '2026-04-22 11:03:11', actor: 'Yaw Acheampong', actorEmail: 'yaw.a@dexwinpay.com', category: 'Wallet', action: 'Fund wallet',            target: 'Payroll Wallet',               detail: 'GH₵ 80,000.00 transferred from main account',     ip: '154.160.9.71',  status: 'Success' },
  { id: 'AUD-007', ts: '2026-04-22 11:30:00', actor: 'Super Admin', actorEmail: 'admin@dexwinpay.com', category: 'Client',   action: 'Add client',              target: 'GreenPath Logistics (CLT-003)', detail: 'New client account created',                      ip: '154.160.5.12',  status: 'Success' },
  { id: 'AUD-008', ts: '2026-04-22 11:45:22', actor: 'Super Admin', actorEmail: 'admin@dexwinpay.com', category: 'Client',   action: 'Fund client wallet',      target: 'Volta River Authority',        detail: 'GH₵ 50,000.00 added to client wallet',            ip: '154.160.5.12',  status: 'Success' },
  { id: 'AUD-009', ts: '2026-04-22 12:00:00', actor: 'Super Admin', actorEmail: 'admin@dexwinpay.com', category: 'Client',   action: 'Run client payroll',      target: 'Accra Breweries Ltd.',         detail: 'Client payroll run for March 2026 · GH₵ 68,400.00', ip: '154.160.5.12', status: 'Success' },
  { id: 'AUD-010', ts: '2026-04-22 12:10:45', actor: 'Yaw Acheampong', actorEmail: 'yaw.a@dexwinpay.com', category: 'Payroll', action: 'Cancel payroll',       target: 'Bonus Run – April 2026',       detail: 'Payroll run cancelled before approval',            ip: '154.160.9.71',  status: 'Warning' },
  { id: 'AUD-011', ts: '2026-04-22 13:20:08', actor: 'Super Admin', actorEmail: 'admin@dexwinpay.com', category: 'Settings', action: 'Update company profile',  target: 'Dexwin Technologies Ltd.',     detail: 'Phone number and address updated',                ip: '154.160.5.12',  status: 'Success' },
  { id: 'AUD-012', ts: '2026-04-22 13:35:00', actor: 'Super Admin', actorEmail: 'admin@dexwinpay.com', category: 'Role',     action: 'Invite team member',      target: 'Serwaa Asante',                detail: 'Invited as HR Manager · expires in 72 hours',     ip: '154.160.5.12',  status: 'Success' },
  { id: 'AUD-013', ts: '2026-04-21 17:02:14', actor: 'Adjoa Barimah', actorEmail: 'adjoa@dexwinpay.com', category: 'Auth',   action: 'Logout',                  target: 'adjoa@dexwinpay.com',          detail: 'Session ended manually',                          ip: '154.160.8.44',  status: 'Info' },
  { id: 'AUD-014', ts: '2026-04-21 16:50:00', actor: 'Adjoa Barimah', actorEmail: 'adjoa@dexwinpay.com', category: 'Employee', action: 'Remove employee',       target: 'Old Contractor (EMP-010)',     detail: 'Employee profile archived and deactivated',       ip: '154.160.8.44',  status: 'Warning' },
  { id: 'AUD-015', ts: '2026-04-21 14:22:33', actor: 'Super Admin', actorEmail: 'admin@dexwinpay.com', category: 'Auth',     action: 'Password changed',        target: 'admin@dexwinpay.com',          detail: 'Account password updated successfully',           ip: '154.160.5.12',  status: 'Success' },
  { id: 'AUD-016', ts: '2026-04-21 10:05:00', actor: 'Yaw Acheampong', actorEmail: 'yaw.a@dexwinpay.com', category: 'Payroll', action: 'Run payroll',          target: 'March 2026',                   detail: 'Payroll run initiated for 6 employees · GH₵ 44,740.00', ip: '154.160.9.71', status: 'Success' },
  { id: 'AUD-017', ts: '2026-04-20 09:15:00', actor: 'Super Admin', actorEmail: 'admin@dexwinpay.com', category: 'Settings', action: 'KYC submitted',           target: 'Dexwin Technologies Ltd.',     detail: 'KYC documents submitted for review',              ip: '154.160.5.12',  status: 'Success' },
  { id: 'AUD-018', ts: '2026-04-20 08:30:00', actor: 'Super Admin', actorEmail: 'admin@dexwinpay.com', category: 'Auth',     action: 'Login',                   target: 'admin@dexwinpay.com',          detail: 'Successful login from Safari on iPhone',          ip: '154.160.2.88',  status: 'Success' },
  { id: 'AUD-019', ts: '2026-04-19 15:44:20', actor: 'Adjoa Barimah', actorEmail: 'adjoa@dexwinpay.com', category: 'Client', action: 'Edit client',             target: 'Kumasi Tech Hub (CLT-004)',    detail: 'Contact person and TIN updated',                  ip: '154.160.8.44',  status: 'Success' },
  { id: 'AUD-020', ts: '2026-04-19 11:00:00', actor: 'Super Admin', actorEmail: 'admin@dexwinpay.com', category: 'Role',     action: 'Remove member',           target: 'Former Staff',                 detail: 'Team member access revoked',                      ip: '154.160.5.12',  status: 'Warning' },
];

/* ─── config maps ───────────────────────────────────────────────────────── */

const CATEGORY_CONFIG = {
  Auth:     { color: 'bg-slate-100 text-slate-600',    icon: LogIn },
  Payroll:  { color: 'bg-violet-50 text-violet-700',   icon: FileSpreadsheet },
  Employee: { color: 'bg-sky-50 text-sky-700',         icon: Users },
  Wallet:   { color: 'bg-emerald-50 text-emerald-700', icon: Wallet },
  Client:   { color: 'bg-amber-50 text-amber-700',     icon: Building2 },
  Settings: { color: 'bg-rose-50 text-rose-700',       icon: Settings },
  Role:     { color: 'bg-teal-50 text-teal-700',       icon: Shield },
};

const ACTION_ICON = {
  'Login': LogIn, 'Logout': LogOut, 'Password changed': Key,
  'Add employee': UserPlus, 'Remove employee': UserMinus, 'Edit employee': Pencil,
  'Run payroll': Play, 'Approve payroll': CheckCircle, 'Cancel payroll': XCircle,
  'Run client payroll': Play,
  'Fund wallet': Wallet, 'Fund client wallet': Wallet,
  'Add client': Building2, 'Edit client': Pencil,
  'Update company profile': Settings, 'KYC submitted': Shield,
  'Invite team member': UserPlus, 'Remove member': UserMinus,
};

const STATUS_CONFIG = {
  Success: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  Warning: 'bg-amber-50 text-amber-700 ring-amber-100',
  Info:    'bg-slate-100 text-slate-600 ring-slate-200',
  Failed:  'bg-red-50 text-red-600 ring-red-100',
};

const ALL_CATEGORIES = ['All', ...Object.keys(CATEGORY_CONFIG)];

function formatTs(ts) {
  const d = new Date(ts.replace(' ', 'T'));
  return d.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function relativeDate(ts) {
  const date = ts.slice(0, 10);
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (date === today) return 'Today';
  if (date === yesterday) return 'Yesterday';
  return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

/* ─── sub-components ────────────────────────────────────────────────────── */

function CategoryBadge({ category }) {
  const cfg = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.Auth;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${cfg.color}`}>
      <Icon size={10} strokeWidth={2} /> {category}
    </span>
  );
}

function StatusDot({ status }) {
  const cls = STATUS_CONFIG[status] || STATUS_CONFIG.Info;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${cls}`}>
      {status}
    </span>
  );
}

function ActorAvatar({ name }) {
  const initials = name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  const colors = ['bg-violet-100 text-violet-700', 'bg-sky-100 text-sky-700', 'bg-emerald-100 text-emerald-700', 'bg-amber-100 text-amber-700', 'bg-rose-100 text-rose-700'];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${color}`}>
      {initials}
    </div>
  );
}

/* ─── Main page ─────────────────────────────────────────────────────────── */

export default function AuditLog() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [catOpen, setCatOpen] = useState(false);

  const filtered = useMemo(() => {
    return EVENTS.filter(e => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        e.actor.toLowerCase().includes(q) ||
        e.action.toLowerCase().includes(q) ||
        e.target.toLowerCase().includes(q) ||
        e.detail.toLowerCase().includes(q) ||
        e.actorEmail.toLowerCase().includes(q);
      const matchCat = category === 'All' || e.category === category;
      return matchSearch && matchCat;
    });
  }, [search, category]);

  // Group by date label
  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach(e => {
      const label = relativeDate(e.ts);
      if (!map[label]) map[label] = [];
      map[label].push(e);
    });
    return map;
  }, [filtered]);

  const todayCount  = EVENTS.filter(e => e.ts.startsWith(new Date().toISOString().slice(0, 10))).length;
  const uniqueActors = [...new Set(EVENTS.map(e => e.actor))].length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-6 py-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Audit Log</h1>
            <p className="mt-1 text-sm text-slate-500">A full record of all actions taken across the platform.</p>
          </div>
          <button className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 px-4 py-2.5 rounded-full transition-colors">
            <Download size={14} /> Export CSV
          </button>
        </div>

        {/* Stat chips */}
        <div className="flex items-center gap-3 mt-5">
          {[
            { label: 'Total events', value: EVENTS.length },
            { label: 'Today', value: todayCount },
            { label: 'Active members', value: uniqueActors },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2">
              <p className="text-base font-bold text-slate-800">{s.value}</p>
              <p className="text-xs text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 max-w-6xl">
        {/* Filter bar */}
        <div className="flex items-center gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by actor, action, or target…"
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
            />
          </div>

          {/* Category filter */}
          <div className="relative">
            <button
              onClick={() => setCatOpen(o => !o)}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 px-4 py-2.5 rounded-xl transition-colors"
            >
              <Filter size={14} className="text-slate-400" />
              {category === 'All' ? 'All categories' : category}
              <ChevronDown size={14} className="text-slate-400" />
            </button>
            {catOpen && (
              <div className="absolute right-0 z-20 mt-1 w-44 rounded-xl border border-slate-200 bg-white shadow-lg py-1 overflow-hidden">
                {ALL_CATEGORIES.map(c => (
                  <button
                    key={c}
                    onClick={() => { setCategory(c); setCatOpen(false); }}
                    className={`flex w-full items-center gap-2 px-3 py-2.5 text-sm transition-colors ${category === c ? 'bg-forest/5 text-forest font-semibold' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    {c !== 'All' && (() => { const Ic = CATEGORY_CONFIG[c]?.icon; return Ic ? <Ic size={13} className="text-slate-400" /> : null; })()}
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          {(search || category !== 'All') && (
            <button
              onClick={() => { setSearch(''); setCategory('All'); }}
              className="text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors"
            >
              Clear filters
            </button>
          )}

          <p className="ml-auto text-xs text-slate-400">{filtered.length} event{filtered.length !== 1 ? 's' : ''}</p>
        </div>

        {/* Log */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-100">
            <Search size={24} className="text-slate-200 mb-3" />
            <p className="text-sm font-semibold text-slate-600">No events found</p>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(([dateLabel, events]) => (
              <div key={dateLabel}>
                {/* Date divider */}
                <div className="flex items-center gap-3 mb-3">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{dateLabel}</p>
                  <div className="flex-1 h-px bg-slate-100" />
                  <p className="text-xs text-slate-300">{events.length} event{events.length !== 1 ? 's' : ''}</p>
                </div>

                {/* Events table */}
                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-50 bg-slate-50/80">
                        {['Time', 'Actor', 'Category', 'Action', 'Target / Detail', 'Status', 'IP'].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {events.map(e => {
                        const ActionIcon = ACTION_ICON[e.action] || RefreshCw;
                        return (
                          <tr key={e.id} className="hover:bg-slate-50/60 transition-colors">
                            {/* Time */}
                            <td className="px-4 py-3.5 whitespace-nowrap">
                              <p className="text-xs font-mono text-slate-500">{e.ts.slice(11)}</p>
                            </td>

                            {/* Actor */}
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-2">
                                <ActorAvatar name={e.actor} />
                                <div>
                                  <p className="text-xs font-semibold text-slate-800 whitespace-nowrap">{e.actor}</p>
                                  <p className="text-[11px] text-slate-400">{e.actorEmail}</p>
                                </div>
                              </div>
                            </td>

                            {/* Category */}
                            <td className="px-4 py-3.5">
                              <CategoryBadge category={e.category} />
                            </td>

                            {/* Action */}
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-1.5 whitespace-nowrap">
                                <ActionIcon size={13} className="text-slate-400 shrink-0" strokeWidth={1.75} />
                                <span className="text-xs font-semibold text-slate-700">{e.action}</span>
                              </div>
                            </td>

                            {/* Target / Detail */}
                            <td className="px-4 py-3.5 max-w-[280px]">
                              <p className="text-xs font-semibold text-slate-700 truncate">{e.target}</p>
                              <p className="text-[11px] text-slate-400 truncate mt-0.5">{e.detail}</p>
                            </td>

                            {/* Status */}
                            <td className="px-4 py-3.5">
                              <StatusDot status={e.status} />
                            </td>

                            {/* IP */}
                            <td className="px-4 py-3.5">
                              <p className="text-xs font-mono text-slate-400 whitespace-nowrap">{e.ip}</p>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
