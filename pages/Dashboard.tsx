
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Trash2, Edit3, ShoppingBag, Coffee, Car, FileText, Package, 
  ChevronDown, Search, Filter, X, Download, TrendingUp, AlertTriangle
} from 'lucide-react';
import { expenseService } from '../services/expenseService';
import { Expense, Category } from '../types';
import { useTheme } from '../App';

const CategoryIcon = ({ category }: { category: Category }) => {
  const iconSize = 20;
  switch (category) {
    case Category.FOOD: return <div className="bg-orange-100 dark:bg-orange-950 p-2.5 rounded-xl"><Coffee size={iconSize} className="text-orange-600" /></div>;
    case Category.TRAVEL: return <div className="bg-blue-100 dark:bg-blue-950 p-2.5 rounded-xl"><Car size={iconSize} className="text-blue-600" /></div>;
    case Category.SHOPPING: return <div className="bg-purple-100 dark:bg-purple-950 p-2.5 rounded-xl"><ShoppingBag size={iconSize} className="text-purple-600" /></div>;
    case Category.BILLS: return <div className="bg-red-100 dark:bg-red-950 p-2.5 rounded-xl"><FileText size={iconSize} className="text-red-600" /></div>;
    default: return <div className="bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl"><Package size={iconSize} className="text-slate-500" /></div>;
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
    // Optimistic UI update: Remove from state immediately for instant feedback
    setExpenses(prev => prev.filter(e => e.id !== id));
    // Persist deletion to local storage
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
      {/* Top Controls */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3 py-2 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <button onClick={() => changeMonth(-1)} className="p-1 text-slate-400">‹</button>
          <span className="font-bold text-sm min-w-[100px] text-center">
            {currentDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={() => changeMonth(1)} className="p-1 text-slate-400">›</button>
        </div>
        <div className="flex gap-2">
           <button onClick={() => setShowSearch(!showSearch)} className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all active:scale-90">
             <Search size={18} className="text-slate-500" />
           </button>
           <button onClick={() => expenseService.exportToCSV(month, year)} className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all active:scale-90">
             <Download size={18} className="text-slate-500" />
           </button>
        </div>
      </div>

      {showSearch && (
        <div className="flex gap-2 animate-in slide-in-from-top-2">
          <input 
            autoFocus
            type="text"
            placeholder="Search notes or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
          />
          <button onClick={() => { setShowSearch(false); setSearchQuery(''); }} className="p-3 bg-slate-200 dark:bg-slate-800 rounded-2xl">
            <X size={18} />
          </button>
        </div>
      )}

      {/* Budget & Total Card */}
      <div className={`relative overflow-hidden rounded-[2.5rem] p-7 shadow-2xl transition-all duration-500 ${theme === 'dark' ? 'bg-indigo-600/90' : 'bg-indigo-600'} text-white`}>
        <div className="flex justify-between items-start relative z-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] opacity-70">Monthly Spending</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-4xl font-extrabold tracking-tight">₹{monthlyTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>
          <button onClick={handleSetBudget} className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold transition-all">
            {budget > 0 ? 'Edit Budget' : 'Set Budget'}
          </button>
        </div>

        {budget > 0 && (
          <div className="mt-8 space-y-2 relative z-10">
            <div className="flex justify-between text-xs font-bold">
              <span className="opacity-70">Budget Progress</span>
              <span>{budgetPercentage.toFixed(0)}% used</span>
            </div>
            <div className="h-3 w-full bg-white/20 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ease-out rounded-full ${budgetPercentage > 85 ? 'bg-red-400' : budgetPercentage > 70 ? 'bg-yellow-400' : 'bg-green-400'}`}
                style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
              />
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-[10px] uppercase font-bold opacity-60">Remaining: ₹{(budget - monthlyTotal).toLocaleString('en-IN')}</span>
              {budgetPercentage > 80 && (
                <div className="flex items-center gap-1 text-[10px] text-yellow-300 font-bold animate-pulse">
                  <AlertTriangle size={12} />
                  <span>Nearing Limit!</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Decor */}
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-indigo-400/20 rounded-full blur-3xl" />
      </div>

      {/* Categories Horizontal Scroll */}
      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
        {['All', ...Object.values(Category)].map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat as any)}
            className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
              categoryFilter === cat 
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-lg' 
              : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-100 dark:border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Transaction List */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-black tracking-tight">Transactions</h2>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{filteredExpenses.length} Total</span>
        </div>

        {filteredExpenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400 animate-in zoom-in duration-700">
            <div className="bg-slate-100 dark:bg-slate-900 p-8 rounded-[3rem] mb-4">
               <Package size={64} strokeWidth={1} className="opacity-20" />
            </div>
            <p className="text-sm font-bold uppercase tracking-widest opacity-60 text-center">No expenses yet 🚀<br/>Tap + to add your first expense</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredExpenses.map((expense) => (
              <div 
                key={expense.id} 
                className="bg-white dark:bg-slate-900 p-4 rounded-[2rem] flex items-center justify-between shadow-sm border border-slate-50 dark:border-slate-800/50 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <CategoryIcon category={expense.category} />
                  <div>
                    <h3 className="font-bold text-sm leading-tight group-hover:text-indigo-600 transition-colors">{expense.category}</h3>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 uppercase font-black tracking-tighter">
                      {new Date(expense.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      {expense.note && <span className="text-indigo-400 dark:text-indigo-500 italic ml-1"> • {expense.note}</span>}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className="font-black text-slate-900 dark:text-white">₹{expense.amount.toLocaleString('en-IN')}</span>
                  <div className="flex gap-2">
                    <button onClick={() => navigate(`/edit/${expense.id}`)} className="p-1.5 text-slate-300 hover:text-indigo-500 transition-colors">
                      <Edit3 size={16} />
                    </button>
                    <button onClick={() => handleDelete(expense.id)} className="p-1.5 text-slate-300 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
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
