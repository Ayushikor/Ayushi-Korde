
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
        <button onClick={() => navigate(-1)} className="p-3.5 bg-slate-100 dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-transform active:scale-90 text-slate-800 dark:text-white">
          <ChevronLeft size={22} strokeWidth={2.5} />
        </button>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">{id ? 'Edit' : 'New'} Record</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Transaction details</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-10 pb-12">
        {/* Giant Amount Input - High Contrast Fix */}
        <div className="text-center space-y-4 py-8 bg-slate-100 dark:bg-slate-800 rounded-[3rem] border border-slate-200 dark:border-slate-700 shadow-md transition-colors">
          <label className="text-[11px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-[0.3em]">Amount Spent</label>
          <div className="flex items-center justify-center px-4">
            <span className="text-4xl font-black text-indigo-600 dark:text-indigo-400 mr-2">₹</span>
            <input 
              type="number" 
              inputMode="decimal"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full max-w-[200px] bg-transparent text-center text-6xl font-black text-slate-950 dark:text-white outline-none placeholder:text-slate-300 dark:placeholder:text-slate-600 appearance-none"
              style={{ caretColor: '#4f46e5' }}
              required
              autoFocus
            />
          </div>
        </div>

        {/* Category Selector */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1 text-slate-950 dark:text-indigo-400">
            <CreditCard size={14} strokeWidth={2.5} />
            <label className="text-[11px] font-black uppercase tracking-widest">Category</label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {Object.values(Category).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`py-4 px-4 rounded-2xl text-sm font-black border transition-all duration-300 flex items-center justify-center gap-2 ${
                  category === cat 
                  ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 border-slate-950 dark:border-white shadow-xl scale-[1.03]' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600'
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
            <div className="flex items-center gap-2 px-1 text-slate-950 dark:text-indigo-400">
              <Calendar size={14} strokeWidth={2.5} />
              <label className="text-[11px] font-black uppercase tracking-widest">Date</label>
            </div>
            <input 
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 px-6 text-slate-950 dark:text-white font-extrabold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm appearance-none"
              required
            />
          </div>

          {/* Notes Input */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1 text-slate-950 dark:text-indigo-400">
              <Type size={14} strokeWidth={2.5} />
              <label className="text-[11px] font-black uppercase tracking-widest">Optional Note</label>
            </div>
            <textarea 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What did you buy?"
              className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 px-6 text-slate-950 dark:text-white font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm h-32 resize-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
            />
          </div>
        </div>

        {/* Action Button */}
        <button 
          type="submit"
          className="w-full bg-indigo-600 dark:bg-indigo-500 text-white py-5 rounded-3xl font-black text-lg shadow-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3 mt-4"
        >
          {id ? <Save size={22} strokeWidth={2.5} /> : <Sparkles size={22} strokeWidth={2.5} />}
          <span className="uppercase tracking-widest">{id ? 'Update' : 'Confirm Entry'}</span>
        </button>
      </form>
    </div>
  );
};

export default AddExpense;
