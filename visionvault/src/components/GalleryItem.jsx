import { useState } from 'react';
import FavoriteButton from './FavoriteButton';

function GalleryItem({ image, onClick }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className="group relative glass rounded-xl overflow-hidden cursor-pointer"
      onClick={() => onClick(image)}
    >
      <div className="aspect-square overflow-hidden">
        <img
          src={imageError ? `https://picsum.photos/400/400?random=${image.id}` : image.thumbnail}
          alt={image.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={() => setImageError(true)}
          loading="lazy"
        />
      </div>
      
      <div className="absolute top-2 right-2 z-10">
        <FavoriteButton imageId={image.id} />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent">
        <h3 className="text-white text-xs font-medium truncate">{image.title}</h3>
        <span className="text-white/60 text-[10px] capitalize">{image.category}</span>
      </div>
    </div>
  );
}

export default GalleryItem;