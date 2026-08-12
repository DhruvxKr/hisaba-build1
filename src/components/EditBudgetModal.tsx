import React, { useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { Category } from '../types';
import { CATEGORIES_META } from '../data/categories';

interface EditBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditBudgetModal: React.FC<EditBudgetModalProps> = ({ isOpen, onClose }) => {
  const { budgets, updateBudgetLimit, profile, updateProfile } = useExpenses();

  const [overallLimit, setOverallLimit] = useState(profile.monthlyBudgetGoal.toString());
  const [selectedCat, setSelectedCat] = useState<Category>('Food');
  const [catLimit, setCatLimit] = useState('8000');

  if (!isOpen) return null;

  const handleSaveOverall = () => {
    const num = parseFloat(overallLimit);
    if (num > 0) {
      updateProfile({ monthlyBudgetGoal: num });
    }
  };

  const handleSaveCatLimit = (cat: Category, limitVal: number) => {
    if (limitVal >= 0) {
      updateBudgetLimit(cat, limitVal);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end justify-center p-0">
      <div className="w-full max-w-lg bg-surface-container rounded-t-[32px] p-6 border-t border-white/10 flex flex-col gap-5 animate-in slide-in-from-bottom duration-300 max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">account_balance_wallet</span>
            <h3 className="text-headline-md text-on-surface font-semibold">Budget Allocations</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-bright flex items-center justify-center text-on-surface"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Overall Monthly Goal */}
        <div className="bg-surface-container-low rounded-2xl p-4 border border-white/5 flex flex-col gap-2">
          <label className="text-label-caps text-on-surface-variant uppercase">
            Total Monthly Budget Goal (₹)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={overallLimit}
              onChange={(e) => setOverallLimit(e.target.value)}
              className="flex-1 bg-surface-container text-on-surface rounded-xl px-4 py-2.5 text-body-lg font-bold focus:outline-none border border-white/5"
            />
            <button
              type="button"
              onClick={handleSaveOverall}
              className="bg-primary text-on-primary px-4 py-2.5 rounded-xl font-semibold text-body-sm shadow-[0_0_12px_rgba(208,188,255,0.3)]"
            >
              Update Goal
            </button>
          </div>
        </div>

        {/* Existing Category Limits List */}
        <div className="flex flex-col gap-3">
          <span className="text-label-caps text-on-surface-variant uppercase px-1">
            Category Limits
          </span>

          {budgets.map((item) => {
            const meta = CATEGORIES_META[item.category] || CATEGORIES_META.Other;
            return (
              <div
                key={item.category}
                className="bg-surface-container-low p-3.5 rounded-2xl flex items-center justify-between border border-white/5 gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]" style={{ color: meta.color }}>
                      {meta.materialIcon}
                    </span>
                  </div>
                  <span className="text-body-lg font-semibold text-on-surface truncate">
                    {item.category}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-body-sm text-on-surface-variant">₹</span>
                  <input
                    type="number"
                    defaultValue={item.limit}
                    onBlur={(e) => handleSaveCatLimit(item.category, parseFloat(e.target.value) || 0)}
                    className="w-24 bg-surface-container text-on-surface font-semibold text-body-md px-2.5 py-1.5 rounded-lg border border-white/5 text-right focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Add New Category Budget */}
        <div className="bg-surface-container-low rounded-2xl p-4 border border-white/5 flex flex-col gap-3">
          <span className="text-label-caps text-primary uppercase font-semibold">
            + Add New Category Budget
          </span>

          <div className="grid grid-cols-2 gap-2">
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value as Category)}
              className="bg-surface-container text-on-surface rounded-xl px-3 py-2 text-body-sm border border-white/5 focus:outline-none"
            >
              {Object.keys(CATEGORIES_META).map((catKey) => (
                <option key={catKey} value={catKey}>
                  {catKey}
                </option>
              ))}
            </select>

            <input
              type="number"
              value={catLimit}
              onChange={(e) => setCatLimit(e.target.value)}
              placeholder="Limit ₹"
              className="bg-surface-container text-on-surface rounded-xl px-3 py-2 text-body-sm border border-white/5 focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              const num = parseFloat(catLimit);
              if (num >= 0) {
                handleSaveCatLimit(selectedCat, num);
              }
            }}
            className="w-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface py-2.5 rounded-xl font-semibold text-body-sm border border-white/10"
          >
            Save Category Budget
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full bg-primary text-on-primary font-semibold py-3.5 rounded-xl text-body-lg shadow-[0_0_15px_rgba(208,188,255,0.3)] mt-2"
        >
          Done
        </button>
      </div>
    </div>
  );
};
