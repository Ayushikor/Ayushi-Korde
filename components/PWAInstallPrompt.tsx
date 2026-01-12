
import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Only show if the user hasn't seen it in this session
      if (!sessionStorage.getItem('pwa_prompt_shown')) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem('pwa_prompt_shown', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed top-20 left-4 right-4 z-[100] animate-in slide-in-from-top-10 duration-500">
      <div className="bg-indigo-600 text-white p-5 rounded-3xl shadow-2xl flex items-center justify-between border border-white/20 backdrop-blur-lg">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-2.5 rounded-2xl">
            <Download size={24} />
          </div>
          <div>
            <h3 className="font-black text-sm uppercase tracking-tight">Install App</h3>
            <p className="text-[10px] opacity-80 font-bold uppercase tracking-widest">Access offline & home screen</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleInstall}
            className="bg-white text-indigo-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-tighter shadow-md active:scale-95 transition-all"
          >
            Add
          </button>
          <button onClick={handleDismiss} className="p-1 opacity-60 hover:opacity-100">
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
