import React from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { ViewTab } from '../types';

export const FloatingNav: React.FC = () => {
  const { activeTab, setActiveTab } = useExpenses();

  // If in add_expense or weekly_recap full-screen mode, hide floating nav if desired, or keep prominent
  if (activeTab === 'add_expense' || activeTab === 'weekly_recap') {
    return null;
  }

  const navItems: { tab: ViewTab; icon: string; label: string }[] = [
    { tab: 'home', icon: 'home', label: 'Home' },
    { tab: 'activity', icon: 'receipt_long', label: 'Activity' },
    { tab: 'add_expense', icon: 'add', label: 'Add' },
    { tab: 'insights', icon: 'query_stats', label: 'Insights' },
    { tab: 'budgets', icon: 'account_balance_wallet', label: 'Budgets' },
  ];

  return (
    <nav className="fixed bottom-6 inset-x-margin-mobile z-50 pb-safe bg-[#2a2a2a]/70 backdrop-blur-2xl rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.6)] border border-white/10">
      <div className="flex justify-around items-center h-16 px-4 relative">
        {navItems.map((item) => {
          if (item.tab === 'add_expense') {
            return (
              <button
                key={item.tab}
                type="button"
                onClick={() => setActiveTab('add_expense')}
                className="flex flex-col items-center justify-center w-14 h-14 bg-primary text-on-primary rounded-full shadow-[0_0_20px_rgba(208,188,255,0.4)] -mt-8 transition-transform active:scale-95 hover:scale-105"
                title="Add Expense"
              >
                <span className="material-symbols-outlined text-[28px]">add</span>
              </button>
            );
          }

          const isActive = activeTab === item.tab;

          return (
            <button
              key={item.tab}
              type="button"
              onClick={() => setActiveTab(item.tab)}
              className={`flex flex-col items-center justify-center w-12 h-12 transition-all relative ${
                isActive ? 'text-primary scale-110' : 'text-on-surface-variant hover:text-on-surface'
              }`}
              title={item.label}
            >
              <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_#d0bcff] absolute -bottom-1" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
