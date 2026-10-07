import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Gauge, 
  Fuel, 
  Zap, 
  Calendar, 
  PhoneCall, 
  MessageSquare, 
  ChevronLeft, 
  ChevronRight, 
  Share2, 
  Heart, 
  SlidersHorizontal, 
  User, 
  Lock, 
  Tag 
} from 'lucide-react';
import { CarListing, Language, Currency, ListingStatus } from '../types';

interface CarDetailModalProps {
  car: CarListing;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  lang: Language;
  currency: Currency;
  onUpdateStatus?: (id: string, status: ListingStatus) => void;
  isAdminLoggedIn?: boolean;
}

export const CarDetailModal: React.FC<CarDetailModalProps> = ({
  car,
  onClose,
  isFavorite,
  onToggleFavorite,
  lang,
  currency,
  onUpdateStatus,
  isAdminLoggedIn = false,
}) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [localStatus, setLocalStatus] = useState<ListingStatus>(car.status);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  const isSold = localStatus === 'sold';
  const isRented = localStatus === 'rented';
  const isClosedDeal = isSold || isRented;

  const handleSellerStatusChange = (newStatus: ListingStatus) => {
    setLocalStatus(newStatus);
    if (onUpdateStatus) {
      onUpdateStatus(car.id, newStatus);
    }
    const label = newStatus === 'urgent' 
      ? (lang === 'am' ? 'መኪናው ወደ አጣዳፊ ሽያጭ (Urgent Deal) ተቀይሯል!' : 'Car listing updated to URGENT DEAL!') 
      : newStatus === 'sold'
      ? (lang === 'am' ? 'መኪናው እንደተሸጠ (SOLD) ተመዝግቧል!' : 'Car listing marked as SOLD!')
      : newStatus === 'rented'
      ? (lang === 'am' ? 'መኪናው እንደተከራየ (RENTED) ተመዝግቧል!' : 'Car listing marked as RENTED!')
      : (lang === 'am' ? 'መኪናው ወደ ዝርዝር (Active) ተመልሷል!' : 'Car listing reset to Active Listed!');
    
    setStatusFeedback(label);
    setTimeout(() => setStatusFeedback(null), 4000);
  };

  const formatPrice = (amount: number) => {
    if (currency === 'USD') {
      const usdRate = 145;
      return `$${Math.round(amount / usdRate).toLocaleString()} USD`;
    }
    return `${amount.toLocaleString()} ETB`;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: car.title,
        text: `Check out this ${car.year} ${car.make} ${car.model} on Charte Cars: ${formatPrice(car.price)}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // REQUIREMENT 4: Show THIS SPECIFIC SELLER'S CONTACT INFO (e.g. Tady), NOT the admin!
  const sellerDisplayName = car.sellerContact?.name || (lang === 'am' ? 'የመኪናው ባለቤት' : 'Car Owner');
  const sellerRawPhone = car.sellerContact?.phone?.replace(/[^0-9]/g, '') || '';
  const sellerFormattedPhone = car.sellerContact?.phone || '';
  const sellerWhatsAppNumber = car.sellerContact?.whatsapp?.replace(/[^0-9]/g, '') || sellerRawPhone;
  const sellerAddress = car.sellerContact?.address || `${car.neighborhood}, ${car.city}`;

  const sellerInquiryMsg = encodeURIComponent(
    `Hello ${sellerDisplayName}, I found your car on Charte Cars: ${car.year} ${car.make} ${car.model} (${car.price.toLocaleString()} ETB, Ref: #${car.id}). I am interested in viewing / purchasing it.`
  );

  const sellerWhatsAppUrl = sellerWhatsAppNumber
    ? `https://wa.me/${sellerWhatsAppNumber}?text=${sellerInquiryMsg}`
    : `https://wa.me/?text=${sellerInquiryMsg}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200">
        
        {/* Modal Sticky Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-4 sm:px-6 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            {isSold ? (
              <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-red-600 text-white border border-red-500 shadow-sm flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span>{lang === 'am' ? 'የተሸጠ (SOLD)' : 'SOLD'}</span>
              </span>
            ) : isRented ? (
              <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-indigo-600 text-white border border-indigo-500 shadow-sm flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span>{lang === 'am' ? 'ተከራይቷል (RENTED)' : 'RENTED'}</span>
              </span>
            ) : localStatus === 'urgent' ? (
              <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-yellow-400 text-slate-950 border border-yellow-300 shadow-sm flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                <span>{lang === 'am' ? 'አጣዳፊ (URGENT)' : 'URGENT'}</span>
              </span>
            ) : (
              <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-emerald-600 text-white border border-emerald-500 shadow-sm flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-200" />
                <span>{lang === 'am' ? 'በዝርዝር ላይ (LISTED)' : 'LISTED'}</span>
              </span>
            )}

            <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
              car.type === 'rent' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {car.type === 'rent' ? (lang === 'am' ? 'ኪራይ Rent' : 'For Rent') : (lang === 'am' ? 'ሽያጭ Buy' : 'For Sale')}
            </span>
            {typeof car.listingCode === 'number' && (
              <span className="text-[10px] font-black bg-slate-900 text-white px-2.5 py-1 rounded-full font-mono">
                C{car.listingCode}
              </span>
            )}
            <span className="text-xs text-slate-400 truncate">
              Ref: #{car.id} &bull; {car.city}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Explicit Back / Previous option */}
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer border border-slate-200"
              title={lang === 'am' ? 'ወደ ኋላ ተመለስ (Back)' : 'Go back to listings'}
            >
              <ChevronLeft className="w-4 h-4 text-slate-700" />
              <span>{lang === 'am' ? 'ወደ ኋላ' : 'Back'}</span>
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
              title="Share listing"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onToggleFavorite(car.id)}
              className={`p-2 rounded-full hover:bg-slate-100 transition-colors ${
                isFavorite ? 'text-red-500' : 'text-slate-600'
              }`}
              title="Favorite"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-700 transition-colors ml-1"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content Scrollable Area */}
        <div className="max-h-[82vh] overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Photo Showcase */}
          <div className="space-y-2.5">
            <div className="relative h-64 sm:h-96 w-full rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center">
              <img 
                src={car.photos[activePhotoIdx]} 
                alt={`${car.title} - photo ${activePhotoIdx + 1}`}
                className="w-full h-full object-cover"
              />

              {isSold && (
                <div className="absolute inset-0 bg-[#0B2559]/85 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 z-20 text-center">
                  <div className="bg-red-600 text-white font-black text-xl sm:text-3xl uppercase px-8 py-3.5 rounded-2xl shadow-2xl tracking-widest border-4 border-white rotate-[-6deg] animate-pulse">
                    SOLD • የተሸጠ
                  </div>
                  <p className="text-white text-xs sm:text-sm font-bold mt-3 bg-red-950/80 border border-red-500/60 px-4 py-1.5 rounded-full shadow">
                    {lang === 'am' ? 'ይህ ተሽከርካሪ ተሸጧል' : 'This Vehicle Has Been Sold'}
                  </p>
                </div>
              )}

              {isRented && (
                <div className="absolute inset-0 bg-[#0B2559]/85 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 z-20 text-center">
                  <div className="bg-indigo-600 text-white font-black text-xl sm:text-3xl uppercase px-8 py-3.5 rounded-2xl shadow-2xl tracking-widest border-4 border-white rotate-[-6deg] animate-pulse">
                    RENTED • የተከራየ
                  </div>
                  <p className="text-white text-xs sm:text-sm font-bold mt-3 bg-indigo-950/80 border border-indigo-500/60 px-4 py-1.5 rounded-full shadow">
                    {lang === 'am' ? 'ይህ ተሽከርካሪ ተከራይቷል' : 'This Vehicle Has Been Rented Out'}
                  </p>
                </div>
              )}

              {car.photos.length > 1 && !isClosedDeal && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setActivePhotoIdx((prev) => (prev === 0 ? car.photos.length - 1 : prev - 1));
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-sm transition-all z-10"
                    title="Previous photo"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setActivePhotoIdx((prev) => (prev === car.photos.length - 1 ? 0 : prev + 1));
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-sm transition-all z-10"
                    title="Next photo"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-white text-xs font-mono px-2.5 py-1 rounded-full z-10">
                    {activePhotoIdx + 1} / {car.photos.length}
                  </div>
                </>
              )}
            </div>

            {car.photos.length > 1 && !isClosedDeal && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {car.photos.map((photo, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActivePhotoIdx(i)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                      activePhotoIdx === i ? 'border-blue-600 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Asking Price Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
                <span className="text-blue-700 font-bold uppercase tracking-wider">{car.make}</span>
                <span>&bull;</span>
                <span>{car.year}</span>
                <span>&bull;</span>
                <span className="flex items-center gap-1 text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>{car.city}, {car.neighborhood}</span>
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 leading-snug">
                {lang === 'am' && car.titleAm ? car.titleAm : car.title}
              </h2>

              {/* Seller Name (e.g. Tady) */}
              {!isClosedDeal && (
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-800">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-slate-500 font-medium">{lang === 'am' ? 'የመኪናው ሻጭ:' : 'Seller:'}</span>
                    <strong className="text-slate-900 font-bold">{sellerDisplayName}</strong>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-lg">
                    {lang === 'am' ? 'ቀጥተኛ ሻጭ (0% ኮሚሽን)' : 'Direct Owner Listing (0% Commission)'}
                  </span>
                </div>
              )}
            </div>

            {/* Price (Only if not closed deal) */}
            {!isClosedDeal && (
              <div className="shrink-0 bg-blue-50/80 border border-blue-100 p-3.5 rounded-2xl md:text-right">
                <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider block">
                  {car.type === 'rent' ? (lang === 'am' ? 'የኪራይ ዋጋ' : 'Rental Rate') : (lang === 'am' ? 'የመኪናው ዋጋ' : 'Asking Price')}
                </span>
                <div className="text-2xl sm:text-3xl font-black font-mono text-[#003399]">
                  {formatPrice(car.price)}
                  {car.type === 'rent' && (
                    <span className="text-xs font-semibold text-slate-600">
                      /{car.rentPeriod === 'day' ? 'day' : 'month'}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* REQUIREMENT 2: DO NOT GIVE INFORMATION ABOUT SOLD AND RENTED CARS */}
          {isClosedDeal ? (
            <div className="bg-slate-100 border border-slate-200 p-6 rounded-2xl text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-200 text-slate-500 flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-700">
                {isSold
                  ? (lang === 'am' ? 'የተሸጠ መኪና — ዝርዝር መረጃ ተሰውሯል' : 'Sold Vehicle — Details Hidden')
                  : (lang === 'am' ? 'የተከራየ መኪና — ዝርዝር መረጃ ተሰውሯል' : 'Rented Vehicle — Details Hidden')}
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {isSold
                  ? (lang === 'am'
                    ? 'ይህ መኪና ተሸጧል። ዋጋ፣ የሻጭ አድራሻ እና ዝርዝር መረጃዎች ከህዝብ እይታ ተደብቀዋል።'
                    : 'This vehicle has been sold. Price, seller contacts, and technical specifications are withheld.')
                  : (lang === 'am'
                    ? 'ይህ መኪና ተከራይቷል። ዋጋ፣ የሻጭ አድራሻ እና ዝርዝር መረጃዎች ከህዝብ እይታ ተደብቀዋል።'
                    : 'This vehicle is currently rented out. Details and contacts are withheld.')}
              </p>
            </div>
          ) : (
            <>
              {/* Technical Specifications Grid */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                  <span>{lang === 'am' ? 'ቴክኒካዊ መረጃዎች (Vehicle Specifications)' : 'Technical Specifications'}</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block mb-0.5">{lang === 'am' ? 'የተሰራበት ዓመት' : 'Model Year'}</span>
                    <span className="font-bold text-slate-900 text-sm flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      <span>{car.year}</span>
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block mb-0.5">{lang === 'am' ? 'የተጓዘው ኪሎሜትር' : 'Mileage'}</span>
                    <span className="font-bold text-slate-900 text-sm flex items-center gap-1 font-mono">
                      <Gauge className="w-3.5 h-3.5 text-amber-600" />
                      <span>{car.mileage.toLocaleString()} km</span>
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block mb-0.5">{lang === 'am' ? 'የማርሽ አይነት' : 'Transmission'}</span>
                    <span className="font-bold text-slate-900 text-sm capitalize">
                      ⚙️ {car.transmission}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block mb-0.5">{lang === 'am' ? 'የነዳጅ አይነት' : 'Fuel Type'}</span>
                    <span className="font-bold text-slate-900 text-sm capitalize flex items-center gap-1">
                      {car.fuelType === 'electric' ? <Zap className="w-3.5 h-3.5 text-emerald-600" /> : <Fuel className="w-3.5 h-3.5 text-blue-600" />}
                      <span>{car.fuelType}</span>
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block mb-0.5">{lang === 'am' ? 'የሰሌዳ አይነት' : 'Plate Code'}</span>
                    <span className="font-bold text-slate-900 text-sm uppercase">
                      {car.plateCode ? car.plateCode.replace('_', ' ') : 'N/A'}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block mb-0.5">{lang === 'am' ? 'የመኪናው ሁኔታ' : 'Condition'}</span>
                    <span className="font-bold text-slate-900 text-sm capitalize">
                      {car.condition === 'brand_new' ? 'Brand New 0km' : car.condition === 'like_new' ? 'Like New' : car.condition}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block mb-0.5">{lang === 'am' ? 'የመኪና አይነት' : 'Body Style'}</span>
                    <span className="font-bold text-slate-900 text-sm uppercase">
                      {car.bodyType}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block mb-0.5">{lang === 'am' ? 'ቀለም' : 'Color'}</span>
                    <span className="font-bold text-slate-900 text-sm truncate">
                      {car.color}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                  {lang === 'am' ? 'የመኪናው መግለጫ (Overview)' : 'Vehicle Description'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/60 p-4 rounded-xl border border-slate-100">
                  {lang === 'am' && car.descriptionAm ? car.descriptionAm : car.description}
                </p>
              </div>

              {/* REQUIREMENT 4: SELLER'S OWN DIRECT CONTACT PANEL (e.g. TADY) - NEVER ADMIN! */}
              <div className="bg-gradient-to-br from-[#051329] to-[#0A224A] text-white p-5 sm:p-6 rounded-2xl border border-blue-800/60 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-900/60 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>{lang === 'am' ? 'የሻጩ ቀጥተኛ መገናኛ' : 'Direct Seller Contact'}:</span>
                        <span className="text-emerald-400 font-bold">{sellerDisplayName}</span>
                      </h4>
                      <p className="text-xs text-slate-300">
                        {sellerAddress && <span>Location: {sellerAddress} &bull; </span>}
                        {lang === 'am' 
                          ? 'ከባለቤቱ ጋር በቀጥታ ይደራደሩ፤ 0% የደላላ ኮሚሽን።' 
                          : 'Connect directly with the seller. 0% broker fee.'}
                      </p>
                    </div>
                  </div>
                  <span className="bg-emerald-950 text-emerald-300 border border-emerald-700/60 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider self-start sm:self-auto">
                    Direct Seller
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Direct Call to SELLER */}
                  {sellerFormattedPhone ? (
                    <a
                      href={`tel:${sellerFormattedPhone}`}
                      className="bg-[#003399] hover:bg-blue-600 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all font-mono"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>{lang === 'am' ? 'ደውሉ' : 'Call'} {sellerDisplayName}: {sellerFormattedPhone}</span>
                    </a>
                  ) : null}

                  {/* WhatsApp Direct to SELLER */}
                  <a
                    href={sellerWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp {sellerDisplayName}</span>
                  </a>
                </div>
              </div>
            </>
          )}

          {/* Seller / Admin Status Toggle */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-700 shadow-xl space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-start sm:items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {lang === 'am' ? 'የመኪናው ሁኔታ ማስተካከያ' : 'Listing Status Controls'}
                  </h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed mt-0.5">
                    {lang === 'am'
                      ? 'መኪናውን ወደ አጣዳፊ (Urgent)፣ ተሽጧል (Sold) ወይም ተከራይቷል (Rented) ይቀይሩ።'
                      : 'Toggle listing status between Listed, Urgent Deal, Sold, or Rented.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400">Current:</span>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                  localStatus === 'sold'
                    ? 'bg-red-600 text-white'
                    : localStatus === 'rented'
                    ? 'bg-indigo-600 text-white'
                    : localStatus === 'urgent'
                    ? 'bg-yellow-400 text-slate-950'
                    : 'bg-emerald-600 text-white'
                }`}>
                  {localStatus}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleSellerStatusChange('active')}
                className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-all ${
                  localStatus === 'active'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg'
                    : 'bg-slate-800 text-emerald-300 border-emerald-500/30'
                }`}
              >
                <span>Active</span>
              </button>

              <button
                type="button"
                onClick={() => handleSellerStatusChange('urgent')}
                className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-all ${
                  localStatus === 'urgent'
                    ? 'bg-yellow-400 text-slate-950 border-yellow-300 shadow-lg'
                    : 'bg-slate-800 text-yellow-300 border-yellow-400/30'
                }`}
              >
                <span>Urgent</span>
              </button>

              <button
                type="button"
                onClick={() => handleSellerStatusChange('sold')}
                className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-all ${
                  localStatus === 'sold'
                    ? 'bg-red-600 text-white border-red-500 shadow-lg'
                    : 'bg-slate-800 text-red-300 border-red-500/30'
                }`}
              >
                <span>Sold</span>
              </button>

              <button
                type="button"
                onClick={() => handleSellerStatusChange('rented')}
                className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-all ${
                  localStatus === 'rented'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg'
                    : 'bg-slate-800 text-indigo-300 border-indigo-500/30'
                }`}
              >
                <span>Rented</span>
              </button>
            </div>

            {statusFeedback && (
              <div className="bg-emerald-950 border border-emerald-500/60 text-emerald-300 text-xs px-3.5 py-2.5 rounded-xl shadow-inner font-semibold">
                {statusFeedback}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
