import React from 'react';
import { X, PlusCircle, ChevronLeft } from 'lucide-react';
import { Language } from '../types';

interface AboutCharteCarsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenListCar: () => void;
  lang: Language;
}

export const AboutCharteCarsModal: React.FC<AboutCharteCarsModalProps> = ({
  isOpen,
  onClose,
  onOpenListCar,
  lang,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      id="about-charte-cars-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-[#04163C] border border-blue-500/40 rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-100 my-8 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Controls: Back & Close Buttons */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-950/80 border border-blue-700/60 text-slate-200 hover:text-white text-xs font-bold transition cursor-pointer"
            title={lang === 'am' ? 'ወደ ኋላ ተመለስ (Back)' : 'Go back to listings'}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{lang === 'am' ? 'ወደ ኋላ' : 'Back'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-blue-950/80 border border-blue-700/50 text-slate-300 hover:text-white hover:bg-blue-900 flex items-center justify-center transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-black text-white text-center uppercase tracking-tight mb-4">
          ABOUT CHARTE CARS
        </h2>

        {/* Lead Intro Description */}
        <p className="text-slate-200 text-xs sm:text-sm text-center leading-relaxed max-w-md mx-auto mb-6">
          Charte Cars is the worldwide direct car marketplace, built to connect buyers and sellers without agents standing in between. There are no commissions, no hidden charges, and no middleman marking up the price. Sellers list their own car directly, and buyers deal with the real owner.
        </p>

        {/* Card 1: FOR BUYERS — 100% FREE */}
        <div className="bg-[#082259]/80 border border-blue-500/30 rounded-2xl p-5 mb-4 shadow-lg">
          <h3 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-sky-400 mb-2">
            FOR BUYERS — 100% FREE
          </h3>
          <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
            Browse every listing, see full prices, photos, and descriptions, and contact any seller directly by phone, WhatsApp, or Telegram. No account, no payment, no limits.
          </p>
        </div>

        {/* Card 2: FOR SELLERS — 600 ETB, ONE TIME */}
        <div className="bg-[#082259]/80 border border-blue-500/30 rounded-2xl p-5 mb-6 shadow-lg">
          <h3 className="text-xs sm:text-sm font-bold tracking-wider uppercase mb-2">
            <span className="text-sky-400">FOR SELLERS — </span>
            <span className="text-amber-400 font-black">600 ETB, ONE TIME</span>
          </h3>
          <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
            Register, pay a single 600 ETB fee, and list your car with up to 15 photos and a full description. Edit your price or photos anytime, and mark your car as Sold or Urgent whenever you need.
          </p>
        </div>

        {/* Action Button */}
        <div>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenListCar();
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#0051E8] hover:bg-[#0044C7] text-white font-bold text-xs sm:text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition active:scale-[0.99] cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ List Your Car (600 ETB, One-Time)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
