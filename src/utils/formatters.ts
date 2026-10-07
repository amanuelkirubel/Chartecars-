import { Currency, Language, ListingType } from '../types';
import { USD_TO_ETB_RATE } from '../data/mockListings';

export function formatPrice(amount: number, currency: Currency = 'ETB'): string {
  if (currency === 'USD') {
    const usd = Math.round(amount / USD_TO_ETB_RATE);
    return `$${usd.toLocaleString('en-US')} USD`;
  }
  return `${amount.toLocaleString()} ETB`;
}

export function formatCarPrice(
  amount: number,
  type: ListingType,
  currency: Currency = 'ETB',
  lang: Language = 'en'
): string {
  const formatted = formatPrice(amount, currency);
  if (type === 'rent') {
    return lang === 'am' ? `${formatted} / በወር` : `${formatted} / mo`;
  }
  return formatted;
}

export function createTelegramInquiryLink(
  carTitle: string,
  price: number,
  handle: string = 'chartecar'
): string {
  const cleanHandle = handle.replace('@', '');
  const msg = encodeURIComponent(
    `Hello Charte Cars! I am interested in inquiring about this vehicle: ${carTitle} (${price.toLocaleString()} ETB). Please share more details.`
  );
  return `https://t.me/${cleanHandle}?text=${msg}`;
}

export function createWhatsAppInquiryLink(
  carTitle: string,
  price: number,
  refId: string = ''
): string {
  const msg = encodeURIComponent(
    `Hello Charte Cars! I am interested in viewing / purchasing this car on Charte Cars:\n🚗 ${carTitle}\n💰 Price: ${price.toLocaleString()} ETB\n🆔 Ref: #${refId}`
  );
  return `https://wa.me/?text=${msg}`;
}

export function sanitizeListingText(text: string): string {
  return text.trim();
}
