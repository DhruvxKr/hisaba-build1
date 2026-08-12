import { Expense, CategoryBudget } from '../types';

// Helper to construct ISO dates relative to today
function getRelativeDate(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysOffset);
  return d.toISOString().split('T')[0];
}

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    amount: 350,
    merchant: 'Starbucks',
    category: 'Food',
    date: getRelativeDate(0), // Today
    time: '09:15 AM',
    paymentMethod: 'UPI',
    notes: 'Morning hazelnut cold brew',
    createdAt: Date.now() - 3600000 * 2,
  },
  {
    id: 'exp-2',
    amount: 1200,
    merchant: 'Amazon',
    category: 'Shopping',
    date: getRelativeDate(0), // Today
    time: '02:40 PM',
    paymentMethod: 'Card',
    notes: 'Wireless charger & cable',
    createdAt: Date.now() - 3600000 * 5,
  },
  {
    id: 'exp-3',
    amount: 280,
    merchant: 'Uber',
    category: 'Transport',
    date: getRelativeDate(1), // Yesterday
    time: '06:20 PM',
    paymentMethod: 'UPI',
    notes: 'Cab to Indiranagar',
    createdAt: Date.now() - 86400000 - 3600000 * 3,
  },
  {
    id: 'exp-4',
    amount: 499,
    merchant: 'Netflix',
    category: 'Subscriptions',
    date: getRelativeDate(1), // Yesterday
    time: '10:00 AM',
    paymentMethod: 'Card',
    recurring: true,
    notes: 'Monthly Subscription',
    createdAt: Date.now() - 86400000 - 3600000 * 10,
  },
  {
    id: 'exp-5',
    amount: 450,
    merchant: 'Zomato',
    category: 'Food',
    date: getRelativeDate(2),
    time: '08:30 PM',
    paymentMethod: 'UPI',
    notes: 'Dinner from Punjabi Rasoi',
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'exp-6',
    amount: 99,
    merchant: 'Apple Music',
    category: 'Subscriptions',
    date: getRelativeDate(3),
    time: '11:15 AM',
    paymentMethod: 'Card',
    recurring: true,
    notes: 'Individual voice plan',
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: 'exp-7',
    amount: 2400,
    merchant: 'Shell Petrol',
    category: 'Transport',
    date: getRelativeDate(3),
    time: '05:45 PM',
    paymentMethod: 'Card',
    notes: 'Full tank fuel',
    createdAt: Date.now() - 86400000 * 3 - 3600000,
  },
  {
    id: 'exp-8',
    amount: 3200,
    merchant: 'Taj Dining',
    category: 'Food',
    date: getRelativeDate(4),
    time: '09:00 PM',
    paymentMethod: 'Card',
    notes: 'Team celebration dinner',
    createdAt: Date.now() - 86400000 * 4,
  },
  {
    id: 'exp-9',
    amount: 650,
    merchant: 'Blinkit',
    category: 'Food',
    date: getRelativeDate(5),
    time: '07:20 AM',
    paymentMethod: 'UPI',
    notes: 'Weekly groceries & milk',
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: 'exp-10',
    amount: 1850,
    merchant: 'Electricity Bill',
    category: 'Bills',
    date: getRelativeDate(6),
    time: '03:10 PM',
    paymentMethod: 'NetBanking',
    notes: 'BESCOM monthly bill',
    createdAt: Date.now() - 86400000 * 6,
  },
  {
    id: 'exp-11',
    amount: 5400,
    merchant: 'Movie Night & Lounge',
    category: 'Entertainment',
    date: getRelativeDate(8),
    time: '07:00 PM',
    paymentMethod: 'Card',
    notes: 'IMAX tickets & snacks',
    createdAt: Date.now() - 86400000 * 8,
  },
  {
    id: 'exp-12',
    amount: 2100,
    merchant: 'IndiGo Air Addon',
    category: 'Travel',
    date: getRelativeDate(10),
    time: '12:30 PM',
    paymentMethod: 'Card',
    notes: 'Seat selection & baggage',
    createdAt: Date.now() - 86400000 * 10,
  },
];

export const INITIAL_BUDGETS: CategoryBudget[] = [
  { category: 'Food', limit: 8000, spent: 6200 },
  { category: 'Entertainment', limit: 6000, spent: 5400 },
  { category: 'Travel', limit: 5000, spent: 2100 },
  { category: 'Transport', limit: 4000, spent: 2680 },
  { category: 'Shopping', limit: 5000, spent: 1200 },
  { category: 'Bills', limit: 3000, spent: 1850 },
];
