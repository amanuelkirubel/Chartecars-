import { CarListing } from '../types';

export const POPULAR_CAR_MAKES = [
  'Toyota',
  'Hyundai',
  'Mercedes-Benz',
  'Suzuki',
  'BYD',
  'Tesla',
  'Kia',
  'Nissan',
  'BMW',
  'Land Rover',
  'Ford',
  'Volkswagen'
];

export const CAR_BODY_TYPES = [
  { id: 'SUV', label: 'SUV', icon: '🚙' },
  { id: 'Sedan', label: 'Sedan', icon: '🚗' },
  { id: 'Crossover', label: 'Crossover', icon: '🚘' },
  { id: 'Pickup', label: 'Pickup Truck', icon: '🛻' },
  { id: 'Hatchback', label: 'Hatchback', icon: '🏎️' },
  { id: 'Van', label: 'Van / Minibus', icon: '🚐' }
];

export const ETHIOPIAN_PLATE_CODES = [
  { id: 'code_2', label: 'Code 2 (Private)' },
  { id: 'code_3', label: 'Code 3 (Commercial)' },
  { id: 'code_1', label: 'Code 1 (Government)' },
  { id: 'code_4', label: 'Code 4 (NGO / UN)' },
  { id: 'duty_free', label: 'Duty Free / Worldwide Plate' }
];

export const INITIAL_CARS: CarListing[] = [
  {
    id: 'cc-1',
    listingCode: 1,
    title: '2024 BYD Atto 3 Extended Range (Electric EV)',
    titleAm: '2024 ቢዋይዲ አቶ 3 ኤሌክትሪክ (EV)',
    make: 'BYD',
    model: 'Atto 3',
    year: 2024,
    price: 6400000,
    mileage: 450,
    transmission: 'automatic',
    fuelType: 'electric',
    bodyType: 'Crossover',
    color: 'Skiing White',
    condition: 'brand_new',
    plateCode: 'code_2',
    city: 'Addis Ababa',
    neighborhood: 'Bole Medhanialem',
    description: 'Pristine 2024 BYD Atto 3 Extended Range EV with 480km single charge capacity. Panoramic glass roof, rotatable 15.6-inch touchscreen, 360-degree cameras, Blade Battery technology.',
    descriptionAm: 'እጅግ ንጹህ 2024 ቢዋይዲ አቶ 3 ኤሌክትሪክ መኪና። በአንድ ቻርጅ 480 ኪ.ሜ የሚጓዝ፣ ፓኖራሚክ ጣሪያ፣ 360 ካሜራ ያለው።',
    photos: [
      'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80'
    ],
    images: [
      'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1200&q=80'
    ],
    features: ['Panoramic Sunroof', '360 Camera', 'Wireless Apple CarPlay', 'Heated Seats', 'Blade Battery'],
    engineCapacity: '150kW Motor (60.48 kWh Battery)',
    type: 'sale',
    status: 'active',
    createdAt: '2026-09-15T10:00:00Z',
    views: 124,
    sellerType: 'owner',
    sellerContact: {
      name: 'Tady',
      phone: '+251911456789',
      whatsapp: '+251911456789',
      city: 'Addis Ababa',
      address: 'Bole Medhanialem, Addis Ababa',
      notes: 'Direct owner. Available for physical viewing anytime.'
    }
  },
  {
    id: 'cc-2',
    listingCode: 2,
    title: '2023 Toyota Land Cruiser Prado TXL 2.8L Diesel',
    titleAm: '2023 ቶዮታ ላንድ ክሩዘር ፕራዶ TXL',
    make: 'Toyota',
    model: 'Land Cruiser Prado',
    year: 2023,
    price: 18500000,
    mileage: 18400,
    transmission: 'automatic',
    fuelType: 'diesel',
    bodyType: 'SUV',
    color: 'Pearl White',
    condition: 'like_new',
    plateCode: 'code_2',
    city: 'Dubai',
    neighborhood: 'Al Quoz / Downtown',
    description: 'Immaculate 2023 Toyota Land Cruiser Prado TXL. Full beige leather interior, cool box, 4WD high and low range, 7 seats, push start, sunroof, pristine suspension. Urgent listing.',
    descriptionAm: '2023 ቶዮታ ፕራዶ TXL በከፍተኛ ጥንቃቄ የተያዘ፣ የቆዳ ወንበር፣ 4WD፣ 7 ሰው የሚይዝ። አስቸኳይ ሽያጭ።',
    photos: [
      'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80'
    ],
    images: [
      'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=1200&q=80'
    ],
    features: ['7-Seater', 'Cool Box', '4x4 Dual Range', 'Leather Interior', 'Reverse Camera'],
    engineCapacity: '2.8L 1GD-FTV Turbo Diesel',
    type: 'sale',
    status: 'urgent',
    createdAt: '2026-09-20T12:00:00Z',
    views: 295,
    sellerType: 'owner',
    sellerContact: {
      name: 'Dawit K.',
      phone: '+971501234567',
      whatsapp: '+971501234567',
      city: 'Dubai',
      address: 'Downtown Dubai, UAE',
      notes: 'Urgent sale, negotiable for cash buyer'
    }
  },
  {
    id: 'cc-3',
    listingCode: 3,
    title: '2024 Suzuki Dzire GLX AMT Automatic',
    titleAm: '2024 ሱዙኪ ዲዛየር GLX ኦቶማቲክ',
    make: 'Suzuki',
    model: 'Dzire',
    year: 2024,
    price: 3850000,
    mileage: 6200,
    transmission: 'automatic',
    fuelType: 'petrol',
    bodyType: 'Sedan',
    color: 'Magma Grey Metallic',
    condition: 'like_new',
    plateCode: 'code_2',
    city: 'Nairobi',
    neighborhood: 'Westlands',
    description: 'Fuel economy king: 2024 Suzuki Dzire GLX top option. Push button start, touch screen multimedia, automatic climate control, alloy wheels. Ideal for daily city commute.',
    descriptionAm: '2024 ሱዙኪ ዲዛየር ከፍተኛ አማራጭ (GLX)፣ ነዳጅ ቆጣቢ፣ ንጹህ ኦቶማቲክ።',
    photos: [
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
    ],
    images: [
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80'
    ],
    features: ['Keyless Entry', 'Push Start', 'Alloy Wheels', 'Touchscreen Infotainment'],
    engineCapacity: '1.2L DualJet Petrol',
    type: 'sale',
    status: 'active',
    createdAt: '2026-09-22T08:30:00Z',
    views: 180,
    sellerType: 'owner',
    sellerContact: {
      name: 'Selamawit T.',
      phone: '+254712345678',
      whatsapp: '+254712345678',
      city: 'Nairobi',
      address: 'Westlands, Nairobi, Kenya',
    }
  },
  {
    id: 'cc-4',
    listingCode: 4,
    title: '2024 Hyundai Tucson 1.6T AWD (For Rent)',
    titleAm: '2024 ሂዩንዳይ ቱክሰን 1.6T (ለኪራይ)',
    make: 'Hyundai',
    model: 'Tucson',
    year: 2024,
    price: 180000,
    mileage: 11000,
    transmission: 'automatic',
    fuelType: 'petrol',
    bodyType: 'SUV',
    color: 'Amazon Gray Pearl',
    condition: 'like_new',
    plateCode: 'code_3',
    city: 'Addis Ababa',
    neighborhood: 'Kazanchis',
    description: 'Available for daily or monthly corporate & personal rental. Luxury SUV with chauffeur or self-drive option for qualified clients.',
    descriptionAm: 'ለወርሃዊ ወይም የቀን ኪራይ የተዘጋጀ ዘመናዊ ሂዩንዳይ ቱክሰን።',
    photos: [
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80'
    ],
    images: [
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=80'
    ],
    features: ['AWD', 'Panoramic Sunroof', 'Lane Assist', 'Wireless Charging'],
    engineCapacity: '1.6L Turbo Gasoline',
    type: 'rent',
    rentPeriod: 'month',
    status: 'active',
    createdAt: '2026-09-25T14:00:00Z',
    views: 210,
    sellerType: 'owner',
    sellerContact: {
      name: 'Yonas M.',
      phone: '+251922334455',
      whatsapp: '+251922334455',
      city: 'Addis Ababa',
      address: 'Kazanchis, Addis Ababa',
    }
  },
  {
    id: 'cc-5',
    listingCode: 5,
    title: '2023 Toyota Hilux Revo Rocco Double Cab 4x4',
    titleAm: '2023 ቶዮታ ሃይሉክስ ሮኮ ደብል ካብ 4x4',
    make: 'Toyota',
    model: 'Hilux Revo Rocco',
    year: 2023,
    price: 13800000,
    mileage: 26000,
    transmission: 'automatic',
    fuelType: 'diesel',
    bodyType: 'Pickup',
    color: 'Desert Khaki',
    condition: 'like_new',
    plateCode: 'code_3',
    city: 'Hawassa',
    neighborhood: 'Piazza / Lake View',
    description: 'Full option Hilux Rocco. Sold and officially delivered to owner in Hawassa.',
    descriptionAm: 'ቶዮታ ሃይሉክስ ሮኮ በሃዋሳ ተሸጧል።',
    photos: [
      'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1200&q=80'
    ],
    images: [
      'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=1200&q=80'
    ],
    features: ['Rocco Styling Bar', '4x4 Differential Lock', 'Black Leather Seats'],
    engineCapacity: '2.8L D-4D Turbo Diesel',
    type: 'sale',
    status: 'sold',
    createdAt: '2026-09-01T09:00:00Z',
    views: 520,
    sellerType: 'owner',
    sellerContact: {
      name: 'Abinet T.',
      city: 'Hawassa',
      address: 'Hawassa Lake View',
    }
  },
  {
    id: 'cc-6',
    listingCode: 6,
    title: '2022 Mercedes-Benz C200 AMG Line (W206)',
    titleAm: '2022 መርሴዲስ ቤንዝ C200 AMG ላይን',
    make: 'Mercedes-Benz',
    model: 'C-Class',
    year: 2022,
    price: 15500000,
    mileage: 19500,
    transmission: 'automatic',
    fuelType: 'petrol',
    bodyType: 'Sedan',
    color: 'Obsidian Black Metallic',
    condition: 'like_new',
    plateCode: 'code_2',
    city: 'London',
    neighborhood: 'Mayfair',
    description: 'Executive sedan: 2022 Mercedes-Benz C200 AMG Line with mild-hybrid EQ Boost, MBUX portrait screen, ambient lighting with 64 colors, Burmester audio. Currently rented out on corporate lease.',
    descriptionAm: 'መርሴዲስ C200 AMG ላይን፣ በአሁኑ ሰዓት ተከራይቷል።',
    photos: [
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=80'
    ],
    images: [
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80'
    ],
    features: ['AMG Line Package', 'Burmester Sound', '64-Color Ambient Light', 'MBUX Touchscreen'],
    engineCapacity: '1.5L Turbo + 48V Mild Hybrid',
    type: 'rent',
    status: 'rented',
    createdAt: '2026-09-28T11:00:00Z',
    views: 310,
    sellerType: 'owner',
    sellerContact: {
      name: 'Henok G.',
      city: 'London',
      address: 'London, UK',
    }
  }
];
