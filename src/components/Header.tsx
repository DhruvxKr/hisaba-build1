import React from 'react';
import { useExpenses } from '../context/ExpenseContext';

interface HeaderProps {
  screenName?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ screenName, showBack, onBack }) => {
  const { activeTab, setIsProfileOpen, profile, user } = useExpenses();

  const getTabTitle = () => {
    if (screenName) return screenName;
    switch (activeTab) {
      case 'home':
        return 'Home';
      case 'activity':
        return 'Activity';
      case 'add_expense':
        return 'Add Transaction';
      case 'insights':
        return 'Insights';
      case 'budgets':
        return 'Budgets';
      case 'weekly_recap':
        return 'Weekly Review';
      default:
        return 'Home';
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#131313]/80 backdrop-blur-xl pt-safe border-b border-white/5">
      <div className="h-16 px-margin-mobile flex items-center justify-between">
        {showBack ? (
          <div className="flex items-center gap-stack-md">
            <button
              type="button"
              onClick={onBack}
              className="w-10 h-10 flex items-center justify-center -ml-2 text-on-surface hover:bg-surface-variant/30 rounded-full transition-colors active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back_ios_new</span>
            </button>
            <h1 className="font-headline-md text-headline-md text-on-surface">{getTabTitle()}</h1>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              {/* Hisaba Diamond Pulse Logo */}
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#a078ff] to-[#4edea3] p-[1.5px] shadow-[0_0_12px_rgba(208,188,255,0.3)]">
                <div className="w-full h-full bg-[#131313] rounded-[7px] flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[18px]">polyline</span>
                </div>
              </div>
              <span className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                Hisaba
              </span>
            </div>

            <div className="flex items-center gap-stack-md">
              <span className="text-body-sm text-on-surface-variant font-medium">
                {getTabTitle()}
              </span>
              <button
                type="button"
                onClick={() => setIsProfileOpen(true)}
                className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-[0_0_10px_rgba(208,188,255,0.25)] hover:scale-105 active:scale-95 transition-all overflow-hidden border border-white/10"
                title="Profile Settings"
              >
                {user?.photoURL || profile.photoURL ? (
                  <img src={user?.photoURL || profile.photoURL} alt={user?.displayName || profile.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-[18px]">person</span>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};
