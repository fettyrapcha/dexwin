import { useState } from 'react';
import { Search, Download, Filter } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { transactions } from '../data/mockData';

const fmt = (n) => `GHS ${Number(n).toLocaleString()}`;

export default function Transactions() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = transactions.filter(tx => {
    const matchSearch = tx.ref.toLowerCase().includes(search.toLowerCase()) || tx.type.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'All' || tx.type === typeFilter;
    const matchStatus = statusFilter === 'All' || tx.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const totalAmount = filtered.reduce((a, tx) => a + tx.amount, 0);

  return (
    <div>
      <PageHeader
        title="Transaction History"
        subtitle="All company payroll transactions"
        actions={
          <>
            <Button variant="secondary" size="sm" icon={Download}>Export CSV</Button>
            <Button variant="secondary" size="sm" icon={Download}>Export PDF</Button>
          </>
        }
      />

      <div className="p-6 space-y-4">
        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by reference or type..."
              className="pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-lg bg-white w-56 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
          <div className="flex items-center gap-1.5">
            {['All', 'Payroll Disbursement', 'Wallet Top-up'].map(t => (
              <button key={t} onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${typeFilter === t ? 'bg-brand-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                {t}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            {['All', 'Successful', 'Pending', 'Failed'].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${statusFilter === s ? 'bg-slate-700 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Summary bar */}
        <div className="flex items-center justify-between bg-white rounded-xl border border-slate-100 shadow-card px-5 py-3">
          <p className="text-xs text-slate-500">{filtered.length} transaction{filtered.length !== 1 ? 's' : ''} in current view</p>
          <p className="text-sm font-bold text-slate-800">Total: {fmt(totalAmount)}</p>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Date', 'Reference', 'Type', 'Amount', 'Source Wallet', 'Recipients', 'Status'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(tx => (
                <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5 text-xs text-slate-500">{tx.date}</td>
                  <td className="px-5 py-3.5 text-xs font-mono text-slate-500">{tx.ref}</td>
                  <td className="px-5 py-3.5 text-sm font-medium text-slate-700">{tx.type}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-slate-800">{fmt(tx.amount)}</td>
                  <td className="px-5 py-3.5 text-xs text-slate-500">{tx.wallet}</td>
                  <td className="px-5 py-3.5 text-xs text-slate-500">{tx.recipients ?? '—'}</td>
                  <td className="px-5 py-3.5"><Badge label={tx.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-slate-400">No transactions match your filters.</div>
          )}
        </div>
      </div>
    </div>
  );
}
