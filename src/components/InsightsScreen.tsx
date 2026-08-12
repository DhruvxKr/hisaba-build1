import React, { useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { CATEGORIES_META } from '../data/categories';
import { formatINR } from '../utils/nlpParser';

export const InsightsScreen: React.FC = () => {
  const { expenses, totalSpentThisMonth, setIsWeeklyRecapOpen } = useExpenses();
  const [activeTooltipPoint, setActiveTooltipPoint] = useState<{
    date: string;
    amount: string;
    x: number;
    y: number;
  } | null>(null);

  const currentMonthPrefix = new Date().toISOString().substring(0, 7);
  
  const prevMonthDate = new Date();
  prevMonthDate.setMonth(prevMonthDate.getMonth() - 1);
  const prevMonthPrefix = prevMonthDate.toISOString().substring(0, 7);

  const currentMonthExpenses = expenses.filter(e => e.date.startsWith(currentMonthPrefix));
  const prevMonthExpenses = expenses.filter(e => e.date.startsWith(prevMonthPrefix));

  const totalSpentPrevMonth = prevMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

  let trendPct = 0;
  if (totalSpentPrevMonth > 0) {
    trendPct = Math.round(((totalSpentThisMonth - totalSpentPrevMonth) / totalSpentPrevMonth) * 100);
  } else if (totalSpentThisMonth > 0) {
    trendPct = 100;
  }

  // Group top spending categories (all time or this month? let's do this month)
  const categoryTotals: Record<string, number> = {};
  currentMonthExpenses.forEach((exp) => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
  });

  const sortedTopCategories = Object.entries(categoryTotals)
    .map(([cat, total]) => ({ category: cat, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 4);

  const maxCategoryTotal = Math.max(...sortedTopCategories.map((c) => c.total), 1);

  // Weekday vs Weekend
  let weekdayTotal = 0;
  let weekendTotal = 0;
  currentMonthExpenses.forEach(exp => {
    const day = new Date(exp.date).getDay();
    if (day === 0 || day === 6) weekendTotal += exp.amount;
    else weekdayTotal += exp.amount;
  });

  const totalDaysInMonthSoFar = new Date().getDate();
  const weekendsSoFar = Array.from({length: totalDaysInMonthSoFar}).filter((_, i) => {
    const d = new Date();
    d.setDate(i + 1);
    return d.getDay() === 0 || d.getDay() === 6;
  }).length || 1;
  const weekdaysSoFar = totalDaysInMonthSoFar - weekendsSoFar || 1;

  const avgWeekend = weekendTotal / weekendsSoFar;
  const avgWeekday = weekdayTotal / weekdaysSoFar;

  let weekendPattern = '';
  if (avgWeekend > avgWeekday * 1.5) {
    weekendPattern = `You spend ${Math.round((avgWeekend / avgWeekday - 1) * 100)}% more on weekends.`;
  } else if (avgWeekday > avgWeekend * 1.5) {
    weekendPattern = `You spend ${Math.round((avgWeekday / avgWeekend - 1) * 100)}% more on weekdays.`;
  } else {
    weekendPattern = 'Your spending is balanced across the week.';
  }

  // Chart data points - simplify by using cumulative spending if not enough data
  const daysWithExpenses = Array.from(new Set(currentMonthExpenses.map(e => e.date))).sort();
  
  if (currentMonthExpenses.length === 0) {
    return (
      <div className="flex flex-col w-full gap-section-gap pb-28 pt-2 h-full items-center justify-center text-center mt-20">
        <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-on-surface-variant text-[32px]">query_stats</span>
        </div>
        <h2 className="text-headline-lg font-bold text-on-surface mb-2">Not enough data yet</h2>
        <p className="text-body-lg text-on-surface-variant max-w-[250px]">
          Add a few expenses and Hisaba will start finding patterns in your spending.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full gap-section-gap pb-28 pt-2">
      {/* Header */}
      <div className="flex flex-col gap-stack-sm text-center">
        <h1 className="text-headline-lg font-headline-lg text-on-surface">Your Money Story</h1>
        <p className="text-body-lg font-body-lg text-on-surface-variant">
          Here’s how you’ve been spending this month.
        </p>
      </div>

      {/* Main Area Chart Card */}
      <div className="relative bg-surface-container rounded-[24px] p-6 shadow-xl flex flex-col gap-stack-lg overflow-hidden border-t border-white/5">
        {/* Glow effect */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-[40px] pointer-events-none" />

        <div className="flex items-center justify-between z-10">
          <div className="flex flex-col">
            <span className="text-label-caps font-label-caps text-on-surface-variant uppercase">
              Total Outflow
            </span>
            <span className="text-display-currency-mobile font-display-currency-mobile text-on-surface">
              {formatINR(totalSpentThisMonth)}
            </span>
          </div>

          {(totalSpentPrevMonth > 0 || totalSpentThisMonth > 0) && (
            <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full border border-white/5 ${trendPct <= 0 ? 'bg-secondary/10 text-secondary' : 'bg-tertiary/10 text-tertiary'}`}>
              <span className="material-symbols-outlined text-[16px]">{trendPct <= 0 ? 'trending_down' : 'trending_up'}</span>
              <span className="text-body-sm font-body-sm font-semibold">{Math.abs(trendPct)}%</span>
            </div>
          )}
        </div>

        {/* Removed Fake SVG Chart to simplify for real data until complex real chart is built */}
        <div className="flex flex-col gap-2 mt-4 z-10">
            <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: '100%' }} />
            </div>
            <p className="text-body-sm text-on-surface-variant">
                {daysWithExpenses.length} days of spending this month.
            </p>
        </div>
      </div>

      {/* Key Highlights Bento Grid */}
      <div className="flex flex-col gap-stack-md">
        <h2 className="text-headline-md font-headline-md text-on-surface px-1">Key Highlights</h2>

        <div className="grid grid-cols-2 gap-stack-md">
          {/* Story 1 */}
          <div className="bg-surface-container-low rounded-2xl p-4 flex flex-col gap-stack-sm relative overflow-hidden border border-white/5 hover:bg-surface-container transition-colors">
            <div className="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center mb-1 text-secondary">
              <span className="material-symbols-outlined text-[20px]">category</span>
            </div>
            <p className="text-body-sm font-body-sm text-on-surface leading-tight">
              {sortedTopCategories[0] ? `Your top expense category is ${sortedTopCategories[0].category}.` : 'No categories yet.'}
            </p>
          </div>

          {/* Story 2 */}
          <div className="bg-surface-container-low rounded-2xl p-4 flex flex-col gap-stack-sm relative overflow-hidden border border-white/5 hover:bg-surface-container transition-colors">
            <div className="w-10 h-10 rounded-full bg-tertiary-container/20 flex items-center justify-center mb-1 text-tertiary">
              <span className="material-symbols-outlined text-[20px]">calendar_today</span>
            </div>
            <p className="text-body-sm font-body-sm text-on-surface leading-tight">
              You've logged expenses on {daysWithExpenses.length} different days.
            </p>
          </div>
        </div>

        {/* Pattern Identified Banner */}
        <div className="bg-primary-container rounded-2xl p-5 flex items-center justify-between relative overflow-hidden shadow-md border border-white/10">
          <div className="flex flex-col z-10 w-2/3">
            <span className="text-label-caps font-label-caps text-on-primary-container/70 uppercase mb-1">
              Spending Pattern
            </span>
            <p className="text-body-lg font-headline-md text-on-primary-container leading-snug">
              {weekendPattern}
            </p>
          </div>
          <div className="z-10 w-12 h-12 rounded-full bg-on-primary-container/10 flex items-center justify-center backdrop-blur-sm text-on-primary-container">
            <span className="material-symbols-outlined text-[24px]">insights</span>
          </div>
        </div>
      </div>

      {/* Top Categories Breakdown */}
      {sortedTopCategories.length > 0 && (
        <div className="flex flex-col gap-stack-md">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-headline-md font-headline-md text-on-surface">Top Categories</h2>
            <button
              type="button"
              onClick={() => setIsWeeklyRecapOpen(true)}
              className="text-body-sm font-body-sm text-primary hover:underline transition-colors"
            >
              Weekly Breakdown
            </button>
          </div>

          <div className="flex flex-col gap-stack-sm">
            {sortedTopCategories.map((item) => {
              const meta = CATEGORIES_META[item.category as keyof typeof CATEGORIES_META] || CATEGORIES_META.Other;
              const pct = Math.round((item.total / maxCategoryTotal) * 100);

              return (
                <div key={item.category} className="bg-surface-container rounded-2xl p-4 flex flex-col gap-3 border border-white/5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]" style={{ color: meta.color }}>
                          {meta.materialIcon}
                        </span>
                      </div>
                      <span className="text-body-lg font-body-lg text-on-surface font-semibold">
                        {item.category}
                      </span>
                    </div>
                    <span className="text-body-lg font-headline-md text-on-surface">
                      ₹{item.total.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden relative">
                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary-fixed rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    >
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-primary-fixed rounded-full blur-[4px]" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
