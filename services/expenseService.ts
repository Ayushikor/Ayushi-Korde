
import { Expense, Category } from '../types';

const STORAGE_KEY = 'expense_tracker_data';

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

  getMonthlyTotal: (monthOffset = 0): number => {
    const expenses = expenseService.getExpenses();
    const now = new Date();
    const targetMonth = now.getMonth() - monthOffset;
    const targetYear = now.getFullYear();
    
    return expenses
      .filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === targetMonth && d.getFullYear() === targetYear;
      })
      .reduce((sum, e) => sum + e.amount, 0);
  }
};
