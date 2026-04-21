import { useState } from 'react';
import { Plus, RefreshCw, Clock } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { Input, Select } from '../../components/ui/Input';
import { teamMembers as initial } from '../../data/mockData';

const rolePermissions = {
  'Super Admin': 'Full access: employees, payroll, transactions, settings, KYC.',
  'HR Manager':  'Manage employees and onboarding. No payroll payment confirmation or company settings.',
  'Finance':     'Review payroll compliance and confirm payment processing. No employee profile editing or company configuration.',
};

function InviteModal({ open, onClose, onInvite }) {
  const [form, setForm] = useState({ name: '', email: '', role: 'HR Manager' });
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  return (
    <Modal open={open} onClose={onClose} title="Invite Team Member">
      <div className="space-y-3">
        <Input label="Full Name" value={form.name} onChange={set('name')} />
        <Input label="Email Address *" type="email" value={form.email} onChange={set('email')} />
        <Select label="Role *" value={form.role} onChange={set('role')}>
          <option>HR Manager</option>
          <option>Finance</option>
        </Select>
        <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-600">
          <strong>Permissions: </strong>{rolePermissions[form.role]}
        </div>
        <p className="text-xs text-slate-400">Invitation links expire after 72 hours. Role-based permissions are system-preset and cannot be customised.</p>
      </div>
      <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-100">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={() => { onInvite(form); onClose(); }}>Send Invitation</Button>
      </div>
    </Modal>
  );
}

export default function Roles() {
  const [members, setMembers] = useState(initial);
  const [showInvite, setShowInvite] = useState(false);

  const handleInvite = (form) => {
    setMembers(prev => [...prev, {
      id: Date.now(), name: form.name, email: form.email,
      role: form.role, status: 'Sent', since: new Date().toISOString().slice(0, 10),
    }]);
  };

  const handleResend = (id) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, status: 'Sent', since: new Date().toISOString().slice(0, 10) } : m));
  };

  return (
    <div>
      <PageHeader
        title="Roles & Team"
        subtitle="Manage team member access and invitations"
        actions={
          <Button variant="primary" size="sm" icon={Plus} onClick={() => setShowInvite(true)}>Invite Member</Button>
        }
      />

      <div className="p-6 space-y-4 max-w-3xl">
        {/* Role descriptions */}
        <Card>
          <h3 className="text-sm font-semibold text-slate-700 border-b border-slate-100 pb-3 mb-4">System Roles</h3>
          <div className="space-y-3">
            {Object.entries(rolePermissions).map(([role, desc]) => (
              <div key={role} className="flex items-start gap-3">
                <Badge label={role === 'Super Admin' ? 'Active' : role === 'HR Manager' ? 'Sent' : 'Accepted'} />
                <div>
                  <p className="text-xs font-semibold text-slate-700">{role}</p>
                  <p className="text-xs text-slate-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Members table */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
            <h3 className="text-sm font-semibold text-slate-700">Team Members</h3>
            <p className="text-xs text-slate-400">{members.length} members</p>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Name', 'Role', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {members.map(m => (
                <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{m.name}</p>
                      <p className="text-xs text-slate-400">{m.email}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-slate-600">{m.role}</td>
                  <td className="px-5 py-3.5"><Badge label={m.status} /></td>
                  <td className="px-5 py-3.5 text-xs text-slate-400">{m.since}</td>
                  <td className="px-5 py-3.5">
                    {(m.status === 'Sent' || m.status === 'Expired') && (
                      <button onClick={() => handleResend(m.id)} className="flex items-center gap-1 text-xs text-brand-600 hover:underline font-medium">
                        <RefreshCw size={11} /> Resend
                      </button>
                    )}
                    {m.status === 'Sent' && (
                      <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                        <Clock size={11} /> Expires in 72h
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <InviteModal open={showInvite} onClose={() => setShowInvite(false)} onInvite={handleInvite} />
    </div>
  );
}
