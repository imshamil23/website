import { useMemo } from 'react';
import { MdAttachMoney, MdPeople, MdLocationOn, MdCalendarMonth } from 'react-icons/md';
import { getIncentive, formatCurrency } from '../utils/dataUtils';

function KpiCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="kpi-card flex items-start gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="text-white text-xl" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-xl font-bold text-slate-800 font-display mt-0.5 truncate">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5 truncate">{sub}</p>}
      </div>
    </div>
  );
}

export default function KpiCards({ data, selectedFY }) {
  const stats = useMemo(() => {
    const total = data.reduce((sum, r) => sum + getIncentive(r), 0);
    const branchMap = {};
    data.forEach(r => {
      const b = r['Branch'];
      if (b) branchMap[b] = (branchMap[b] || 0) + getIncentive(r);
    });
    const topBranch = Object.entries(branchMap).sort((a, b) => b[1] - a[1])[0];
    const months = new Set(data.map(r => r['Month-Yy']).filter(Boolean)).size;
    return { total, topBranch, months };
  }, [data]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <KpiCard icon={MdAttachMoney} label="Total Incentive" value={formatCurrency(stats.total)} sub="Net incentive credited" color="bg-accent" />
      <KpiCard icon={MdPeople} label="Total Records" value={data.length.toLocaleString()} sub="Incentive entries" color="bg-emerald-500" />
      <KpiCard icon={MdLocationOn} label="Top Branch" value={stats.topBranch ? stats.topBranch[0] : '—'} sub={stats.topBranch ? formatCurrency(stats.topBranch[1]) : ''} color="bg-violet-500" />
      <KpiCard icon={MdCalendarMonth} label="Financial Year" value={selectedFY === 'all' ? 'All Years' : selectedFY} sub={`${stats.months} month${stats.months !== 1 ? 's' : ''} of data`} color="bg-amber-500" />
    </div>
  );
}
