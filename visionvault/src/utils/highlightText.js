/**
 * Highlights search terms in text and returns HTML string
 * @param {string} text - The text to search within
 * @param {string} highlight - The term to highlight
 * @returns {string} HTML string with mark tags
 */
export const highlightText = (text, highlight) => {
  if (!highlight || !text) return text;
  
  try {
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    
    return parts.map((part) => 
      part.toLowerCase() === highlight.toLowerCase() 
        ? `<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">${part}</mark>` 
        : part
    ).join('');
  } catch (error) {
    console.error("Highlight error:", error);
    return text;
  }
};

/**
 * Check if text contains highlight term (for conditional rendering)
 */
export const containsHighlight = (text, highlight) => {
  if (!highlight || !text) return false;
  return text.toLowerCase().includes(highlight.toLowerCase());
};