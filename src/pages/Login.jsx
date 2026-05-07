import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MdAutoGraph, MdBadge, MdLock, MdVisibility, MdVisibilityOff, MdLogin } from 'react-icons/md';

export default function Login() {
  const [empCode, setEmpCode] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!empCode.trim() || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true); setError('');
    await new Promise(r => setTimeout(r, 400));
    const result = login(empCode.trim(), password);
    setLoading(false);
    if (result.success) navigate('/dashboard');
    else setError('Invalid Employee Code or Password. Please try again.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E3A5F] to-[#0F172A] flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `radial-gradient(circle at 25px 25px, white 2px, transparent 0)`, backgroundSize: '50px 50px' }} />
      <div className="relative w-full max-w-sm">
        <div className="bg-white rounded-3xl shadow-2xl shadow-black/30 p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
              <MdAutoGraph className="text-white text-3xl" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 font-display">IncentiveIQ</h1>
            <p className="text-slate-400 text-sm mt-1">Employee Incentive Portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Employee Code</label>
              <div className="relative">
                <MdBadge className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 text-lg" />
                <input type="text" value={empCode} onChange={e => { setEmpCode(e.target.value); setError(''); }}
                  placeholder="e.g. AM00161"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                  autoComplete="username" spellCheck={false} />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Password</label>
              <div className="relative">
                <MdLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 text-lg" />
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                  autoComplete="current-password" />
                <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors" tabIndex={-1}>
                  {showPass ? <MdVisibilityOff className="text-lg" /> : <MdVisibility className="text-lg" />}
                </button>
              </div>
            </div>

            {error && <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-xs text-red-600 font-medium">{error}</div>}

            <button type="submit" disabled={loading}
              className="w-full bg-accent hover:bg-blue-600 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-500/30 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed font-display text-sm">
              {loading ? <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> : <MdLogin className="text-lg" />}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-xs text-slate-300 mt-6">Internal portal · Authorized personnel only</p>
        </div>
      </div>
    </div>
  );
}
