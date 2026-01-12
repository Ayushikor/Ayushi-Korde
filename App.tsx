
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, PieChart, BarChart2, Moon, Sun } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import AddExpense from './pages/AddExpense';
import Summary from './pages/Summary';
import Statistics from './pages/Statistics';

type Theme = 'light' | 'dark';
const ThemeContext = createContext<{ theme: Theme; toggleTheme: () => void }>({ theme: 'light', toggleTheme: () => {} });
export const useTheme = () => useContext(ThemeContext);

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/summary', label: 'Summary', icon: PieChart },
    { path: '/stats', label: 'Stats', icon: BarChart2 },
  ];

  return (
    <div className={`flex flex-col min-h-screen ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} max-w-md mx-auto shadow-2xl relative overflow-hidden transition-colors duration-300`}>
      <header className={`p-4 flex justify-between items-center ${theme === 'dark' ? 'bg-slate-900/50' : 'bg-white/50'} backdrop-blur-md sticky top-0 z-50`}>
        <span className="font-bold tracking-tight text-lg">ExpenseTracker</span>
        <button 
          onClick={toggleTheme}
          className={`p-2 rounded-full ${theme === 'dark' ? 'bg-slate-800 text-yellow-400' : 'bg-slate-100 text-slate-600'} transition-all active:scale-90`}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      <main className="flex-1 pb-24 overflow-y-auto">
        {children}
      </main>

      <Link 
        to="/add"
        className="fixed bottom-24 right-4 bg-indigo-600 text-white p-5 rounded-2xl shadow-[0_8px_30px_rgb(79,70,229,0.3)] hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 z-50 md:right-[calc(50%-180px)]"
      >
        <PlusCircle size={24} />
      </Link>

      <nav className={`fixed bottom-0 left-0 right-0 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border-t px-6 py-4 flex justify-between items-center z-40 max-w-md mx-auto`}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex flex-col items-center gap-1.5 transition-all ${isActive ? 'text-indigo-500 scale-110' : 'text-slate-400 hover:text-slate-500'}`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as Theme) || 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <HashRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<AddExpense />} />
            <Route path="/edit/:id" element={<AddExpense />} />
            <Route path="/summary" element={<Summary />} />
            <Route path="/stats" element={<Statistics />} />
          </Routes>
        </AppLayout>
      </HashRouter>
    </ThemeContext.Provider>
  );
};

export default App;
