export default function Button({ children, variant = 'primary', size = 'md', onClick, disabled, className = '', type = 'button', icon: Icon }) {
  const base = 'inline-flex items-center gap-2 font-medium rounded-lg transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm', lg: 'px-5 py-2.5 text-sm' };
  const variants = {
    primary:  'bg-brand-600 text-white hover:bg-brand-700 shadow-sm',
    secondary:'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-sm',
    ghost:    'text-slate-600 hover:bg-slate-100',
    danger:   'bg-red-600 text-white hover:bg-red-700 shadow-sm',
    outline:  'border border-brand-600 text-brand-600 hover:bg-brand-50',
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      {Icon && <Icon size={size === 'sm' ? 13 : 15} />}
      {children}
    </button>
  );
}
