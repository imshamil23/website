import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  LineChart, Line
} from 'recharts';
import { groupSum, monthlyTrend, formatCurrency } from '../utils/dataUtils';

const COLORS = ['#3B82F6','#10B981','#F59E0B','#EF4444','#8B5CF6','#06B6D4','#EC4899','#84CC16'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-100 shadow-lg rounded-xl px-3 py-2 text-xs">
      <p className="font-semibold text-slate-700 mb-1">{label}</p>
      {payload.map((p, i) => <p key={i} style={{ color: p.color }}>{formatCurrency(p.value)}</p>)}
    </div>
  );
};

export default function Charts({ data }) {
  const branchData = useMemo(() => groupSum(data, 'Branch').slice(0, 12), [data]);
  const divisionData = useMemo(() => groupSum(data, 'DIVISION').slice(0, 8), [data]);
  const trendData = useMemo(() => monthlyTrend(data).slice(-18), [data]);

  const tickFmt = v => typeof v === 'number' ? formatCurrency(v) : String(v).length > 10 ? String(v).slice(0,10)+'…' : v;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="chart-card lg:col-span-2">
        <h3 className="text-sm font-semibold text-slate-700 font-display mb-4">Branch-wise Incentive</h3>
        {branchData.length === 0 ? <div className="h-48 flex items-center justify-center text-slate-300 text-sm">No data</div> : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={branchData} margin={{ top: 4, right: 8, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94A3B8' }} angle={-35} textAnchor="end" interval={0} />
              <YAxis tickFormatter={tickFmt} tick={{ fontSize: 10, fill: '#94A3B8' }} width={60} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[4,4,0,0]}>
                {branchData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="chart-card">
        <h3 className="text-sm font-semibold text-slate-700 font-display mb-4">Division-wise Split</h3>
        {divisionData.length === 0 ? <div className="h-48 flex items-center justify-center text-slate-300 text-sm">No data</div> : (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={divisionData} cx="50%" cy="45%" outerRadius={90} innerRadius={48} dataKey="value" nameKey="name">
                {divisionData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Legend formatter={v => <span style={{ fontSize: 10, color: '#64748B' }}>{String(v).length > 14 ? String(v).slice(0,14)+'…' : v}</span>} />
              <Tooltip formatter={v => formatCurrency(v)} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="chart-card lg:col-span-3">
        <h3 className="text-sm font-semibold text-slate-700 font-display mb-4">Monthly Incentive Trend</h3>
        {trendData.length === 0 ? <div className="h-48 flex items-center justify-center text-slate-300 text-sm">No data</div> : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendData} margin={{ top: 4, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <YAxis tickFormatter={tickFmt} tick={{ fontSize: 10, fill: '#94A3B8' }} width={65} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2.5} dot={{ r: 3, fill: '#3B82F6' }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
