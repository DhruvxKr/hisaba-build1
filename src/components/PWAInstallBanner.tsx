import React, { useState } from 'react';
import { usePWA } from '../hooks/usePWA';

export const PWAInstallBanner: React.FC = () => {
  const { canInstall, deferredPrompt, isIOS, installPWA, dismissInstall } = usePWA();
  const [showIOSTip, setShowIOSTip] = useState(false);

  if (!canInstall) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await installPWA();
    } else if (isIOS) {
      setShowIOSTip(!showIOSTip);
    }
  };

  return (
    <div className="w-full my-3 bg-surface-container rounded-2xl p-4 border border-primary/20 shadow-[0_0_20px_rgba(160,120,255,0.15)] flex flex-col gap-3 relative overflow-hidden transition-all animate-in fade-in slide-in-from-bottom duration-300">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#a078ff] to-[#4edea3] p-[2px] shadow-[0_0_12px_rgba(208,188,255,0.3)] shrink-0">
            <div className="w-full h-full bg-[#131313] rounded-[10px] flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[22px]">polyline</span>
            </div>
          </div>
          <div className="flex flex-col">
            <h4 className="text-body-lg font-bold text-on-surface">Install Hisaba App</h4>
            <p className="text-body-sm text-on-surface-variant">Fast, app-like expense tracking from your home screen.</p>
          </div>
        </div>

        <button
          type="button"
          onClick={dismissInstall}
          className="w-8 h-8 rounded-full bg-surface-bright flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors shrink-0"
          title="Dismiss"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>

      {showIOSTip && isIOS && (
        <div className="bg-surface-container-high rounded-xl p-3 text-body-sm text-on-surface-variant border border-white/5 flex flex-col gap-1.5 mt-1">
          <div className="flex items-center gap-2 font-semibold text-on-surface">
            <span className="material-symbols-outlined text-primary text-[18px]">ios_share</span>
            <span>How to install on iOS Safari:</span>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-xs text-on-surface-variant pl-1">
            <li>Tap the <strong className="text-on-surface">Share</strong> button in Safari toolbar.</li>
            <li>Scroll down and tap <strong className="text-on-surface">Add to Home Screen</strong>.</li>
            <li>Tap <strong className="text-on-surface">Add</strong> to complete installation.</li>
          </ol>
        </div>
      )}

      <div className="flex items-center gap-2 mt-1">
        <button
          type="button"
          onClick={handleInstallClick}
          className="flex-1 bg-primary text-on-primary font-semibold py-2.5 rounded-xl text-body-sm shadow-[0_0_15px_rgba(208,188,255,0.25)] flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">download_for_offline</span>
          <span>{isIOS ? (showIOSTip ? 'Got it' : 'Installation Guide') : 'Install App'}</span>
        </button>
        <button
          type="button"
          onClick={dismissInstall}
          className="px-4 py-2.5 bg-surface-container-high text-on-surface-variant hover:text-on-surface font-medium rounded-xl text-body-sm transition-colors"
        >
          Not now
        </button>
      </div>
    </div>
  );
};
