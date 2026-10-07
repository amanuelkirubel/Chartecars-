import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  Copy, 
  Check, 
  CheckCircle2, 
  Send, 
  MessageSquare,
  ChevronLeft
} from 'lucide-react';
import { CarListing, Language } from '../types';
import { LISTING_FEE_ETB } from '../config/pricing';
import { CONTACT_INFO } from '../data/mockListings';

interface CarPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  car: CarListing | null;
  purpose?: 'reservation' | 'down_payment' | 'listing_fee';
  lang: Language;
}

export const CarPaymentModal: React.FC<CarPaymentModalProps> = ({
  isOpen,
  onClose,
  car,
  purpose = 'listing_fee',
  lang,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const directMsg = encodeURIComponent(
    `Hello Charte Cars (@chartecar), I would like to pay the ${LISTING_FEE_ETB} ETB service fee to list a vehicle.`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div 
        className="relative bg-white text-slate-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#051329] text-white p-5 sm:p-6 flex items-center justify-between border-b border-blue-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">
                  {lang === 'am' ? 'የቻርቴ መኪኖች ክፍያ ዴስክ' : 'Charte Cars Service Desk'}
                </h2>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Verified
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Official Listing Service Fee: {LISTING_FEE_ETB} ETB
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
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
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/60 transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-center space-y-1">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              Listing Service Fee
            </span>
            <div className="text-3xl font-black font-mono text-amber-900">
              {LISTING_FEE_ETB} ETB
            </div>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Pay 600 ETB directly via Telegram @chartecar or WhatsApp @Chartecar to list your vehicle.
            </p>
          </div>

          <div className="space-y-3">
            <a
              href={`https://t.me/chartecar?text=${directMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow transition"
            >
              <Send className="w-4 h-4" />
              <span>Contact on Telegram: @chartecar</span>
            </a>

            <a
              href={`https://wa.me/?text=${directMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow transition"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Contact on WhatsApp: @Chartecar</span>
            </a>
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={onClose}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
