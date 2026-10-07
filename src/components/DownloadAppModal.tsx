import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Smartphone, 
  X, 
  CheckCircle2, 
  QrCode, 
  Laptop, 
  Apple, 
  ShieldCheck, 
  Zap, 
  BellRing, 
  ArrowDownToLine,
  ChevronLeft
} from 'lucide-react';
import { Language } from '../types';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface DownloadAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const DownloadAppModal: React.FC<DownloadAppModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'install' | 'qr' | 'guide'>('install');

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setInstallSuccess(true);
        setTimeout(() => onClose(), 2500);
      }
      setDeferredPrompt(null);
    } else {
      setActiveTab('guide');
    }
  };

  const handleDownloadAppLauncher = () => {
    const appInfo = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Charte Cars App</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="refresh" content="0; url=${window.location.href}">
  <style>
    body { font-family: sans-serif; background: #001A4E; color: white; text-align: center; padding: 50px 20px; }
    .btn { background: #003399; color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: bold; }
  </style>
</head>
<body>
  <h2>Launching Charte Cars App...</h2>
  <p>Connecting to World automobile marketplace.</p>
  <p><a class="btn" href="${window.location.href}">Open Charte Cars Now</a></p>
</body>
</html>`;
    const blob = new Blob([appInfo], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'CharteCars-App-Launcher.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://chartecars-v2.onrender.com';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(currentUrl)}&bgcolor=051838&color=ffffff&margin=10`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-[#051838] border border-blue-500/40 rounded-3xl shadow-2xl p-6 sm:p-8 z-10 space-y-6 text-slate-100">
        
        {/* Header Controls: Back & Close */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-950/80 hover:bg-blue-900 border border-blue-700/60 text-slate-200 hover:text-white text-xs font-bold transition cursor-pointer"
            title={lang === 'am' ? 'ወደ ኋላ ተመለስ (Back)' : 'Go back to listings'}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{lang === 'am' ? 'ወደ ኋላ' : 'Back'}</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#00266B] via-[#0037A3] to-[#2563EB] flex items-center justify-center text-white font-black text-xl shadow-xl border border-blue-400/40 shrink-0">
            CC
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Charte Cars App
              </h3>
              <span className="bg-blue-600/30 text-blue-300 border border-blue-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                Official
              </span>
            </div>
            <p className="text-xs text-blue-200 font-medium">
              {lang === 'am' ? 'የቻርቴ መኪኖች ይፋዊ የሞባይልና የኮምፒውተር መተግበሪያ' : "World's Official Automobile Marketplace App"}
            </p>
          </div>
        </div>

        {installSuccess ? (
          <div className="bg-emerald-950/80 border border-emerald-500 text-emerald-200 p-5 rounded-2xl flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
            <div>
              <p className="font-bold text-sm">
                {lang === 'am' ? 'መተግበሪያው በተሳካ ሁኔታ ተጭኗል!' : 'Charte Cars App Installed Successfully!'}
              </p>
              <p className="text-xs text-emerald-300/80 mt-0.5">
                {lang === 'am' ? 'አሁን ከስልክዎ ወይም ከኮምፒውተርዎ በቀጥታ መጠቀም ይችላሉ።' : 'You can now launch Charte Cars directly from your home screen or app drawer.'}
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="grid grid-cols-3 gap-1 bg-[#030E24] p-1.5 rounded-2xl border border-blue-900/50 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('install')}
                className={`py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'install' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <ArrowDownToLine className="w-3.5 h-3.5" />
                <span>{lang === 'am' ? 'ጫን / አውርድ' : 'Install'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('qr')}
                className={`py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'qr' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>{lang === 'am' ? 'QR ኮድ' : 'Scan QR'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('guide')}
                className={`py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'guide' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>{lang === 'am' ? 'መመሪያ' : 'Guide'}</span>
              </button>
            </div>

            {/* TAB 1 */}
            {activeTab === 'install' && (
              <div className="space-y-4">
                <div className="bg-[#020A1A]/80 border border-blue-900/60 rounded-2xl p-4 space-y-2.5">
                  <div className="text-xs font-bold text-blue-300 uppercase tracking-wider">
                    {lang === 'am' ? 'የመተግበሪያው ጥቅሞች' : 'App Features & Benefits'}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{lang === 'am' ? 'በጣም ፈጣን እይታ' : 'Fast 0-Lag Speed'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BellRing className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>{lang === 'am' ? 'የአዳዲስ መኪኖች ማሳወቂያ' : 'New Car Alerts'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{lang === 'am' ? 'የተረጋገጡ ሻጮች' : 'Verified World Cars'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-purple-400 shrink-0" />
                      <span>{lang === 'am' ? 'ኢንተርኔት ቆጣቢ' : 'Offline Mode Support'}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-base shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2.5 transition active:scale-[0.99] cursor-pointer"
                >
                  <Download className="w-5 h-5" />
                  <span>
                    {deferredPrompt 
                      ? (lang === 'am' ? 'የቻርቴ መኪኖች መተግበሪያን ጫን' : 'Install Charte Cars App Now') 
                      : (lang === 'am' ? 'በመሳሪያዎ ላይ ይጫኑ' : 'Install to Home Screen / Desktop')}
                  </span>
                </button>

                <div>
                  <button
                    type="button"
                    onClick={handleDownloadAppLauncher}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-blue-400 text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition"
                  >
                    <ArrowDownToLine className="w-4 h-4 text-blue-400" />
                    <span>{lang === 'am' ? 'የመተግበሪያውን ፋይል አውርድ (.html)' : 'Download Offline App Launcher File'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: QR Code */}
            {activeTab === 'qr' && (
              <div className="text-center space-y-4 py-2">
                <p className="text-xs text-slate-300">
                  {lang === 'am' 
                    ? 'የስልክዎን ካሜራ ወደዚህ QR ኮድ በማዞር መተግበሪያውን በሞባይልዎ ይክፈቱ እና ይጫኑ፡' 
                    : 'Scan this QR code with your phone camera to open and install Charte Cars instantly:'}
                </p>

                <div className="inline-block p-3 rounded-2xl bg-white shadow-2xl">
                  <img
                    src={qrUrl}
                    alt="Charte Cars App QR Code"
                    className="w-44 h-44 rounded-lg object-contain mx-auto"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: Guide */}
            {activeTab === 'guide' && (
              <div className="space-y-3 text-xs">
                <div className="bg-[#020A1A] p-3.5 rounded-2xl border border-blue-900/50 space-y-1.5">
                  <div className="font-bold text-white flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span>Android (Google Chrome)</span>
                  </div>
                  <ol className="list-decimal list-inside text-slate-300 space-y-1 pl-1">
                    <li>Tap the three vertical dots (⋮) at top right.</li>
                    <li>Select "Install app" or "Add to Home screen".</li>
                    <li>Confirm "Install" to add Charte Cars to your phone.</li>
                  </ol>
                </div>

                <div className="bg-[#020A1A] p-3.5 rounded-2xl border border-blue-900/50 space-y-1.5">
                  <div className="font-bold text-white flex items-center gap-2">
                    <Apple className="w-4 h-4 text-slate-200" />
                    <span>iPhone / iPad (Safari)</span>
                  </div>
                  <ol className="list-decimal list-inside text-slate-300 space-y-1 pl-1">
                    <li>Tap the Share icon (📤) in Safari toolbar.</li>
                    <li>Scroll down and tap "Add to Home Screen" (+).</li>
                    <li>Tap "Add" in top right corner.</li>
                  </ol>
                </div>

                <div className="bg-[#020A1A] p-3.5 rounded-2xl border border-blue-900/50 space-y-1.5">
                  <div className="font-bold text-white flex items-center gap-2">
                    <Laptop className="w-4 h-4 text-blue-400" />
                    <span>PC & Mac (Chrome / Edge)</span>
                  </div>
                  <p className="text-slate-300 pl-1">
                    Click the install icon (⊕ or desktop monitor) in the browser address bar.
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <div className="pt-2 border-t border-blue-950/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>Telegram Desk: @chartecar</span>
          <button
            type="button"
            onClick={onClose}
            className="text-blue-400 hover:text-white underline font-semibold"
          >
            {lang === 'am' ? 'ዝጋ' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
