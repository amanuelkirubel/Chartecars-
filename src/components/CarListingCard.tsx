import React, { useState, useRef } from 'react';
import { 
  Car, 
  MapPin, 
  Fuel, 
  Gauge, 
  Zap, 
  Heart, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  User, 
  Lock, 
  MessageSquare 
} from 'lucide-react';
import { CarListing, Language, Currency } from '../types';

interface CarListingCardProps {
  car: CarListing;
  onSelect: (car: CarListing) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  lang: Language;
  currency: Currency;
  isAdminLoggedIn?: boolean;
}

export const CarListingCard: React.FC<CarListingCardProps> = ({
  car,
  onSelect,
  isFavorite,
  onToggleFavorite,
  lang,
  currency,
  isAdminLoggedIn = false,
}) => {
  const isSold = car.status === 'sold';
  const isRented = car.status === 'rented';
  // Requirement 2: Do not give information about sold and rented cars!
  const isClosedDeal = isSold || isRented;

  // Requirement 3: Card changeable or next option to see other pictures
  // ONLY for listed ('active') and 'urgent' cars, NOT for sold or rented cars!
  const canBrowsePhotos = !isClosedDeal && !!car.photos && car.photos.length > 1;

  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const formatPrice = (amount: number) => {
    if (currency === 'USD') {
      const usdRate = 145;
      return `$${Math.round(amount / usdRate).toLocaleString()} USD`;
    }
    return `${amount.toLocaleString()} ETB`;
  };

  const getConditionBadge = () => {
    switch (car.condition) {
      case 'brand_new':
        return { label: lang === 'am' ? 'አዲስ 0 ኪ.ሜ' : 'Brand New 0km', bg: 'bg-emerald-500 text-white' };
      case 'like_new':
        return { label: lang === 'am' ? 'በጣም ንጹህ' : 'Like New', bg: 'bg-blue-600 text-white' };
      case 'duty_free':
        return { label: lang === 'am' ? 'ቀረጥ ነጻ' : 'Duty Free', bg: 'bg-purple-600 text-white' };
      default:
        return { label: lang === 'am' ? 'ያገለገለ' : 'Used', bg: 'bg-slate-700 text-slate-200' };
    }
  };

  const conditionBadge = getConditionBadge();

  const getStatusBadge = () => {
    if (isSold) {
      return {
        label: lang === 'am' ? 'የተሸጠ (SOLD)' : 'SOLD',
        bg: 'bg-red-600 text-white border-red-500 shadow-red-900/40',
        dot: 'bg-white'
      };
    }
    if (isRented) {
      return {
        label: lang === 'am' ? 'ተከራይቷል (RENTED)' : 'RENTED',
        bg: 'bg-indigo-600 text-white border-indigo-500 shadow-indigo-900/40',
        dot: 'bg-white'
      };
    }
    if (car.status === 'urgent') {
      return {
        label: lang === 'am' ? 'አጣዳፊ (URGENT)' : 'URGENT',
        bg: 'bg-yellow-400 text-slate-950 font-black border-yellow-300 shadow-amber-900/30',
        dot: 'bg-slate-950'
      };
    }
    return {
      label: lang === 'am' ? 'በዝርዝር ላይ (LISTED)' : 'LISTED',
      bg: 'bg-emerald-600 text-white border-emerald-400/70 shadow-emerald-900/30',
      dot: 'bg-emerald-200'
    };
  };

  const statusBadge = getStatusBadge();

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (canBrowsePhotos) {
      setCurrentPhotoIndex((prev) => (prev > 0 ? prev - 1 : car.photos.length - 1));
    }
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (canBrowsePhotos) {
      setCurrentPhotoIndex((prev) => (prev < car.photos.length - 1 ? prev + 1 : 0));
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!canBrowsePhotos) return;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!canBrowsePhotos || touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 35) {
      if (diff > 0) {
        setCurrentPhotoIndex((prev) => (prev < car.photos.length - 1 ? prev + 1 : 0));
      } else {
        setCurrentPhotoIndex((prev) => (prev > 0 ? prev - 1 : car.photos.length - 1));
      }
    }
    touchStartX.current = null;
  };

  const activePhoto = (car.photos && car.photos[currentPhotoIndex]) || car.photos?.[0] || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80';

  // REQUIREMENT 4: Show ONLY the seller / car owner's own contact info (e.g. Tady), NOT the admin!
  const sellerDisplayName = car.sellerContact?.name || (lang === 'am' ? 'የመኪናው ባለቤት' : 'Car Owner');
  const sellerRawPhone = car.sellerContact?.phone?.replace(/[^0-9]/g, '') || '';
  const sellerWhatsAppNumber = car.sellerContact?.whatsapp?.replace(/[^0-9]/g, '') || sellerRawPhone;

  const sellerInquiryText = encodeURIComponent(
    `Hello ${sellerDisplayName}, I found your car on Charte Cars: ${car.year} ${car.make} ${car.model} (${car.price.toLocaleString()} ETB, Ref: #${car.id}). I am interested in viewing / purchasing it.`
  );

  const sellerWhatsAppUrl = sellerWhatsAppNumber
    ? `https://wa.me/${sellerWhatsAppNumber}?text=${sellerInquiryText}`
    : `https://wa.me/?text=${sellerInquiryText}`;

  return (
    <div 
      className={`group bg-white rounded-2xl sm:rounded-3xl border shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between relative ${
        isSold 
          ? 'border-red-300 ring-1 ring-red-200' 
          : isRented 
          ? 'border-indigo-300 ring-1 ring-indigo-200' 
          : 'border-slate-200/80'
      }`}
    >
      <div>
        {/* Photo Container */}
        <div 
          className="relative h-56 sm:h-64 overflow-hidden bg-slate-950 select-none cursor-pointer"
          onClick={() => { if (!isClosedDeal) onSelect(car); }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <img 
            src={activePhoto} 
            alt={car.title}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isClosedDeal ? 'filter contrast-95 scale-100' : 'group-hover:scale-105'
            }`}
            loading="lazy"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />

          {/* REQUIREMENT 2 & 3: For Sold and Rented cars: cover picture by blue color and bold mark exactly matching picture */}
          {isSold && (
            <div className="absolute inset-0 bg-[#0B2559]/85 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 z-25 text-center pointer-events-none">
              <div className="bg-red-600 text-white font-black text-base sm:text-xl uppercase px-6 py-3 rounded-2xl shadow-2xl tracking-widest border-2 border-white rotate-[-6deg] flex flex-col items-center gap-0.5 animate-pulse">
                <span>SOLD • የተሸጠ</span>
              </div>
            </div>
          )}

          {isRented && (
            <div className="absolute inset-0 bg-[#0B2559]/85 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 z-25 text-center pointer-events-none">
              <div className="bg-indigo-600 text-white font-black text-base sm:text-xl uppercase px-6 py-3 rounded-2xl shadow-2xl tracking-widest border-2 border-white rotate-[-6deg] flex flex-col items-center gap-0.5 animate-pulse">
                <span>RENTED • የተከራየ</span>
              </div>
            </div>
          )}

          {/* Top Left Badges: Status (Sold=Red, Rented=Indigo, Urgent=Yellow, Listed=Green), Type, Plate */}
          <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-20">
            <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border shadow-md flex items-center gap-1 backdrop-blur-md ${statusBadge.bg}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`} />
              <span>{statusBadge.label}</span>
            </span>

            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-md shadow-sm ${
              car.type === 'rent'
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'bg-[#003399] text-white'
            }`}>
              {car.type === 'rent' ? (lang === 'am' ? 'ኪራይ Rent' : 'Rent') : (lang === 'am' ? 'ሽያጭ Buy' : 'For Sale')}
            </span>

            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full backdrop-blur-md shadow-sm ${conditionBadge.bg}`}>
              {conditionBadge.label}
            </span>

            {typeof car.listingCode === 'number' && (
              <span className="text-[10px] font-black bg-white/95 text-slate-900 border border-white px-2 py-0.5 rounded-full font-mono backdrop-blur-md shadow-sm">
                C{car.listingCode}
              </span>
            )}
          </div>

          {/* Top Right Favorite Button */}
          <div className="absolute top-3 right-3 z-20">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(car.id);
              }}
              className={`p-2 rounded-full backdrop-blur-md transition-all ${
                isFavorite 
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/40 scale-110' 
                  : 'bg-black/50 text-white hover:bg-black/80'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Photo switching arrows: ONLY for active & urgent cars, NOT for sold/rented cars! */}
          {canBrowsePhotos && (
            <>
              <button
                type="button"
                onClick={handlePrevPhoto}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/65 hover:bg-black/95 text-white flex items-center justify-center backdrop-blur-sm border border-white/40 transition-all shadow-lg active:scale-90"
                title="Previous photo"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>

              <button
                type="button"
                onClick={handleNextPhoto}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/65 hover:bg-black/95 text-white flex items-center justify-center backdrop-blur-sm border border-white/40 transition-all shadow-lg active:scale-90"
                title="Next photo"
                aria-label="Next photo"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>

              <div className="absolute bottom-3 right-3 z-20 bg-black/75 backdrop-blur-md text-white font-mono text-[11px] font-bold px-2.5 py-1 rounded-lg border border-white/20 shadow">
                {currentPhotoIndex + 1} / {car.photos.length}
              </div>
            </>
          )}

          {/* Bottom Left Photo Specs */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white z-15">
            <span className="text-xs font-bold bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-1 border border-white/10">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>{car.year}</span>
            </span>
            <span className="text-xs font-bold bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-1 border border-white/10 font-mono">
              <Gauge className="w-3.5 h-3.5 text-amber-400" />
              <span>{car.mileage.toLocaleString()} km</span>
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 space-y-3">
          
          {/* Location & Body Type */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="font-medium text-slate-700 truncate">{car.city} &bull; {car.neighborhood}</span>
            </div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {car.bodyType}
            </span>
          </div>

          {/* Car Title */}
          <h3 
            onClick={() => { if (!isClosedDeal) onSelect(car); }}
            className={`text-base sm:text-lg font-bold text-slate-900 leading-snug line-clamp-2 transition-colors ${
              isClosedDeal ? '' : 'hover:text-blue-700 cursor-pointer'
            }`}
          >
            {lang === 'am' && car.titleAm ? car.titleAm : car.title}
          </h3>

          {/* REQUIREMENT 2: DO NOT GIVE INFORMATION ABOUT SOLD AND RENTED CARS (Match Screenshot 2) */}
          {isClosedDeal ? (
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center gap-2 text-xs bg-slate-100 border border-slate-200/80 px-3 py-2 rounded-xl text-slate-500 font-medium">
                <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>
                  {isSold
                    ? (lang === 'am' ? 'የሻጭ መረጃ ከሽያጭ በኋላ ተሰውሯል' : 'Seller info hidden after sale')
                    : (lang === 'am' ? 'የሻጭ መረጃ ከኪራይ በኋላ ተሰውሯል' : 'Seller info hidden after rental')}
                </span>
              </div>
            </div>
          ) : (
            <>
              {/* Tech Spec Chips (Transmission, Fuel, Color) */}
              <div className="flex flex-wrap items-center gap-2 py-1 text-xs text-slate-600 border-y border-slate-100">
                <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md font-medium">
                  <span className="text-slate-400">⚙️</span>
                  <span className="capitalize">{car.transmission}</span>
                </div>

                <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md font-medium">
                  {car.fuelType === 'electric' ? <Zap className="w-3.5 h-3.5 text-emerald-600" /> : <Fuel className="w-3.5 h-3.5 text-blue-600" />}
                  <span className="capitalize">{car.fuelType}</span>
                </div>

                <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md font-medium text-slate-500 truncate max-w-[130px]">
                  <span>🎨 {car.color}</span>
                </div>
              </div>

              {/* Price */}
              <div className="pt-1">
                <span className="text-[11px] uppercase font-semibold text-slate-400 block">
                  {car.type === 'rent' ? (lang === 'am' ? 'የኪራይ ዋጋ' : 'Rental Price') : (lang === 'am' ? 'የሽያጭ ዋጋ' : 'Asking Price')}
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl sm:text-2xl font-black font-mono text-[#003399]">
                    {formatPrice(car.price)}
                  </span>
                  {car.type === 'rent' && (
                    <span className="text-xs font-semibold text-slate-500">
                      /{car.rentPeriod === 'day' ? (lang === 'am' ? 'በቀን' : 'day') : (lang === 'am' ? 'በወር' : 'mo')}
                    </span>
                  )}
                </div>
              </div>

              {/* REQUIREMENT 4: SHOW ONLY THIS SPECIFIC SELLER'S NAME (e.g. Tady), NOT ADMIN! */}
              <div className="flex items-center justify-between text-xs bg-slate-50 border border-slate-200/80 px-2.5 py-1.5 rounded-xl">
                <div className="flex items-center gap-1.5 truncate">
                  <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="truncate">
                    <span className="text-slate-500 font-medium">{lang === 'am' ? 'ሻጭ: ' : 'Seller: '}</span>
                    <span className="font-bold text-slate-900">{sellerDisplayName}</span>
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md shrink-0">
                  {lang === 'am' ? 'ቀጥተኛ ሻጭ' : 'Direct Seller'}
                </span>
              </div>
            </>
          )}

        </div>
      </div>

      {/* Footer Action Buttons (Matching Screenshot 2 exactly for Sold / Rented cars) */}
      <div className="p-4 sm:p-5 pt-0 flex items-center gap-2">
        {isClosedDeal ? (
          <button
            type="button"
            disabled
            className="w-full bg-slate-100 text-slate-400 text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 border border-slate-200 cursor-not-allowed select-none"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>
              {isSold
                ? (lang === 'am' ? 'ተሸጧል — ዝርዝር መረጃ የለም' : 'Sold — No Further Details')
                : (lang === 'am' ? 'ተከራይቷል — ዝርዝር መረጃ የለም' : 'Rented — No Further Details')}
            </span>
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => onSelect(car)}
              className="flex-1 bg-slate-900 hover:bg-[#003399] text-white text-xs font-bold py-2.5 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{lang === 'am' ? 'ዝርዝር እይ' : 'View Specs'}</span>
            </button>

            {/* REQUIREMENT 4: WhatsApp button contacts THIS SPECIFIC SELLER directly! */}
            <a
              href={sellerWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 px-3.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              title={`Contact ${sellerDisplayName} on WhatsApp`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </>
        )}
      </div>

    </div>
  );
};
