import { MdMenu, MdNotifications } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ title, onMenuClick }) {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-slate-100 px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
          <MdMenu className="text-xl" />
        </button>
        <div>
          <h1 className="text-base md:text-lg font-semibold text-slate-800 font-display">{title}</h1>
          <p className="text-xs text-slate-400 hidden md:block">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors relative">
          <MdNotifications className="text-xl" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
        </button>
        <div className="flex items-center gap-2 pl-2 border-l border-slate-100">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-slate-700">{user?.empName}</p>
            <p className="text-xs text-slate-400">{user?.empCode}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
