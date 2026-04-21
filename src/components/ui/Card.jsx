export default function Card({ children, className = '', padding = true }) {
  return (
    <div className={`bg-white rounded-xl border border-slate-100 shadow-card ${padding ? 'p-5' : ''} ${className}`}>
      {children}
    </div>
  );
}

export function StatCard({ label, value, sub, icon: Icon, iconBg = 'bg-brand-50', iconColor = 'text-brand-600', trend }) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-500 font-medium mb-1">{label}</p>
          <p className="text-2xl font-bold text-slate-800">{value}</p>
          {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
        </div>
        {Icon && (
          <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center`}>
            <Icon size={18} className={iconColor} />
          </div>
        )}
      </div>
    </Card>
  );
}
