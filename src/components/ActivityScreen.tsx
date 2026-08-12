import React, { useState, useMemo } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { CATEGORIES_META } from '../data/categories';
import { Category, Expense } from '../types';

export const ActivityScreen: React.FC = () => {
  const { expenses, filterOptions, setFilterOptions, setSelectedExpenseForEdit } = useExpenses();
  const [selectedCategoryChip, setSelectedCategoryChip] = useState<Category | 'All'>('All');
  const [selectedTimeChip, setSelectedTimeChip] = useState<'all' | 'today' | 'yesterday' | 'week'>('all');

  // Filter expenses based on search & chips
  const filteredExpenses = useMemo(() => {
    return expenses.filter((exp) => {
      // 1. Search Query
      if (filterOptions.searchQuery.trim()) {
        const q = filterOptions.searchQuery.toLowerCase();
        const matchMerchant = exp.merchant.toLowerCase().includes(q);
        const matchCategory = exp.category.toLowerCase().includes(q);
        const matchNotes = exp.notes?.toLowerCase().includes(q);
        const matchAmount = exp.amount.toString().includes(q);
        if (!matchMerchant && !matchCategory && !matchNotes && !matchAmount) {
          return false;
        }
      }

      // 2. Category Filter Chip
      if (selectedCategoryChip !== 'All' && exp.category !== selectedCategoryChip) {
        return false;
      }

      // 3. Time Filter Chip
      if (selectedTimeChip !== 'all') {
        const todayStr = new Date().toISOString().split('T')[0];
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (selectedTimeChip === 'today' && exp.date !== todayStr) return false;
        if (selectedTimeChip === 'yesterday' && exp.date !== yesterdayStr) return false;
        if (selectedTimeChip === 'week') {
          const expDate = new Date(exp.date);
          const diffDays = Math.floor((Date.now() - expDate.getTime()) / (1000 * 3600 * 24));
          if (diffDays > 7) return false;
        }
      }

      return true;
    });
  }, [expenses, filterOptions.searchQuery, selectedCategoryChip, selectedTimeChip]);

  // Group filtered expenses into Today, Yesterday, This Week, and Earlier
  const groupedExpenses = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const todayList: Expense[] = [];
    const yesterdayList: Expense[] = [];
    const thisWeekList: Expense[] = [];
    const earlierList: Expense[] = [];

    filteredExpenses.forEach((exp) => {
      if (exp.date === todayStr) {
        todayList.push(exp);
      } else if (exp.date === yesterdayStr) {
        yesterdayList.push(exp);
      } else {
        const expDate = new Date(exp.date);
        const diffDays = Math.floor((Date.now() - expDate.getTime()) / (1000 * 3600 * 24));
        if (diffDays <= 7) {
          thisWeekList.push(exp);
        } else {
          earlierList.push(exp);
        }
      }
    });

    return { todayList, yesterdayList, thisWeekList, earlierList };
  }, [filteredExpenses]);

  return (
    <div className="flex flex-col w-full relative pb-28 pt-2">
      {/* Sticky Search & Filter Header */}
      <div className="sticky top-16 z-40 bg-[#131313]/90 backdrop-blur-xl pb-stack-sm pt-stack-sm -mx-margin-mobile px-margin-mobile border-b border-white/5">
        <div className="flex items-center gap-stack-sm w-full">
          {/* Search Input */}
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-outline group-focus-within:text-primary transition-colors">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </div>
            <input
              type="text"
              value={filterOptions.searchQuery}
              onChange={(e) =>
                setFilterOptions((prev) => ({ ...prev, searchQuery: e.target.value }))
              }
              placeholder="Search activity..."
              className="w-full bg-surface-container-low text-on-surface rounded-full py-3 pl-11 pr-10 text-body-lg focus:outline-none focus:ring-1 focus:ring-primary/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] transition-all placeholder:text-on-surface-variant/70"
            />
            {filterOptions.searchQuery && (
              <button
                type="button"
                onClick={() => setFilterOptions((prev) => ({ ...prev, searchQuery: '' }))}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>

          {/* Filter Toggle Button */}
          <button
            type="button"
            onClick={() => {
              // Cycle category chip or reset
              setSelectedCategoryChip((prev) => (prev === 'All' ? 'Food' : 'All'));
            }}
            className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full text-on-surface transition-transform active:scale-95 shadow-sm border border-white/5 ${
              selectedCategoryChip !== 'All' ? 'bg-primary/20 text-primary' : 'bg-surface-container-high'
            }`}
            title="Toggle Filter"
          >
            <span className="material-symbols-outlined text-[24px]">tune</span>
          </button>
        </div>

        {/* Filter Chips Scroll View */}
        <div className="flex overflow-x-auto gap-stack-sm mt-stack-md pb-1 hide-scrollbar">
          <button
            type="button"
            onClick={() => {
              setSelectedTimeChip('all');
              setSelectedCategoryChip('All');
            }}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-label-caps whitespace-nowrap transition-colors ${
              selectedTimeChip === 'all' && selectedCategoryChip === 'All'
                ? 'bg-primary/20 text-primary border border-primary/30'
                : 'bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            All Time
          </button>

          <button
            type="button"
            onClick={() => setSelectedTimeChip((prev) => (prev === 'today' ? 'all' : 'today'))}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-label-caps whitespace-nowrap transition-colors ${
              selectedTimeChip === 'today'
                ? 'bg-primary/20 text-primary border border-primary/30'
                : 'bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            Today
          </button>

          {/* Category Dropdown/Pill selector */}
          {['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() =>
                setSelectedCategoryChip((prev) => (prev === cat ? 'All' : (cat as Category)))
              }
              className={`flex-shrink-0 px-4 py-2 rounded-full text-label-caps whitespace-nowrap transition-colors ${
                selectedCategoryChip === cat
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Spacer */}
      <div className="h-4" />

      {/* Activity Timeline Groups */}
      <div className="flex flex-col gap-section-gap w-full">
        {filteredExpenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center opacity-70">
            <span className="material-symbols-outlined text-[48px] text-surface-container-highest mb-4">
              receipt_long
            </span>
            <p className="text-body-lg text-on-surface-variant font-medium">
              No transactions match your search
            </p>
            <button
              type="button"
              onClick={() => {
                setFilterOptions((prev) => ({ ...prev, searchQuery: '' }));
                setSelectedCategoryChip('All');
                setSelectedTimeChip('all');
              }}
              className="mt-4 px-4 py-2 bg-surface-container-high text-primary rounded-full text-body-sm hover:bg-surface-container-highest transition-all"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            {/* TODAY GROUP */}
            {groupedExpenses.todayList.length > 0 && (
              <div className="flex flex-col gap-stack-md relative">
                <div className="sticky top-[140px] z-30 bg-[#131313]/95 backdrop-blur-md py-2 -mx-margin-mobile px-margin-mobile border-b border-white/5">
                  <h2 className="text-label-caps text-on-surface-variant uppercase tracking-wider">
                    Today
                  </h2>
                </div>
                {groupedExpenses.todayList.map((exp) => (
                  <TransactionRow
                    key={exp.id}
                    expense={exp}
                    onClick={() => setSelectedExpenseForEdit(exp)}
                  />
                ))}
              </div>
            )}

            {/* YESTERDAY GROUP */}
            {groupedExpenses.yesterdayList.length > 0 && (
              <div className="flex flex-col gap-stack-md relative">
                <div className="sticky top-[140px] z-30 bg-[#131313]/95 backdrop-blur-md py-2 -mx-margin-mobile px-margin-mobile border-b border-white/5">
                  <h2 className="text-label-caps text-on-surface-variant uppercase tracking-wider">
                    Yesterday
                  </h2>
                </div>
                {groupedExpenses.yesterdayList.map((exp) => (
                  <TransactionRow
                    key={exp.id}
                    expense={exp}
                    onClick={() => setSelectedExpenseForEdit(exp)}
                  />
                ))}
              </div>
            )}

            {/* THIS WEEK GROUP */}
            {groupedExpenses.thisWeekList.length > 0 && (
              <div className="flex flex-col gap-stack-md relative">
                <div className="sticky top-[140px] z-30 bg-[#131313]/95 backdrop-blur-md py-2 -mx-margin-mobile px-margin-mobile border-b border-white/5">
                  <h2 className="text-label-caps text-on-surface-variant uppercase tracking-wider">
                    This Week
                  </h2>
                </div>
                {groupedExpenses.thisWeekList.map((exp) => (
                  <TransactionRow
                    key={exp.id}
                    expense={exp}
                    onClick={() => setSelectedExpenseForEdit(exp)}
                  />
                ))}
              </div>
            )}

            {/* EARLIER GROUP */}
            {groupedExpenses.earlierList.length > 0 && (
              <div className="flex flex-col gap-stack-md relative">
                <div className="sticky top-[140px] z-30 bg-[#131313]/95 backdrop-blur-md py-2 -mx-margin-mobile px-margin-mobile border-b border-white/5">
                  <h2 className="text-label-caps text-on-surface-variant uppercase tracking-wider">
                    Earlier This Month
                  </h2>
                </div>
                {groupedExpenses.earlierList.map((exp) => (
                  <TransactionRow
                    key={exp.id}
                    expense={exp}
                    onClick={() => setSelectedExpenseForEdit(exp)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Reusable Transaction Row Component
const TransactionRow: React.FC<{ expense: Expense; onClick: () => void }> = ({
  expense,
  onClick,
}) => {
  const meta = CATEGORIES_META[expense.category] || CATEGORIES_META.Other;

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-stack-md py-2.5 px-2 group cursor-pointer hover:bg-surface-container/50 rounded-2xl transition-all border border-transparent hover:border-white/5 active:scale-[0.99]"
    >
      {/* Category Icon */}
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.05),0_4px_12px_rgba(0,0,0,0.3)] shrink-0"
        style={{ backgroundColor: '#1A1A1A' }}
      >
        <span className="material-symbols-outlined text-[22px]" style={{ color: meta.color }}>
          {meta.materialIcon}
        </span>
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-center min-w-0">
        <div className="flex justify-between items-end w-full">
          <span className="text-body-lg font-semibold text-on-surface truncate">
            {expense.merchant}
          </span>
          <span className="text-body-lg font-bold text-on-surface whitespace-nowrap ml-2">
            ₹{expense.amount.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="flex justify-between items-start w-full mt-1">
          <span className="text-body-sm text-on-surface-variant truncate">
            {expense.category}
          </span>
          <span className="text-body-sm text-outline whitespace-nowrap ml-2 text-[12px]">
            {expense.time || expense.date}
          </span>
        </div>
      </div>
    </div>
  );
};
