/**
 * Filter images based on multiple criteria
 */
export const filterImages = (images, filters) => {
  const { category, searchQuery, tags } = filters;
  
  return images.filter(image => {
    // Filter by category
    if (category && category !== 'all' && image.category !== category) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        image.title.toLowerCase().includes(query) ||
        image.category.toLowerCase().includes(query) ||
        image.tags.some(tag => tag.toLowerCase().includes(query)) ||
        (image.aiCaption && image.aiCaption.toLowerCase().includes(query));
      
      if (!matchesSearch) return false;
    }
    
    // Filter by tags
    if (tags && tags.length > 0) {
      const hasAllTags = tags.every(tag => 
        image.tags.includes(tag.toLowerCase())
      );
      if (!hasAllTags) return false;
    }
    
    return true;
  });
};

/**
 * Get unique categories from images
 */
export const getCategories = (images) => {
  const categories = ['all', ...new Set(images.map(img => img.category))];
  return categories;
};

/**
 * Get all unique tags from images
 */
export const getAllTags = (images) => {
  const tagsSet = new Set();
  images.forEach(img => {
    img.tags.forEach(tag => tagsSet.add(tag));
  });
  return Array.from(tagsSet);
};

/**
 * Sort images by various criteria
 */
export const sortImages = (images, sortBy = 'default') => {
  const sorted = [...images];
  
  switch(sortBy) {
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'category':
      return sorted.sort((a, b) => a.category.localeCompare(b.category));
    case 'recent':
      // Assuming newer IDs are more recent
      return sorted.sort((a, b) => b.id - a.id);
    default:
      return sorted;
  }
};