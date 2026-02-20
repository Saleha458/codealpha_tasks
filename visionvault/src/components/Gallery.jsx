import { useState } from 'react';
import GalleryItem from './GalleryItem';
import LightboxModal from './LightboxModal';
import { useFavorites } from '../context/FavoritesContext';
import { FaHeart } from 'react-icons/fa';

function Gallery({ images, loading, showFavoritesOnly }) {
  const [selectedImage, setSelectedImage] = useState(null);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="glass rounded-lg aspect-square animate-pulse" />
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-block p-4 glass rounded-xl mb-3">
          {showFavoritesOnly ? (
            <FaHeart className="text-2xl text-pink-400 mx-auto" />
          ) : (
            <span className="text-2xl">🔍</span>
          )}
        </div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {showFavoritesOnly ? 'No favorites yet' : 'No images found'}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {showFavoritesOnly 
            ? 'Click the heart icon on images you love'
            : 'Try a different search term'}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {images.map((image) => (
          <GalleryItem
            key={image.id}
            image={image}
            onClick={setSelectedImage}
          />
        ))}
      </div>

      {selectedImage && (
        <LightboxModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          images={images}
        />
      )}
    </>
  );
}

export default Gallery;