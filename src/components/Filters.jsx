import { useMemo } from 'react';
import { unique, formatMonthYear } from '../utils/dataUtils';
import { MdFilterAlt, MdRefresh } from 'react-icons/md';

export default function Filters({ allData, filters, onChange, onReset }) {
  const options = useMemo(() => ({
    fy: unique(allData, 'FY'),
    month: unique(allData, 'Month-Yy'),
    branch: unique(allData, 'Branch'),
    division: unique(allData, 'DIVISION'),
  }), [allData]);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-slate-600">
          <MdFilterAlt className="text-accent text-lg" />
          <span className="text-sm font-semibold font-display">Filters</span>
        </div>
        <button onClick={onReset} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-accent transition-colors px-2 py-1 rounded-lg hover:bg-slate-50">
          <MdRefresh className="text-sm" />
          Reset
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className="text-xs text-slate-400 font-medium block mb-1">Financial Year</label>
          <select className="filter-select w-full" value={filters.fy} onChange={e => onChange({ ...filters, fy: e.target.value })}>
            <option value="all">All Years</option>
            {options.fy.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-400 font-medium block mb-1">Month</label>
          <select className="filter-select w-full" value={filters.month} onChange={e => onChange({ ...filters, month: e.target.value })}>
            <option value="all">All Months</option>
            {options.month.map(v => <option key={v} value={v}>{formatMonthYear(v)}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-400 font-medium block mb-1">Branch</label>
          <select className="filter-select w-full" value={filters.branch} onChange={e => onChange({ ...filters, branch: e.target.value })}>
            <option value="all">All Branches</option>
            {options.branch.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-400 font-medium block mb-1">Division</label>
          <select className="filter-select w-full" value={filters.division} onChange={e => onChange({ ...filters, division: e.target.value })}>
            <option value="all">All Divisions</option>
            {options.division.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}
