import { useEffect } from 'react';

/**
 * Hook to gracefully coordinate single modal close with browser popstate
 */
export function useModalBackClose(isOpen: boolean, onClose: () => void) {
  useEffect(() => {
    if (!isOpen) return;

    // Push state so back button closes modal
    try {
      window.history.pushState({ modalOpen: true }, '');
    } catch (e) {}

    const handlePopState = () => {
      onClose();
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isOpen, onClose]);
}
