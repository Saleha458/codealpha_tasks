import { useEffect } from 'react';

/**
 * Custom hook for keyboard navigation in the lightbox
 */
const useKeyboardNavigation = ({
  isOpen,
  onClose,
  onNext,
  onPrev,
  currentIndex = 0,
  totalImages = 0
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      // Prevent default behavior for arrow keys and escape
      if (['Escape', 'ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) {
        e.preventDefault();
      }

      switch(e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowRight':
          if (onNext && currentIndex < totalImages - 1) {
            onNext();
          }
          break;
        case 'ArrowLeft':
          if (onPrev && currentIndex > 0) {
            onPrev();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, onNext, onPrev, currentIndex, totalImages]);

  return null;
};

export default useKeyboardNavigation;