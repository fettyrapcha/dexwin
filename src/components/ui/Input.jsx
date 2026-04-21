export function Input({ label, id, error, className = '', ...props }) {
  return (
    <div className={className}>
      {label && <label htmlFor={id} className="block text-xs font-medium text-slate-600 mb-1.5">{label}</label>}
      <input
        id={id}
        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-800 placeholder-slate-400
          focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function Select({ label, id, children, error, className = '', ...props }) {
  return (
    <div className={className}>
      {label && <label htmlFor={id} className="block text-xs font-medium text-slate-600 mb-1.5">{label}</label>}
      <select
        id={id}
        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-800
          focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
