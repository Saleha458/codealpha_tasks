export default function Navbar({ favCount, showFav, setShowFav }) {
  return (
    <div className="flex justify-between items-center px-8 py-4 bg-white shadow-md">
      <h1 className="text-2xl font-bold text-slate-700">
        VisionVault
      </h1>

      <button
        onClick={() => setShowFav(!showFav)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Favorites ({favCount})
      </button>
    </div>
  );
}