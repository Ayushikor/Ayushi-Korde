
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, PieChart, BarChart2, Moon, Sun } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import AddExpense from './pages/AddExpense';
import Summary from './pages/Summary';
import Statistics from './pages/Statistics';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';

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
    <div className={`flex flex-col min-h-screen ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-950'} max-w-md mx-auto relative overflow-hidden transition-colors duration-300 md:shadow-2xl`}>
      <PWAInstallPrompt />
      
      <header className={`p-5 flex justify-between items-center ${theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-100'} backdrop-blur-md sticky top-0 z-50 border-b`}>
        <span className="font-black tracking-tighter text-2xl bg-gradient-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent">ExpensePro</span>
        <button 
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-slate-800 text-yellow-400' : 'bg-slate-100 text-slate-800'} transition-all active:scale-90`}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      <main className="flex-1 pb-32 overflow-y-auto no-scrollbar">
        {children}
      </main>

      <Link 
        to="/add"
        aria-label="Add Expense"
        className="fixed bottom-28 right-6 bg-indigo-600 text-white p-5 rounded-[2rem] shadow-2xl hover:bg-indigo-700 transition-all hover:scale-110 active:scale-90 z-50 md:right-[calc(50%-180px)]"
      >
        <PlusCircle size={32} strokeWidth={2.5} />
      </Link>

      <nav className={`fixed bottom-0 left-0 right-0 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} border-t px-8 py-6 flex justify-between items-center z-40 max-w-md mx-auto rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)]`}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex flex-col items-center gap-2 transition-all duration-300 ${isActive ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}
            >
              <Icon size={28} strokeWidth={isActive ? 3 : 2} />
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isActive ? 'opacity-100' : 'opacity-60'}`}>{item.label}</span>
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
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
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
