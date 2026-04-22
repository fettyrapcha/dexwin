import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Plus, Search, Download, X, ChevronDown, Check,
  UserPlus, Activity, MoreHorizontal, RefreshCw, Trash2,
  ShieldCheck, Clock, AlertCircle,
} from 'lucide-react';

/* ─── mock data ─────────────────────────────────────────────────────────── */

const ALL_PERMISSIONS = [
  'Prepare payroll',
  'Pay payroll',
  'Manage employees',
];

const ROLE_PRESETS = {
  'Super Admin':  ['Prepare payroll', 'Pay payroll', 'Manage employees'],
  'HR Manager':   ['Manage employees'],
  'Finance':      ['Prepare payroll', 'Pay payroll'],
};

const MOCK_MEMBERS = [
  { id: 1, name: 'Adjoa Barimah',   email: 'adjoa@dexwinpay.com',    avatar: 'AB', role: 'HR Manager', permissions: ROLE_PRESETS['HR Manager'],  status: 'Active',   lastActive: '2 hours ago',  since: '2023-02-01' },
  { id: 2, name: 'Yaw Acheampong',  email: 'yaw.a@dexwinpay.com',    avatar: 'YA', role: 'Finance',    permissions: ROLE_PRESETS['Finance'],     status: 'Active',   lastActive: '1 day ago',    since: '2023-06-15' },
  { id: 3, name: 'Serwaa Asante',   email: 's.asante@dexwinpay.com', avatar: 'SA', role: 'HR Manager', permissions: ROLE_PRESETS['HR Manager'],  status: 'Pending',  lastActive: 'Invited',      since: '2025-04-10' },
  { id: 4, name: 'Kojo Mensah',     email: 'kojo.m@dexwinpay.com',   avatar: 'KM', role: 'Finance',    permissions: ROLE_PRESETS['Finance'],     status: 'Expired',  lastActive: '30 days ago',  since: '2025-03-28' },
  { id: 5, name: 'Nana Ama Quaye',  email: 'n.quaye@dexwinpay.com',  avatar: 'NQ', role: 'Finance',    permissions: ROLE_PRESETS['Finance'],     status: 'Active',   lastActive: '3 days ago',   since: '2024-11-01' },
];

const MOCK_USERS = [
  { id: 'U1', name: 'Seth Walker',   email: 'seth@company.com'   },
  { id: 'U2', name: 'Ama Boateng',   email: 'ama@company.com'    },
  { id: 'U3', name: 'Kofi Asare',    email: 'kofi@company.com'   },
  { id: 'U4', name: 'Efua Mensah',   email: 'efua@company.com'   },
  { id: 'U5', name: 'Kwame Darko',   email: 'kwame@company.com'  },
];

/* ─── helpers ───────────────────────────────────────────────────────────── */

const permColor = (p) => {
  const map = {
    'Prepare payroll':    'bg-violet-50 text-violet-700 ring-violet-100',
    'Pay payroll':        'bg-sky-50 text-sky-700 ring-sky-100',
    'Manage employees':   'bg-emerald-50 text-emerald-700 ring-emerald-100',
  };
  return map[p] || 'bg-slate-100 text-slate-600 ring-slate-200';
};

function StatusBadge({ status }) {
  if (status === 'Active')
    return <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Active</span>;
  if (status === 'Pending')
    return <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-100"><Clock size={10} />Pending</span>;
  return <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 ring-1 ring-red-100"><AlertCircle size={10} />Expired</span>;
}

/* ─── Permission multi-select tag input ─────────────────────────────────── */

function PermissionSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [dropPos, setDropPos] = useState({});
  const triggerRef = useRef(null);
  const dropRef = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target) &&
        dropRef.current && !dropRef.current.contains(e.target)
      ) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const handleOpen = () => {
    if (!open && triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      setDropPos({ top: r.bottom + 4, left: r.left, width: r.width });
    }
    setOpen(o => !o);
  };

  const toggle = (p) => {
    onChange(value.includes(p) ? value.filter(v => v !== p) : [...value, p]);
  };

  const dropdown = open && createPortal(
    <div
      ref={dropRef}
      style={{ position: 'fixed', top: dropPos.top, left: dropPos.left, width: dropPos.width, zIndex: 9999 }}
      className="rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden"
    >
      <div className="px-3 py-2 border-b border-slate-100">
        <p className="text-xs font-semibold text-slate-400 mb-1.5">Presets</p>
        <div className="flex flex-wrap gap-1">
          {Object.keys(ROLE_PRESETS).map(role => (
            <button key={role} type="button"
              onClick={() => { onChange(ROLE_PRESETS[role]); setOpen(false); }}
              className="text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded-lg transition-colors"
            >{role}</button>
          ))}
        </div>
      </div>
      <div className="py-1 max-h-52 overflow-y-auto">
        {ALL_PERMISSIONS.map(p => (
          <button key={p} type="button" onClick={() => toggle(p)}
            className="flex w-full items-center justify-between px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${permColor(p)}`}>{p}</span>
            {value.includes(p) && <Check size={14} className="text-forest shrink-0" />}
          </button>
        ))}
      </div>
    </div>,
    document.body
  );

  return (
    <div ref={triggerRef}>
      <div
        onClick={handleOpen}
        className="min-h-[42px] w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2 flex flex-wrap gap-1.5 items-center"
      >
        {value.length === 0 && <span className="text-sm text-slate-400">Select permissions</span>}
        {value.map(p => (
          <span key={p} className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${permColor(p)}`}>
            {p}
            <button type="button" onClick={e => { e.stopPropagation(); toggle(p); }} className="hover:opacity-70">
              <X size={10} />
            </button>
          </span>
        ))}
        <ChevronDown size={14} className="ml-auto text-slate-400 shrink-0" />
      </div>
      {dropdown}
    </div>
  );
}

/* ─── Member dropdown ───────────────────────────────────────────────────── */

function MemberSelect({ value, onChange, used }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [dropPos, setDropPos] = useState({});
  const triggerRef = useRef(null);
  const dropRef = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target) &&
        dropRef.current && !dropRef.current.contains(e.target)
      ) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const handleOpen = () => {
    if (!open && triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      setDropPos({ top: r.bottom + 4, left: r.left, width: r.width });
    }
    setOpen(o => !o);
  };

  const filtered = MOCK_USERS.filter(u =>
    !used.includes(u.id) &&
    (u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase()))
  );
  const selected = MOCK_USERS.find(u => u.id === value);

  const dropdown = open && createPortal(
    <div
      ref={dropRef}
      style={{ position: 'fixed', top: dropPos.top, left: dropPos.left, width: dropPos.width, zIndex: 9999 }}
      className="rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden"
    >
      <div className="p-2 border-b border-slate-100">
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            autoFocus
            value={q}
            onChange={e => setQ(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 py-1.5 text-xs focus:outline-none"
            placeholder="Search…"
          />
        </div>
      </div>
      <div className="max-h-48 overflow-y-auto py-1">
        {filtered.length === 0 ? (
          <p className="px-3 py-2 text-xs text-slate-400">No members available</p>
        ) : filtered.map(u => (
          <button key={u.id} type="button"
            onClick={() => { onChange(u.id); setOpen(false); setQ(''); }}
            className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left hover:bg-slate-50 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-forest/10 flex items-center justify-center text-forest text-xs font-bold shrink-0">
              {u.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800">{u.name}</p>
              <p className="text-xs text-slate-400">{u.email}</p>
            </div>
          </button>
        ))}
      </div>
    </div>,
    document.body
  );

  return (
    <div ref={triggerRef}>
      <div
        onClick={handleOpen}
        className="flex h-[42px] w-full cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-white px-3 text-sm"
      >
        {selected ? (
          <span className="font-medium text-slate-800">{selected.name}</span>
        ) : (
          <span className="text-slate-400">Select Team Member</span>
        )}
        <ChevronDown size={14} className="text-slate-400 shrink-0" />
      </div>
      {dropdown}
    </div>
  );
}

/* ─── Invite modal ──────────────────────────────────────────────────────── */

const emptyRow = () => ({ id: Date.now() + Math.random(), userId: '', permissions: [] });

function InviteModal({ onClose, onSent }) {
  const [rows, setRows] = useState([emptyRow()]);
  const [sent, setSent] = useState(false);

  const usedIds = rows.map(r => r.userId).filter(Boolean);
  const updateRow = (id, field, val) => setRows(rs => rs.map(r => r.id === id ? { ...r, [field]: val } : r));
  const addRow = () => setRows(rs => [...rs, emptyRow()]);
  const removeRow = (id) => setRows(rs => rs.filter(r => r.id !== id));

  const canSend = rows.some(r => r.userId && r.permissions.length > 0);
  const filled = rows.filter(r => r.userId && r.permissions.length > 0);

  const handleSend = () => {
    setSent(true);
    onSent(filled);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={!sent ? onClose : undefined} />
      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl overflow-hidden">

        {sent ? (
          /* ── success state ── */
          <div className="px-8 py-10 flex flex-col items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Check size={20} className="text-forest" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Invite(s) sent</h2>
              <p className="mt-1 text-sm text-slate-500">
                {filled.length} team member{filled.length !== 1 ? 's' : ''} have been invited. They'll receive a 72-hour link to join the workspace.
              </p>
            </div>
            <div className="flex gap-3 pt-2 w-full">
              <button
                onClick={() => { setSent(false); setRows([emptyRow()]); }}
                className="flex-1 rounded-full border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Invite more
              </button>
              <button
                onClick={onClose}
                className="flex-1 rounded-full bg-forest py-2.5 text-sm font-semibold text-white hover:bg-forest-dark transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* ── invite form ── */
          <>
            <div className="px-6 pt-6 pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0">
                    <UserPlus size={18} className="text-slate-600" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Invite team members</h2>
                    <p className="mt-0.5 text-sm text-slate-500">Invite one or more team members and assign each a role.</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="px-6 pb-4 space-y-4 max-h-[50vh] overflow-y-auto">
              {rows.map((row, i) => (
                <div key={row.id} className="relative">
                  {rows.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      className="absolute -right-1 -top-1 z-10 w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-200 transition-colors shadow-sm"
                    >
                      <X size={10} />
                    </button>
                  )}
                  <div className="grid grid-cols-2 gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                        Select Team Member
                      </label>
                      <MemberSelect
                        value={row.userId}
                        onChange={val => updateRow(row.id, 'userId', val)}
                        used={usedIds.filter(id => id !== row.userId)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                        Permission <span className="text-red-400">*</span>
                      </label>
                      <PermissionSelect
                        value={row.permissions}
                        onChange={val => updateRow(row.id, 'permissions', val)}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addRow}
                className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors pt-1"
              >
                <Plus size={15} /> Add another
              </button>
            </div>

            <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-slate-100">
              <button
                onClick={onClose}
                className="flex-1 rounded-full border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={!canSend}
                onClick={handleSend}
                className="flex-1 rounded-full bg-forest py-2.5 text-sm font-semibold text-white hover:bg-forest-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Send invites
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Row action menu ───────────────────────────────────────────────────── */

function ActionMenu({ member, onResend, onRemove }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
      >
        <MoreHorizontal size={16} />
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-1 w-44 rounded-xl border border-slate-200 bg-white shadow-lg py-1 overflow-hidden">
          {(member.status === 'Pending' || member.status === 'Expired') && (
            <button
              onClick={() => { onResend(member.id); setOpen(false); }}
              className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <RefreshCw size={14} className="text-slate-400" /> Resend invite
            </button>
          )}
          <button
            onClick={() => { onRemove(member.id); setOpen(false); }}
            className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={14} /> Remove member
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Main Role Management page ─────────────────────────────────────────── */

const TABS = ['All Members', 'Pending Requests', 'Expired Access'];

export default function RoleManagement() {
  const [members, setMembers] = useState(MOCK_MEMBERS);
  const [tab, setTab] = useState('All Members');
  const [search, setSearch] = useState('');
  const [showInvite, setShowInvite] = useState(false);

  const filtered = members.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase());
    const matchTab =
      tab === 'All Members' ? true :
      tab === 'Pending Requests' ? m.status === 'Pending' :
      tab === 'Expired Access' ? m.status === 'Expired' : true;
    return matchSearch && matchTab;
  });

  const handleSent = (rows) => {
    const newMembers = rows.map(row => {
      const user = MOCK_USERS.find(u => u.id === row.userId);
      return {
        id: Date.now() + Math.random(),
        name: user.name,
        email: user.email,
        avatar: user.name.split(' ').map(n => n[0]).join(''),
        role: 'Custom',
        permissions: row.permissions,
        status: 'Pending',
        lastActive: 'Invited',
        since: new Date().toISOString().slice(0, 10),
      };
    });
    setMembers(prev => [...prev, ...newMembers]);
  };

  const handleResend = (id) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, status: 'Pending', lastActive: 'Invited' } : m));
  };

  const handleRemove = (id) => {
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  const tabCounts = {
    'All Members': members.length,
    'Pending Requests': members.filter(m => m.status === 'Pending').length,
    'Expired Access': members.filter(m => m.status === 'Expired').length,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-6 py-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Role Management</h1>
            <p className="mt-1 text-sm text-slate-500 max-w-lg">
              Manage organisational permissions, access hierarchies, and member lifecycle across the DexwinPay platform.
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <button className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 px-4 py-2.5 rounded-full transition-colors">
              <Download size={14} /> Export Logs
            </button>
            <button
              onClick={() => setShowInvite(true)}
              className="flex items-center gap-2 text-sm font-semibold text-white bg-forest hover:bg-forest-dark px-4 py-2.5 rounded-full transition-colors"
            >
              <Plus size={15} /> Assign New Role
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl">
        {/* Tab bar + search row */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 gap-0.5">
            {TABS.map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t ? 'bg-forest text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
              >
                {t}
                {tabCounts[t] > 0 && (
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center ${tab === t ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {tabCounts[t]}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="search members"
                className="w-56 pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-300 font-mono">⌘K</span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center px-4">
              <div className="w-14 h-14 rounded-2xl border border-slate-200 bg-white shadow-sm flex items-center justify-center mb-4">
                <Activity size={22} className="text-slate-300" />
              </div>
              <p className="text-sm font-semibold text-slate-700 mb-1">No role assign</p>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                No team members have been invited yet. Assign roles to give your HR, Finance, and Admin staff access to the platform.
              </p>
              <button
                onClick={() => setShowInvite(true)}
                className="mt-5 flex items-center gap-2 text-sm font-semibold text-white bg-forest hover:bg-forest-dark px-5 py-2.5 rounded-full transition-colors"
              >
                <Plus size={14} /> Assign New Role
              </button>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  {['Member', 'Role', 'Permissions', 'Status', 'Last Active', ''].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(m => (
                  <tr key={m.id} className="hover:bg-slate-50/60 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-forest/10 flex items-center justify-center text-forest text-xs font-bold shrink-0">
                          {m.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{m.name}</p>
                          <p className="text-xs text-slate-400">{m.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">{m.role}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {m.permissions.slice(0, 3).map(p => (
                          <span key={p} className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${permColor(p)}`}>{p}</span>
                        ))}
                        {m.permissions.length > 3 && (
                          <span className="text-xs text-slate-400 font-medium px-1">+{m.permissions.length - 3} more</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={m.status} />
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-400">{m.lastActive}</td>
                    <td className="px-5 py-4">
                      <ActionMenu member={m} onResend={handleResend} onRemove={handleRemove} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showInvite && (
        <InviteModal
          onClose={() => setShowInvite(false)}
          onSent={handleSent}
        />
      )}
    </div>
  );
}
