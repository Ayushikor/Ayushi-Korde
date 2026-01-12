import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Save, Sparkles, Calendar, Type, CreditCard } from 'lucide-react';
import { Category } from '../types';
import { expenseService } from '../services/expenseService';
import { useTheme } from '../App';

const AddExpense: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>(Category.OTHER);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (id) {
      const expenses = expenseService.getExpenses();
      const existing = expenses.find(e => e.id === id);
      if (existing) {
        setAmount(existing.amount.toString());
        setCategory(existing.category);
        setDate(existing.date.split('T')[0]);
        setNote(existing.note);
      }
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (id) {
      expenseService.updateExpense(id, {
        amount: val,
        category,
        date: new Date(date).toISOString(),
        note
      });
    } else {
      expenseService.saveExpense({
        amount: val,
        category,
        date: new Date(date).toISOString(),
        note
      });
    }
    navigate('/');
  };

  return (
    <div className="p-6 space-y-8 animate-in slide-in-from-bottom-6 duration-500">
      <header className="flex items-center gap-5">
        <button onClick={() => navigate(-1)} className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-transform active:scale-90 text-slate-500 dark:text-slate-100">
          <ChevronLeft size={22} />
        </button>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">{id ? 'Edit' : 'New'} Record</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Expense details</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-10 pb-12">
        {/* The Giant Amount Input - Fixed Visibility */}
        <div className="text-center space-y-4 py-6 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
          <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">Amount Spent</label>
          <div className="flex items-center justify-center px-4">
            <span className="text-4xl font-black text-indigo-500 mr-2">₹</span>
            <input 
              type="number" 
              inputMode="decimal"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full max-w-[200px] bg-transparent text-center text-6xl font-black text-slate-900 dark:text-white outline-none placeholder:text-slate-200 dark:placeholder:text-slate-800/60"
              required
              autoFocus
            />
          </div>
        </div>

        {/* Category Selector */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <CreditCard size={14} className="text-indigo-500" />
            <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Category</label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {Object.values(Category).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`py-4 px-4 rounded-2xl text-sm font-bold border transition-all duration-300 flex items-center justify-center gap-2 ${
                  category === cat 
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-xl scale-[1.03]' 
                  : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {/* Date Selector */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <Calendar size={14} className="text-indigo-500" />
              <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Date</label>
            </div>
            <input 
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl py-4 px-6 text-slate-800 dark:text-white font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm appearance-none"
              required
            />
          </div>

          {/* Notes Input */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <Type size={14} className="text-indigo-500" />
              <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Note</label>
            </div>
            <textarea 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What was this for? (optional)"
              className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl py-4 px-6 text-slate-800 dark:text-white font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm h-32 resize-none placeholder:text-slate-300 dark:placeholder:text-slate-700"
            />
          </div>
        </div>

        {/* Action Button */}
        <button 
          type="submit"
          className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black text-lg shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:bg-indigo-700 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3 mt-4"
        >
          {id ? <Save size={22} strokeWidth={2.5} /> : <Sparkles size={22} strokeWidth={2.5} />}
          <span className="uppercase tracking-widest">{id ? 'Update Entry' : 'Add Record'}</span>
        </button>
      </form>
    </div>
  );
};

export default AddExpense;