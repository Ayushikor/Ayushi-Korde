
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Save } from 'lucide-react';
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
    <div className="p-5 animate-in slide-in-from-bottom-4 duration-300">
      <header className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-600">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-800">{id ? 'Edit Expense' : 'Add Expense'}</h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amount Input */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
            <input 
              type="number" 
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-10 pr-4 text-2xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
              required
            />
          </div>
        </div>

        {/* Category Picker */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Category</label>
          <div className="grid grid-cols-2 gap-3">
            {Object.values(Category).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`py-3 px-4 rounded-xl text-sm font-semibold border transition-all ${
                  category === cat 
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                  : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Date Picker */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Date</label>
          <input 
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
            required
          />
        </div>

        {/* Note Input */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Note (Optional)</label>
          <textarea 
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What was this for?"
            className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm h-24"
          />
        </div>

        {/* Action Button */}
        <button 
          type="submit"
          className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <Save size={20} />
          {id ? 'Save Changes' : 'Add Expense'}
        </button>
      </form>
    </div>
  );
};

export default AddExpense;
