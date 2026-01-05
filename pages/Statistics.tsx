
import React from 'react';
import { Award, Target, HelpCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { expenseService } from '../services/expenseService';

const Statistics: React.FC = () => {
  const currentTotal = expenseService.getMonthlyTotal(0);
  const lastTotal = expenseService.getMonthlyTotal(1);
  const diff = currentTotal - lastTotal;
  const percentageChange = lastTotal > 0 ? (diff / lastTotal) * 100 : 0;
  
  const stats = [
    {
      title: 'Current Month',
      value: `₹${currentTotal.toLocaleString('en-IN')}`,
      sub: 'This month so far',
      icon: Target,
      color: 'bg-indigo-500'
    },
    {
      title: 'Last Month',
      value: `₹${lastTotal.toLocaleString('en-IN')}`,
      sub: 'Previous period total',
      icon: Award,
      color: 'bg-emerald-500'
    }
  ];

  return (
    <div className="p-5 animate-in fade-in slide-in-from-right-4 duration-300">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Statistics</h1>
        <p className="text-slate-500">How are you doing this month?</p>
      </header>

      <div className="grid grid-cols-1 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`${stat.color} p-3 rounded-2xl text-white shadow-lg shadow-indigo-100`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{stat.title}</p>
              <p className="text-xl font-bold text-slate-800">{stat.value}</p>
              <p className="text-[10px] text-slate-500">{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-8">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          Insights
          <HelpCircle size={16} className="text-slate-300" />
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50">
            {diff >= 0 ? (
              <ArrowUpRight className="text-red-500 shrink-0 mt-1" />
            ) : (
              <ArrowDownRight className="text-green-500 shrink-0 mt-1" />
            )}
            <div>
              <p className="text-sm font-semibold text-slate-700">
                {diff >= 0 
                  ? `Spending is up by ${Math.abs(percentageChange).toFixed(1)}% compared to last month.` 
                  : `Great job! Spending is down by ${Math.abs(percentageChange).toFixed(1)}% compared to last month.`}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {diff >= 0 
                  ? "Try checking your 'Shopping' or 'Other' categories to see where you can save." 
                  : "You're doing better than last month. Keep it up!"}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl border-2 border-dashed border-slate-100 text-center">
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mb-1">Daily Average</p>
            <p className="text-2xl font-bold text-slate-800">₹{(currentTotal / new Date().getDate()).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      <div className="p-4 bg-indigo-50 rounded-2xl text-center">
        <p className="text-xs text-indigo-600 font-medium">Tip: Track every expense, no matter how small, to get the most accurate insights!</p>
      </div>
    </div>
  );
};

export default Statistics;
