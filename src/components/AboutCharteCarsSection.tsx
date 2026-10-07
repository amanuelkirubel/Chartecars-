import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Language } from '../types';

interface AboutCharteCarsSectionProps {
  lang: Language;
  onOpenListCar: () => void;
  onOpenAboutModal?: () => void;
}

export const AboutCharteCarsSection: React.FC<AboutCharteCarsSectionProps> = ({
  lang,
  onOpenListCar,
}) => {
  return (
    <section id="about-charte-cars" className="bg-[#04163C] text-slate-100 py-16 px-4 sm:px-6 lg:px-8 border-t border-blue-900/60">
      <div className="max-w-3xl mx-auto text-center space-y-7">
        
        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
          ABOUT CHARTE CARS
        </h2>

        {/* Lead Intro Description */}
        <p className="text-slate-200 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
          Charte Cars is the worldwide direct car marketplace, built to connect buyers and sellers without agents standing in between. There are no commissions, no hidden charges, and no middleman marking up the price. Sellers list their own car directly, and buyers deal with the real owner.
        </p>

        {/* 2 Rounded Blue Cards */}
        <div className="space-y-4 text-left">
          {/* Card 1: FOR BUYERS — 100% FREE */}
          <div className="bg-[#082259]/80 border border-blue-500/30 rounded-2xl p-5 sm:p-6 shadow-lg">
            <h3 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-sky-400 mb-2">
              FOR BUYERS — 100% FREE
            </h3>
            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
              Browse every listing, see full prices, photos, and descriptions, and contact any seller directly by phone, WhatsApp, or Telegram. No account, no payment, no limits.
            </p>
          </div>

          {/* Card 2: FOR SELLERS — 600 ETB, ONE TIME */}
          <div className="bg-[#082259]/80 border border-blue-500/30 rounded-2xl p-5 sm:p-6 shadow-lg">
            <h3 className="text-xs sm:text-sm font-bold tracking-wider uppercase mb-2">
              <span className="text-sky-400">FOR SELLERS — </span>
              <span className="text-amber-400 font-black">600 ETB, ONE TIME</span>
            </h3>
            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
              Register, pay a single 600 ETB fee, and list your car with up to 15 photos and a full description. Edit your price or photos anytime, and mark your car as Sold or Urgent whenever you need.
            </p>
          </div>
        </div>

        {/* Bottom Button matching Screenshot 3 */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onOpenListCar}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#0051E8] hover:bg-[#0044C7] text-white font-bold text-xs sm:text-sm shadow-xl shadow-blue-600/30 inline-flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ List Your Car (600 ETB, One-Time)</span>
          </button>
        </div>

      </div>
    </section>
  );
};
