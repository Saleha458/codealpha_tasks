import { useState } from 'react';
import { FaFilter } from 'react-icons/fa';

function FilterBar({ categories, selectedCategory, onCategoryChange, getCount }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-3 py-1.5 min-w-[70px] justify-between
          text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5"
      >
        <div className="flex items-center gap-1">
          <FaFilter className="text-[10px]" />
          <span className="text-xs">Filter</span>
        </div>
        <span className="text-[8px]">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 z-50 mt-1 w-28 glass rounded-lg overflow-hidden shadow-lg">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  onCategoryChange(cat);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-1.5 text-left text-xs capitalize
                  flex items-center justify-between
                  hover:bg-black/5 dark:hover:bg-white/5
                  ${selectedCategory === cat ? 'bg-black/5 dark:bg-white/5' : ''}`}
              >
                <span>{cat === 'all' ? 'All' : cat}</span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400">
                  {getCount(cat)}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default FilterBar;