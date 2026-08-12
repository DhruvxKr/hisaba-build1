import { Category } from '../types';

export interface CategoryMeta {
  id: Category;
  label: string;
  materialIcon: string;
  color: string; // Tailwind text color class or hex
  bgContainer: string;
  borderGlow: string;
  examples: string;
}

export const CATEGORIES_META: Record<Category, CategoryMeta> = {
  Food: {
    id: 'Food',
    label: 'Dining & Food',
    materialIcon: 'restaurant',
    color: '#4edea3', // secondary
    bgContainer: 'bg-secondary-container/10',
    borderGlow: 'glow-emerald',
    examples: 'Zomato, Starbucks, Swiggy',
  },
  Transport: {
    id: 'Transport',
    label: 'Transport',
    materialIcon: 'directions_car',
    color: '#d0bcff', // primary
    bgContainer: 'bg-primary-container/10',
    borderGlow: 'glow-violet',
    examples: 'Uber, Metro, Fuel',
  },
  Shopping: {
    id: 'Shopping',
    label: 'Shopping',
    materialIcon: 'shopping_bag',
    color: '#ffb2b7', // tertiary
    bgContainer: 'bg-tertiary-container/10',
    borderGlow: 'glow-rose',
    examples: 'Amazon, Nike, Zepto',
  },
  Entertainment: {
    id: 'Entertainment',
    label: 'Entertainment',
    materialIcon: 'movie',
    color: '#ff516a',
    bgContainer: 'bg-tertiary-container/20',
    borderGlow: 'glow-rose',
    examples: 'Movies, BookMyShow, Gaming',
  },
  Bills: {
    id: 'Bills',
    label: 'Bills & Utilities',
    materialIcon: 'receipt_long',
    color: '#f59e0b',
    bgContainer: 'bg-amber-500/10',
    borderGlow: 'glow-amber',
    examples: 'Electricity, Wifi, Water',
  },
  Health: {
    id: 'Health',
    label: 'Health & Medical',
    materialIcon: 'medical_services',
    color: '#06b6d4',
    bgContainer: 'bg-cyan-500/10',
    borderGlow: 'glow-cyan',
    examples: 'Pharmacy, Doctor, Gym',
  },
  Travel: {
    id: 'Travel',
    label: 'Travel & Flights',
    materialIcon: 'flight',
    color: '#4edea3',
    bgContainer: 'bg-emerald-500/10',
    borderGlow: 'glow-emerald',
    examples: 'Flights, Hotels, Trains',
  },
  Education: {
    id: 'Education',
    label: 'Education',
    materialIcon: 'school',
    color: '#a855f7',
    bgContainer: 'bg-purple-500/10',
    borderGlow: 'glow-purple',
    examples: 'Courses, Books, Tuition',
  },
  Subscriptions: {
    id: 'Subscriptions',
    label: 'Subscriptions',
    materialIcon: 'play_circle',
    color: '#d0bcff',
    bgContainer: 'bg-primary-container/20',
    borderGlow: 'glow-violet',
    examples: 'Netflix, Spotify, Apple',
  },
  Other: {
    id: 'Other',
    label: 'Other Expenses',
    materialIcon: 'more_horiz',
    color: '#cbc3d7',
    bgContainer: 'bg-surface-variant/30',
    borderGlow: '',
    examples: 'Miscellaneous',
  },
};
