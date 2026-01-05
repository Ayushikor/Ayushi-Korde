
import React from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, PieChart, BarChart2 } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import AddExpense from './pages/AddExpense';
import Summary from './pages/Summary';
import Statistics from './pages/Statistics';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/summary', label: 'Summary', icon: PieChart },
    { path: '/stats', label: 'Stats', icon: BarChart2 },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 max-w-md mx-auto shadow-xl relative overflow-hidden">
      {/* Main Content Area */}
      <main className="flex-1 pb-24 overflow-y-auto">
        {children}
      </main>

      {/* Floating Action Button */}
      <Link 
        to="/add"
        className="fixed bottom-20 right-4 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-transform active:scale-95 z-50 md:right-[calc(50%-180px)]"
      >
        <PlusCircle size={24} />
      </Link>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-40 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

const App: React.FC = () => {
  return (
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
  );
};

export default App;
