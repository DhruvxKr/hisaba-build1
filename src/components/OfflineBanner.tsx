import React from 'react';

interface OfflineBannerProps {
  isOffline: boolean;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ isOffline }) => {
  if (!isOffline) return null;

  return (
    <div className="w-full bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 flex items-center justify-center gap-2 text-amber-300 text-body-sm font-medium animate-in fade-in slide-in-from-top duration-300 z-40">
      <span className="material-symbols-outlined text-[18px]">wifi_off</span>
      <span>You're working offline. Changes are saved locally and will sync when connected.</span>
    </div>
  );
};
