/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ExpenseProvider, useExpenses } from './context/ExpenseContext';
import { Header } from './components/Header';
import { FloatingNav } from './components/FloatingNav';
import { HomeScreen } from './components/HomeScreen';
import { ActivityScreen } from './components/ActivityScreen';
import { AddExpenseScreen } from './components/AddExpenseScreen';
import { InsightsScreen } from './components/InsightsScreen';
import { BudgetsScreen } from './components/BudgetsScreen';
import { WeeklyRecapModal } from './components/WeeklyRecapModal';
import { TransactionDetailModal } from './components/TransactionDetailModal';
import { EditBudgetModal } from './components/EditBudgetModal';
import { ProfileModal } from './components/ProfileModal';
import { AuthScreen } from './components/AuthScreen';
import { OfflineBanner } from './components/OfflineBanner';
import { usePWA } from './hooks/usePWA';

const MainAppContent: React.FC = () => {
  const {
    user,
    isAuthLoading,
    activeTab,
    setActiveTab,
    selectedExpenseForEdit,
    setSelectedExpenseForEdit,
    isWeeklyRecapOpen,
    setIsWeeklyRecapOpen,
    isProfileOpen,
    setIsProfileOpen,
    isEditBudgetOpen,
    setIsEditBudgetOpen,
  } = useExpenses();

  const { isOffline } = usePWA();

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#131313] text-[#e5e2e1] flex flex-col items-center justify-center p-6 gap-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#a078ff] to-[#4edea3] p-[2.5px] shadow-[0_0_32px_rgba(160,120,255,0.4)] animate-pulse">
          <div className="w-full h-full bg-[#18181b] rounded-[13px] flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-[32px]">polyline</span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-headline-md font-bold text-on-surface tracking-tight">Hisaba</h1>
          <p className="text-body-sm text-on-surface-variant font-medium animate-pulse">Restoring session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="relative min-h-screen bg-[#131313] text-[#e5e2e1]">
        <OfflineBanner isOffline={isOffline} />
        <AuthScreen />
      </div>
    );
  }

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'activity':
        return <ActivityScreen />;
      case 'add_expense':
        return <AddExpenseScreen />;
      case 'insights':
        return <InsightsScreen />;
      case 'budgets':
        return <BudgetsScreen />;
      default:
        return <HomeScreen />;
    }
  };

  const isAddOrRecap = activeTab === 'add_expense';

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] font-sans relative flex flex-col items-center">
      {/* Mobile Shell Constraints */}
      <div className="w-full max-w-md min-h-screen flex flex-col relative px-margin-mobile">
        {/* Header */}
        <Header
          showBack={isAddOrRecap}
          onBack={() => setActiveTab('home')}
        />

        {/* Offline Banner below header */}
        <div className="pt-16 w-full">
          <OfflineBanner isOffline={isOffline} />
        </div>

        {/* Screen Content Container */}
        <main className="flex-1 w-full pt-2 relative">
          {renderActiveScreen()}
        </main>

        {/* Floating Bottom Nav */}
        <FloatingNav />

        {/* Modals & Sheets */}
        <TransactionDetailModal
          expense={selectedExpenseForEdit}
          onClose={() => setSelectedExpenseForEdit(null)}
        />

        <EditBudgetModal
          isOpen={isEditBudgetOpen}
          onClose={() => setIsEditBudgetOpen(false)}
        />

        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
        />

        <WeeklyRecapModal
          isOpen={isWeeklyRecapOpen}
          onClose={() => setIsWeeklyRecapOpen(false)}
        />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ExpenseProvider>
      <MainAppContent />
    </ExpenseProvider>
  );
}
