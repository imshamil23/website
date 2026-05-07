import { createContext, useContext, useState } from 'react';
import passwords from '../data/password.json';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('iap_user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  const login = (empCode, password) => {
    const match = passwords.find(
      p => p['Emp Code'].trim() === empCode.trim() && p['PASSWORD'] === password
    );
    if (match) {
      const userData = { empCode: match['Emp Code'].trim(), empName: match['Emp Name'].trim() };
      localStorage.setItem('iap_user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    }
    return { success: false };
  };

  const logout = () => {
    localStorage.removeItem('iap_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
