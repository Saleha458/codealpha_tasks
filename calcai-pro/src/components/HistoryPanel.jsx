import React from 'react';
import { History, X } from 'lucide-react';

const HistoryPanel = ({ history, onSelect, onClear }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-h-96 overflow-y-auto">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-200">
          <History size={18} />
          History
        </h3>
        {history.length > 0 && (
          <button
            onClick={onClear}
            className="text-gray-500 hover:text-red-500 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>
      
      {history.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-4">No calculations yet</p>
      ) : (
        <div className="space-y-2">
          {history.slice().reverse().map((item, idx) => (
            <div
              key={idx}
              onClick={() => onSelect(item.expression)}
              className="p-2 bg-gray-50 dark:bg-gray-700 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              <div className="text-sm text-gray-600 dark:text-gray-300">{item.expression}</div>
              <div className="text-right font-semibold text-gray-800 dark:text-gray-200">= {item.result}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPanel;