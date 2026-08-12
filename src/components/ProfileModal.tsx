import React, { useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { usePWA } from '../hooks/usePWA';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { profile, updateProfile, expenses, logout, user } = useExpenses();
  const { isStandalone, installPWA, deferredPrompt, isIOS } = usePWA();

  const [name, setName] = useState(user?.displayName || profile.name || 'User');
  const [goal, setGoal] = useState(profile.monthlyBudgetGoal.toString());
  const [showIOSTip, setShowIOSTip] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    updateProfile({
      name: name.trim() || user?.displayName || 'User',
      monthlyBudgetGoal: parseFloat(goal) || 0,
    });
    onClose();
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(expenses, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `hisaba_expenses_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const avatarUrl = user?.photoURL || profile.photoURL;
  const displayName = user?.displayName || profile.name || 'User';
  const displayEmail = user?.email || profile.email || '';

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end justify-center p-0">
      <div className="w-full max-w-lg bg-surface-container rounded-t-[32px] p-6 border-t border-white/10 flex flex-col gap-5 animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">person</span>
            <h3 className="text-headline-md text-on-surface font-semibold">User Settings</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-bright flex items-center justify-center text-on-surface hover:bg-surface-dim transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Profile Avatar Hero */}
        <div className="flex items-center gap-4 bg-surface-container-low p-4 rounded-2xl border border-white/5">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-14 h-14 rounded-full object-cover border-2 border-primary/40 shadow-[0_0_15px_rgba(208,188,255,0.3)] shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-headline-lg shadow-[0_0_20px_rgba(208,188,255,0.4)] shrink-0">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-headline-md text-on-surface font-bold truncate">
              {displayName}
            </span>
            {displayEmail && (
              <span className="text-body-sm text-on-surface-variant truncate">
                {displayEmail}
              </span>
            )}
          </div>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-label-caps text-on-surface-variant uppercase mb-1 block">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-surface-container-low text-on-surface rounded-xl px-4 py-3 text-body-lg focus:outline-none focus:ring-1 focus:ring-primary/50 border border-white/5 font-semibold"
            />
          </div>

          <div>
            <label className="text-label-caps text-on-surface-variant uppercase mb-1 block">
              Monthly Budget Goal (₹)
            </label>
            <input
              type="number"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full bg-surface-container-low text-on-surface rounded-xl px-4 py-3 text-body-lg focus:outline-none focus:ring-1 focus:ring-primary/50 border border-white/5 font-semibold"
            />
          </div>
        </div>

        {/* Export / App Actions */}
        <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
          {!isStandalone && (
            <>
              {deferredPrompt ? (
                <button
                  type="button"
                  onClick={installPWA}
                  className="w-full bg-primary/20 hover:bg-primary/30 text-primary py-3 rounded-xl font-semibold text-body-sm flex items-center justify-center gap-2 border border-primary/30 transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">download_for_offline</span>
                  Install Hisaba App
                </button>
              ) : isIOS ? (
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => setShowIOSTip(!showIOSTip)}
                    className="w-full bg-primary/20 hover:bg-primary/30 text-primary py-3 rounded-xl font-semibold text-body-sm flex items-center justify-center gap-2 border border-primary/30 transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px]">ios_share</span>
                    How to Install on iOS
                  </button>
                  {showIOSTip && (
                    <div className="bg-surface-container-high rounded-xl p-3 text-body-sm text-on-surface-variant border border-white/5 space-y-1 text-xs">
                      <p>1. Tap the <strong className="text-on-surface">Share</strong> button in Safari.</p>
                      <p>2. Select <strong className="text-on-surface">Add to Home Screen</strong>.</p>
                      <p>3. Tap <strong className="text-on-surface">Add</strong>.</p>
                    </div>
                  )}
                </div>
              ) : null}
            </>
          )}

          <button
            type="button"
            onClick={handleExportJSON}
            className="w-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface py-3 rounded-xl font-semibold text-body-sm flex items-center justify-center gap-2 border border-white/5 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export Expense History (JSON)
          </button>

          <button
            type="button"
            onClick={logout}
            className="w-full bg-tertiary-container/20 hover:bg-tertiary-container/30 text-tertiary py-3 rounded-xl font-semibold text-body-sm flex items-center justify-center gap-2 border border-tertiary-container/30 transition-all mt-1"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Sign Out
          </button>
        </div>

        {/* Save Button */}
        <button
          type="button"
          onClick={handleSave}
          className="w-full bg-primary text-on-primary font-semibold py-3.5 rounded-xl text-body-lg shadow-[0_0_15px_rgba(208,188,255,0.3)] mt-2"
        >
          Save Profile
        </button>
      </div>
    </div>
  );
};

