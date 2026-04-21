const variants = {
  Active:     'bg-brand-50 text-brand-700',
  Pending:    'bg-amber-50 text-amber-700',
  Successful: 'bg-brand-50 text-brand-700',
  Failed:     'bg-red-50 text-red-700',
  Sent:       'bg-blue-50 text-blue-700',
  Accepted:   'bg-brand-50 text-brand-700',
  Expired:    'bg-slate-100 text-slate-500',
  Complete:   'bg-brand-50 text-brand-700',
  'In Progress': 'bg-amber-50 text-amber-700',
  'Not Started': 'bg-slate-100 text-slate-500',
  Verified:   'bg-brand-50 text-brand-700',
  Pending_KYC:'bg-amber-50 text-amber-700',
  Contract:   'bg-violet-50 text-violet-700',
  'Full-time': 'bg-sky-50 text-sky-700',
  Processed:  'bg-brand-50 text-brand-700',
  Draft:      'bg-slate-100 text-slate-500',
};

export default function Badge({ label, className = '' }) {
  const cls = variants[label] || 'bg-slate-100 text-slate-600';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cls} ${className}`}>
      {label}
    </span>
  );
}
