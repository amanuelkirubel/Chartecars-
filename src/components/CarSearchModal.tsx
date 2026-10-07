import React from 'react';
import { 
  X, 
  Search, 
  Car, 
  MapPin, 
  Gauge, 
  RotateCcw, 
  ArrowRight,
  Globe,
  ChevronLeft
} from 'lucide-react';
import { CarFilterState, Language } from '../types';

interface CarSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: CarFilterState;
  onFilterChange: (patch: Partial<CarFilterState>) => void;
  onResetFilters: () => void;
  lang: Language;
  totalResults: number;
}

export const CarSearchModal: React.FC<CarSearchModalProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onResetFilters,
  lang,
  totalResults,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div 
        className="relative w-full max-w-3xl bg-[#071739] text-white rounded-2xl sm:rounded-3xl shadow-2xl border border-blue-700/60 overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#002B82] px-5 py-4 border-b border-blue-900 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-inner">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>{lang === 'am' ? 'ተሽከርካሪዎችን ይፈልጉ እና ያጣሩ' : 'Search & Filter Vehicles (Worldwide)'}</span>
              </h3>
              <p className="text-xs text-blue-200">
                Type any city worldwide, brand, model, body style, or price
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-900/80 hover:bg-blue-800 text-blue-100 hover:text-white text-xs font-bold transition cursor-pointer border border-blue-700/60"
              title={lang === 'am' ? 'ወደ ኋላ ተመለስ (Back)' : 'Go back to listings'}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{lang === 'am' ? 'ወደ ኋላ' : 'Back'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-blue-900/60 hover:bg-blue-800 text-blue-200 hover:text-white transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Top Toggles: All, Sale, Rent, Rented, Urgent, Sold (Requirement 3: NO numbers) */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#001033] p-2 rounded-2xl border border-blue-900/80">
            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => onFilterChange({ type: 'all' })}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filters.type === 'all'
                    ? 'bg-[#0037A3] text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>

              <button
                type="button"
                onClick={() => onFilterChange({ type: 'sale' })}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filters.type === 'sale'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sale
              </button>

              <button
                type="button"
                onClick={() => onFilterChange({ type: 'rent' })}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filters.type === 'rent'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Rent
              </button>

              <button
                type="button"
                onClick={() => onFilterChange({ type: 'rented' })}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filters.type === 'rented'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-indigo-300 hover:text-indigo-200'
                }`}
              >
                Rented
              </button>

              <button
                type="button"
                onClick={() => onFilterChange({ type: 'urgent' })}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filters.type === 'urgent'
                    ? 'bg-yellow-400 text-slate-950 font-black shadow-md'
                    : 'text-yellow-400 hover:text-yellow-300'
                }`}
              >
                Urgent
              </button>

              <button
                type="button"
                onClick={() => onFilterChange({ type: 'sold' })}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filters.type === 'sold'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-red-400 hover:text-red-300'
                }`}
              >
                Sold
              </button>
            </div>
          </div>

          {/* REQUIREMENT 5: Free-text inputs (Users & admin type/spell themselves worldwide) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            
            {/* 1. Brand / Make (Free text) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-blue-200 flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-blue-400" />
                <span>Vehicle Brand / Make (Type yourself)</span>
              </label>
              <input
                type="text"
                value={filters.make}
                onChange={(e) => onFilterChange({ make: e.target.value })}
                placeholder="Type brand (e.g. Toyota, Mercedes, BYD, Tesla, Hyundai)..."
                className="w-full bg-[#001033] border border-blue-900/90 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-400"
              />
            </div>

            {/* 2. City (Worldwide — Free text) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-blue-200 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span>City (Worldwide — Type yourself)</span>
              </label>
              <input
                type="text"
                value={filters.city}
                onChange={(e) => onFilterChange({ city: e.target.value })}
                placeholder="Type any city worldwide (e.g. Addis Ababa, Dubai, Nairobi, London)..."
                className="w-full bg-[#001033] border border-blue-900/90 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-400"
              />
            </div>

            {/* 3. Model / Keyword Search (Free text) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-blue-200 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-blue-400" />
                <span>Model / Keyword (Type yourself)</span>
              </label>
              <input
                type="text"
                value={filters.searchQuery}
                onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
                placeholder="Type model (e.g. Prado, Hilux, Atto 3, C-Class)..."
                className="w-full bg-[#001033] border border-blue-900/90 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-400"
              />
            </div>

            {/* 4. Body Style (Free text) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-blue-200 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-blue-400" />
                <span>Body Style (Type yourself)</span>
              </label>
              <input
                type="text"
                value={filters.bodyType}
                onChange={(e) => onFilterChange({ bodyType: e.target.value })}
                placeholder="Type body style (e.g. SUV, Sedan, Pickup, Crossover)..."
                className="w-full bg-[#001033] border border-blue-900/90 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-400"
              />
            </div>

            {/* 5. Min Price */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-blue-200">
                Min Price (ETB)
              </label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => onFilterChange({ minPrice: e.target.value })}
                placeholder="e.g. 2000000"
                className="w-full bg-[#001033] border border-blue-900/90 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            {/* 6. Max Price */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-blue-200">
                Max Price (ETB)
              </label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => onFilterChange({ maxPrice: e.target.value })}
                placeholder="e.g. 15000000"
                className="w-full bg-[#001033] border border-blue-900/90 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-[#001440] px-5 py-4 border-t border-blue-900 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-2 rounded-xl transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex-1 sm:flex-initial bg-[#0051E8] hover:bg-blue-600 text-white font-bold text-xs sm:text-sm py-2.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>View Matching Cars</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
