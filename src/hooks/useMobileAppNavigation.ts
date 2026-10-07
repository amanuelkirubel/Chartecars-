import { useEffect, useRef, useCallback } from 'react';
import { Language, CarFilterState } from '../types';

export interface MobileNavigationProps {
  // Modal states
  hasActiveModal: boolean;
  closeTopModal: () => void;

  // Filter state
  carFilters: CarFilterState;
  onResetFilters: () => void;

  // Toast / Language
  lang: Language;
  showToast: (msg: string) => void;
}

export function useMobileAppNavigation({
  hasActiveModal,
  closeTopModal,
  carFilters,
  onResetFilters,
  lang,
  showToast,
}: MobileNavigationProps) {
  const lastBackPressRef = useRef<number>(0);
  const isNavigatingBackRef = useRef<boolean>(false);
  const hasModalHistoryPushedRef = useRef<boolean>(false);
  const hasActiveModalRef = useRef<boolean>(hasActiveModal);
  const closeTopModalRef = useRef<() => void>(closeTopModal);
  const carFiltersRef = useRef<CarFilterState>(carFilters);
  const onResetFiltersRef = useRef<() => void>(onResetFilters);
  const langRef = useRef<Language>(lang);
  const showToastRef = useRef<(msg: string) => void>(showToast);

  // Keep refs up to date to avoid stale closures inside popstate
  useEffect(() => {
    hasActiveModalRef.current = hasActiveModal;
  }, [hasActiveModal]);

  useEffect(() => {
    closeTopModalRef.current = closeTopModal;
  }, [closeTopModal]);

  useEffect(() => {
    carFiltersRef.current = carFilters;
  }, [carFilters]);

  useEffect(() => {
    onResetFiltersRef.current = onResetFilters;
  }, [onResetFilters]);

  useEffect(() => {
    langRef.current = lang;
  }, [lang]);

  useEffect(() => {
    showToastRef.current = showToast;
  }, [showToast]);

  // 1. Initialize root history guard so phone back button never closes the website unexpectedly
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      if (!window.history.state || window.history.state.charteApp !== true) {
        window.history.replaceState({ charteApp: true, level: 0, view: 'root' }, '');
        window.history.pushState({ charteApp: true, level: 1, view: 'home' }, '');
      }
    } catch (e) {
      console.warn('History navigation guard init failed', e);
    }
  }, []);

  // 2. Track when a modal opens: push a history state entry
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (hasActiveModal) {
      if (!hasModalHistoryPushedRef.current) {
        hasModalHistoryPushedRef.current = true;
        try {
          window.history.pushState(
            { charteApp: true, level: 2, view: 'modal' },
            ''
          );
        } catch (e) {
          console.warn('Failed to push modal history state', e);
        }
      }
    } else {
      hasModalHistoryPushedRef.current = false;
    }
  }, [hasActiveModal]);

  // 3. Central popstate listener: intercepts phone hardware/gesture back and browser previous button
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePopState = () => {
      // If we are currently handling a programmatic UI back, consume it and return
      if (isNavigatingBackRef.current) {
        isNavigatingBackRef.current = false;
        return;
      }

      // CASE 1: A modal is currently open -> Close the modal smoothly without closing the website
      if (hasActiveModalRef.current) {
        hasModalHistoryPushedRef.current = false;
        closeTopModalRef.current();
        return;
      }

      // CASE 2: No modal is open, but a filter or search is active -> Return to "All" listings
      const filters = carFiltersRef.current;
      const isFiltered =
        filters.type !== 'all' ||
        Boolean(filters.searchQuery?.trim()) ||
        Boolean(filters.city?.trim()) ||
        Boolean(filters.make?.trim()) ||
        Boolean(filters.bodyType?.trim()) ||
        Boolean(filters.minPrice) ||
        Boolean(filters.maxPrice);

      if (isFiltered) {
        onResetFiltersRef.current();
        showToastRef.current(
          langRef.current === 'am'
            ? 'ወደ ሁሉም ዝርዝሮች ተመልሷል (Returned to All Cars)'
            : 'Returned to All Listings'
        );
        // Re-push home state to maintain buffer
        try {
          window.history.pushState({ charteApp: true, level: 1, view: 'home' }, '');
        } catch (e) {}
        return;
      }

      // CASE 3: On clean home page -> Prevent accidental phone back gesture from closing the site
      const now = Date.now();
      const timeSinceLastPress = now - lastBackPressRef.current;

      if (timeSinceLastPress > 2200) {
        // First back press: Warn the user and prevent closure
        lastBackPressRef.current = now;
        showToastRef.current(
          langRef.current === 'am'
            ? 'ለመውጣት ወደ ኋላ እንደገና ይጫኑ (Press back again to exit)'
            : 'Press back again to exit Charte Cars'
        );
        // Restore the guard entry so the website stays open
        try {
          window.history.pushState({ charteApp: true, level: 1, view: 'home' }, '');
        } catch (e) {}
      } else {
        // Second back press within 2.2 seconds: User deliberately intends to exit
        window.history.go(-1);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // 4. Safe UI close function for on-screen buttons (X button, "Back" button, etc.)
  const safeCloseModal = useCallback(() => {
    closeTopModalRef.current();

    if (typeof window !== 'undefined' && hasModalHistoryPushedRef.current) {
      hasModalHistoryPushedRef.current = false;
      isNavigatingBackRef.current = true;
      try {
        window.history.back();
      } catch (e) {
        isNavigatingBackRef.current = false;
      }
    }
  }, []);

  return { safeCloseModal };
}
