import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Building2, ShieldCheck, Users, ListChecks,
  Plus, RefreshCw, CheckCircle,
  Clock, ChevronRight, Circle
} from 'lucide-react';
import KYCFlow from './KYCFlow';
import CompanyProfile, { CompanyProfileForm } from './CompanyProfile';
import { teamMembers as initialMembers, checklistSteps } from '../../data/mockData';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';

/* ─── shared primitives ─────────────────────────────────────────────────── */

function FormRow({ label, hint, children, divider = true }) {
  return (
    <>
      <div className="grid grid-cols-5 gap-8 py-5">
        <div className="col-span-2">
          <p className="text-sm font-semibold text-slate-700">{label}</p>
          {hint && <p className="text-xs text-slate-400 mt-1 leading-relaxed">{hint}</p>}
        </div>
        <div className="col-span-3 space-y-3">{children}</div>
      </div>
      {divider && <hr className="border-slate-100" />}
    </>
  );
}

function SectionHeader({ title, desc }) {
  return (
    <div className="pb-5 border-b border-slate-100">
      <h2 className="text-base font-semibold text-slate-800">{title}</h2>
      {desc && <p className="text-sm text-slate-400 mt-1">{desc}</p>}
    </div>
  );
}

/* ─── tab: Company Profile ──────────────────────────────────────────────── */

function CompanyTab() {
  return <CompanyProfileForm cancelTo="/settings" />;
}


/* ─── tab: Roles & Team ─────────────────────────────────────────────────── */

const rolePerms = {
  'Super Admin': 'Full access — employees, payroll, transactions, settings, KYC.',
  'HR Manager':  'Manage employees and onboarding. No payroll payment confirmation or company settings.',
  'Finance':     'Review payroll and confirm payment processing. No employee profile editing or company config.',
};

function InviteModal({ open, onClose, onInvite }) {
  const [form, setForm] = useState({ name: '', email: '', role: 'HR Manager' });
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  return (
    <Modal open={open} onClose={onClose} title="Invite team member">
      <div className="space-y-3">
        <Input label="Full name" value={form.name} onChange={set('name')} placeholder="Ama Sarpong" />
        <Input label="Email address" type="email" value={form.email} onChange={set('email')} placeholder="ama@company.com" />
        <Select label="Role" value={form.role} onChange={set('role')}>
          <option>HR Manager</option><option>Finance</option>
        </Select>
        <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-500">
          <strong className="text-slate-600">Permissions: </strong>{rolePerms[form.role]}
        </div>
        <p className="text-xs text-slate-400">Invitation links expire after 72 hours. Roles are system-preset and cannot be customised.</p>
      </div>
      <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-100">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={() => { onInvite(form); onClose(); }}>Send invitation</Button>
      </div>
    </Modal>
  );
}

function RolesTab() {
  const [members, setMembers] = useState(initialMembers);
  const [showInvite, setShowInvite] = useState(false);

  const handleInvite = form => setMembers(prev => [...prev, {
    id: Date.now(), name: form.name, email: form.email, role: form.role,
    status: 'Sent', since: new Date().toISOString().slice(0, 10),
  }]);

  const handleResend = id => setMembers(prev => prev.map(m => m.id === id
    ? { ...m, status: 'Sent', since: new Date().toISOString().slice(0, 10) }
    : m
  ));

  const statusDot = { Accepted: 'bg-brand-400', Sent: 'bg-amber-400', Expired: 'bg-slate-300' };

  return (
    <div>
      <SectionHeader title="Roles & Team" desc="Invite team members and manage their access levels." />

      {/* Role legend */}
      <FormRow label="System roles" hint="Permissions are preset by the platform and cannot be customised.">
        <div className="space-y-3">
          {Object.entries(rolePerms).map(([role, desc]) => (
            <div key={role} className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/60">
              <div className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                <Users size={12} className="text-slate-500" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-700">{role}</p>
                <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </FormRow>

      {/* Member list */}
      <FormRow label="Team members" hint="Pending and expired invitations are visible here." divider={false}>
        <div>
          <div className="flex justify-end mb-3">
            <Button variant="primary" size="sm" icon={Plus} onClick={() => setShowInvite(true)}>Invite member</Button>
          </div>
          <div className="rounded-xl border border-slate-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Name', 'Role', 'Status', 'Joined', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {members.map(m => (
                  <tr key={m.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-xs font-semibold shrink-0">
                          {m.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-800">{m.name}</p>
                          <p className="text-xs text-slate-400">{m.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">{m.role}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${statusDot[m.status] || 'bg-slate-300'}`} />
                        <span className="text-xs text-slate-600">{m.status}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">{m.since}</td>
                    <td className="px-4 py-3">
                      {(m.status === 'Sent' || m.status === 'Expired') && (
                        <button onClick={() => handleResend(m.id)} className="flex items-center gap-1 text-xs text-brand-600 hover:underline font-medium">
                          <RefreshCw size={10} /> Resend
                        </button>
                      )}
                      {m.status === 'Sent' && (
                        <p className="flex items-center gap-1 text-xs text-slate-400 mt-0.5"><Clock size={10} /> Expires 72h</p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </FormRow>

      <InviteModal open={showInvite} onClose={() => setShowInvite(false)} onInvite={handleInvite} />
    </div>
  );
}

/* ─── tab: Onboarding ───────────────────────────────────────────────────── */

const stepIcons = { Complete: CheckCircle, 'In Progress': Clock, 'Not Started': Circle };
const stepColors = { Complete: 'text-brand-500', 'In Progress': 'text-amber-500', 'Not Started': 'text-slate-300' };

function OnboardingTab() {
  const navigate = useNavigate();
  const completed = checklistSteps.filter(s => s.status === 'Complete').length;
  const pct = Math.round((completed / checklistSteps.length) * 100);

  return (
    <div>
      <SectionHeader title="Onboarding checklist" desc="Complete all steps to fully configure your company workspace." />

      {/* Progress summary */}
      <div className="grid grid-cols-3 gap-4 my-6">
        {[
          { label: 'Completed', value: completed, color: 'text-brand-600 bg-brand-50' },
          { label: 'Remaining', value: checklistSteps.length - completed, color: 'text-amber-600 bg-amber-50' },
          { label: 'Progress', value: `${pct}%`, color: 'text-slate-700 bg-slate-100' },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl ${s.color} px-5 py-4`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs font-medium mt-0.5 opacity-70">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-slate-400 mb-2">
          <span>Setup progress</span><span>{pct}% complete</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-2">
        {checklistSteps.map((step, i) => {
          const Icon = stepIcons[step.status] || Circle;
          const color = stepColors[step.status] || 'text-slate-300';
          const isDone = step.status === 'Complete';
          return (
            <div
              key={step.id}
              onClick={() => navigate(step.path)}
              className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all group
                ${isDone
                  ? 'border-brand-100 bg-brand-50/50'
                  : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-card'
                }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${isDone ? 'bg-brand-100' : 'bg-slate-100'}`}>
                <span className="text-xs font-bold text-slate-400">{i + 1}</span>
              </div>
              <Icon size={16} className={`${color} shrink-0`} />
              <p className={`flex-1 text-sm font-medium ${isDone ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                {step.label}
              </p>
              <Badge label={step.status} />
              <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors shrink-0" />
            </div>
          );
        })}
      </div>

      <p className="text-xs text-slate-400 bg-slate-50 rounded-xl p-3 mt-5">
        <strong className="text-slate-500">Note:</strong> KYC is not required for payroll preparation — only before actual payment processing begins.
      </p>
    </div>
  );
}

/* ─── main Settings page ────────────────────────────────────────────────── */

const tabs = [
  { id: 'company',    label: 'Company profile', icon: Building2  },
  { id: 'kyc',        label: 'KYC',             icon: ShieldCheck },
  { id: 'roles',      label: 'Roles & team',    icon: Users       },
  { id: 'onboarding', label: 'Onboarding',      icon: ListChecks  },
];

const tabContent = {
  company:    <CompanyTab />,
  roles:      <RolesTab />,
  onboarding: <OnboardingTab />,
};

export default function Settings() {
  const location = useLocation();
  const navigate = useNavigate();
  const defaultTab = location.pathname.includes('kyc')
    ? 'kyc'
    : location.pathname.includes('roles')
      ? 'roles'
      : location.pathname.includes('onboarding')
        ? 'onboarding'
        : 'company';
  const [active, setActive] = useState(defaultTab);

  useEffect(() => {
    if (location.pathname.includes('kyc')) setActive('kyc');
    else if (location.pathname.includes('roles')) setActive('roles');
    else if (location.pathname.includes('onboarding')) setActive('onboarding');
    else if (location.pathname === '/settings') setActive('company');
  }, [location.pathname]);

  if (location.pathname === '/settings/company') {
    return <CompanyProfile />;
  }

  if (location.pathname === '/settings/kyc') {
    return <KYCFlow />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page header */}
      <div className="bg-white border-b border-slate-100">
        <div className="px-6 pt-6 pb-0">
          <h1 className="text-base font-semibold text-slate-800">Settings</h1>
          <p className="text-xs text-slate-400 mt-0.5 mb-4">Manage your company account, compliance, and team.</p>

          {/* Tab bar */}
          <div className="flex items-end gap-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = active === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.id === 'company') {
                      navigate('/settings/company');
                      return;
                    }
                    if (tab.id === 'kyc') {
                      navigate('/settings/kyc');
                      return;
                    }
                    if (tab.id === 'roles') {
                      navigate('/settings/roles');
                      return;
                    }
                    if (tab.id === 'onboarding') {
                      navigate('/settings/onboarding');
                      return;
                    }
                    setActive(tab.id);
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-xl border-b-2 transition-all
                    ${isActive
                      ? 'border-brand-600 text-brand-700 bg-brand-50/60'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                >
                  <Icon size={14} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
          {tabContent[active]}
        </div>
      </div>
    </div>
  );
}
