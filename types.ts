
export enum Category {
  FOOD = 'Food',
  TRAVEL = 'Travel',
  SHOPPING = 'Shopping',
  BILLS = 'Bills',
  OTHER = 'Other'
}

export interface Expense {
  id: string;
  amount: number;
  category: Category;
  date: string; // ISO string
  note: string;
  createdAt: number;
}

export interface CategoryBreakdown {
  category: Category;
  total: number;
  percentage: number;
  count: number;
}

export interface Budget {
  month: number; // 0-11
  year: number;
  amount: number;
}
