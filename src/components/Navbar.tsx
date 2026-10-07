import React, { useState } from 'react';
import { 
  Heart, 
  PlusCircle, 
  Menu, 
  X, 
  Download,
  User,
  LogOut,
  Search,
  Send,
  Car as CarIcon,
  Video
} from 'lucide-react';
import { Language, Currency, ListingType } from '../types';
import { CONTACT_INFO } from '../data/mockListings';

interface NavbarProps {
  currentType: ListingType | 'all' | 'sold' | 'rented' | 'urgent';
  onSelectType: (type: ListingType | 'all' | 'sold' | 'rented' | 'urgent') => void;
  lang: Language;
  onToggleLang: () => void;
  currency: Currency;
  onToggleCurrency: () => void;
  favoritesCount: number;
  onOpenFavorites: () => void;
  onOpenListCar: () => void;
  onOpenAdmin: () => void;
  onOpenDownloadApp: () => void;
  onOpenSearch: () => void;
  onOpenPaymentDesk?: () => void;
  onOpenAbout?: () => void;
  isAdminLoggedIn?: boolean;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentType,
  onSelectType,
  lang,
  onToggleLang,
  currency,
  onToggleCurrency,
  favoritesCount,
  onOpenFavorites,
  onOpenListCar,
  onOpenAdmin,
  onOpenDownloadApp,
  onOpenSearch,
  onOpenAbout,
  isAdminLoggedIn = false,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full shadow-md">

      {/* 1. Thin top strip: Telegram Contact, Telegram Channel, TikTok, Admin Login (NO phone numbers!) */}
      <div className="bg-[#071739] text-white px-4 sm:px-8 py-2 text-[11px] hidden sm:block border-b border-blue-900/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {lang === 'am' ? 'ዓለም፣ በመንኮራኩሮች ላይ' : 'Charte Cars — The World On Wheels'}
            </span>

            {/* Direct Contact Telegram @chartecar */}
            <a
              href={CONTACT_INFO.telegramContactUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-blue-300 hover:text-white transition font-semibold"
            >
              <Send className="w-3 h-3 text-sky-400" />
              <span>Contact: @chartecar</span>
            </a>

            {/* Join Telegram Channel @Chartecars */}
            <a
              href={CONTACT_INFO.telegramChannelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sky-300 hover:text-white transition font-semibold"
            >
              <span className="bg-sky-500/20 text-sky-300 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold">Channel</span>
              <span>@Chartecars</span>
            </a>

            {/* TikTok Channel @Chartecars */}
            <a
              href={CONTACT_INFO.tiktokChannelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-pink-300 hover:text-white transition font-semibold"
            >
              <Video className="w-3 h-3 text-pink-400" />
              <span>TikTok: @Chartecars</span>
            </a>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            {/* WhatsApp @Chartecar */}
            <a
              href={CONTACT_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition font-medium flex items-center gap-1"
            >
              <span>WhatsApp: @Chartecar</span>
            </a>

            {isAdminLoggedIn ? (
              <button 
                onClick={onLogout} 
                className="flex items-center gap-1 text-red-300 hover:text-red-100 transition font-bold"
              >
                <LogOut className="w-3 h-3" />
                <span>{lang === 'am' ? 'ውጣ' : 'Logout'}</span>
              </button>
            ) : (
              <button 
                onClick={onOpenAdmin} 
                className="flex items-center gap-1 text-blue-300 hover:text-white transition font-bold"
              >
                <User className="w-3 h-3" />
                <span>{lang === 'am' ? 'አስተዳዳሪ ግባ' : 'Admin Login'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main bar: white background, logo + pill controls */}
      <div className="bg-white text-slate-900 px-4 sm:px-8 py-2.5 border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">

          {/* Logo: circular mark + wordmark */}
          <div
            className="cursor-pointer flex items-center gap-2.5 shrink-0"
            onClick={() => onSelectType('all')}
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-[#00266B] via-[#0037A3] to-[#2563EB] flex items-center justify-center text-white font-black text-sm shadow-md border border-blue-400/30">
              CC
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-[#0037A3]">
                CHARTE
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-slate-400">
                CARS
              </span>
            </div>
          </div>

          {/* Buy / Rent pill toggle */}
          <div className="hidden md:flex items-center bg-slate-100 rounded-full p-1 shrink-0">
            <button
              onClick={() => onSelectType('sale')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition ${
                currentType === 'sale'
                  ? 'bg-[#0037A3] text-white shadow'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <CarIcon className="w-3.5 h-3.5" />
              BUY
            </button>
            <button
              onClick={() => onSelectType('rent')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition ${
                currentType === 'rent'
                  ? 'bg-[#0037A3] text-white shadow'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              RENT
            </button>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-2 sm:gap-3 ml-auto">

            {/* Search */}
            <button
              onClick={onOpenSearch}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-[#0037A3] transition text-xs font-bold"
              title="Search Vehicles"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{lang === 'am' ? 'ፈልግ' : 'Search'}</span>
            </button>

            {/* Favorites */}
            <button
              onClick={onOpenFavorites}
              className="relative p-2 rounded-full border border-slate-200 text-slate-500 hover:text-red-500 hover:border-red-200 transition"
              title="Saved Cars"
            >
              <Heart className="w-4 h-4" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Download app pill */}
            <button
              onClick={onOpenDownloadApp}
              className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-600 transition text-xs font-bold"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{lang === 'am' ? 'አውርድ' : 'Download App'}</span>
            </button>

            {/* Language toggle pill */}
            <button
              onClick={onToggleLang}
              className="hidden sm:flex items-center justify-center px-3.5 py-1.5 rounded-full bg-[#0037A3] text-white text-xs font-bold"
            >
              {lang === 'en' ? 'EN' : 'አማ'}
            </button>

            {/* Currency toggle pill */}
            <button
              onClick={onToggleCurrency}
              className="hidden sm:flex items-center justify-center px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 hover:text-blue-700 text-xs font-bold"
              title="Toggle Currency (ETB / USD)"
            >
              {currency}
            </button>

            {/* + SELL pill (Requirement 5: non-admins see direct contact with 600 ETB notice, admins can list) */}
            <button
              onClick={onOpenListCar}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold shadow-md transition active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{lang === 'am' ? 'ሽጥ' : 'SELL'}</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded-lg"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white text-slate-800 p-4 space-y-3 border-b border-slate-200 animate-in slide-in-from-top-2">

          <div className="grid grid-cols-2 gap-2 text-center text-xs font-bold">
            <button
              onClick={() => { onSelectType('sale'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-xl border ${currentType === 'sale' ? 'bg-[#0037A3] text-white border-[#0037A3]' : 'border-slate-200 text-slate-600'}`}
            >
              BUY
            </button>
            <button
              onClick={() => { onSelectType('rent'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-xl border ${currentType === 'rent' ? 'bg-[#0037A3] text-white border-[#0037A3]' : 'border-slate-200 text-slate-600'}`}
            >
              RENT
            </button>
          </div>

          {/* Socials / Direct links in mobile drawer */}
          <div className="space-y-1.5 py-1 text-xs">
            <a
              href={CONTACT_INFO.telegramContactUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2 rounded-xl bg-blue-50 text-blue-900 font-bold"
            >
              <span className="flex items-center gap-2">
                <Send className="w-4 h-4 text-sky-600" />
                <span>Telegram: @chartecar</span>
              </span>
              <span className="text-[10px] bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">Contact</span>
            </a>

            <a
              href={CONTACT_INFO.telegramChannelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2 rounded-xl bg-sky-50 text-sky-900 font-bold"
            >
              <span className="flex items-center gap-2">
                <Send className="w-4 h-4 text-sky-500" />
                <span>Channel: @Chartecars</span>
              </span>
              <span className="text-[10px] bg-sky-200 text-sky-800 px-2 py-0.5 rounded-full">Join</span>
            </a>

            <a
              href={CONTACT_INFO.tiktokChannelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2 rounded-xl bg-pink-50 text-pink-900 font-bold"
            >
              <span className="flex items-center gap-2">
                <Video className="w-4 h-4 text-pink-500" />
                <span>TikTok: @Chartecars</span>
              </span>
              <span className="text-[10px] bg-pink-200 text-pink-800 px-2 py-0.5 rounded-full">Follow</span>
            </a>
          </div>

          <button
            onClick={() => { onOpenSearch(); setMobileMenuOpen(false); }}
            className="w-full border border-slate-200 p-2.5 rounded-xl font-bold flex items-center justify-center gap-2 text-slate-700"
          >
            <Search className="w-4 h-4" />
            <span>{lang === 'am' ? 'መኪና ፈልግ (Search Vehicles)' : 'Search Vehicles & Filters'}</span>
          </button>

          <button
            onClick={() => { onOpenDownloadApp(); setMobileMenuOpen(false); }}
            className="w-full border border-emerald-200 text-emerald-600 p-2.5 rounded-xl font-bold flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>{lang === 'am' ? 'አውርድ (Download App)' : 'Download App'}</span>
          </button>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            {isAdminLoggedIn ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { onOpenAdmin(); setMobileMenuOpen(false); }}
                  className="text-[#0037A3] font-bold text-xs"
                >
                  ADMIN PORTAL
                </button>
                <button
                  onClick={() => { if (onLogout) onLogout(); setMobileMenuOpen(false); }}
                  className="text-red-500 font-bold flex items-center gap-1 text-xs"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{lang === 'am' ? 'ውጣ' : 'Logout'}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => { onOpenAdmin(); setMobileMenuOpen(false); }}
                className="text-[#0037A3] font-bold flex items-center gap-1 text-xs"
              >
                <User className="w-3.5 h-3.5" />
                <span>{lang === 'am' ? 'አስተዳዳሪ ግባ (Login)' : 'Admin Login'}</span>
              </button>
            )}
            
            <div className="flex items-center gap-2">
              <button 
                onClick={onToggleCurrency} 
                className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full text-xs font-bold"
              >
                {currency}
              </button>
              <button 
                onClick={onToggleLang} 
                className="bg-[#0037A3] text-white px-3 py-1 rounded-full text-xs font-bold"
              >
                {lang === 'en' ? 'EN' : 'አማ'}
              </button>
            </div>
          </div>
        </div>
      )}

    </header>
  );
};
