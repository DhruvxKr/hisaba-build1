import React, { createContext, useContext, useState, useEffect } from 'react';
import { Expense, CategoryBudget, UserProfile, ViewTab, FilterOptions, Category } from '../types';
import { auth, loginWithGoogle, logoutUser, User } from '../lib/firebase';
import {
  subscribeUserExpenses,
  addExpenseFirestore,
  updateExpenseFirestore,
  deleteExpenseFirestore,
  subscribeUserBudgets,
  updateBudgetFirestore,
  getOrCreateUserProfile,
  updateUserProfileFirestore,
} from '../services/firebaseService';

interface ExpenseContextType {
  user: User | null;
  isAuthLoading: boolean;
  authError: string | null;
  expenses: Expense[];
  budgets: CategoryBudget[];
  profile: UserProfile;
  activeTab: ViewTab;
  filterOptions: FilterOptions;
  selectedExpenseForEdit: Expense | null;
  isDataLoading: boolean;
  isWeeklyRecapOpen: boolean;
  isProfileOpen: boolean;
  isEditBudgetOpen: boolean;

  // Actions
  login: () => Promise<void>;
  logout: () => Promise<void>;
  setActiveTab: (tab: ViewTab) => void;
  setFilterOptions: React.Dispatch<React.SetStateAction<FilterOptions>>;
  setSelectedExpenseForEdit: (exp: Expense | null) => void;
  setIsWeeklyRecapOpen: (open: boolean) => void;
  setIsProfileOpen: (open: boolean) => void;
  setIsEditBudgetOpen: (open: boolean) => void;

  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => Promise<void>;
  updateExpense: (id: string, updated: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  updateBudgetLimit: (category: Category, limit: number) => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;

  // Computed helpers
  totalSpentThisMonth: number;
  remainingBudgetThisMonth: number;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<CategoryBudget[]>([]);
  const [profile, setProfile] = useState<UserProfile>({
    name: 'User',
    monthlyBudgetGoal: 0,
    currency: '₹',
  });

  const [activeTab, setActiveTab] = useState<ViewTab>('home');
  const [selectedExpenseForEdit, setSelectedExpenseForEdit] = useState<Expense | null>(null);
  const [isWeeklyRecapOpen, setIsWeeklyRecapOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditBudgetOpen, setIsEditBudgetOpen] = useState(false);

  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    searchQuery: '',
    category: 'All',
    dateRange: 'all',
    sortBy: 'date-desc',
  });

  // Monitor Firebase Auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currUser) => {
      setUser(currUser);
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Subscribe to Firestore expenses & budgets when authenticated user changes
  useEffect(() => {
    if (!user) {
      setExpenses([]);
      setBudgets([]);
      setProfile({
        name: 'User',
        monthlyBudgetGoal: 0,
        currency: '₹',
      });
      return;
    }

    setIsDataLoading(true);

    getOrCreateUserProfile(user.uid, {
      name: user.displayName || 'User',
      email: user.email || '',
      photoURL: user.photoURL || '',
    })
      .then((userProfile) => {
        setProfile(userProfile);
      })
      .catch((err) => console.error('Error fetching user profile:', err));

    const unsubExpenses = subscribeUserExpenses(
      user.uid,
      (data) => {
        setExpenses(data);
        setIsDataLoading(false);
      },
      (err) => {
        console.error('Expense subscription error:', err);
        setIsDataLoading(false);
      }
    );

    const unsubBudgets = subscribeUserBudgets(
      user.uid,
      (data) => {
        setBudgets(data);
      },
      (err) => {
        console.error('Budget subscription error:', err);
      }
    );

    return () => {
      unsubExpenses();
      unsubBudgets();
    };
  }, [user]);

  const handleLogin = async () => {
    try {
      setAuthError(null);
      setIsAuthLoading(true);
      await loginWithGoogle();
    } catch (err: unknown) {
      console.error('Google Sign-In Error:', err);
      const errorObj = err as { message?: string };
      setAuthError(errorObj.message || 'Failed to sign in with Google. Please try again.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setActiveTab('home');
      setIsProfileOpen(false);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const currentMonthPrefix = new Date().toISOString().substring(0, 7); // "YYYY-MM"

  // Dynamically calculate category spent amounts based on current month expenses
  const updatedBudgets = budgets.map((b) => {
    const currentCategorySpent = expenses
      .filter((exp) => exp.category === b.category && exp.date.startsWith(currentMonthPrefix))
      .reduce((sum, exp) => sum + exp.amount, 0);
    return { ...b, spent: currentCategorySpent };
  });

  const totalSpentThisMonth = expenses
    .filter((exp) => exp.date.startsWith(currentMonthPrefix))
    .reduce((sum, exp) => sum + exp.amount, 0);

  const remainingBudgetThisMonth = profile.monthlyBudgetGoal > 0 
    ? Math.max(0, profile.monthlyBudgetGoal - totalSpentThisMonth)
    : 0;

  const addExpense = async (newExpData: Omit<Expense, 'id' | 'createdAt'>) => {
    if (!user) return;
    await addExpenseFirestore(user.uid, newExpData);
  };

  const updateExpense = async (id: string, updated: Partial<Expense>) => {
    if (!user) return;
    await updateExpenseFirestore(user.uid, id, updated);
  };

  const deleteExpense = async (id: string) => {
    if (!user) return;
    await deleteExpenseFirestore(user.uid, id);
  };

  const updateBudgetLimit = async (category: Category, limit: number) => {
    if (!user) return;
    await updateBudgetFirestore(user.uid, category, limit);
  };

  const updateProfile = async (updated: Partial<UserProfile>) => {
    if (!user) return;
    setProfile((prev) => ({ ...prev, ...updated }));
    await updateUserProfileFirestore(user.uid, updated);
  };

  return (
    <ExpenseContext.Provider
      value={{
        user,
        isAuthLoading,
        authError,
        expenses,
        budgets: updatedBudgets,
        profile,
        activeTab,
        filterOptions,
        selectedExpenseForEdit,
        isDataLoading,
        isWeeklyRecapOpen,
        isProfileOpen,
        isEditBudgetOpen,
        login: handleLogin,
        logout: handleLogout,
        setActiveTab,
        setFilterOptions,
        setSelectedExpenseForEdit,
        setIsWeeklyRecapOpen,
        setIsProfileOpen,
        setIsEditBudgetOpen,
        addExpense,
        updateExpense,
        deleteExpense,
        updateBudgetLimit,
        updateProfile,
        totalSpentThisMonth,
        remainingBudgetThisMonth,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};

