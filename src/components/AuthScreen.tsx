import React from 'react';
import { useExpenses } from '../context/ExpenseContext';

export const AuthScreen: React.FC = () => {
  const { login, isAuthLoading, authError } = useExpenses();

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] font-sans flex flex-col justify-between p-6 max-w-md mx-auto relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-primary/20 rounded-full blur-[64px] pointer-events-none" />
      <div className="absolute bottom-1/3 -right-20 w-64 h-64 bg-secondary/15 rounded-full blur-[64px] pointer-events-none" />

      {/* Top Header Logo */}
      <div className="pt-12 flex flex-col items-center text-center gap-3 z-10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#a078ff] to-[#4edea3] p-[2px] shadow-[0_0_30px_rgba(208,188,255,0.4)] mb-2">
          <div className="w-full h-full bg-[#131313] rounded-[14px] flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-[36px]">polyline</span>
          </div>
        </div>

        <h1 className="text-[36px] font-bold text-on-surface tracking-tight">Hisaba</h1>
        <span className="text-label-caps font-label-caps text-primary tracking-widest uppercase bg-primary-container/20 px-3 py-1 rounded-full border border-primary/30">
          Personal Expense Tracker
        </span>
      </div>

      {/* Middle Feature Highlights Card */}
      <div className="glass-panel rounded-[28px] p-6 flex flex-col gap-5 border border-white/10 shadow-2xl z-10 my-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-headline-lg font-bold text-on-surface leading-tight">
            Intelligent spending insights, private & synced
          </h2>
          <p className="text-body-sm text-on-surface-variant leading-relaxed">
            Log expenses instantly, track category budgets in real time, and review your weekly financial story with elegant glassmorphic visuals.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="flex flex-col gap-3 pt-2">
          <div className="flex items-center gap-3 text-body-sm text-on-surface">
            <div className="w-8 h-8 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary shrink-0">
              <span className="material-symbols-outlined text-[18px]">bolt</span>
            </div>
            <span>Fast, one-tap expense logging & natural input</span>
          </div>

          <div className="flex items-center gap-3 text-body-sm text-on-surface">
            <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-[18px]">insights</span>
            </div>
            <span>Automated weekly spending story & review</span>
          </div>

          <div className="flex items-center gap-3 text-body-sm text-on-surface">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <span className="material-symbols-outlined text-[18px]">lock</span>
            </div>
            <span>Private, multi-user secure cloud sync</span>
          </div>
        </div>
      </div>

      {/* Bottom Sign In Button & Footer */}
      <div className="flex flex-col gap-4 pb-8 z-10">
        {authError && (
          <div className="bg-tertiary-container/20 border border-tertiary-container/40 p-3.5 rounded-xl text-tertiary text-body-sm text-center">
            {authError}
          </div>
        )}

        <button
          type="button"
          onClick={login}
          disabled={isAuthLoading}
          className="w-full bg-primary hover:bg-primary-fixed-dim text-on-primary font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 shadow-[0_0_24px_rgba(208,188,255,0.35)] transition-all active:scale-[0.98] disabled:opacity-60"
        >
          {isAuthLoading ? (
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
              <span>Connecting to Google...</span>
            </div>
          ) : (
            <>
              {/* Google SVG Logo */}
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span className="text-body-lg font-bold">Continue with Google</span>
            </>
          )}
        </button>

        <p className="text-[12px] text-on-surface-variant/70 text-center font-normal">
          By continuing, you sign in securely to your personal Hisaba workspace.
        </p>
      </div>
    </div>
  );
};
