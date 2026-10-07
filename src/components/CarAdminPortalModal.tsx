import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Car, 
  ShieldCheck, 
  Lock, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Edit, 
  Trash2, 
  LogOut,
  Archive,
  TrendingUp,
  Download,
  BarChart3,
  Calendar,
  DollarSign,
  User,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Tag,
  ChevronLeft
} from 'lucide-react';
import { CarListing, Language, ListingStatus, Currency, ArchivedCarListing } from '../types';
import { 
  getArchivedCars, 
  calculateMarketAnalysis, 
  HISTORICAL_ARCHIVE_STORAGE_KEY,
  saveCarToArchive
} from '../data/historicalArchive';
import { formatPrice } from '../utils/formatters';

interface CarAdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  cars: CarListing[];
  onUpdateCar: (updatedCar: CarListing) => void;
  onDeleteCar: (id: string) => void;
  lang: Language;
  currency?: Currency;
  onUpdateStatus?: (id: string, status: ListingStatus) => void;
  isAdminLoggedIn?: boolean;
  onLoginSuccess?: () => void;
  onLogout?: () => void;
}

// REQUIREMENT 1:
// Admin login ONLY [amanuelkirubel0@gmailcom][emanuelkirubel7@gmail.com] [manuelkirubel@gmailcom] [Amanuelkirubel9@gmail.com]
// Passwords: @Chartekira19891989 and @Charte2000
const ALLOWED_ADMIN_EMAILS = [
  'amanuelkirubel0@gmail.com',
  'amanuelkirubel0@gmailcom',
  'emanuelkirubel7@gmail.com',
  'manuelkirubel@gmail.com',
  'manuelkirubel@gmailcom',
  'amanuelkirubel9@gmail.com',
  'amanuelkirubel9@gmailcom'
];

const ALLOWED_ADMIN_PASSWORDS = [
  '@Chartekira19891989',
  '@Charte2000'
];

export const CarAdminPortalModal: React.FC<CarAdminPortalModalProps> = ({
  isOpen,
  onClose,
  cars,
  onUpdateCar,
  onDeleteCar,
  lang,
  currency = 'ETB',
  onUpdateStatus,
  isAdminLoggedIn,
  onLoginSuccess,
  onLogout,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return isAdminLoggedIn ?? (localStorage.getItem('charte_admin_auth') === 'true');
  });

  const [adminEmail, setAdminEmail] = useState('');
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  // Active view tab inside Admin Portal
  const [activeTab, setActiveTab] = useState<'listings' | 'archive' | 'market_analysis'>('listings');
  const [searchQuery, setSearchQuery] = useState('');
  const [archiveSearchQuery, setArchiveSearchQuery] = useState('');

  // Editing car modal inside admin
  const [editingCar, setEditingCar] = useState<CarListing | null>(null);

  // Historical archive state
  const [archivedCars, setArchivedCars] = useState<ArchivedCarListing[]>(() => getArchivedCars());

  // Reload archive when modal opens or tab changes
  useEffect(() => {
    setArchivedCars(getArchivedCars());
  }, [isOpen, activeTab]);

  useEffect(() => {
    if (isAdminLoggedIn !== undefined) {
      setIsAuthenticated(isAdminLoggedIn);
    }
  }, [isAdminLoggedIn]);

  // Login handler strictly enforcing the 4 emails and 2 passwords
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    const normalizedEmail = adminEmail.trim().toLowerCase();
    const cleanPass = passcode.trim();

    const isEmailValid = ALLOWED_ADMIN_EMAILS.some(
      (email) => email.toLowerCase() === normalizedEmail
    );

    const isPasswordValid = ALLOWED_ADMIN_PASSWORDS.includes(cleanPass);

    if (isEmailValid && isPasswordValid) {
      setIsAuthenticated(true);
      setAuthError('');
      localStorage.setItem('charte_admin_auth', 'true');
      localStorage.setItem('charte_admin_active_email', normalizedEmail);
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } else {
      setAuthError(
        lang === 'am'
          ? 'የአስተዳዳሪ ኢሜይል ወይም የይለፍ ቃል የተሳሳተ ነው! የተፈቀደላቸው አስተዳዳሪዎች ብቻ ናቸው መግባት የሚችሉት።'
          : 'Access Denied: Invalid administrator email or password. Only authorized Charte Cars admin accounts can sign in.'
      );
    }
  };

  const handleDirectLogout = () => {
    setIsAuthenticated(false);
    setPasscode('');
    setAdminEmail('');
    setAuthError('');
    localStorage.removeItem('charte_admin_auth');
    localStorage.removeItem('charte_admin_active_email');
    if (onLogout) {
      onLogout();
    }
    onClose();
  };

  const handleStatusChange = (car: CarListing, newStatus: ListingStatus) => {
    const updated = { ...car, status: newStatus };
    onUpdateCar(updated);
    // Also save state to historical archive
    saveCarToArchive(updated, newStatus === 'sold' ? 'marked_sold' : 'historical_record');
    setArchivedCars(getArchivedCars());
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCar) {
      onUpdateCar(editingCar);
      saveCarToArchive(editingCar, 'historical_record');
      setArchivedCars(getArchivedCars());
      setEditingCar(null);
    }
  };

  // Export archive data to JSON or CSV for Requirement 4
  const handleExportArchiveJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(archivedCars, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `CharteCars_Historical_Archive_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportArchiveCSV = () => {
    if (archivedCars.length === 0) return;
    const headers = ['ID', 'Title', 'Make', 'Model', 'Year', 'Price_ETB', 'Mileage_km', 'Fuel', 'Transmission', 'Status', 'City', 'ArchivedAt'];
    const rows = archivedCars.map((c) => [
      c.id,
      `"${c.title.replace(/"/g, '""')}"`,
      c.make,
      c.model,
      c.year,
      c.price,
      c.mileage,
      c.fuelType,
      c.transmission,
      c.status,
      c.city,
      c.archivedAt
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CharteCars_Market_Analysis_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Restore archived car to active listings if not in cars
  const handleRestoreArchivedCar = (archived: ArchivedCarListing) => {
    const exists = cars.some((c) => c.id === archived.id);
    if (!exists) {
      onUpdateCar({
        ...archived,
        status: 'active'
      });
      alert(`Restored ${archived.title} to live listings!`);
    } else {
      handleStatusChange(archived, 'active');
    }
  };

  // Market analysis metrics memo
  const marketStats = useMemo(() => {
    return calculateMarketAnalysis(archivedCars);
  }, [archivedCars]);

  const filteredCars = cars.filter((car) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      car.title.toLowerCase().includes(q) ||
      car.make.toLowerCase().includes(q) ||
      car.model.toLowerCase().includes(q) ||
      car.city.toLowerCase().includes(q) ||
      car.sellerContact?.name?.toLowerCase().includes(q)
    );
  });

  const filteredArchive = archivedCars.filter((car) => {
    if (!archiveSearchQuery.trim()) return true;
    const q = archiveSearchQuery.toLowerCase();
    return (
      car.title.toLowerCase().includes(q) ||
      car.make.toLowerCase().includes(q) ||
      car.model.toLowerCase().includes(q) ||
      car.status.toLowerCase().includes(q) ||
      car.city.toLowerCase().includes(q)
    );
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fade-in">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200">
        
        {/* Header */}
        <div className="bg-[#051329] text-white px-5 py-4 border-b border-blue-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/50 flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">Charte Cars Admin Portal</h2>
                <span className="bg-blue-950 text-blue-300 border border-blue-600/60 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                  Secure Access
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Authorized vehicle management & Historical Archive Database
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

            {isAuthenticated && (
              <button
                type="button"
                onClick={handleDirectLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow transition active:scale-95 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{lang === 'am' ? 'ውጣ' : 'Logout'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* REQUIREMENT 1: AUTHENTICATION BARRIER */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#003399] flex items-center justify-center mx-auto border border-blue-100 shadow-inner">
              <Lock className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">Admin Login</h3>
              <p className="text-xs text-slate-500 mt-1">
                Authorized administrators only: enter your designated email and password to access car management and archive databases.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-3.5 text-left">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Admin Email
                </label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="amanuelkirubel0@gmail.com"
                  required
                  autoFocus
                  className="w-full text-sm bg-slate-50 border border-slate-300 rounded-xl py-2.5 px-3 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Admin Password
                </label>
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter admin password"
                  required
                  className="w-full text-sm bg-slate-50 border border-slate-300 rounded-xl py-2.5 px-3 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                />
              </div>

              {authError && (
                <div className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200 flex items-start gap-1.5">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#003399] hover:bg-blue-800 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-md transition-all cursor-pointer"
              >
                Sign In as Admin
              </button>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED PORTAL DASHBOARD */
          <div className="max-h-[82vh] overflow-y-auto p-4 sm:p-6 space-y-6 text-xs">
            
            {/* Top Navigation Tabs inside Admin */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('listings')}
                  className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                    activeTab === 'listings'
                      ? 'bg-[#003399] text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Car className="w-4 h-4" />
                  <span>Current Listings ({cars.length})</span>
                </button>

                {/* REQUIREMENT 4: HISTORICAL ARCHIVE DATABASE TAB */}
                <button
                  type="button"
                  onClick={() => setActiveTab('archive')}
                  className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                    activeTab === 'archive'
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100'
                  }`}
                >
                  <Archive className="w-4 h-4" />
                  <span>Historical Archive Database ({archivedCars.length})</span>
                </button>

                {/* MARKET ANALYSIS TAB */}
                <button
                  type="button"
                  onClick={() => setActiveTab('market_analysis')}
                  className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                    activeTab === 'market_analysis'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-emerald-50 text-emerald-900 border border-emerald-300 hover:bg-emerald-100'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Market Analysis</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportArchiveCSV}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-xl border border-slate-300 flex items-center gap-1.5 transition text-xs"
                  title="Export Archive to CSV"
                >
                  <Download className="w-3.5 h-3.5 text-blue-600" />
                  <span>Export CSV</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportArchiveJSON}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-xl border border-slate-300 flex items-center gap-1.5 transition text-xs"
                  title="Export Archive to JSON"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Export JSON</span>
                </button>
              </div>
            </div>

            {/* TAB 1: CURRENT ACTIVE LISTINGS */}
            {activeTab === 'listings' && (
              <div className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search current listings by title, make, city, or seller..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-3">
                  {filteredCars.map((car) => (
                    <div 
                      key={car.id}
                      className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={car.photos[0]} 
                          alt={car.title} 
                          className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">{car.title}</span>
                            <span className="text-[10px] font-mono text-slate-400">#{car.id}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500">
                            <span>{car.year} &bull; {car.make} {car.model}</span>
                            <span>&bull;</span>
                            <span className="font-semibold text-slate-700">{car.city}</span>
                            <span>&bull;</span>
                            <span className="font-mono font-bold text-[#003399]">{car.price.toLocaleString()} ETB</span>
                          </div>
                        </div>
                      </div>

                      {/* Status Selector & Controls */}
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <select
                          value={car.status || 'active'}
                          onChange={(e) => handleStatusChange(car, e.target.value as ListingStatus)}
                          className={`text-xs font-bold rounded-lg px-2.5 py-1.5 border transition-colors shadow-sm ${
                            car.status === 'sold'
                              ? 'bg-red-600 text-white border-red-500 font-black'
                              : car.status === 'urgent'
                              ? 'bg-yellow-400 text-slate-950 border-yellow-300 font-black'
                              : 'bg-emerald-600 text-white border-emerald-500 font-bold'
                          }`}
                        >
                          <option value="active" className="bg-white text-emerald-800 font-bold">🟢 Listed / Active (Green)</option>
                          <option value="urgent" className="bg-white text-amber-700 font-bold">🟡 Urgent Deal (Yellow)</option>
                          <option value="sold" className="bg-white text-red-700 font-bold">🔴 Sold (Red)</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => setEditingCar(car)}
                          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                          title="Edit Vehicle"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete ${car.title} from active listings? (It will remain safely preserved in the Historical Archive)`)) {
                              onDeleteCar(car.id);
                              setArchivedCars(getArchivedCars());
                            }
                          }}
                          className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600"
                          title="Delete from active"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: HISTORICAL ARCHIVE DATABASE (Requirement 4) */}
            {activeTab === 'archive' && (
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900">
                  <div>
                    <h4 className="font-bold text-sm flex items-center gap-2">
                      <Archive className="w-4 h-4 text-amber-600" />
                      <span>Permanent Historical Archive Database</span>
                    </h4>
                    <p className="text-xs text-amber-800/90 mt-0.5">
                      All listed cars are permanently preserved here for future reference, price tracking, and market analysis.
                    </p>
                  </div>
                  <div className="font-mono font-bold text-lg bg-white px-3 py-1 rounded-xl border border-amber-300">
                    {archivedCars.length} Cars Preserved
                  </div>
                </div>

                {/* Archive Search */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={archiveSearchQuery}
                    onChange={(e) => setArchiveSearchQuery(e.target.value)}
                    placeholder="Search archive by make, model, status (sold/urgent/active), or city..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-3">
                  {filteredArchive.map((archived) => (
                    <div 
                      key={archived.id}
                      className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={archived.photos?.[0] || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=400&q=80'} 
                          alt={archived.title} 
                          className="w-16 h-16 rounded-xl object-cover border border-slate-300 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">{archived.title}</span>
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                              archived.status === 'sold'
                                ? 'bg-red-600 text-white'
                                : archived.status === 'urgent'
                                ? 'bg-yellow-400 text-slate-950'
                                : 'bg-emerald-600 text-white'
                            }`}>
                              {archived.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                            <span>Recorded: {formatPrice(archived.price)}</span>
                            <span>&bull;</span>
                            <span>{archived.year} {archived.make}</span>
                            <span>&bull;</span>
                            <span>{archived.city}</span>
                            <span>&bull;</span>
                            <span className="font-mono text-slate-400">Archived: {new Date(archived.archivedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleRestoreArchivedCar(archived)}
                          className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 shadow transition"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Restore to Market</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: MARKET ANALYSIS (Requirement 4) */}
            {activeTab === 'market_analysis' && (
              <div className="space-y-5">
                {/* Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Vehicles</span>
                    <span className="text-2xl font-black font-mono text-slate-900 mt-1">{marketStats.totalCarsTracked}</span>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl">
                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">Average Asking Price</span>
                    <span className="text-xl sm:text-2xl font-black font-mono text-emerald-900 mt-1">
                      {formatPrice(marketStats.averagePriceETB)}
                    </span>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl">
                    <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block">Total Market Value</span>
                    <span className="text-xl sm:text-2xl font-black font-mono text-blue-900 mt-1">
                      {formatPrice(marketStats.totalMarketValueETB)}
                    </span>
                  </div>

                  <div className="bg-red-50 border border-red-200 p-4 rounded-2xl">
                    <span className="text-[11px] font-bold text-red-800 uppercase tracking-wider block">Vehicles Sold</span>
                    <span className="text-2xl font-black font-mono text-red-900 mt-1">{marketStats.soldCount}</span>
                  </div>
                </div>

                {/* Make Breakdown Table */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span>Brand Market Distribution & Average Valuations</span>
                  </h4>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500">
                          <th className="py-2">Vehicle Brand</th>
                          <th className="py-2">Total Units Tracked</th>
                          <th className="py-2">Average Asking Price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {marketStats.topMakesByAvgPrice.map((item) => (
                          <tr key={item.make} className="hover:bg-slate-50">
                            <td className="py-2.5 font-bold text-slate-900">{item.make}</td>
                            <td className="py-2.5 font-mono text-slate-600">{item.count} units</td>
                            <td className="py-2.5 font-mono font-bold text-[#003399]">{formatPrice(item.avgPrice)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* Edit Car Sub-Modal */}
        {editingCar && (
          <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-5 space-y-4 border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="font-bold text-slate-900 text-sm">Edit Vehicle: {editingCar.title}</h3>
                <button type="button" onClick={() => setEditingCar(null)}>
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Title</label>
                  <input
                    type="text"
                    value={editingCar.title}
                    onChange={(e) => setEditingCar({ ...editingCar, title: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Price (ETB)</label>
                    <input
                      type="number"
                      value={editingCar.price}
                      onChange={(e) => setEditingCar({ ...editingCar, price: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Mileage (km)</label>
                    <input
                      type="number"
                      value={editingCar.mileage}
                      onChange={(e) => setEditingCar({ ...editingCar, mileage: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingCar(null)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-[#003399] text-white font-bold"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
