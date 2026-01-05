
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Edit3, ShoppingBag, Coffee, Car, FileText, Package } from 'lucide-react';
import { expenseService } from '../services/expenseService';
import { Expense, Category } from '../types';

const CategoryIcon = ({ category }: { category: Category }) => {
  const iconSize = 20;
  switch (category) {
    case Category.FOOD: return <Coffee size={iconSize} className="text-orange-500" />;
    case Category.TRAVEL: return <Car size={iconSize} className="text-blue-500" />;
    case Category.SHOPPING: return <ShoppingBag size={iconSize} className="text-purple-500" />;
    case Category.BILLS: return <FileText size={iconSize} className="text-red-500" />;
    default: return <Package size={iconSize} className="text-slate-500" />;
  }
};

const Dashboard: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const navigate = useNavigate();

  const loadData = useCallback(() => {
    setExpenses(expenseService.getExpenses());
    setMonthlyTotal(expenseService.getMonthlyTotal());
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this expense?')) {
      expenseService.deleteExpense(id);
      loadData();
    }
  };

  return (
    <div className="p-5 animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Hello!</h1>
        <p className="text-slate-500">Track your daily spending easily.</p>
      </header>

      {/* Total Card */}
      <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl mb-8 transform transition-hover hover:scale-[1.02]">
        <span className="text-sm opacity-80 uppercase tracking-widest font-semibold">Total Expenses (Month)</span>
        <div className="flex items-baseline gap-1 mt-2">
          <span className="text-3xl font-bold">₹{monthlyTotal.toLocaleString('en-IN')}</span>
          <span className="text-sm opacity-70">.00</span>
        </div>
        <div className="mt-4 flex justify-between items-center text-xs">
          <div className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
            {expenses.length} Total items
          </div>
          <button 
             onClick={() => navigate('/summary')}
             className="text-white font-medium underline underline-offset-4"
          >
            See breakdown
          </button>
        </div>
      </div>

      {/* Recent List */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-800">Recent Transactions</h2>
          <button onClick={loadData} className="text-xs text-indigo-600 font-semibold">Refresh</button>
        </div>

        {expenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Package size={48} strokeWidth={1} className="mb-2 opacity-20" />
            <p className="text-sm">No expenses yet. Add one!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {expenses.slice(0, 10).map((expense) => (
              <div 
                key={expense.id} 
                className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-slate-100 group transition-all hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <CategoryIcon category={expense.category} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 text-sm leading-tight">{expense.category}</h3>
                    <p className="text-[11px] text-slate-400 mt-1 uppercase font-medium tracking-tighter">
                      {new Date(expense.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      {expense.note && ` • ${expense.note}`}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="font-bold text-slate-800">-₹{expense.amount.toLocaleString('en-IN')}</span>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => navigate(`/edit/${expense.id}`)} className="text-slate-400 hover:text-indigo-500">
                      <Edit3 size={14} />
                    </button>
                    <button onClick={() => handleDelete(expense.id)} className="text-slate-400 hover:text-red-500">
                      <Trash2 size={14} />
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
