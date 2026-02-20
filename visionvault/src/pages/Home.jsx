import { useState } from "react";
import { images } from "../data/images";
import Navbar from "../components/Navbar";
import ImageCard from "../components/ImageCard";
import SearchBar from "../components/SearchBar";

export default function Home() {
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [showFav, setShowFav] = useState(false);

  const toggleFav = (img) => {
    if (favorites.find((f) => f.id === img.id)) {
      setFavorites(favorites.filter((f) => f.id !== img.id));
    } else {
      setFavorites([...favorites, img]);
    }
  };

  const filteredImages = (showFav ? favorites : images).filter((img) =>
    img.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar
        favCount={favorites.length}
        showFav={showFav}
        setShowFav={setShowFav}
      />

      <SearchBar search={search} setSearch={setSearch} />

      {filteredImages.length === 0 ? (
        <div className="text-center mt-16 text-gray-500 text-lg">
          No favorite images yet. Start adding some ❤️
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-8">
          {filteredImages.map((img) => (
            <ImageCard
              key={img.id}
              image={img}
              toggleFav={toggleFav}
              isFav={favorites.some((f) => f.id === img.id)}
            />
          ))}
        </div>
      )}
    </>
  );
}