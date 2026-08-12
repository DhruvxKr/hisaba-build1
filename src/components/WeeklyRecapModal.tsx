import React from 'react';
import { useExpenses } from '../context/ExpenseContext';

interface WeeklyRecapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WeeklyRecapModal: React.FC<WeeklyRecapModalProps> = ({ isOpen, onClose }) => {
  const { expenses } = useExpenses();

  if (!isOpen) return null;

  // Compute past 7 days spending
  const now = new Date();
  const weekStart = new Date();
  weekStart.setDate(now.getDate() - 6);

  const formatDateRange = () => {
    const startStr = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
    const endStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
    return `${startStr} - ${endStr}`;
  };

  const weekExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return d >= weekStart && d <= now;
  });

  const lastWeekStart = new Date(weekStart);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);
  const lastWeekEnd = new Date(weekStart);
  lastWeekEnd.setDate(lastWeekEnd.getDate() - 1);

  const lastWeekExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return d >= lastWeekStart && d <= lastWeekEnd;
  });

  const totalWeeklySpent = weekExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalLastWeekSpent = lastWeekExpenses.reduce((sum, e) => sum + e.amount, 0);

  let diffPct = 0;
  if (totalLastWeekSpent > 0) {
    diffPct = Math.round(((totalWeeklySpent - totalLastWeekSpent) / totalLastWeekSpent) * 100);
  }

  // Calculate categories
  const categoryTotals: Record<string, number> = {};
  weekExpenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });
  const categoriesSorted = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);
  const colors = ['bg-tertiary-container', 'bg-primary', 'bg-secondary', 'bg-amber-400'];
  const shadows = [
    'shadow-[0_0_12px_rgba(255,81,106,0.4)]',
    'shadow-[0_0_12px_rgba(208,188,255,0.4)]',
    'shadow-[0_0_12px_rgba(78,222,163,0.4)]',
    'shadow-[0_0_12px_rgba(251,191,36,0.4)]'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#131313] overflow-y-auto pt-safe px-margin-mobile pb-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="h-16 flex items-center justify-between border-b border-white/5 mb-4">
        <button
          type="button"
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center -ml-2 text-on-surface hover:bg-surface-variant/30 rounded-full transition-colors active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back_ios_new</span>
        </button>
        <h1 className="font-headline-md text-headline-md text-on-surface">Weekly Review</h1>
        <div className="w-10" />
      </div>

      <div className="flex flex-col relative w-full text-on-surface pb-12 gap-stack-md max-w-md mx-auto">
        {/* Progress Bar Top */}
        <div className="flex items-center gap-2 mb-2">
          <div className="h-1 flex-1 bg-surface-container rounded-full overflow-hidden">
            <div className="h-full bg-primary w-full rounded-full shadow-[0_0_15px_rgba(208,188,255,0.4)]" />
          </div>
        </div>

        {/* Date Title */}
        <div className="flex flex-col items-center justify-center text-center mb-2">
          <span className="font-label-caps text-label-caps text-primary tracking-widest mb-1 uppercase">
            {formatDateRange()}
          </span>
          <h2 className="font-display-currency-mobile text-display-currency-mobile text-on-surface">
            Your Week in Review
          </h2>
        </div>

        {totalWeeklySpent === 0 ? (
          <div className="glass-panel rounded-2xl p-stack-lg flex flex-col items-center justify-center border border-white/10 shadow-lg text-center">
            <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-on-surface-variant text-[28px]">insights</span>
            </div>
            <h3 className="text-headline-md font-bold mb-2">Your first weekly story is waiting</h3>
            <p className="text-body-sm text-on-surface-variant">Add some expenses this week to see your spending breakdown here.</p>
          </div>
        ) : (
          <>
            {/* Total Spent Hero Card */}
            <div className="glass-panel rounded-2xl p-stack-lg flex flex-col items-center justify-center border border-white/10 shadow-lg">
              <span className="font-body-sm text-body-sm text-on-surface-variant mb-1">
                Total Spent
              </span>
              <div className="font-display-currency text-display-currency text-on-surface mb-2">
                ₹{totalWeeklySpent.toLocaleString('en-IN')}
              </div>
              {totalLastWeekSpent > 0 && (
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full border ${diffPct <= 0 ? 'text-secondary bg-secondary/10 border-secondary/20' : 'text-tertiary-container bg-tertiary-container/10 border-tertiary-container/20'}`}>
                  <span className="material-symbols-outlined text-[16px]">{diffPct <= 0 ? 'trending_down' : 'trending_up'}</span>
                  <span className="font-body-sm text-body-sm font-semibold">{Math.abs(diffPct)}% {diffPct <= 0 ? 'less' : 'more'} than last week</span>
                </div>
              )}
            </div>

            {/* Category Breakdown Card */}
            <div className="glass-panel rounded-2xl p-stack-md flex flex-col border border-white/10 shadow-md">
              <span className="font-body-sm text-body-sm text-on-surface-variant mb-3 font-semibold">
                Category Breakdown
              </span>

              {/* Segmented Progress Bar */}
              <div className="flex h-3 w-full rounded-full overflow-hidden mb-4 bg-surface-container-highest">
                {categoriesSorted.map(([cat, amt], i) => (
                  <div key={cat} className={`h-full ${colors[i]} ${shadows[i]}`} style={{ width: `${(amt / totalWeeklySpent) * 100}%` }} />
                ))}
              </div>

              {/* Legend Grid */}
              <div className="grid grid-cols-2 gap-y-2.5 gap-x-4">
                {categoriesSorted.map(([cat, amt], i) => (
                  <div key={cat} className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${colors[i]} ${shadows[i]}`} />
                    <span className="font-body-sm text-body-sm text-on-surface flex-1 truncate">{cat}</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">{Math.round((amt / totalWeeklySpent) * 100)}%</span>
                  </div>
                ))}
              </div>
            </div>

        {/* Peak Day & Top Category Grid */}
        <div className="grid grid-cols-2 gap-stack-sm">
          {/* Peak Day */}
          <div className="glass-panel rounded-2xl p-stack-md flex flex-col justify-between border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Peak Day</span>
            </div>

            <div className="font-headline-md text-headline-md text-on-surface mb-2">
              {(
                Object.entries(
                  weekExpenses.reduce((acc, e) => {
                    const day = new Date(e.date).toLocaleDateString('en-US', { weekday: 'long' });
                    acc[day] = (acc[day] || 0) + e.amount;
                    return acc;
                  }, {} as Record<string, number>)
                ) as [string, number][]
              ).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None'}
            </div>
          </div>

          {/* Top Category */}
          <div className="glass-panel rounded-2xl p-stack-md flex flex-col justify-between border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-tertiary-container">
                <span className="material-symbols-outlined text-[18px]">star</span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Top Category</span>
            </div>
            
            <div>
              <div className="font-headline-md text-headline-md text-on-surface truncate">
                {categoriesSorted[0]?.[0] || 'None'}
              </div>
              <div className="font-body-lg text-body-lg text-tertiary-container font-semibold mt-1">
                {categoriesSorted[0]?.[1] ? `₹${categoriesSorted[0][1].toLocaleString('en-IN')}` : '₹0'}
              </div>
            </div>
          </div>
        </div>
          </>
        )}

        {/* Done Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full bg-primary text-on-primary font-headline-md text-headline-md py-4 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(208,188,255,0.3)] active:scale-[0.98] transition-transform mt-4"
        >
          Done
        </button>
      </div>
    </div>
  );
};
