
import React, { useMemo } from 'react';
import { PieChart as PieIcon, TrendingUp, ChevronRight } from 'lucide-react';
import { expenseService } from '../services/expenseService';
import { Category, CategoryBreakdown } from '../types';

const Summary: React.FC = () => {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  const data = useMemo(() => {
    const expenses = expenseService.getExpensesByMonth(month, year);
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    
    const results: CategoryBreakdown[] = Object.values(Category).map(cat => {
      const catExpenses = expenses.filter(e => e.category === cat);
      const catTotal = catExpenses.reduce((sum, e) => sum + e.amount, 0);
      return {
        category: cat,
        total: catTotal,
        percentage: total > 0 ? (catTotal / total) * 100 : 0,
        count: catExpenses.length
      };
    }).sort((a, b) => b.total - a.total);

    return { results, total };
  }, [month, year]);

  // Generate SVG Pie Chart slices
  const chartSlices = useMemo(() => {
    let accumulated = 0;
    const colors = ['#6366f1', '#f59e0b', '#3b82f6', '#ef4444', '#10b981'];
    return data.results.filter(r => r.total > 0).map((r, i) => {
      const start = accumulated;
      accumulated += r.percentage;
      return { 
        ...r, 
        start, 
        end: accumulated, 
        color: colors[i % colors.length] 
      };
    });
  }, [data]);

  return (
    <div className="p-5 space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <header className="mb-2">
        <h1 className="text-3xl font-black tracking-tighter">Insights</h1>
        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">Detailed Analysis</p>
      </header>

      {/* Visual Chart Section */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center">
        {data.total > 0 ? (
          <div className="relative w-48 h-48 mb-8">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              {chartSlices.map((s, i) => {
                const radius = 40;
                const circumference = 2 * Math.PI * radius;
                const offset = circumference - (s.percentage / 100) * circumference;
                const rotation = (s.start / 100) * 360;
                return (
                  <circle
                    key={i}
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="transparent"
                    stroke={s.color}
                    strokeWidth="12"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{ 
                      transformOrigin: '50px 50px',
                      transform: `rotate(${rotation}deg)`,
                      transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)' 
                    }}
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs font-bold text-slate-400 uppercase">Total</span>
              <span className="text-xl font-black">₹{data.total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center text-slate-300">
             <PieIcon size={64} strokeWidth={1} className="opacity-20 mb-2" />
             <p className="text-xs font-bold uppercase tracking-widest">No spending data</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 w-full">
          {chartSlices.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase truncate max-w-[80px]">{s.category}</span>
                <span className="text-xs font-black">{s.percentage.toFixed(0)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* List Breakdown */}
      <div className="space-y-3">
        {data.results.map((res) => (
          <div key={res.category} className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 group hover:border-indigo-500 transition-all duration-300">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-1 h-8 rounded-full ${res.percentage > 40 ? 'bg-red-500' : 'bg-indigo-500'}`} />
                <div>
                  <h3 className="font-bold text-slate-700 dark:text-slate-200">{res.category}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{res.count} items</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-slate-900 dark:text-white text-lg">₹{res.total.toLocaleString('en-IN')}</p>
                <p className={`text-[10px] font-black ${res.percentage > 40 ? 'text-red-400' : 'text-slate-400'}`}>{res.percentage.toFixed(1)}%</p>
              </div>
            </div>
            {/* Tiny progress bar inside list */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${res.percentage > 40 ? 'bg-red-400' : 'bg-indigo-400'}`}
                style={{ width: `${res.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Summary;
