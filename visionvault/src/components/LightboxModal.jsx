import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import FavoriteButton from './FavoriteButton';

function LightboxModal({ image, onClose, images }) {
  const currentIndex = images.findIndex(img => img.id === image.id);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % images.length;
    onClose();
    setTimeout(() => document.querySelector(`[data-id="${images[nextIndex].id}"]`)?.click(), 0);
  };

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    onClose();
    setTimeout(() => document.querySelector(`[data-id="${images[prevIndex].id}"]`)?.click(), 0);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-3 bg-white/20 rounded-full text-white hover:bg-white/30"
      >
        <FaTimes size={24} />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); handlePrev(); }}
        className="absolute left-4 z-50 p-3 bg-white/20 rounded-full text-white hover:bg-white/30"
      >
        <FaChevronLeft size={24} />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); handleNext(); }}
        className="absolute right-4 z-50 p-3 bg-white/20 rounded-full text-white hover:bg-white/30"
      >
        <FaChevronRight size={24} />
      </button>

      <div className="relative max-w-7xl max-h-[90vh] mx-4" onClick={(e) => e.stopPropagation()}>
        <img
          src={image.url}
          alt={image.title}
          className="max-w-full max-h-[80vh] object-contain rounded-lg"
        />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent rounded-b-lg">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{image.title}</h2>
              <div className="flex gap-2">
                {image.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-white/20 rounded-full text-sm text-white">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            <FavoriteButton imageId={image.id} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default LightboxModal;