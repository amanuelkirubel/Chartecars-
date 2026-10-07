import { CarListing, ArchivedCarListing } from '../types';

export const HISTORICAL_ARCHIVE_STORAGE_KEY = 'charte_cars_historical_archive_v1';

export function getArchivedCars(): ArchivedCarListing[] {
  try {
    const raw = localStorage.getItem(HISTORICAL_ARCHIVE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to load historical archive', err);
    return [];
  }
}

export function saveCarToArchive(
  car: CarListing,
  reason: 'marked_sold' | 'marked_rented' | 'admin_archived' | 'historical_record' = 'historical_record'
): void {
  try {
    const archive = getArchivedCars();
    const existingIndex = archive.findIndex((item) => item.id === car.id);

    const archivedRecord: ArchivedCarListing = {
      ...car,
      archivedAt: new Date().toISOString(),
      archivedReason: reason,
      originalAskingPrice: car.price,
      finalRecordedPrice: car.price,
    };

    if (existingIndex >= 0) {
      archive[existingIndex] = {
        ...archive[existingIndex],
        ...archivedRecord,
        finalRecordedPrice: car.price,
        status: car.status,
      };
    } else {
      archive.unshift(archivedRecord);
    }

    localStorage.setItem(HISTORICAL_ARCHIVE_STORAGE_KEY, JSON.stringify(archive));
  } catch (err) {
    console.error('Failed to write to historical archive', err);
  }
}

export function syncActiveCarsToArchive(cars: CarListing[]): void {
  try {
    const archive = getArchivedCars();
    const archiveMap = new Map(archive.map((item) => [item.id, item]));

    for (const car of cars) {
      if (!archiveMap.has(car.id)) {
        archiveMap.set(car.id, {
          ...car,
          archivedAt: new Date().toISOString(),
          archivedReason: car.status === 'sold' ? 'marked_sold' : car.status === 'rented' ? 'marked_rented' : 'historical_record',
          originalAskingPrice: car.price,
          finalRecordedPrice: car.price,
        });
      } else {
        const existing = archiveMap.get(car.id)!;
        archiveMap.set(car.id, {
          ...existing,
          ...car,
          finalRecordedPrice: car.price,
          status: car.status,
        });
      }
    }

    const updatedList = Array.from(archiveMap.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    localStorage.setItem(HISTORICAL_ARCHIVE_STORAGE_KEY, JSON.stringify(updatedList));
  } catch (err) {
    console.error('Failed to sync to historical archive', err);
  }
}

export interface MarketAnalysisMetrics {
  totalCarsTracked: number;
  totalMarketValueETB: number;
  averagePriceETB: number;
  soldCount: number;
  rentedCount: number;
  activeCount: number;
  urgentCount: number;
  makeDistribution: Record<string, number>;
  fuelDistribution: Record<string, number>;
  topMakesByAvgPrice: { make: string; count: number; avgPrice: number }[];
}

export function calculateMarketAnalysis(archive: ArchivedCarListing[]): MarketAnalysisMetrics {
  const totalCarsTracked = archive.length;
  if (totalCarsTracked === 0) {
    return {
      totalCarsTracked: 0,
      totalMarketValueETB: 0,
      averagePriceETB: 0,
      soldCount: 0,
      rentedCount: 0,
      activeCount: 0,
      urgentCount: 0,
      makeDistribution: {},
      fuelDistribution: {},
      topMakesByAvgPrice: [],
    };
  }

  let totalMarketValueETB = 0;
  let soldCount = 0;
  let rentedCount = 0;
  let activeCount = 0;
  let urgentCount = 0;

  const makeDistribution: Record<string, number> = {};
  const makePriceSums: Record<string, { count: number; total: number }> = {};
  const fuelDistribution: Record<string, number> = {};

  for (const car of archive) {
    totalMarketValueETB += car.price || 0;

    if (car.status === 'sold') soldCount++;
    else if (car.status === 'rented') rentedCount++;
    else if (car.status === 'urgent') urgentCount++;
    else activeCount++;

    const make = car.make || 'Other';
    makeDistribution[make] = (makeDistribution[make] || 0) + 1;
    if (!makePriceSums[make]) {
      makePriceSums[make] = { count: 0, total: 0 };
    }
    makePriceSums[make].count += 1;
    makePriceSums[make].total += car.price || 0;

    const fuel = car.fuelType || 'other';
    fuelDistribution[fuel] = (fuelDistribution[fuel] || 0) + 1;
  }

  const averagePriceETB = Math.round(totalMarketValueETB / totalCarsTracked);

  const topMakesByAvgPrice = Object.entries(makePriceSums)
    .map(([make, data]) => ({
      make,
      count: data.count,
      avgPrice: Math.round(data.total / data.count),
    }))
    .sort((a, b) => b.count - a.count);

  return {
    totalCarsTracked,
    totalMarketValueETB,
    averagePriceETB,
    soldCount,
    rentedCount,
    activeCount,
    urgentCount,
    makeDistribution,
    fuelDistribution,
    topMakesByAvgPrice,
  };
}
