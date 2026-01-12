
import { Expense, Category, Budget } from '../types';

const STORAGE_KEY = 'expense_tracker_data';
const BUDGET_KEY = 'expense_tracker_budget';

export const expenseService = {
  getExpenses: (): Expense[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    try {
      return JSON.parse(data).sort((a: Expense, b: Expense) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    } catch (e) {
      console.error("Failed to parse expenses", e);
      return [];
    }
  },

  getExpensesByMonth: (month: number, year: number): Expense[] => {
    return expenseService.getExpenses().filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });
  },

  saveExpense: (expense: Omit<Expense, 'id' | 'createdAt'>): Expense => {
    const expenses = expenseService.getExpenses();
    const newExpense: Expense = {
      ...expense,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
    };
    expenses.push(newExpense);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    return newExpense;
  },

  updateExpense: (id: string, updatedData: Partial<Expense>): void => {
    const expenses = expenseService.getExpenses();
    const index = expenses.findIndex(e => e.id === id);
    if (index !== -1) {
      expenses[index] = { ...expenses[index], ...updatedData };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    }
  },

  deleteExpense: (id: string): void => {
    const expenses = expenseService.getExpenses();
    const filtered = expenses.filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  getMonthlyTotal: (month: number, year: number): number => {
    return expenseService.getExpensesByMonth(month, year)
      .reduce((sum, e) => sum + e.amount, 0);
  },

  // Budget Methods
  getBudget: (month: number, year: number): number => {
    const data = localStorage.getItem(BUDGET_KEY);
    if (!data) return 0;
    const budgets: Budget[] = JSON.parse(data);
    const found = budgets.find(b => b.month === month && b.year === year);
    return found ? found.amount : 0;
  },

  saveBudget: (month: number, year: number, amount: number): void => {
    const data = localStorage.getItem(BUDGET_KEY);
    let budgets: Budget[] = data ? JSON.parse(data) : [];
    const index = budgets.findIndex(b => b.month === month && b.year === year);
    if (index !== -1) {
      budgets[index].amount = amount;
    } else {
      budgets.push({ month, year, amount });
    }
    localStorage.setItem(BUDGET_KEY, JSON.stringify(budgets));
  },

  // Export
  exportToCSV: (month: number, year: number) => {
    const expenses = expenseService.getExpensesByMonth(month, year);
    const headers = ['Date', 'Category', 'Amount', 'Note'];
    const rows = expenses.map(e => [
      new Date(e.date).toLocaleDateString(),
      e.category,
      e.amount,
      e.note.replace(/,/g, ' ')
    ]);
    
    const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `expenses_${month + 1}_${year}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
