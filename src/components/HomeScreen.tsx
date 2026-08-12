import React from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { CATEGORIES_META } from '../data/categories';
import { formatINR } from '../utils/nlpParser';
import { PWAInstallBanner } from './PWAInstallBanner';

export const HomeScreen: React.FC = () => {
  const {
    expenses,
    profile,
    user,
    totalSpentThisMonth,
    remainingBudgetThisMonth,
    setActiveTab,
    setSelectedExpenseForEdit,
    setIsWeeklyRecapOpen,
  } = useExpenses();

  const recentExpenses = expenses.slice(0, 4);

  const hour = new Date().getHours();
  const greetingTime = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const displayName = user?.displayName || profile.name || 'User';

  // Compute ring percentage
  const budgetGoal = profile.monthlyBudgetGoal;
  const spentRatio = budgetGoal > 0 ? Math.min(1, totalSpentThisMonth / budgetGoal) : 0;
  const ringOffset = 188 - 188 * spentRatio; // 2 * PI * r (2 * 3.14 * 30 = ~188)

  return (
    <div className="flex flex-col w-full gap-stack-lg pb-28 pt-2">
      {/* PWA Install Banner */}
      <PWAInstallBanner />

      {/* Greeting Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-[28px] font-bold text-on-surface tracking-tight">
          {greetingTime}, {displayName}
        </h1>
        <p className="text-body-sm text-on-surface-variant font-normal">
          Here is your financial pulse for this month.
        </p>
      </div>

      {/* Main Monthly Spending Hero Card */}
      <div className="relative bg-surface-container rounded-[24px] p-6 shadow-xl flex flex-col gap-4 overflow-hidden border border-white/5 group">
        {/* Violet Ambient Glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/15 rounded-full blur-[48px] pointer-events-none" />

        <div className="flex items-center justify-between z-10">
          <div className="flex flex-col">
            <span className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest mb-1">
              Monthly Spending
            </span>
            <span className="text-display-currency font-display-currency text-on-surface">
              {formatINR(totalSpentThisMonth)}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsWeeklyRecapOpen(true)}
            className="flex items-center gap-1.5 bg-primary-container/20 border border-primary/30 px-3 py-1.5 rounded-full text-primary hover:bg-primary-container/30 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
            <span className="text-label-caps font-semibold">Weekly Recap</span>
          </button>
        </div>

        {/* Wave Sparkline Chart */}
        <div className="relative w-full h-[80px] z-10 mt-2">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 300 80" preserveAspectRatio="none">
            <defs>
              <linearGradient id="homeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a078ff" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#a078ff" stopOpacity="0.0" />
              </linearGradient>
              <filter id="homeGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              d="M0,80 L0,50 Q40,30 80,60 T160,25 T240,45 T300,15 L300,80 Z"
              fill="url(#homeGradient)"
            />
            <path
              d="M0,50 Q40,30 80,60 T160,25 T240,45 T300,15"
              fill="none"
              stroke="#a078ff"
              strokeWidth="3"
              strokeLinecap="round"
              filter="url(#homeGlow)"
            />
          </svg>
        </div>
      </div>

      {/* Grid Cards: Ring Progress & Quick Highlights */}
      <div className="grid grid-cols-2 gap-stack-md">
        {/* Left Card: REMAINING with Ring Meter */}
        <div className="bg-surface-container rounded-[24px] p-4 flex flex-col items-center justify-between border border-white/5 relative overflow-hidden shadow-md">
          <span className="text-label-caps font-label-caps text-secondary uppercase tracking-widest self-start">
            Remaining
          </span>

          <div className="relative w-28 h-28 my-3 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r="30"
                stroke="#2a2a2a"
                strokeWidth="7"
                fill="none"
              />
              <circle
                cx="40"
                cy="40"
                r="30"
                stroke="#4edea3"
                strokeWidth="7"
                strokeDasharray="188"
                strokeDashoffset={ringOffset}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-1000 ease-out"
                style={{ filter: 'drop-shadow(0 0 6px rgba(78, 222, 163, 0.5))' }}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-body-lg font-bold text-on-surface">
                {budgetGoal > 0 ? `₹${Math.round(remainingBudgetThisMonth / 1000)}k` : '₹0'}
              </span>
              <span className="text-[10px] text-on-surface-variant">
                {budgetGoal > 0 ? `of ₹${Math.round(budgetGoal / 1000)}k` : 'No budget set'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Stack Cards */}
        <div className="flex flex-col gap-stack-md justify-between">
          {/* Insight Card */}
          <div className="bg-surface-container rounded-[20px] p-3.5 flex flex-col gap-1 border border-white/5 relative overflow-hidden shadow-sm">
            <div className="flex items-center gap-1.5 text-tertiary">
              <span className="material-symbols-outlined text-[16px]">trending_down</span>
              <span className="text-label-caps font-label-caps uppercase tracking-wider">Insight</span>
            </div>
            <p className="text-body-sm text-on-surface leading-tight font-normal">
              You're spending <span className="text-secondary font-bold">18% less</span> on food this month.
            </p>
          </div>

          {/* Upcoming Card */}
          <div className="bg-surface-container rounded-[20px] p-3.5 flex flex-col gap-1 border border-white/5 relative overflow-hidden shadow-sm">
            <div className="flex items-center gap-1.5 text-primary">
              <span className="material-symbols-outlined text-[16px]">event_repeat</span>
              <span className="text-label-caps font-label-caps uppercase tracking-wider">Upcoming</span>
            </div>
            <p className="text-body-sm text-on-surface leading-tight font-normal">
              <span className="font-bold text-primary">₹2,400</span> in subs renew this week.
            </p>
          </div>
        </div>
      </div>

      {/* Weekly Recap Quick Action Banner */}
      <div 
        onClick={() => setIsWeeklyRecapOpen(true)}
        className="bg-gradient-to-r from-primary-container/20 via-surface-container to-secondary-container/20 rounded-[24px] p-4 border border-white/10 flex items-center justify-between cursor-pointer hover:border-primary/40 transition-all shadow-md group active:scale-[0.99]"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-[20px]">movie</span>
          </div>
          <div className="flex flex-col">
            <span className="text-headline-md text-[16px] text-on-surface font-semibold">
              Your Week in Review
            </span>
            <span className="text-body-sm text-on-surface-variant text-[13px]">
              Tap to watch your spending story
            </span>
          </div>
        </div>
        <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">
          chevron_right
        </span>
      </div>

      {/* Recent Activity Section */}
      <div className="flex flex-col gap-stack-md mt-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-headline-md font-headline-md text-on-surface">Recent Activity</h2>
          <button
            type="button"
            onClick={() => setActiveTab('activity')}
            className="text-label-caps font-label-caps text-primary uppercase tracking-wider hover:underline"
          >
            SEE ALL
          </button>
        </div>

        <div className="flex flex-col gap-stack-sm">
          {recentExpenses.length === 0 ? (
            <div className="bg-surface-container rounded-2xl p-6 text-center text-on-surface-variant">
              No transactions logged yet. Tap + to add your first expense!
            </div>
          ) : (
            recentExpenses.map((exp) => {
              const meta = CATEGORIES_META[exp.category] || CATEGORIES_META.Other;
              return (
                <div
                  key={exp.id}
                  onClick={() => setSelectedExpenseForEdit(exp)}
                  className="bg-surface-container/70 hover:bg-surface-container p-3.5 rounded-[20px] flex items-center gap-stack-md cursor-pointer transition-all border border-white/5 active:scale-[0.99] group"
                >
                  {/* Category Icon */}
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.05),0_4px_12px_rgba(0,0,0,0.3)] shrink-0"
                    style={{ backgroundColor: '#1A1A1A' }}
                  >
                    <span
                      className="material-symbols-outlined text-[22px]"
                      style={{ color: meta.color }}
                    >
                      {meta.materialIcon}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-center min-w-0">
                    <div className="flex justify-between items-end w-full">
                      <span className="text-body-lg font-semibold text-on-surface truncate">
                        {exp.merchant}
                      </span>
                      <span className="text-body-lg font-bold text-on-surface whitespace-nowrap ml-2">
                        -₹{exp.amount.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between items-start w-full mt-0.5">
                      <span className="text-body-sm text-on-surface-variant truncate">
                        {exp.category}
                      </span>
                      <span className="text-body-sm text-outline whitespace-nowrap ml-2 text-[12px]">
                        {exp.time || exp.date}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
