import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useFavorites } from '../context/FavoritesContext';

function FavoriteButton({ imageId }) {
  const { favorites, toggleFavorite } = useFavorites();
  const isFavorite = favorites.includes(imageId);

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggleFavorite(imageId);
      }}
      className={`p-2 rounded-full transition-all hover:scale-110
        ${isFavorite ? 'bg-pink-500 text-white' : 'bg-black/50 text-white/70'}`}
    >
      {isFavorite ? <FaHeart /> : <FaRegHeart />}
    </button>
  );
}

export default FavoriteButton;