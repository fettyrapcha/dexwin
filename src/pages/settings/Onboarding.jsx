import { CheckCircle, Circle, Clock, ChevronRight } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import { checklistSteps } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';
import Badge from '../../components/ui/Badge';

const iconMap = {
  'Complete':    <CheckCircle size={18} className="text-brand-500" />,
  'In Progress': <Clock size={18} className="text-amber-500" />,
  'Not Started': <Circle size={18} className="text-slate-300" />,
};

export default function Onboarding() {
  const navigate = useNavigate();
  const completed = checklistSteps.filter(s => s.status === 'Complete').length;

  return (
    <div>
      <PageHeader
        title="Onboarding Checklist"
        subtitle="Complete all steps before running payroll"
      />
      <div className="p-6 max-w-xl space-y-4">
        {/* Progress */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-slate-700">Setup Progress</p>
            <p className="text-xs text-slate-500">{completed} / {checklistSteps.length} complete</p>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div className="bg-brand-500 h-2 rounded-full transition-all" style={{ width: `${(completed / checklistSteps.length) * 100}%` }} />
          </div>
        </div>

        {/* Steps */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-card divide-y divide-slate-50 overflow-hidden">
          {checklistSteps.map((step, i) => (
            <div
              key={step.id}
              onClick={() => navigate(step.path)}
              className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="shrink-0">{iconMap[step.status]}</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-700">{step.label}</p>
              </div>
              <Badge label={step.status} />
              <ChevronRight size={14} className="text-slate-300" />
            </div>
          ))}
        </div>

        <div className="text-xs text-slate-400 bg-slate-50 rounded-xl p-3">
          <strong>Note:</strong> KYC completion is not required for payroll preparation. It is only required before actual payment processing begins.
        </div>
      </div>
    </div>
  );
}
