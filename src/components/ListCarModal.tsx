import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Car, 
  Send, 
  MessageSquare,
  ShieldCheck,
  User,
  Phone,
  MapPin,
  Globe,
  ChevronLeft
} from 'lucide-react';
import { CarListing, Language, ListingType } from '../types';
import { LISTING_FEE_ETB } from '../config/pricing';

interface ListCarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCar: (newCar: Omit<CarListing, 'id' | 'createdAt' | 'views'>) => void;
  lang: Language;
  isAdminLoggedIn?: boolean;
  existingCars?: CarListing[];
  onOpenAdminLogin?: () => void;
}

export const ListCarModal: React.FC<ListCarModalProps> = ({
  isOpen,
  onClose,
  onAddCar,
  lang,
  isAdminLoggedIn = false,
  onOpenAdminLogin,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Admin Listing Form State (All inputs are free-text typed by user/admin, NOT locked dropdowns)
  const [type, setType] = useState<ListingType>('sale');
  const [rentPeriod, setRentPeriod] = useState<'day' | 'month'>('month');
  const [title, setTitle] = useState('');
  const [titleAm, setTitleAm] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('2024');
  const [price, setPrice] = useState('');
  const [mileage, setMileage] = useState('');
  const [transmission, setTransmission] = useState<'automatic' | 'manual'>('automatic');
  const [fuelType, setFuelType] = useState<'petrol' | 'diesel' | 'electric' | 'hybrid'>('petrol');
  const [bodyType, setBodyType] = useState('SUV');
  const [color, setColor] = useState('');
  const [condition, setCondition] = useState<'brand_new' | 'like_new' | 'used' | 'duty_free'>('like_new');
  const [plateCode, setPlateCode] = useState('code_2');
  
  // Requirement 5: Free-text city worldwide, no dropdown
  const [city, setCity] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  
  // Requirement 4: Ask seller name, phone, address (e.g. Tady)
  const [sellerName, setSellerName] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');
  const [sellerWhatsApp, setSellerWhatsApp] = useState('');
  const [sellerAddress, setSellerAddress] = useState('');
  const [sellerNotes, setSellerNotes] = useState('');

  const [isCompressing, setIsCompressing] = useState(false);
  const [formError, setFormError] = useState('');
  const [successToast, setSuccessToast] = useState(false);

  if (!isOpen) return null;

  // Direct contact message for Telegram & WhatsApp
  const directMessage = encodeURIComponent(
    `Hello Charte Cars (@Chartecar)! I would like to list/sell my vehicle on Charte Cars and pay the ${LISTING_FEE_ETB} ETB service fee. Please send me the instructions to submit my vehicle photos, car name, asking price, and my seller contact details.`
  );

  const telegramLink = `https://t.me/chartecar?text=${directMessage}`;
  const whatsappLink = `https://wa.me/?text=${directMessage}`;

  // REQUIREMENT 5: NON-ADMIN VIEW
  if (!isAdminLoggedIn) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
        <div className="fixed inset-0" onClick={onClose} />

        <div className="relative w-full max-w-lg bg-[#071739] text-white rounded-3xl shadow-2xl border border-blue-600/50 overflow-hidden z-10 p-6 sm:p-8 space-y-6">
          
          <div className="flex items-center justify-between">
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
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="text-center space-y-2 pt-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-blue-600/30 border border-blue-400/40">
              <Car className="w-8 h-8" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'am' ? 'የቻርቴ መኪኖች ይፋዊ የሽያጭ ዴስክ' : 'Official Charte Cars Listing Desk'}</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {lang === 'am' ? 'መኪናዎን ለመዘርዘር ወይም ለመሸጥ' : 'List or Sell Your Car on Charte Cars'}
            </h3>
          </div>

          {/* 600 ETB Service Fee Highlight Box */}
          <div className="bg-gradient-to-br from-[#0B2559] to-[#081C44] border-2 border-amber-400/70 rounded-2xl p-5 text-center space-y-2 shadow-lg">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block">
              {lang === 'am' ? 'የአገልግሎት ክፍያ' : 'Official Service Fee'}
            </span>
            <div className="text-3xl sm:text-4xl font-black font-mono text-amber-400">
              {LISTING_FEE_ETB} ETB
            </div>
            <p className="text-xs text-blue-100/90 leading-relaxed max-w-sm mx-auto">
              {lang === 'am'
                ? `መኪናዎችን በቻርቴ መኪኖች ላይ በአስተዳዳሪ በኩል ብቻ ነው የሚለጠፉት። መኪናዎን ለመዘርዘር የ ${LISTING_FEE_ETB} ብር የአገልግሎት ክፍያ በቴሌግራም ወይም በዋትስአፕ ይክፈሉ።`
                : `Car listings are currently managed and published directly by Charte Cars Admin. Please pay the ${LISTING_FEE_ETB} ETB service fee via Telegram or WhatsApp to list your vehicle.`}
            </p>
          </div>

          {/* Direct Contact Buttons (Telegram @Chartecar & WhatsApp @Chartecar) */}
          <div className="space-y-3">
            <a
              href={telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-black text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-sky-900/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Send className="w-5 h-5" />
              <span>
                {lang === 'am' ? 'በቴሌግራም አግኙን፡ @Chartecar' : 'Contact on Telegram: @Chartecar'}
              </span>
            </a>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-900/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <MessageSquare className="w-5 h-5" />
              <span>
                {lang === 'am' ? 'በዋትስአፕ አግኙን፡ @Chartecar' : 'Contact on WhatsApp: @Chartecar'}
              </span>
            </a>
          </div>

          {/* 3-Step Instruction */}
          <div className="bg-[#040E24] border border-blue-900/60 rounded-2xl p-4 text-xs text-slate-300 space-y-2">
            <div className="font-bold text-white flex items-center gap-2 text-xs uppercase tracking-wide">
              <span>{lang === 'am' ? 'የአሰራር ቅደም ተከተል' : 'How it works'}:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-slate-300 leading-relaxed">
              <li>
                {lang === 'am' 
                  ? 'ቴሌግራም @Chartecar ወይም ዋትስአፕ @Chartecar ላይ መልዕክት ይላኩልን።' 
                  : 'Message us on Telegram @Chartecar or WhatsApp @Chartecar.'}
              </li>
              <li>
                {lang === 'am' 
                  ? `የ ${LISTING_FEE_ETB} ብር የአገልግሎት ክፍያ በቴሌብር ወይም በባንክ ይክፈሉ።` 
                  : `Pay the ${LISTING_FEE_ETB} ETB service fee (Telebirr or bank transfer).`}
              </li>
              <li>
                {lang === 'am' 
                  ? 'የመኪናዎን ፎቶዎች፣ ሞዴል፣ ዋጋ እና የእርስዎን ስም/ስልክ ይላኩልን፤ በቀጥታ በእርስዎ ስም ይለጠፋል!' 
                  : 'Send vehicle photos, model, asking price, and your seller name & phone. Your car will display your direct contact!'}
              </li>
            </ol>
          </div>

          {/* Admin shortcut */}
          <div className="pt-2 text-center border-t border-blue-900/60">
            <p className="text-[11px] text-slate-400">
              {lang === 'am' ? 'አስተዳዳሪ ነዎት?' : 'Are you a Charte Cars Administrator?'}{' '}
              {onOpenAdminLogin && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAdminLogin();
                  }}
                  className="text-blue-400 hover:text-white font-bold underline ml-1"
                >
                  {lang === 'am' ? 'አስተዳዳሪ ግባ (Login)' : 'Log in to Admin to list directly'}
                </button>
              )}
            </p>
          </div>

        </div>
      </div>
    );
  }

  // ADMIN VIEW: Full form with free-text typing for city worldwide, brand, and seller contact info
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1200;
          let { width, height } = img;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round(height * (maxDim / width));
              width = maxDim;
            } else {
              width = Math.round(width * (maxDim / height));
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.8));
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const fileList: File[] = Array.from(e.target.files);
    const files = fileList.slice(0, 15 - photos.length);
    if (files.length === 0) return;

    setIsCompressing(true);
    const newPhotos: string[] = [];
    for (const f of files) {
      try {
        const base64 = await compressImage(f);
        newPhotos.push(base64);
      } catch (err) {
        console.error('Failed to compress photo', err);
      }
    }
    setPhotos((prev) => [...prev, ...newPhotos].slice(0, 15));
    setIsCompressing(false);
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim()) {
      setFormError('Please enter a vehicle title');
      return;
    }
    if (!make.trim()) {
      setFormError('Please type the vehicle brand / make');
      return;
    }
    if (!price || Number(price) <= 0) {
      setFormError('Please enter a valid price');
      return;
    }
    if (!city.trim()) {
      setFormError('Please type the vehicle city worldwide');
      return;
    }
    if (!sellerName.trim()) {
      setFormError('Please type the seller / car owner name (e.g. Tady)');
      return;
    }

    const finalPhotos = photos.length > 0 
      ? photos 
      : [
          'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
        ];

    onAddCar({
      title: title.trim(),
      titleAm: titleAm.trim() || undefined,
      make: make.trim(),
      model: model.trim() || 'Standard',
      year: Number(year) || 2024,
      price: Number(price),
      mileage: Number(mileage) || 0,
      transmission,
      fuelType,
      bodyType: bodyType.trim() || 'Sedan',
      color: color.trim() || 'White',
      condition,
      plateCode,
      city: city.trim(),
      neighborhood: neighborhood.trim() || 'Central',
      description: description.trim() || `Verified ${make.trim()} ${model.trim()} for ${type}.`,
      photos: finalPhotos,
      images: [finalPhotos[0]],
      type,
      rentPeriod: type === 'rent' ? rentPeriod : undefined,
      status: 'active',
      sellerType: 'owner',
      sellerContact: {
        name: sellerName.trim(),
        phone: sellerPhone.trim() || undefined,
        whatsapp: sellerWhatsApp.trim() || sellerPhone.trim() || undefined,
        address: sellerAddress.trim() || undefined,
        notes: sellerNotes.trim() || undefined
      }
    });

    setSuccessToast(true);
    setTimeout(() => {
      setSuccessToast(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-3xl bg-[#091738] text-white rounded-3xl shadow-2xl border border-blue-700/60 overflow-hidden z-10 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-blue-900 bg-[#06122C]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/30 text-blue-400 border border-blue-500/40">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Admin Vehicle Listing Form</span>
                <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  Worldwide
                </span>
              </h2>
              <p className="text-xs text-blue-200">
                Type brand, model, city worldwide, and the car owner's direct contact info
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
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-5">
          
          {successToast && (
            <div className="bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs p-3 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Vehicle published directly with seller contact!</span>
            </div>
          )}

          {formError && (
            <div className="bg-red-950/80 border border-red-500 text-red-200 text-xs p-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Type: Sale / Rent */}
          <div className="grid grid-cols-2 gap-3 bg-[#040E24] p-2 rounded-2xl border border-blue-950">
            <button
              type="button"
              onClick={() => setType('sale')}
              className={`py-2 rounded-xl text-xs font-bold transition ${
                type === 'sale' ? 'bg-[#0037A3] text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              For Sale
            </button>
            <button
              type="button"
              onClick={() => setType('rent')}
              className={`py-2 rounded-xl text-xs font-bold transition ${
                type === 'rent' ? 'bg-amber-500 text-slate-950 font-black shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              For Rent
            </button>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Vehicle Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 2024 Toyota Land Cruiser Prado TXL"
              className="w-full bg-[#05112B] border border-blue-900 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-400"
            />
          </div>

          {/* REQUIREMENT 5: Free-text input for Brand (Make), Model, Body Style */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Brand / Make (Type yourself) *
              </label>
              <input
                type="text"
                required
                value={make}
                onChange={(e) => setMake(e.target.value)}
                placeholder="e.g. Toyota, Mercedes, BYD, Tesla..."
                className="w-full bg-[#05112B] border border-blue-900 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Model (Type yourself)
              </label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. Prado, Hilux, Atto 3, C-Class..."
                className="w-full bg-[#05112B] border border-blue-900 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Model Year
              </label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full bg-[#05112B] border border-blue-900 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Price, Mileage & Body Style */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Price (ETB) *
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 6400000"
                className="w-full bg-[#05112B] border border-blue-900 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Mileage (km)
              </label>
              <input
                type="number"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                placeholder="e.g. 15000"
                className="w-full bg-[#05112B] border border-blue-900 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Body Style (Type yourself)
              </label>
              <input
                type="text"
                value={bodyType}
                onChange={(e) => setBodyType(e.target.value)}
                placeholder="e.g. SUV, Sedan, Pickup, Crossover..."
                className="w-full bg-[#05112B] border border-blue-900 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          {/* REQUIREMENT 5: Free-text Worldwide City and Neighborhood */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span>City (Worldwide — Type any city) *</span>
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Addis Ababa, Dubai, Nairobi, London, Hawassa..."
                className="w-full bg-[#05112B] border border-blue-900 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Neighborhood / Area
              </label>
              <input
                type="text"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                placeholder="e.g. Bole Medhanialem / Westlands / Downtown"
                className="w-full bg-[#05112B] border border-blue-900 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>

          {/* REQUIREMENT 4: SELLER CONTACT INFO SECTION (e.g. TADY) */}
          <div className="bg-[#050E22] border-2 border-emerald-500/50 p-4 sm:p-5 rounded-2xl space-y-3.5 shadow-xl">
            <div className="flex items-center justify-between border-b border-blue-900/60 pb-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-black text-white uppercase tracking-wider">
                  Car Owner / Seller Contact Info (Shown on Listing)
                </h4>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                Displayed Directly
              </span>
            </div>

            <p className="text-[11px] text-blue-200">
              💡 <strong>Direct Seller Policy:</strong> Enter the real car owner's name and contact here (e.g. if the seller is <strong>Tady</strong>, enter Tady's name and phone number). <strong>Only Tady's contact info will be shown on the car listing, not the admin's!</strong>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-200 uppercase mb-1">
                  Seller / Car Owner Name *
                </label>
                <input
                  type="text"
                  required
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  placeholder="e.g. Tady / Dawit / Abebe"
                  className="w-full bg-[#071638] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 uppercase mb-1">
                  Seller Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={sellerPhone}
                  onChange={(e) => setSellerPhone(e.target.value)}
                  placeholder="e.g. +251 91 145 6789 or 0911..."
                  className="w-full bg-[#071638] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Seller WhatsApp Number (if different)
                </label>
                <input
                  type="tel"
                  value={sellerWhatsApp}
                  onChange={(e) => setSellerWhatsApp(e.target.value)}
                  placeholder="e.g. +251 91 145 6789"
                  className="w-full bg-[#071638] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Seller Address / Location
                </label>
                <input
                  type="text"
                  value={sellerAddress}
                  onChange={(e) => setSellerAddress(e.target.value)}
                  placeholder="e.g. Bole Medhanialem / Hawassa Lake View"
                  className="w-full bg-[#071638] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>
          </div>

          {/* Photos Upload */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Vehicle Photos ({photos.length}/15)
            </label>

            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-blue-800 hover:border-blue-500 bg-[#040E24] rounded-2xl p-4 text-center cursor-pointer transition"
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <Upload className="w-6 h-6 text-blue-400 mx-auto mb-1" />
              <p className="text-xs text-slate-300">
                {isCompressing ? 'Processing photos...' : 'Click to select up to 15 photos of the vehicle'}
              </p>
            </div>

            {photos.length > 0 && (
              <div className="grid grid-cols-5 gap-2 mt-3">
                {photos.map((p, i) => (
                  <div key={i} className="relative group rounded-xl overflow-hidden h-16 border border-slate-700">
                    <img src={p} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(i)}
                      className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide complete vehicle specifications, condition, options..."
              className="w-full bg-[#05112B] border border-blue-900 rounded-xl p-3 text-xs text-white focus:outline-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#0051E8] hover:bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow-lg transition text-sm cursor-pointer"
          >
            Publish Vehicle Directly (with Seller's Info)
          </button>

        </form>

      </div>
    </div>
  );
};
