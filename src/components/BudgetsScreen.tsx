import React from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { CATEGORIES_META } from '../data/categories';
import { Category } from '../types';

export const BudgetsScreen: React.FC = () => {
  const { budgets, totalSpentThisMonth, profile, setIsEditBudgetOpen } = useExpenses();

  const totalOverallLimit = profile.monthlyBudgetGoal;
  const overallSpentRatio = totalOverallLimit > 0 ? Math.min(1, totalSpentThisMonth / totalOverallLimit) : 0;
  const spentPercentage = Math.round(overallSpentRatio * 100);

  // Financial weather status based on spending ratio
  const getWeatherBadge = () => {
    if (spentPercentage < 75) {
      return { label: 'Calm', icon: 'wb_sunny', color: 'text-secondary', bg: 'bg-surface-container' };
    } else if (spentPercentage <= 95) {
      return { label: 'Watchful', icon: 'thunderstorm', color: 'text-amber-400', bg: 'bg-surface-container' };
    } else {
      return { label: 'Alert', icon: 'warning', color: 'text-tertiary-container', bg: 'bg-tertiary-container/10' };
    }
  };

  const weather = getWeatherBadge();

  return (
    <div className="flex flex-col w-full gap-section-gap pb-28 pt-2">
      {/* Monthly Summary Card */}
      <div className="relative bg-surface-container-high rounded-3xl p-stack-lg shadow-xl shadow-black/30 overflow-hidden border border-white/10">
        {/* Inner Highlight line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between mb-stack-lg">
          <div className="flex flex-col">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest mb-1">
              Overall Budget
            </span>
            <h2 className="font-display-currency-mobile text-display-currency-mobile text-on-surface">
              ₹{totalSpentThisMonth.toLocaleString('en-IN')}{' '}
              <span className="text-on-surface-variant text-body-lg font-normal">
                / ₹{totalOverallLimit.toLocaleString('en-IN')}
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-1 bg-surface-container px-3 py-1.5 rounded-full border border-white/5 shadow-inner">
            <span
              className={`material-symbols-outlined text-[18px] ${weather.color} drop-shadow-[0_0_8px_rgba(78,222,163,0.5)]`}
            >
              {weather.icon}
            </span>
            <span className={`font-body-sm text-body-sm ${weather.color} font-medium`}>
              {weather.label}
            </span>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="relative h-4 rounded-full bg-surface-container shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] mb-4 overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-primary/50 to-primary transition-all duration-700 shadow-[0_0_15px_rgba(208,188,255,0.4)]"
            style={{ width: `${Math.min(100, spentPercentage)}%` }}
          >
            <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/30 blur-[2px] rounded-full" />
          </div>
        </div>

        {/* Projections */}
        <div className="flex justify-between items-center text-body-sm font-body-sm">
          <span className="text-on-surface-variant">{spentPercentage}% spent</span>
          <div className="text-right">
            <span className="text-on-surface-variant">Projected: </span>
            <span className="text-on-surface font-medium">
              ₹{Math.round(totalSpentThisMonth * 1.15).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Categories Budget List */}
      <div className="flex flex-col gap-stack-md">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-headline-lg text-headline-lg text-on-surface">Categories</h3>
          <button
            type="button"
            onClick={() => setIsEditBudgetOpen(true)}
            className="text-body-sm font-semibold text-primary hover:underline"
          >
            Edit Limits
          </button>
        </div>

        {budgets.length === 0 ? (
          <div className="bg-surface-container rounded-2xl p-6 text-center border border-white/5 flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center">
              <span className="material-symbols-outlined text-on-surface-variant">account_balance_wallet</span>
            </div>
            <div>
              <h4 className="text-headline-md text-on-surface font-semibold">No budgets set</h4>
              <p className="text-body-sm text-on-surface-variant mt-1">Create a monthly budget to start tracking your spending.</p>
            </div>
          </div>
        ) : (
          budgets.map((item) => {
            const meta = CATEGORIES_META[item.category] || CATEGORIES_META.Other;
            const pct = Math.round((item.spent / (item.limit || 1)) * 100);
          const isOver = item.spent > item.limit;
          const isPacingHigh = pct >= 85 && !isOver;

          return (
            <div
              key={item.category}
              className="bg-surface-container rounded-2xl p-stack-md relative overflow-hidden shadow-sm border border-white/5 transition-all hover:bg-surface-container-high group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-stack-md">
                  <div className="w-12 h-12 rounded-full bg-surface shadow-inner flex items-center justify-center border border-white/5 shrink-0">
                    <span className="material-symbols-outlined text-[22px]" style={{ color: meta.color }}>
                      {meta.materialIcon}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-headline-md text-headline-md text-on-surface">
                      {item.category}
                    </h4>

                    {isOver ? (
                      <span className="font-body-sm text-body-sm text-tertiary-container flex items-center gap-1 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container shadow-[0_0_6px_rgba(255,81,106,0.6)]" />
                        Over budget
                      </span>
                    ) : isPacingHigh ? (
                      <span className="font-body-sm text-body-sm text-amber-400 flex items-center gap-1 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]" />
                        Pacing high
                      </span>
                    ) : (
                      <span className="font-body-sm text-body-sm text-secondary flex items-center gap-1 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_6px_rgba(78,222,163,0.6)]" />
                        On track
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-headline-md text-headline-md text-on-surface">
                    ₹{item.spent.toLocaleString('en-IN')}
                  </div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant">
                    of ₹{item.limit.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="relative h-3 rounded-full bg-surface shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] overflow-hidden">
                <div
                  className={`absolute top-0 left-0 h-full rounded-full transition-all duration-700 ${
                    isOver
                      ? 'bg-gradient-to-r from-tertiary-container/60 to-tertiary-container shadow-[0_0_12px_rgba(255,81,106,0.5)]'
                      : isPacingHigh
                      ? 'bg-gradient-to-r from-amber-500/60 to-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.5)]'
                      : 'bg-gradient-to-r from-secondary-container to-secondary shadow-[0_0_12px_rgba(78,222,163,0.3)]'
                  }`}
                  style={{ width: `${Math.min(100, pct)}%` }}
                >
                  <div className="absolute top-0 right-0 bottom-0 w-3 bg-white/30 blur-[2px] rounded-full" />
                </div>
              </div>

              {/* Warning box if pacing high or over */}
              {(isPacingHigh || isOver) && (
                <div className="mt-3 bg-tertiary-container/10 border border-tertiary-container/20 rounded-xl p-2.5 flex items-start gap-2 text-body-sm text-tertiary-fixed-dim">
                  <span className="material-symbols-outlined text-tertiary-container text-[18px] shrink-0 mt-0.5">
                    warning
                  </span>
                  <span>
                    {isOver
                      ? `Exceeded limit by ₹${(item.spent - item.limit).toLocaleString('en-IN')}`
                      : `At this pace, you'll exceed by ₹${Math.round((item.limit * 0.2)).toLocaleString('en-IN')}`}
                  </span>
                </div>
              )}
            </div>
          );
        }))}

        {/* Create New Budget Button */}
        <button
          type="button"
          onClick={() => setIsEditBudgetOpen(true)}
          className="mt-2 flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed border-outline-variant/60 text-on-surface-variant font-headline-md hover:bg-surface-container hover:text-on-surface transition-all group active:scale-[0.99]"
        >
          <span className="material-symbols-outlined group-hover:text-primary transition-colors text-[22px]">
            add_circle
          </span>
          Manage & Add Category Budgets
        </button>
      </div>
    </div>
  );
};
