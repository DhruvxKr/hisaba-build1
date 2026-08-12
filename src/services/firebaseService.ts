import {
  collection,
  doc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  Unsubscribe,
  getDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Expense, CategoryBudget, Category, UserProfile } from '../types';

// User Profile
export async function getOrCreateUserProfile(
  userId: string,
  defaultData: { name: string; email?: string; photoURL?: string }
): Promise<UserProfile> {
  const userRef = doc(db, 'users', userId);
  const snap = await getDoc(userRef);

  if (snap.exists()) {
    const data = snap.data();
    return {
      name: data.name || defaultData.name,
      email: data.email || defaultData.email,
      photoURL: data.photoURL || defaultData.photoURL,
      monthlyBudgetGoal: typeof data.monthlyBudgetGoal === 'number' ? data.monthlyBudgetGoal : 0,
      currency: data.currency || '₹',
    };
  } else {
    const newProfile: UserProfile = {
      name: defaultData.name,
      email: defaultData.email,
      photoURL: defaultData.photoURL,
      monthlyBudgetGoal: 0,
      currency: '₹',
    };
    await setDoc(userRef, {
      ...newProfile,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return newProfile;
  }
}

export async function updateUserProfileFirestore(userId: string, updatedData: Partial<UserProfile>) {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, { ...updatedData, updatedAt: Date.now() }, { merge: true });
}

// User Expenses
export function subscribeUserExpenses(
  userId: string,
  onData: (expenses: Expense[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const expensesRef = collection(db, 'users', userId, 'expenses');
  const q = query(expensesRef, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const expensesList: Expense[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          amount: Number(data.amount) || 0,
          merchant: data.merchant || 'Expense',
          category: data.category || 'Other',
          date: data.date || new Date().toISOString().split('T')[0],
          time: data.time || '12:00 PM',
          paymentMethod: data.paymentMethod || 'UPI',
          notes: data.notes || '',
          recurring: Boolean(data.recurring),
          createdAt: data.createdAt || Date.now(),
        } as Expense;
      });
      onData(expensesList);
    },
    (err) => {
      console.error('Error fetching expenses from Firestore:', err);
      if (onError) onError(err);
    }
  );
}

export async function addExpenseFirestore(
  userId: string,
  expense: Omit<Expense, 'id' | 'createdAt'>
) {
  const expensesRef = collection(db, 'users', userId, 'expenses');
  const now = Date.now();
  const docRef = await addDoc(expensesRef, {
    ...expense,
    createdAt: now,
    updatedAt: now,
  });
  return docRef.id;
}

export async function updateExpenseFirestore(
  userId: string,
  expenseId: string,
  updatedData: Partial<Expense>
) {
  const docRef = doc(db, 'users', userId, 'expenses', expenseId);
  await updateDoc(docRef, {
    ...updatedData,
    updatedAt: Date.now(),
  });
}

export async function deleteExpenseFirestore(userId: string, expenseId: string) {
  const docRef = doc(db, 'users', userId, 'expenses', expenseId);
  await deleteDoc(docRef);
}

// User Budgets
export function subscribeUserBudgets(
  userId: string,
  onData: (budgets: CategoryBudget[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const budgetsRef = collection(db, 'users', userId, 'budgets');

  return onSnapshot(
    budgetsRef,
    (snapshot) => {
      const budgetsList: CategoryBudget[] = [];
      snapshot.docs.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.category && data.monthlyLimit !== undefined) {
          budgetsList.push({
            category: data.category as Category,
            limit: Number(data.monthlyLimit),
            spent: 0, // Computed dynamically against expenses
          });
        }
      });
      onData(budgetsList);
    },
    (err) => {
      console.error('Error fetching budgets from Firestore:', err);
      if (onError) onError(err);
    }
  );
}

export async function updateBudgetFirestore(userId: string, category: Category, monthlyLimit: number) {
  // Use category name as document ID to avoid duplicates
  const docRef = doc(db, 'users', userId, 'budgets', category);
  await setDoc(
    docRef,
    {
      category,
      monthlyLimit,
      updatedAt: Date.now(),
    },
    { merge: true }
  );
}
