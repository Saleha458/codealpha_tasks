function Sidebar({ categories, selectedCategory, setSelectedCategory }) {
  return (
    <div className="glass p-6 rounded-xl w-56 h-fit">
      <h2 className="font-bold mb-4">Filters</h2>

      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => setSelectedCategory(cat)}
          className={`block w-full text-left px-3 py-2 rounded-md mb-2 
          ${selectedCategory === cat ? "bg-black text-white" : ""}`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

export default Sidebar;