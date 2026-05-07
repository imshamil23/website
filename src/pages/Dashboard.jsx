import { useState, useMemo, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Filters from '../components/Filters';
import KpiCards from '../components/KpiCards';
import Charts from '../components/Charts';
import summaryData from '../data/summary.json';
import { applyFilters } from '../utils/dataUtils';

const DEFAULT_FILTERS = { fy: 'all', month: 'all', branch: 'all', division: 'all' };

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const filteredData = useMemo(() => applyFilters(summaryData, filters), [filters]);
  const handleReset = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar collapsed={!sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar title="Analytics Dashboard" onMenuClick={() => setSidebarOpen(v => !v)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5">
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5 text-xs text-blue-600 font-medium flex items-center gap-2">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
            Aggregate analytics only · No personal employee data is displayed
          </div>
          <Filters allData={summaryData} filters={filters} onChange={setFilters} onReset={handleReset} />
          <KpiCards data={filteredData} selectedFY={filters.fy} />
          <Charts data={filteredData} />
        </main>
      </div>
    </div>
  );
}
