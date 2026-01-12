
import React, { useMemo } from 'react';
import { Award, Target, HelpCircle, ArrowUpRight, ArrowDownRight, Zap, Coffee, ShoppingBag, Car } from 'lucide-react';
import { expenseService } from '../services/expenseService';
import { Category } from '../types';

const Statistics: React.FC = () => {
  const now = new Date();
  const currentTotal = expenseService.getMonthlyTotal(now.getMonth(), now.getFullYear());
  
  const lastMonth = new Date(now);
  lastMonth.setMonth(now.getMonth() - 1);
  const lastTotal = expenseService.getMonthlyTotal(lastMonth.getMonth(), lastMonth.getFullYear());
  
  const diff = currentTotal - lastTotal;
  const percentageChange = lastTotal > 0 ? (diff / lastTotal) * 100 : 0;

  const insights = useMemo(() => {
    const list = [];
    const currentExpenses = expenseService.getExpensesByMonth(now.getMonth(), now.getFullYear());
    const prevExpenses = expenseService.getExpensesByMonth(lastMonth.getMonth(), lastMonth.getFullYear());

    // Category Specific Logic
    const foodCurrent = currentExpenses.filter(e => e.category === Category.FOOD).reduce((s, e) => s + e.amount, 0);
    const foodPrev = prevExpenses.filter(e => e.category === Category.FOOD).reduce((s, e) => s + e.amount, 0);
    
    if (foodCurrent > foodPrev && foodPrev > 0) {
      list.push({ text: "Food expenses increased compared to last month. 🍔", type: 'warning', icon: Coffee });
    } else if (foodCurrent < foodPrev && foodCurrent > 0) {
      list.push({ text: "You spent less on Food this month! Great job. 🥦", type: 'success', icon: Coffee });
    }

    const shopCurrent = currentExpenses.filter(e => e.category === Category.SHOPPING).reduce((s, e) => s + e.amount, 0);
    if (shopCurrent > currentTotal * 0.4) {
      list.push({ text: "Shopping is over 40% of your total spending. 📈", type: 'warning', icon: ShoppingBag });
    }

    if (currentTotal > lastTotal && lastTotal > 0) {
      list.push({ text: "Overall spending is trending upwards. 🚀", type: 'info', icon: Target });
    }

    return list;
  }, [currentTotal, lastTotal]);

  return (
    <div className="p-5 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight">Financial Health</h1>
        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">Growth & Trends</p>
      </header>

      {/* Main Stats Card */}
      <div className="bg-slate-900 dark:bg-indigo-950 rounded-[2.5rem] p-7 text-white shadow-2xl relative overflow-hidden">
        <div className="flex justify-between items-center mb-6 relative z-10">
          <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md">
            <Zap size={24} className="text-yellow-400" />
          </div>
          <div className="text-right">
             <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Avg Daily</span>
             <p className="font-black text-xl">₹{(currentTotal / now.getDate()).toFixed(0)}</p>
          </div>
        </div>
        
        <div className="space-y-1 relative z-10">
          <span className="text-xs font-bold uppercase opacity-60 tracking-widest">Growth since last month</span>
          <div className="flex items-center gap-2">
            <p className="text-4xl font-black">{Math.abs(percentageChange).toFixed(1)}%</p>
            {diff >= 0 ? <ArrowUpRight className="text-red-400" size={32} strokeWidth={3} /> : <ArrowDownRight className="text-green-400" size={32} strokeWidth={3} />}
          </div>
          <p className="text-xs opacity-70 font-medium">Compared to last month's ₹{lastTotal.toLocaleString('en-IN')}</p>
        </div>

        <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl" />
      </div>

      {/* Smart Insights */}
      <div className="space-y-4">
        <h3 className="font-black text-lg tracking-tight flex items-center gap-2">
          Smart Insights
          <div className="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-ping" />
        </h3>
        
        {insights.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] text-center border border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-400 font-bold">Collecting more data for insights...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {insights.map((insight, i) => (
              <div key={i} className={`p-5 rounded-[2rem] flex gap-4 items-start shadow-sm border ${
                insight.type === 'warning' ? 'bg-red-50 dark:bg-red-950/30 border-red-100 dark:border-red-900/50' : 
                insight.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/50' :
                'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-100 dark:border-indigo-900/50'
              }`}>
                <div className={`p-2 rounded-xl shrink-0 ${
                  insight.type === 'warning' ? 'bg-red-100 text-red-600' : 
                  insight.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                  'bg-indigo-100 text-indigo-600'
                }`}>
                  <insight.icon size={20} />
                </div>
                <p className="text-sm font-bold leading-relaxed py-1">{insight.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tip of the day */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-[2rem] text-white shadow-lg">
        <h4 className="font-black text-xs uppercase tracking-widest mb-2 opacity-80">Pro Tip</h4>
        <p className="text-sm font-bold italic leading-relaxed">
          "The fastest way to reach your budget goal is to cut down on small recurring 'Other' expenses."
        </p>
      </div>
    </div>
  );
};

export default Statistics;
