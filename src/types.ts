export type Language = 'en' | 'am';
export type Currency = 'ETB' | 'USD';
export type ListingType = 'sale' | 'rent';
export type ListingStatus = 'active' | 'urgent' | 'sold' | 'rented' | 'pending';
export type MarketplaceMode = 'cars' | 'homes';

export interface SellerContact {
  name: string;
  phone?: string;
  altPhone?: string;
  telegram?: string;
  whatsapp?: string;
  address?: string;
  city?: string;
  preferredContact?: 'phone' | 'whatsapp' | 'telegram' | 'any';
  notes?: string;
}

export interface PaymentDetails {
  method?: string;
  transactionRef?: string;
  paidAt?: string;
  receiptScreenshot?: string;
  receiptFileType?: 'image' | 'pdf';
  receiptFileName?: string;
}

export interface CarListing {
  id: string;
  listingCode?: number; // e.g. C1, C2, C10
  title: string;
  titleAm?: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  transmission: 'automatic' | 'manual';
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  bodyType: string;
  color: string;
  condition: 'brand_new' | 'like_new' | 'used' | 'duty_free';
  plateCode?: string;
  city: string;
  neighborhood: string;
  description: string;
  descriptionAm?: string;
  photos: string[];
  images: string[];
  features?: string[];
  engineCapacity?: string;
  type: ListingType;
  rentPeriod?: 'day' | 'month';
  status: ListingStatus;
  createdAt: string;
  views: number;
  sellerType?: 'owner' | 'dealer';
  sellerContact?: SellerContact;
  paymentDetails?: PaymentDetails;
}

export interface CarFilterState {
  searchQuery: string;
  make: string;
  bodyType: string;
  transmission: string;
  fuelType: string;
  condition: string;
  plateCode: string;
  minPrice: string;
  maxPrice: string;
  minYear: string;
  maxYear: string;
  city: string;
  type: ListingType | 'all' | 'sold' | 'rented' | 'urgent';
}

export interface ArchivedCarListing extends CarListing {
  archivedAt: string;
  archivedReason: 'marked_sold' | 'marked_rented' | 'admin_archived' | 'historical_record';
  originalAskingPrice: number;
  finalRecordedPrice: number;
  daysOnMarket?: number;
}
