export default function ImageCard({ image, toggleFav, isFav }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:scale-105 transition duration-300">
      <img
        src={image.url}
        alt={image.title}
        className="w-full h-48 object-cover"
      />

      <div className="p-4 flex justify-between items-center">
        <h2 className="font-semibold text-slate-700">
          {image.title}
        </h2>

        <button
          onClick={() => toggleFav(image)}
          className={`px-3 py-1 rounded-lg text-sm ${
            isFav ? "bg-red-500 text-white" : "bg-gray-200"
          }`}
        >
          {isFav ? "♥" : "♡"}
        </button>
      </div>
    </div>
  );
}