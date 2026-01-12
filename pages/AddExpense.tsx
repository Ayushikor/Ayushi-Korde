
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Save, Sparkles } from 'lucide-react';
import { Category } from '../types';
import { expenseService } from '../services/expenseService';

const AddExpense: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
      <header className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-transform active:scale-90">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-black tracking-tight">{id ? 'Edit Entry' : 'New Entry'}</h1>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Transaction Details</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8 pb-12">
        {/* Large Amount Input */}
        <div className="text-center space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Enter Amount</label>
          <div className="relative inline-block w-full">
            <span className="absolute left-1/2 -translate-x-[90px] top-1/2 -translate-y-1/2 text-3xl font-black text-indigo-500">₹</span>
            <input 
              type="number" 
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full bg-transparent text-center text-6xl font-black text-slate-900 dark:text-white focus:outline-none placeholder-slate-200 dark:placeholder-slate-800 transition-all"
              required
              autoFocus
            />
          </div>
        </div>

        {/* Category Picker */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Select Category</label>
          <div className="grid grid-cols-2 gap-3">
            {Object.values(Category).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`py-4 px-4 rounded-[1.5rem] text-sm font-bold border transition-all duration-300 transform ${
                  category === cat 
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-xl scale-[1.02]' 
                  : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-100 dark:border-slate-800 hover:border-indigo-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Date Picker */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">When?</label>
            <input 
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[1.5rem] py-4 px-6 text-slate-800 dark:text-white font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
              required
            />
          </div>

          {/* Note Input */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">What for?</label>
            <textarea 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Added some notes here..."
              className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[1.5rem] py-4 px-6 text-slate-800 dark:text-white font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm h-28 resize-none"
            />
          </div>
        </div>

        {/* Save Button */}
        <button 
          type="submit"
          className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black text-lg shadow-[0_15px_40px_rgb(79,70,229,0.3)] hover:bg-indigo-700 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3"
        >
          {id ? <Save size={24} /> : <Sparkles size={24} />}
          {id ? 'Update Record' : 'Record Expense'}
        </button>
      </form>
    </div>
  );
};

export default AddExpense;
