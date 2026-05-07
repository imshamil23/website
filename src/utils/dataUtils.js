export const INCENTIVE_KEY = "Net Incentive\nto Credit";

export function getIncentive(row) {
  return Number(row[INCENTIVE_KEY]) || 0;
}

export function formatMonthYear(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    const month = d.toLocaleString('en-US', { month: 'short' });
    const year = String(d.getFullYear()).slice(2);
    return `${month}-${year}`;
  } catch {
    return dateStr;
  }
}

export function formatCurrency(val) {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)}Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(2)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
  return `₹${val.toFixed(0)}`;
}

export function unique(arr, key) {
  return [...new Set(arr.map(r => r[key]).filter(Boolean))].sort();
}

export function applyFilters(data, filters) {
  return data.filter(row => {
    if (filters.fy && filters.fy !== 'all' && row['FY'] !== filters.fy) return false;
    if (filters.month && filters.month !== 'all' && row['Month-Yy'] !== filters.month) return false;
    if (filters.branch && filters.branch !== 'all' && row['Branch'] !== filters.branch) return false;
    if (filters.division && filters.division !== 'all' && row['DIVISION'] !== filters.division) return false;
    return true;
  });
}

export function groupSum(data, key) {
  const map = {};
  data.forEach(row => {
    const k = row[key] || 'Unknown';
    map[k] = (map[k] || 0) + getIncentive(row);
  });
  return Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function monthlyTrend(data) {
  const map = {};
  data.forEach(row => {
    const k = row['Month-Yy'];
    if (!k) return;
    map[k] = (map[k] || 0) + getIncentive(row);
  });
  return Object.entries(map)
    .map(([dateStr, value]) => ({ name: formatMonthYear(dateStr), value, dateStr }))
    .sort((a, b) => new Date(a.dateStr) - new Date(b.dateStr));
}
