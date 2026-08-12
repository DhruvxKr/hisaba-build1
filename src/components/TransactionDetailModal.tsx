import React, { useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { Expense, Category, PaymentMethod } from '../types';
import { CATEGORIES_META } from '../data/categories';

interface TransactionDetailModalProps {
  expense: Expense | null;
  onClose: () => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  expense,
  onClose,
}) => {
  const { updateExpense, deleteExpense } = useExpenses();

  if (!expense) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [merchant, setMerchant] = useState(expense.merchant);
  const [amount, setAmount] = useState(expense.amount.toString());
  const [category, setCategory] = useState<Category>(expense.category);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(expense.paymentMethod);
  const [notes, setNotes] = useState(expense.notes || '');

  const handleSaveEdit = () => {
    const num = parseFloat(amount);
    if (!num || num <= 0) return;

    updateExpense(expense.id, {
      merchant,
      amount: num,
      category,
      paymentMethod,
      notes,
    });
    setIsEditing(false);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm('Delete this transaction?')) {
      deleteExpense(expense.id);
      onClose();
    }
  };

  const meta = CATEGORIES_META[expense.category] || CATEGORIES_META.Other;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end justify-center p-0">
      <div className="w-full max-w-lg bg-surface-container rounded-t-[32px] p-6 border-t border-white/10 flex flex-col gap-4 animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">receipt</span>
            <h3 className="text-headline-md text-on-surface font-semibold">
              {isEditing ? 'Edit Transaction' : 'Transaction Detail'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-bright flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {!isEditing ? (
          <div className="flex flex-col gap-5 py-2">
            {/* Amount & Merchant Hero Header */}
            <div className="flex flex-col items-center justify-center text-center p-4 bg-surface-container-low rounded-2xl border border-white/5">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-3 shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
                style={{ backgroundColor: '#1A1A1A' }}
              >
                <span className="material-symbols-outlined text-[28px]" style={{ color: meta.color }}>
                  {meta.materialIcon}
                </span>
              </div>

              <span className="text-display-currency text-on-surface font-bold">
                ₹{expense.amount.toLocaleString('en-IN')}
              </span>
              <span className="text-headline-md text-on-surface font-semibold mt-1">
                {expense.merchant}
              </span>
              <span className="text-body-sm text-on-surface-variant mt-0.5">
                {expense.category} • {expense.time || expense.date}
              </span>
            </div>

            {/* Details Table */}
            <div className="flex flex-col gap-3 bg-surface-container-low rounded-2xl p-4 border border-white/5">
              <div className="flex justify-between items-center text-body-sm">
                <span className="text-on-surface-variant">Payment Method</span>
                <span className="text-on-surface font-semibold bg-surface-container px-2.5 py-1 rounded-md">
                  {expense.paymentMethod}
                </span>
              </div>

              <div className="flex justify-between items-center text-body-sm">
                <span className="text-on-surface-variant">Date</span>
                <span className="text-on-surface font-semibold">{expense.date}</span>
              </div>

              {expense.notes && (
                <div className="flex flex-col gap-1 text-body-sm pt-2 border-t border-white/5">
                  <span className="text-on-surface-variant">Notes</span>
                  <p className="text-on-surface bg-surface-container p-2.5 rounded-xl">
                    {expense.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex-1 bg-surface-container-high hover:bg-surface-container-highest text-on-surface py-3.5 rounded-xl font-semibold text-body-sm flex items-center justify-center gap-2 border border-white/5 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">edit</span>
                Edit
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="bg-tertiary-container/20 hover:bg-tertiary-container/30 text-tertiary py-3.5 px-5 rounded-xl font-semibold text-body-sm flex items-center justify-center gap-2 border border-tertiary-container/30 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
                Delete
              </button>
            </div>
          </div>
        ) : (
          /* Edit Form */
          <div className="flex flex-col gap-4 py-2">
            <div>
              <label className="text-label-caps text-on-surface-variant uppercase mb-1 block">
                Merchant
              </label>
              <input
                type="text"
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                className="w-full bg-surface-container-low text-on-surface rounded-xl px-4 py-3 text-body-lg focus:outline-none focus:ring-1 focus:ring-primary/50 border border-white/5"
              />
            </div>

            <div>
              <label className="text-label-caps text-on-surface-variant uppercase mb-1 block">
                Amount (₹)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-surface-container-low text-on-surface rounded-xl px-4 py-3 text-body-lg focus:outline-none focus:ring-1 focus:ring-primary/50 border border-white/5"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-label-caps text-on-surface-variant uppercase mb-1 block">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full bg-surface-container-low text-on-surface rounded-xl px-3 py-3 text-body-sm focus:outline-none border border-white/5 cursor-pointer"
                >
                  {Object.keys(CATEGORIES_META).map((catKey) => (
                    <option key={catKey} value={catKey}>
                      {catKey}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-label-caps text-on-surface-variant uppercase mb-1 block">
                  Payment
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full bg-surface-container-low text-on-surface rounded-xl px-3 py-3 text-body-sm focus:outline-none border border-white/5 cursor-pointer"
                >
                  <option value="UPI">UPI</option>
                  <option value="Card">Card</option>
                  <option value="Cash">Cash</option>
                  <option value="NetBanking">NetBanking</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-label-caps text-on-surface-variant uppercase mb-1 block">
                Notes
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional notes"
                className="w-full bg-surface-container-low text-on-surface rounded-xl px-4 py-2.5 text-body-sm focus:outline-none border border-white/5"
              />
            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-surface-container-high text-on-surface py-3 rounded-xl font-semibold text-body-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="flex-1 bg-primary text-on-primary py-3 rounded-xl font-semibold text-body-sm shadow-[0_0_15px_rgba(208,188,255,0.3)]"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
