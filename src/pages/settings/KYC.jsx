import { useState } from 'react';
import { CheckCircle, Upload, Plus, Trash2 } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { Input, Select } from '../../components/ui/Input';

const initialDirectors = [{ id: 1, title: 'Mr', firstName: 'Kwame', lastName: 'Asante', position: 'CEO', isDirector: true, isShareholder: true, isSignatory: false }];

export default function KYC() {
  const [step, setStep] = useState('form');
  const [kycStatus] = useState('Verified');
  const [saved, setSaved] = useState(false);
  const [directors, setDirectors] = useState(initialDirectors);
  const [form, setForm] = useState({
    legalName: 'Dexwin Technologies Ltd.',
    regNumber: 'CS-0012345',
    regDate: '2018-06-15',
    businessType: 'LIMITED_LIABILITY',
    regType: '',
    ownershipType: 'PRIVATE',
    tin: 'C0098765432',
    city: 'Accra',
    streetName: '12 Liberation Road',
    gpsAddress: 'GA-145-3120',
    annualTurnover: '500000',
    sourceOfFunds: 'BUSINESS_PROCEEDS',
    phoneNumber: '+233 30 123 4567',
    industry: 'Technology',
    payrollFrequency: 'MONTHLY',
  });
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const addDirector = () => setDirectors(d => [...d, { id: Date.now(), title: '', firstName: '', lastName: '', position: '', isDirector: false, isShareholder: false, isSignatory: false }]);
  const removeDirector = (id) => setDirectors(d => d.filter(dir => dir.id !== id));

  if (kycStatus === 'Verified') {
    return (
      <div>
        <PageHeader title="KYC Verification" subtitle="Know Your Customer compliance for payroll disbursement" />
        <div className="p-6">
          <Card className="max-w-md">
            <div className="flex flex-col items-center text-center py-4">
              <CheckCircle size={40} className="text-brand-500 mb-3" />
              <Badge label="Verified" className="mb-2" />
              <h3 className="text-base font-semibold text-slate-800 mt-1">KYC Complete</h3>
              <p className="text-sm text-slate-500 mt-1">Your Affinity business account is active and ready for payroll disbursement.</p>
              <p className="text-xs text-slate-400 mt-2">Affinity Ref: {form.tin}</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="KYC Verification"
        subtitle="Complete your company's KYC to enable payroll disbursements"
        actions={
          <>
            <Button variant="secondary" size="sm" onClick={() => setSaved(true)}>Save Progress</Button>
            <Button variant="primary" size="sm" onClick={() => setStep('submitted')}>Submit KYC</Button>
          </>
        }
      />
      <div className="p-6 space-y-4 max-w-3xl">
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700">
          KYC completion is required only for actual salary payment processing. You may prepare payroll runs without completing KYC.
        </div>

        {/* Business Details */}
        <Card>
          <h3 className="text-sm font-semibold text-slate-700 border-b border-slate-100 pb-3 mb-4">Business Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Legal Name *" value={form.legalName} onChange={set('legalName')} className="col-span-2" />
            <Input label="Registration Number *" value={form.regNumber} onChange={set('regNumber')} />
            <Input label="Registration Date *" type="date" value={form.regDate} onChange={set('regDate')} />
            <Select label="Business Type *" value={form.businessType} onChange={set('businessType')}>
              <option value="SOLE_PROPRIETOR">Sole Proprietor</option>
              <option value="PARTNERSHIP">Partnership</option>
              <option value="NON_PROFIT">Non-Profit</option>
              <option value="LIMITED_LIABILITY">Limited Liability</option>
              <option value="GOVERNMENT_ORGANISATION">Government Organisation</option>
            </Select>
            <Select label="Ownership Type *" value={form.ownershipType} onChange={set('ownershipType')}>
              <option value="PRIVATE">Private</option>
              <option value="PUBLIC">Public</option>
            </Select>
            <Input label="TIN *" value={form.tin} onChange={set('tin')} />
            <Input label="Industry / Sector" value={form.industry} onChange={set('industry')} />
            <Input label="City *" value={form.city} onChange={set('city')} />
            <Input label="Street Name *" value={form.streetName} onChange={set('streetName')} />
            <Input label="Ghana GPS Address" value={form.gpsAddress} onChange={set('gpsAddress')} />
            <Input label="Phone Number *" value={form.phoneNumber} onChange={set('phoneNumber')} />
            <Input label="Annual Turnover (GHS)" type="number" value={form.annualTurnover} onChange={set('annualTurnover')} />
            <Select label="Source of Funds *" value={form.sourceOfFunds} onChange={set('sourceOfFunds')}>
              <option value="BUSINESS_PROCEEDS">Business Proceeds</option>
              <option value="REMITTANCES">Remittances</option>
            </Select>
            <Select label="Payroll Frequency" value={form.payrollFrequency} onChange={set('payrollFrequency')}>
              <option value="MONTHLY">Monthly</option>
              <option value="QUARTERLY">Quarterly</option>
              <option value="YEARLY">Yearly</option>
            </Select>
          </div>
        </Card>

        {/* Documents */}
        <Card>
          <h3 className="text-sm font-semibold text-slate-700 border-b border-slate-100 pb-3 mb-4">Document Uploads</h3>
          <p className="text-xs text-slate-500 mb-3">PDF, JPG, or PNG — max 10MB each</p>
          <div className="grid grid-cols-2 gap-3">
            {['Certificate of Incorporation', 'Certificate of Registration', 'Annual Renewal Receipt', 'Business Regulation File'].map(doc => (
              <div key={doc} className="border border-dashed border-slate-200 rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors">
                <Upload size={16} className="text-slate-400 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-slate-600">{doc}</p>
                  <p className="text-xs text-slate-400">Click to upload</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Directors */}
        <Card>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-sm font-semibold text-slate-700">Directors & Shareholders (≥10% ownership)</h3>
            <Button variant="secondary" size="sm" icon={Plus} onClick={addDirector}>Add Person</Button>
          </div>
          <div className="space-y-4">
            {directors.map((dir, i) => (
              <div key={dir.id} className="bg-slate-50 rounded-xl p-4 space-y-3 relative">
                {directors.length > 1 && (
                  <button onClick={() => removeDirector(dir.id)} className="absolute top-3 right-3 text-slate-400 hover:text-red-500">
                    <Trash2 size={14} />
                  </button>
                )}
                <p className="text-xs font-semibold text-slate-500">Person {i + 1}</p>
                <div className="grid grid-cols-3 gap-3">
                  <Select label="Title">
                    <option>Mr</option><option>Mrs</option><option>Ms</option><option>Dr</option>
                  </Select>
                  <Input label="First Name" defaultValue={dir.firstName} />
                  <Input label="Last Name" defaultValue={dir.lastName} />
                  <Input label="Position" defaultValue={dir.position} />
                  <Input label="Phone" placeholder="+233..." />
                  <Input label="Ghana GPS Address" />
                </div>
                <div className="flex items-center gap-4 pt-1">
                  {['isDirector', 'isShareholder', 'isSignatory'].map(flag => (
                    <label key={flag} className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                      <input type="checkbox" defaultChecked={dir[flag]} className="accent-brand-600" />
                      {flag === 'isDirector' ? 'Director' : flag === 'isShareholder' ? 'Shareholder' : 'Signatory'}
                    </label>
                  ))}
                </div>
                <p className="text-xs text-slate-400">Ghana Card and live selfie (photoKey) required per Affinity requirements.</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
