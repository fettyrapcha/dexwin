export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="h-16 border-b border-slate-100 bg-white flex items-center justify-between px-6">
      <div>
        <h1 className="text-base font-semibold text-slate-800">{title}</h1>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
