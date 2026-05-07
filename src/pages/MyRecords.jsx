import { useState, useMemo, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Filters from '../components/Filters';
import { useAuth } from '../context/AuthContext';
import summaryData from '../data/summary.json';
import { applyFilters, getIncentive, formatCurrency, formatMonthYear } from '../utils/dataUtils';

const PAGE_SIZE = 25;
const DEFAULT_FILTERS = { fy: 'all', month: 'all', branch: 'all', division: 'all' };

export default function MyRecords() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);

  const filteredData = useMemo(() => applyFilters(summaryData, filters), [filters]);
  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));
  const pageData = useMemo(() => filteredData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [filteredData, page]);
  const totalIncentive = useMemo(() => filteredData.reduce((s, r) => s + getIncentive(r), 0), [filteredData]);

  const handleReset = useCallback(() => { setFilters(DEFAULT_FILTERS); setPage(1); }, []);
  const handleFilterChange = useCallback((f) => { setFilters(f); setPage(1); }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar collapsed={!sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar title="My Records" onMenuClick={() => setSidebarOpen(v => !v)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5">

          <div className="bg-gradient-to-r from-accent to-blue-500 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold font-display">
                {user.empName.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()}
              </div>
              <div>
                <h2 className="font-bold text-lg font-display leading-tight">{user.empName}</h2>
                <p className="text-blue-100 text-sm">{user.empCode}</p>
              </div>
              <div className="ml-auto text-right hidden sm:block">
                <p className="text-blue-100 text-xs">Total Incentive</p>
                <p className="text-2xl font-bold font-display">{formatCurrency(totalIncentive)}</p>
              </div>
            </div>
          </div>

          <Filters allData={summaryData} filters={filters} onChange={handleFilterChange} onReset={handleReset} />

          <div className="flex flex-wrap gap-3 text-xs text-slate-500">
            <span className="bg-white border border-slate-100 rounded-lg px-3 py-1.5 font-medium">{filteredData.length.toLocaleString()} records</span>
            <span className="bg-white border border-slate-100 rounded-lg px-3 py-1.5 font-medium text-accent">{formatCurrency(totalIncentive)} total</span>
            <span className="bg-white border border-slate-100 rounded-lg px-3 py-1.5 font-medium">Page {page} of {totalPages}</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    {['#','Branch','Dealership','Division','Month','FY','Incentive'].map(h => (
                      <th key={h} className={`px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide ${h === 'Incentive' ? 'text-right' : 'text-left'}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {pageData.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-12 text-slate-300 text-sm">No records found</td></tr>
                  ) : pageData.map((row, idx) => {
                    const incentive = getIncentive(row);
                    return (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 text-xs text-slate-300 font-mono">{(page-1)*PAGE_SIZE+idx+1}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{row['Branch'] || '—'}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{row['Dealership'] || '—'}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className="bg-blue-50 text-blue-600 rounded-md px-2 py-0.5 text-xs font-medium">{row['DIVISION'] || '—'}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">{formatMonthYear(row['Month-Yy'])}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{row['FY'] || '—'}</td>
                        <td className={`px-4 py-3 text-sm text-right font-semibold font-display ${incentive < 0 ? 'text-red-500' : 'text-emerald-600'}`}>{formatCurrency(incentive)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50">
                <p className="text-xs text-slate-400">Showing {Math.min((page-1)*PAGE_SIZE+1, filteredData.length)}–{Math.min(page*PAGE_SIZE, filteredData.length)} of {filteredData.length.toLocaleString()}</p>
                <div className="flex gap-1">
                  <button disabled={page===1} onClick={() => setPage(p => p-1)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed">← Prev</button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pg = Math.max(1, Math.min(page-2, totalPages-4)) + i;
                    if (pg < 1 || pg > totalPages) return null;
                    return <button key={pg} onClick={() => setPage(pg)} className={`w-8 h-7 rounded-lg text-xs font-medium ${pg===page ? 'bg-accent text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'}`}>{pg}</button>;
                  })}
                  <button disabled={page===totalPages} onClick={() => setPage(p => p+1)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed">Next →</button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
