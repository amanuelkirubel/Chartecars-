/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Car, 
  RotateCcw, 
  Download, 
  Flame
} from 'lucide-react';
import { 
  CarListing, 
  CarFilterState, 
  Language, 
  Currency, 
  ListingType, 
  ListingStatus 
} from './types';
import { INITIAL_CARS } from './data/mockCars';
import { syncActiveCarsToArchive, saveCarToArchive } from './data/historicalArchive';
import { useMobileAppNavigation } from './hooks/useMobileAppNavigation';
import { LISTING_FEE_ETB } from './config/pricing';

// Charte Cars Components
import { DownloadAppBanner } from './components/DownloadAppBanner';
import { Navbar } from './components/Navbar';
import { CarHeroSection } from './components/CarHeroSection';
import { CarListingCard } from './components/CarListingCard';
import { CarDetailModal } from './components/CarDetailModal';
import { ListCarModal } from './components/ListCarModal';
import { CarAdminPortalModal } from './components/CarAdminPortalModal';
import { CarFavoritesModal } from './components/CarFavoritesModal';
import { DownloadAppModal } from './components/DownloadAppModal';
import { CarPaymentModal } from './components/CarPaymentModal';
import { AboutCharteCarsModal } from './components/AboutCharteCarsModal';
import { AboutCharteCarsSection } from './components/AboutCharteCarsSection';
import { CarSearchModal } from './components/CarSearchModal';
import { Footer } from './components/Footer';

const STORAGE_KEY_CARS = 'charte_cars_listings_v1';
const STORAGE_KEY_CAR_FAVS = 'charte_cars_favs_v1';
const STORAGE_KEY_LANG = 'charte_cars_lang_v1';
const STORAGE_KEY_CURRENCY = 'charte_cars_currency_v1';

function getNextListingCode(existingCars: CarListing[]): number {
  const highest = existingCars.reduce(
    (max, c) => (typeof c.listingCode === 'number' && c.listingCode > max ? c.listingCode : max),
    0
  );
  return highest + 1;
}

function assignMissingListingCodes(carsToCheck: CarListing[]): CarListing[] {
  const missing = carsToCheck.filter((c) => typeof c.listingCode !== 'number');
  if (missing.length === 0) return carsToCheck;

  let nextCode = getNextListingCode(carsToCheck);
  const sortedMissingIds = [...missing]
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .map((c) => c.id);

  const codeById = new Map<string, number>();
  sortedMissingIds.forEach((id) => {
    codeById.set(id, nextCode);
    nextCode += 1;
  });

  return carsToCheck.map((c) =>
    typeof c.listingCode === 'number' ? c : { ...c, listingCode: codeById.get(c.id) }
  );
}

export default function App() {
  // 1. Language and Currency State
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem(STORAGE_KEY_LANG) as Language) || 'en';
  });

  const [currency, setCurrency] = useState<Currency>(() => {
    return (localStorage.getItem(STORAGE_KEY_CURRENCY) as Currency) || 'ETB';
  });

  // 2. Charte Cars Inventory State
  const [cars, setCars] = useState<CarListing[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CARS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return assignMissingListingCodes(parsed);
      } catch (e) {
        console.error('Failed to parse saved cars', e);
      }
    }
    return assignMissingListingCodes(INITIAL_CARS);
  });

  // Save all listed cars forever in a historical archive database for future reference and market analysis
  useEffect(() => {
    syncActiveCarsToArchive(cars);
  }, [cars]);

  // 3. Saved / Favorited Cars
  const [carFavorites, setCarFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CAR_FAVS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved car favorites', e);
      }
    }
    return [];
  });

  // 4. Car Filter State (Supporting 'all' | 'sale' | 'rent' | 'rented' | 'urgent' | 'sold' shortcuts WITHOUT numbers)
  const [carFilters, setCarFilters] = useState<CarFilterState>({
    searchQuery: '',
    make: '',
    bodyType: '',
    transmission: '',
    fuelType: '',
    condition: '',
    plateCode: '',
    minPrice: '',
    maxPrice: '',
    minYear: '',
    maxYear: '',
    city: '',
    type: 'all',
  });

  // 5. Modals State
  const [selectedCar, setSelectedCar] = useState<CarListing | null>(null);
  const [isListCarModalOpen, setIsListCarModalOpen] = useState(false);
  const [isCarAdminModalOpen, setIsCarAdminModalOpen] = useState(false);
  const [isCarFavoritesModalOpen, setIsCarFavoritesModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Admin Authentication State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('charte_admin_auth') === 'true';
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    localStorage.setItem('charte_admin_auth', 'true');
    setToastMessage(lang === 'am' ? 'በአስተዳዳሪነት በተሳካ ሁኔታ ገብተዋል' : 'Successfully logged in as Admin.');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('charte_admin_auth');
    localStorage.removeItem('charte_admin_active_email');
    setIsCarAdminModalOpen(false);
    setToastMessage(lang === 'am' ? 'በተሳካ ሁኔታ ወጥተዋል' : 'Successfully logged out.');
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Unified Mobile Back Navigation System (Fixes phone back button closing website)
  const hasActiveModal = Boolean(
    selectedCar ||
    isListCarModalOpen ||
    isCarAdminModalOpen ||
    isCarFavoritesModalOpen ||
    isDownloadModalOpen ||
    isAboutModalOpen ||
    isPaymentModalOpen ||
    isSearchModalOpen
  );

  const handleCloseTopModal = () => {
    if (selectedCar) {
      setSelectedCar(null);
    } else if (isSearchModalOpen) {
      setIsSearchModalOpen(false);
    } else if (isListCarModalOpen) {
      setIsListCarModalOpen(false);
    } else if (isCarAdminModalOpen) {
      setIsCarAdminModalOpen(false);
    } else if (isCarFavoritesModalOpen) {
      setIsCarFavoritesModalOpen(false);
    } else if (isPaymentModalOpen) {
      setIsPaymentModalOpen(false);
    } else if (isDownloadModalOpen) {
      setIsDownloadModalOpen(false);
    } else if (isAboutModalOpen) {
      setIsAboutModalOpen(false);
    }
  };

  // Filter handlers
  const handleCarFilterChange = (patch: Partial<CarFilterState>) => {
    setCarFilters((prev) => ({ ...prev, ...patch }));
  };

  const handleResetCarFilters = () => {
    setCarFilters({
      searchQuery: '',
      make: '',
      bodyType: '',
      transmission: '',
      fuelType: '',
      condition: '',
      plateCode: '',
      minPrice: '',
      maxPrice: '',
      minYear: '',
      maxYear: '',
      city: '',
      type: 'all',
    });
  };

  const { safeCloseModal } = useMobileAppNavigation({
    hasActiveModal,
    closeTopModal: handleCloseTopModal,
    carFilters,
    onResetFilters: handleResetCarFilters,
    lang,
    showToast: (msg: string) => {
      setToastMessage(msg);
      setTimeout(() => setToastMessage(null), 3000);
    },
  });

  // Persistence Effects
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CARS, JSON.stringify(cars));
    } catch (err) {
      console.error('Failed to save cars to localStorage', err);
    }
  }, [cars]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CAR_FAVS, JSON.stringify(carFavorites));
  }, [carFavorites]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LANG, lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CURRENCY, currency);
  }, [currency]);

  const toggleCarFavorite = (id: string) => {
    setCarFavorites((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddCar = (newCarData: Omit<CarListing, 'id' | 'createdAt' | 'views'>) => {
    const newCar: CarListing = {
      ...newCarData,
      id: `cc-${Date.now()}`,
      listingCode: getNextListingCode(cars),
      createdAt: new Date().toISOString(),
      views: 1,
    };
    setCars((prev) => [newCar, ...prev]);
    saveCarToArchive(newCar, 'historical_record');
    setToastMessage(lang === 'am' ? 'መኪናው በቀጥታ ተለጥፏል!' : 'Vehicle successfully published to marketplace!');
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleUpdateCarStatus = (id: string, status: ListingStatus) => {
    setCars((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const updated = { ...c, status };
          saveCarToArchive(updated, status === 'sold' ? 'marked_sold' : status === 'rented' ? 'marked_rented' : 'historical_record');
          return updated;
        }
        return c;
      })
    );
    if (selectedCar && selectedCar.id === id) {
      setSelectedCar((prev) => (prev ? { ...prev, status } : null));
    }
  };

  const handleUpdateCar = (updatedCar: CarListing) => {
    setCars((prev) =>
      prev.map((c) => (c.id === updatedCar.id ? updatedCar : c))
    );
    saveCarToArchive(updatedCar, 'historical_record');
    if (selectedCar && selectedCar.id === updatedCar.id) {
      setSelectedCar(updatedCar);
    }
  };

  const handleDeleteCar = (id: string) => {
    const carToDelete = cars.find((c) => c.id === id);
    if (carToDelete) {
      saveCarToArchive(carToDelete, 'admin_archived');
    }
    setCars((prev) => prev.filter((c) => c.id !== id));
    setCarFavorites((prev) => prev.filter((favId) => favId !== id));
    if (selectedCar && selectedCar.id === id) {
      setSelectedCar(null);
    }
  };

  // Filtered Cars Memo
  // REQUIREMENT 3: Shortcuts for all, sale, rent, rented, urgent, sold
  const filteredCars = useMemo(() => {
    return cars.filter((item) => {
      if (carFilters.type === 'sold') {
        if (item.status !== 'sold') return false;
      } else if (carFilters.type === 'rented') {
        if (item.status !== 'rented') return false;
      } else if (carFilters.type === 'urgent') {
        if (item.status !== 'urgent') return false;
      } else if (carFilters.type === 'sale') {
        if (item.type !== 'sale') return false;
      } else if (carFilters.type === 'rent') {
        if (item.type !== 'rent') return false;
      }

      // Make
      if (carFilters.make && !item.make.toLowerCase().includes(carFilters.make.toLowerCase().trim())) {
        return false;
      }
      // Body type
      if (carFilters.bodyType && !item.bodyType.toLowerCase().includes(carFilters.bodyType.toLowerCase().trim())) {
        return false;
      }
      // Transmission
      if (carFilters.transmission && item.transmission !== carFilters.transmission) {
        return false;
      }
      // Fuel type
      if (carFilters.fuelType && item.fuelType !== carFilters.fuelType) {
        return false;
      }
      // Condition
      if (carFilters.condition && item.condition !== carFilters.condition) {
        return false;
      }
      // Plate Code
      if (carFilters.plateCode && item.plateCode !== carFilters.plateCode) {
        return false;
      }
      // City (Worldwide text search)
      if (carFilters.city && !item.city.toLowerCase().includes(carFilters.city.toLowerCase().trim())) {
        return false;
      }
      // Price range
      if (carFilters.minPrice && item.price < Number(carFilters.minPrice)) {
        return false;
      }
      if (carFilters.maxPrice && item.price > Number(carFilters.maxPrice)) {
        return false;
      }
      // Search query
      if (carFilters.searchQuery.trim()) {
        const q = carFilters.searchQuery.toLowerCase().trim();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchTitleAm = item.titleAm?.toLowerCase().includes(q);
        const matchMake = item.make.toLowerCase().includes(q);
        const matchModel = item.model.toLowerCase().includes(q);
        const matchCity = item.city.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        if (!matchTitle && !matchTitleAm && !matchMake && !matchModel && !matchCity && !matchDesc) {
          return false;
        }
      }
      return true;
    });
  }, [cars, carFilters]);

  const favoriteCarObjects = useMemo(() => {
    return cars.filter((c) => carFavorites.includes(c.id));
  }, [cars, carFavorites]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* 1. Top Download Banner */}
      <DownloadAppBanner
        onOpenDownload={() => setIsDownloadModalOpen(true)}
        lang={lang}
      />

      {/* 2. Top Navigation Bar */}
      <Navbar
        currentType={carFilters.type}
        onSelectType={(type) => handleCarFilterChange({ type })}
        lang={lang}
        onToggleLang={() => setLang((prev) => (prev === 'en' ? 'am' : 'en'))}
        currency={currency}
        onToggleCurrency={() => setCurrency((prev) => (prev === 'ETB' ? 'USD' : 'ETB'))}
        favoritesCount={carFavorites.length}
        onOpenFavorites={() => setIsCarFavoritesModalOpen(true)}
        onOpenListCar={() => setIsListCarModalOpen(true)}
        onOpenAdmin={() => setIsCarAdminModalOpen(true)}
        onOpenDownloadApp={() => setIsDownloadModalOpen(true)}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        onOpenPaymentDesk={() => setIsPaymentModalOpen(true)}
        onOpenAbout={() => setIsAboutModalOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
        onLogout={handleLogout}
      />

      {/* 3. Hero Section (Worldwide) */}
      <CarHeroSection
        onOpenSearch={() => setIsSearchModalOpen(true)}
        onOpenListCar={() => setIsListCarModalOpen(true)}
        lang={lang}
      />

      {/* 4. Main Inventory Area */}
      <div className="bg-[#F8FAFC] flex-1 py-10 border-t border-slate-200">
        <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          
          {/* LATEST LISTINGS Header (REQUIREMENT 3: "do not mantion how many cars in all remove number") */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-5 mb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-7 bg-[#0037A3] rounded-sm" />
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
                  {lang === 'am' ? 'የቅርብ ጊዜ ዝርዝሮች (LATEST LISTINGS)' : 'LATEST LISTINGS'}
                </h2>
              </div>

              {/* Requirement 5: Worldwide, no numbers mentioned */}
              <p className="text-xs text-slate-500 font-medium mt-1.5 pl-4.5">
                {carFilters.type === 'sold'
                  ? (lang === 'am' ? 'የተሸጡ ተሽከርካሪዎች' : 'Vehicles marked as Sold with official record')
                  : carFilters.type === 'rented'
                  ? (lang === 'am' ? 'የተከራዩ ተሽከርካሪዎች' : 'Vehicles marked as Rented with official record')
                  : carFilters.type === 'urgent'
                  ? (lang === 'am' ? 'አጣዳፊ የሽያጭ ዕድሎች' : 'Urgent car deals with motivated sellers')
                  : carFilters.type === 'rent'
                  ? (lang === 'am' ? 'ለኪራይ የቀረቡ ተሽከርካሪዎች' : 'Verified cars available for daily or monthly rental')
                  : carFilters.type === 'sale'
                  ? (lang === 'am' ? 'ለሽያጭ የቀረቡ ተሽከርካሪዎች' : 'Verified cars available for direct sale')
                  : (lang === 'am' ? 'በመላው አለም ለሽያጭና ለኪራይ የቀረቡ መኪኖች' : 'Browse all verified cars for sale and rent worldwide')}
              </p>
            </div>
          </div>

          {/* REQUIREMENT 3: SHORTCUTS FOR ALL, SALE, RENT, RENTED, URGENT, SOLD — NO NUMBERS! */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 bg-white p-2 sm:p-2.5 rounded-2xl border border-slate-200 shadow-sm">

              {/* 1. All (No number) */}
              <button
                type="button"
                onClick={() => handleCarFilterChange({ type: 'all' })}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  carFilters.type === 'all'
                    ? 'bg-[#0037A3] text-white shadow-md shadow-blue-900/20'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <Car className="w-3.5 h-3.5" />
                <span>{lang === 'am' ? 'ሁሉም (All)' : 'All'}</span>
              </button>

              {/* 2. Sale (No number) */}
              <button
                type="button"
                onClick={() => handleCarFilterChange({ type: 'sale' })}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  carFilters.type === 'sale'
                    ? 'bg-[#0037A3] text-white shadow-md shadow-blue-900/20'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <span>{lang === 'am' ? 'ሽያጭ' : 'Sale'}</span>
              </button>

              {/* 3. Rent (No number) */}
              <button
                type="button"
                onClick={() => handleCarFilterChange({ type: 'rent' })}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  carFilters.type === 'rent'
                    ? 'bg-[#0037A3] text-white shadow-md shadow-blue-900/20'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <span>{lang === 'am' ? 'ኪራይ' : 'Rent'}</span>
              </button>

              {/* 4. Rented (NEW! No number) */}
              <button
                type="button"
                onClick={() => handleCarFilterChange({ type: 'rented' })}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  carFilters.type === 'rented'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20'
                    : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100 border border-indigo-200'
                }`}
              >
                <span>{lang === 'am' ? 'ተከራይቷል (Rented)' : 'Rented'}</span>
              </button>

              {/* 5. Urgent Deals (No number) */}
              <button
                type="button"
                onClick={() => handleCarFilterChange({ type: 'urgent' })}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  carFilters.type === 'urgent'
                    ? 'bg-yellow-400 text-slate-950 shadow-md shadow-amber-900/20 ring-2 ring-yellow-400/50'
                    : 'bg-yellow-50 text-amber-900 hover:bg-yellow-100 border border-yellow-200'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-600 fill-current" />
                <span>{lang === 'am' ? 'አጣዳፊ' : 'Urgent Deals'}</span>
              </button>

              {/* 6. Sold (No number) */}
              <button
                type="button"
                onClick={() => handleCarFilterChange({ type: 'sold' })}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  carFilters.type === 'sold'
                    ? 'bg-red-600 text-white shadow-md shadow-red-900/20'
                    : 'bg-red-50 text-red-800 hover:bg-red-100 border border-red-200'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-red-600" />
                <span>{lang === 'am' ? 'የተሸጠ' : 'Sold'}</span>
              </button>

              {/* Reset if shortcut or filter active */}
              {carFilters.type !== 'all' && (
                <button
                  type="button"
                  onClick={handleResetCarFilters}
                  className="ml-auto text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1 font-semibold px-2 py-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{lang === 'am' ? 'አጽዳ' : 'Clear'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Car Listings Grid */}
          {filteredCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCars.map((car) => (
                <CarListingCard
                  key={car.id}
                  car={car}
                  lang={lang}
                  currency={currency}
                  isFavorite={carFavorites.includes(car.id)}
                  onToggleFavorite={toggleCarFavorite}
                  onSelect={setSelectedCar}
                  isAdminLoggedIn={isAdminLoggedIn}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <Car className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {lang === 'am' ? 'በዚህ ምድብ የተገኘ መኪና የለም' : 'No vehicles found in this category'}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
                {lang === 'am' 
                  ? 'ሁሉንም መኪኖች ለማየት ወደ "ሁሉም (All)" ይመለሱ።' 
                  : 'Switch back to "All" to browse all available vehicles on Charte Cars.'}
              </p>
              <button
                onClick={handleResetCarFilters}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{lang === 'am' ? 'ሁሉንም መኪኖች አሳይ' : 'Show All Cars'}</span>
              </button>
            </div>
          )}

        </main>
      </div>

      {/* 5. Floating Quick Download App Button */}
      <div className="fixed bottom-5 right-5 z-30">
        <button
          type="button"
          onClick={() => setIsDownloadModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-full font-bold shadow-2xl shadow-emerald-950/80 border border-emerald-400/40 transition-all transform hover:scale-105 active:scale-95 text-xs cursor-pointer"
          title="Download Charte Cars App"
        >
          <Download className="w-4 h-4 animate-bounce shrink-0" />
          <span className="font-bold">
            {lang === 'am' ? 'አፕሊኬሽኑን አውርድ' : 'Download App'}
          </span>
        </button>
      </div>

      {/* 6. About Charte Cars Section (Matches Screenshot 3) */}
      <AboutCharteCarsSection
        lang={lang}
        onOpenListCar={() => setIsListCarModalOpen(true)}
        onOpenAboutModal={() => setIsAboutModalOpen(true)}
      />

      {/* 7. Footer */}
      <Footer
        lang={lang}
        onOpenAdmin={() => setIsCarAdminModalOpen(true)}
        onOpenListCar={() => setIsListCarModalOpen(true)}
        onOpenDownloadApp={() => setIsDownloadModalOpen(true)}
        onSelectType={(type) => handleCarFilterChange({ type })}
        onOpenAbout={() => setIsAboutModalOpen(true)}
      />

      {/* ------------------------------------------------------------- */}
      {/* MODALS */}
      {/* ------------------------------------------------------------- */}

      {/* Vehicle Detail View Modal */}
      {selectedCar && (
        <CarDetailModal
          car={selectedCar}
          onClose={safeCloseModal}
          lang={lang}
          currency={currency}
          isFavorite={carFavorites.includes(selectedCar.id)}
          onToggleFavorite={toggleCarFavorite}
          onUpdateStatus={handleUpdateCarStatus}
          isAdminLoggedIn={isAdminLoggedIn}
        />
      )}

      {/* List a Car Modal (Non-admin: 600 ETB direct contact; Admin: free text worldwide + seller info) */}
      <ListCarModal
        isOpen={isListCarModalOpen}
        onClose={safeCloseModal}
        onAddCar={handleAddCar}
        lang={lang}
        isAdminLoggedIn={isAdminLoggedIn}
        existingCars={cars}
        onOpenAdminLogin={() => {
          setIsListCarModalOpen(false);
          setIsCarAdminModalOpen(true);
        }}
      />

      {/* Vehicle Search & Filters Modal (Free-text typed worldwide) */}
      <CarSearchModal
        isOpen={isSearchModalOpen}
        onClose={safeCloseModal}
        filters={carFilters}
        onFilterChange={handleCarFilterChange}
        onResetFilters={handleResetCarFilters}
        lang={lang}
        totalResults={filteredCars.length}
      />

      {/* Admin Portal Modal */}
      <CarAdminPortalModal
        isOpen={isCarAdminModalOpen}
        onClose={safeCloseModal}
        cars={cars}
        onUpdateStatus={handleUpdateCarStatus}
        onUpdateCar={handleUpdateCar}
        onDeleteCar={handleDeleteCar}
        lang={lang}
        currency={currency}
        isAdminLoggedIn={isAdminLoggedIn}
        onLoginSuccess={handleAdminLoginSuccess}
        onLogout={handleLogout}
      />

      {/* Car Favorites Modal */}
      <CarFavoritesModal
        isOpen={isCarFavoritesModalOpen}
        onClose={safeCloseModal}
        favorites={favoriteCarObjects}
        onRemoveFavorite={toggleCarFavorite}
        onSelectCar={setSelectedCar}
        lang={lang}
        currency={currency}
      />

      {/* Download App Modal */}
      <DownloadAppModal
        isOpen={isDownloadModalOpen}
        onClose={safeCloseModal}
        lang={lang}
      />

      {/* About Charte Cars Modal */}
      <AboutCharteCarsModal
        isOpen={isAboutModalOpen}
        onClose={safeCloseModal}
        lang={lang}
        onOpenListCar={() => {
          setIsAboutModalOpen(false);
          setIsListCarModalOpen(true);
        }}
      />

      {/* Car Payment & Service Desk Modal */}
      <CarPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={safeCloseModal}
        car={null}
        purpose="listing_fee"
        lang={lang}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-950/95 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2.5 backdrop-blur">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
