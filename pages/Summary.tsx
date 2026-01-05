
import React, { useMemo } from 'react';
import { PieChart, List, TrendingUp } from 'lucide-react';
import { expenseService } from '../services/expenseService';
import { Category, CategoryBreakdown } from '../types';

const Summary: React.FC = () => {
  const breakdown = useMemo(() => {
    const expenses = expenseService.getExpenses();
    const now = new Date();
    const currentMonthExpenses = expenses.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });

    const total = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
    
    const results: CategoryBreakdown[] = Object.values(Category).map(cat => {
      const catExpenses = currentMonthExpenses.filter(e => e.category === cat);
      const catTotal = catExpenses.reduce((sum, e) => sum + e.amount, 0);
      return {
        category: cat,
        total: catTotal,
        percentage: total > 0 ? (catTotal / total) * 100 : 0,
        count: catExpenses.length
      };
    }).sort((a, b) => b.total - a.total);

    return { results, total };
  }, []);

  return (
    <div className="p-5 animate-in fade-in slide-in-from-right-4 duration-300">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Monthly Summary</h1>
        <p className="text-slate-500">{new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</p>
      </header>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
            <TrendingUp size={20} />
          </div>
          <h2 className="font-bold text-slate-700">Spending by Category</h2>
        </div>

        <div className="space-y-6">
          {breakdown.results.filter(r => r.total > 0).length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <PieChart size={40} className="mx-auto mb-2 opacity-20" />
              <p>No data for this month</p>
            </div>
          ) : (
            breakdown.results.filter(r => r.total > 0).map((res) => (
              <div key={res.category} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-slate-700">{res.category}</span>
                  <span className="font-bold text-slate-900">₹{res.total.toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                    style={{ width: `${res.percentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  <span>{res.count} transactions</span>
                  <span>{res.percentage.toFixed(0)}%</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs opacity-50 uppercase font-bold tracking-widest mb-1">Total Spent</p>
            <p className="text-2xl font-bold">₹{breakdown.total.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-white/10 p-4 rounded-2xl">
            <List size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
