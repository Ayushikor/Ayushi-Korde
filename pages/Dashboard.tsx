import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Trash2, Edit3, ShoppingBag, Coffee, Car, FileText, Package, 
  ChevronDown, Search, Filter, X, Download, TrendingUp, AlertTriangle, ChevronLeft, ChevronRight
} from 'lucide-react';
import { expenseService } from '../services/expenseService';
import { Expense, Category } from '../types';
import { useTheme } from '../App';

const CategoryIcon = ({ category }: { category: Category }) => {
  const iconSize = 20;
  switch (category) {
    case Category.FOOD: return <div className="bg-orange-100 dark:bg-orange-900/30 p-2.5 rounded-2xl transition-colors"><Coffee size={iconSize} className="text-orange-600 dark:text-orange-400" /></div>;
    case Category.TRAVEL: return <div className="bg-blue-100 dark:bg-blue-900/30 p-2.5 rounded-2xl transition-colors"><Car size={iconSize} className="text-blue-600 dark:text-blue-400" /></div>;
    case Category.SHOPPING: return <div className="bg-purple-100 dark:bg-purple-900/30 p-2.5 rounded-2xl transition-colors"><ShoppingBag size={iconSize} className="text-purple-600 dark:text-purple-400" /></div>;
    case Category.BILLS: return <div className="bg-red-100 dark:bg-red-900/30 p-2.5 rounded-2xl transition-colors"><FileText size={iconSize} className="text-red-600 dark:text-red-400" /></div>;
    default: return <div className="bg-slate-100 dark:bg-slate-800 p-2.5 rounded-2xl transition-colors"><Package size={iconSize} className="text-slate-500 dark:text-slate-400" /></div>;
  }
};

const Dashboard: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budget, setBudget] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'All'>('All');

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const loadData = useCallback(() => {
    const data = expenseService.getExpensesByMonth(month, year);
    setExpenses(data);
    setBudget(expenseService.getBudget(month, year));
  }, [month, year]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const monthlyTotal = useMemo(() => expenses.reduce((s, e) => s + e.amount, 0), [expenses]);
  const budgetPercentage = budget > 0 ? (monthlyTotal / budget) * 100 : 0;
  
  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => {
      const matchesSearch = e.note.toLowerCase().includes(searchQuery.toLowerCase()) || e.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || e.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [expenses, searchQuery, categoryFilter]);

  const handleDelete = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    expenseService.deleteExpense(id);
  };

  const handleSetBudget = () => {
    const val = prompt('Enter monthly budget amount:', budget.toString());
    if (val !== null) {
      const num = parseFloat(val);
      if (!isNaN(num)) {
        expenseService.saveBudget(month, year, num);
        setBudget(num);
      }
    }
  };

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentDate(newDate);
  };

  return (
    <div className="p-5 space-y-6 animate-in fade-in duration-500">
      {/* Month Selector & Tools */}
      <div className="flex justify-between items-center gap-3">
        <div className="flex-1 flex items-center justify-between bg-white dark:bg-slate-900 px-4 py-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          <button onClick={() => changeMonth(-1)} className="p-1 text-slate-400 hover:text-indigo-500 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <span className="font-bold text-sm text-slate-800 dark:text-slate-100">
            {currentDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={() => changeMonth(1)} className="p-1 text-slate-400 hover:text-indigo-500 transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
        <div className="flex gap-2">
           <button onClick={() => setShowSearch(!showSearch)} className={`p-3 rounded-2xl border transition-all active:scale-90 ${showSearch ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-900/30 dark:border-indigo-800 dark:text-indigo-400' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-500'}`}>
             <Search size={18} />
           </button>
           <button onClick={() => expenseService.exportToCSV(month, year)} className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm text-slate-500 transition-all active:scale-90">
             <Download size={18} />
           </button>
        </div>
      </div>

      {showSearch && (
        <div className="flex gap-2 animate-in slide-in-from-top-2 duration-300">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              autoFocus
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none text-sm text-slate-900 dark:text-white transition-all shadow-inner"
            />
          </div>
          <button onClick={() => { setShowSearch(false); setSearchQuery(''); }} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-500">
            <X size={18} />
          </button>
        </div>
      )}

      {/* Hero Budget Card */}
      <div className={`relative overflow-hidden rounded-[2.5rem] p-8 shadow-2xl transition-all duration-500 ${theme === 'dark' ? 'bg-indigo-600/90' : 'bg-indigo-600'} text-white`}>
        <div className="flex justify-between items-start relative z-10">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] opacity-80">Monthly Expenses</span>
            <div className="mt-2">
              <span className="text-4xl font-black tracking-tight">₹{monthlyTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>
          <button onClick={handleSetBudget} className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-5 py-2.5 rounded-2xl text-xs font-bold transition-all border border-white/20">
            {budget > 0 ? 'Edit Goal' : 'Set Goal'}
          </button>
        </div>

        {budget > 0 && (
          <div className="mt-10 space-y-3 relative z-10">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
              <span className="opacity-80">Budget Spent</span>
              <span>{Math.min(budgetPercentage, 100).toFixed(0)}%</span>
            </div>
            <div className="h-4 w-full bg-black/20 rounded-full overflow-hidden p-1 backdrop-blur-sm border border-white/10">
              <div 
                className={`h-full transition-all duration-1000 ease-out rounded-full ${budgetPercentage > 90 ? 'bg-rose-400' : budgetPercentage > 75 ? 'bg-amber-400' : 'bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.5)]'}`}
                style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
              />
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-[11px] font-bold opacity-90">₹{(budget - monthlyTotal).toLocaleString('en-IN')} left</span>
              {budgetPercentage > 85 && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-red-500/30 rounded-full text-[10px] font-black uppercase tracking-tighter border border-red-500/20 animate-pulse">
                  <AlertTriangle size={12} />
                  <span>Limit reached!</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Decorative elements */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-56 h-56 bg-indigo-400/20 rounded-full blur-[80px] pointer-events-none" />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
        {['All', ...Object.values(Category)].map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat as any)}
            className={`px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all border shadow-sm ${
              categoryFilter === cat 
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white scale-105' 
              : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Transactions */}
      <section className="space-y-5 pb-8">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-xl font-black tracking-tight text-slate-800 dark:text-white">Recent Activity</h2>
          <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-bold text-slate-500 uppercase tracking-widest">{filteredExpenses.length} Records</span>
        </div>

        {filteredExpenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-white dark:bg-slate-900/50 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800/50">
            <div className="bg-slate-50 dark:bg-slate-900 p-10 rounded-full mb-6 transition-colors">
               <Package size={50} strokeWidth={1} className="opacity-30" />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-60 text-center leading-relaxed">No data for this period<br/>Start by adding an expense</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredExpenses.map((expense) => (
              <div 
                key={expense.id} 
                className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] flex items-center justify-between shadow-sm border border-slate-50 dark:border-slate-800 transition-all hover:shadow-lg hover:border-indigo-100 dark:hover:border-indigo-900/50 group"
              >
                <div className="flex items-center gap-5">
                  <CategoryIcon category={expense.category} />
                  <div>
                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">{expense.category}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        {new Date(expense.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                      {expense.note && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700" />
                          <span className="text-[10px] text-indigo-500 dark:text-indigo-400 font-medium italic truncate max-w-[120px]">{expense.note}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="font-black text-slate-900 dark:text-white text-base">₹{expense.amount.toLocaleString('en-IN')}</span>
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => navigate(`/edit/${expense.id}`)} className="p-2 text-slate-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                      <Edit3 size={15} />
                    </button>
                    <button onClick={() => handleDelete(expense.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;