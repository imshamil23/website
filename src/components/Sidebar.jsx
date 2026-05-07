import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MdDashboard, MdPerson, MdLogout, MdAutoGraph } from 'react-icons/md';

export default function Sidebar({ collapsed, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.empName?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'EM';

  return (
    <>
      {!collapsed && (
        <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={onClose} />
      )}
      <aside className={`fixed top-0 left-0 h-screen z-30 flex flex-col bg-[#0F172A] transition-transform duration-300 w-64 ${collapsed ? '-translate-x-full' : 'translate-x-0'} lg:translate-x-0 lg:static lg:h-screen`}>
        
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
          <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center">
            <MdAutoGraph className="text-white text-xl" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm font-display leading-tight">IncentiveIQ</p>
            <p className="text-slate-400 text-xs">Analytics Portal</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          <p className="text-slate-500 text-xs uppercase tracking-widest px-4 mb-3 font-medium">Menu</p>
          <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onClose}>
            <MdDashboard className="text-lg flex-shrink-0" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/my-records" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onClose}>
            <MdPerson className="text-lg flex-shrink-0" />
            <span>My Records</span>
          </NavLink>
        </nav>

        <div className="px-3 pb-5 border-t border-white/10 pt-4 space-y-3">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-8 h-8 rounded-full bg-accent/30 border border-accent/50 flex items-center justify-center text-accent text-xs font-bold font-display">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">{user?.empName}</p>
              <p className="text-slate-400 text-xs">{user?.empCode}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="sidebar-link w-full text-red-400 hover:bg-red-500/20 hover:text-red-300">
            <MdLogout className="text-lg flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
