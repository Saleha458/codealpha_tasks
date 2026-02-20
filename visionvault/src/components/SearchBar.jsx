export default function SearchBar({ search, setSearch }) {
  return (
    <div className="flex justify-center mt-6">
      <input
        type="text"
        placeholder="Search images..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-96 px-4 py-2 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}