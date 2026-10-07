import React from 'react';
import { 
  Mail, 
  Send, 
  ShieldCheck,
  Download,
  Smartphone,
  Video,
  MessageSquare
} from 'lucide-react';
import { CharteLogo } from './CharteLogo';
import { Language } from '../types';
import { CONTACT_INFO } from '../data/mockListings';

interface FooterProps {
  lang: Language;
  onOpenAdmin: () => void;
  onOpenListCar: () => void;
  onOpenDownloadApp: () => void;
  onSelectType: (type: 'all' | 'sale' | 'rent' | 'sold' | 'rented' | 'urgent') => void;
  onOpenAbout?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  onOpenAdmin,
  onOpenListCar,
  onOpenDownloadApp,
  onSelectType,
  onOpenAbout,
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#000E26] border-t border-blue-900/60 text-slate-400 text-xs">
      
      {/* Download App Hero Strip */}
      <div className="bg-gradient-to-r from-[#001438] via-[#002B7A] to-[#001438] py-5 px-4 border-b border-blue-800/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">
                {lang === 'am' ? 'የቻርቴ መኪኖች መተግበሪያን በስልክዎ ይጫኑ' : 'Get Charte Cars on Your Smartphone or PC'}
              </p>
              <p className="text-xs text-blue-200">
                {lang === 'am' ? 'ፈጣን የመኪና ፍለጋ፣ ኦፍላይን እይታ እና የቀጥታ ቴሌግራም/ዋትስአፕ ግንኙነት' : 'Ultra-fast vehicle search, offline browsing, and direct Telegram/WhatsApp connections.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenDownloadApp}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-900/40 flex items-center gap-2 transition active:scale-95 cursor-pointer text-xs"
          >
            <Download className="w-4 h-4" />
            <span>{lang === 'am' ? 'አፕሊኬሽኑን አውርድ (Download App)' : 'Download / Install App'}</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <CharteLogo size="lg" showSubtitle={true} brand="cars" />
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              {lang === 'am'
                ? 'ቻርቴ መኪኖች — በመላው ዓለም አስተማማኝ ተሽከርካሪዎችን ለመግዛት፣ ለመሸጥ እና ለመከራየት የሚያስችል ይፋዊ መድረክ።'
                : 'Charte Cars — World premier automobile marketplace. Connecting buyers and verified car owners with 0% middleman.'}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1 bg-[#001A4E] border border-blue-800/40 text-blue-300 px-3 py-1 rounded-lg text-[11px] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Plate & Inspection</span>
              </span>
            </div>
          </div>

          {/* Quick Vehicle Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {lang === 'am' ? 'ፈጣን ማውጫ' : 'Automobile Categories'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => onSelectType('all')}
                  className="hover:text-blue-300 transition-colors text-left"
                >
                  {lang === 'am' ? 'ሁሉም መኪኖች (All Cars)' : 'All Vehicles'}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectType('sale')}
                  className="hover:text-blue-300 transition-colors text-left"
                >
                  {lang === 'am' ? 'መኪና ይግዙ (Cars for Sale)' : 'Cars for Sale (Buy)'}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectType('rent')}
                  className="hover:text-blue-300 transition-colors text-left"
                >
                  {lang === 'am' ? 'መኪና ይከራዩ (Rental Cars)' : 'Cars for Rent (Rentals)'}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectType('urgent')}
                  className="hover:text-yellow-300 text-yellow-400 transition-colors text-left font-semibold"
                >
                  {lang === 'am' ? 'አጣዳፊ ሽያጭ (Urgent Deals)' : 'Urgent Deals'}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectType('sold')}
                  className="hover:text-red-300 text-red-400 transition-colors text-left font-semibold"
                >
                  {lang === 'am' ? 'የተሸጡ መኪኖች (Sold Cars)' : 'Sold Vehicles'}
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenListCar}
                  className="text-blue-400 hover:text-blue-300 font-semibold"
                >
                  + {lang === 'am' ? 'መኪናዎን ይዘርዝሩ / ይሽጡ (600 ብር)' : 'List / Sell Your Car (600 ETB)'}
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Makes Worldwide */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {lang === 'am' ? 'ተወዳጅ የመኪና አይነቶች' : 'Popular Vehicle Makes'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Toyota (Land Cruiser, Hilux, RAV4, Corolla)</li>
              <li>Hyundai (Tucson, Elantra, Santa Fe)</li>
              <li>Mercedes-Benz (C-Class, E-Class, G-Wagon)</li>
              <li>BYD Electric Vehicles (Atto 3, Song, Tang)</li>
              <li>Suzuki (Dzire, Swift, Jimny)</li>
            </ul>
          </div>

          {/* Direct Social Channels & Admin Portal (NO PHONE NUMBERS!) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {lang === 'am' ? 'ይፋዊ የመገናኛ መስመሮች' : 'Official Channels & Contacts'}
            </h4>
            <div className="space-y-2.5 text-xs">
              
              {/* Direct Telegram Contact @chartecar */}
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-sky-400 shrink-0" />
                <a 
                  href={CONTACT_INFO.telegramContactUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white text-sky-400 font-semibold"
                >
                  Contact Telegram: @chartecar
                </a>
              </div>

              {/* Join Telegram Channel @Chartecars */}
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-blue-400 shrink-0" />
                <a 
                  href={CONTACT_INFO.telegramChannelUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white text-blue-300 font-semibold"
                >
                  Join Telegram Channel: @Chartecars
                </a>
              </div>

              {/* TikTok Channel @Chartecars */}
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-pink-400 shrink-0" />
                <a 
                  href={CONTACT_INFO.tiktokChannelUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white text-pink-300 font-semibold"
                >
                  TikTok Channel: @Chartecars
                </a>
              </div>

              {/* WhatsApp @Chartecar */}
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                <a 
                  href={CONTACT_INFO.whatsappUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white text-emerald-400 font-semibold"
                >
                  WhatsApp: @Chartecar
                </a>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2 pt-1">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-slate-300">chartecars@gmail.com</span>
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenAdmin}
                  className="text-xs text-blue-400 hover:text-white font-medium underline flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{lang === 'am' ? 'የአስተዳዳሪ ፖርታል (Admin Portal)' : 'Admin Portal & Historical Archive'}</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-blue-950/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <p>© {currentYear} Charte Cars World. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Telegram: @chartecar</span>
            <span>·</span>
            <span>Channel: @Chartecars</span>
            <span>·</span>
            <span>TikTok: @Chartecars</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
