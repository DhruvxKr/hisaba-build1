export type Category = 
  | 'Food'
  | 'Transport'
  | 'Shopping'
  | 'Entertainment'
  | 'Bills'
  | 'Health'
  | 'Travel'
  | 'Education'
  | 'Subscriptions'
  | 'Other';

export type PaymentMethod = 'UPI' | 'Card' | 'Cash' | 'NetBanking';

export interface Expense {
  id: string;
  amount: number;
  merchant: string;
  category: Category;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "09:15 AM"
  paymentMethod: PaymentMethod;
  notes?: string;
  recurring?: boolean;
  createdAt: number;
}

export interface CategoryBudget {
  category: Category;
  limit: number;
  spent: number;
}

export interface UserProfile {
  name: string;
  monthlyBudgetGoal: number;
  currency: string;
  email?: string;
  photoURL?: string;
}

export type ViewTab = 'home' | 'activity' | 'add_expense' | 'insights' | 'budgets' | 'weekly_recap';

export interface FilterOptions {
  searchQuery: string;
  category: Category | 'All';
  dateRange: 'all' | 'today' | 'week' | 'month';
  sortBy: 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';
}
