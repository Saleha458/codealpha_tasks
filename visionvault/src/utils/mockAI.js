// Mock AI functions to simulate smart gallery features

/**
 * Generates an AI caption for an image based on its title and tags
 */
export const generateAICaption = (image) => {
  const captions = [
    `AI Analysis: Beautiful ${image.title.toLowerCase()} captured in stunning detail`,
    `Smart detection: ${image.tags.slice(0, 3).join(", ")} identified in this image`,
    `AI vision: This appears to be a ${image.category} photograph with emphasis on ${image.tags[0]}`,
    `Scene understanding: ${image.aiCaption || "Natural landscape with artistic composition"}`,
    `AI description: A captivating ${image.category} image featuring ${image.tags.join(", ")}`
  ];
  
  return captions[Math.floor(Math.random() * captions.length)];
};

/**
 * Simulates AI-powered image search
 */
export const aiImageSearch = (query, images) => {
  const queryLower = query.toLowerCase();
  return images.filter(img => 
    img.title.toLowerCase().includes(queryLower) ||
    img.category.toLowerCase().includes(queryLower) ||
    img.tags.some(tag => tag.toLowerCase().includes(queryLower)) ||
    (img.aiCaption && img.aiCaption.toLowerCase().includes(queryLower))
  );
};

/**
 * Generates smart category suggestions based on viewing history
 */
export const suggestCategories = (favorites, allImages) => {
  if (favorites.length === 0) return [];
  
  const favoriteCategories = favorites.map(id => {
    const img = allImages.find(img => img.id === id);
    return img?.category;
  }).filter(Boolean);
  
  const categoryCount = {};
  favoriteCategories.forEach(cat => {
    categoryCount[cat] = (categoryCount[cat] || 0) + 1;
  });
  
  return Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .map(([cat]) => cat)
    .slice(0, 3);
};

/**
 * AI-powered image enhancement suggestions
 */
export const getEnhancementSuggestions = (image) => {
  const suggestions = [
    "Try increasing contrast for better depth",
    "This image would look great in black and white",
    "Consider cropping to focus on the main subject",
    "Warm up the colors for a more inviting feel",
    "Add vignette effect to draw attention to center"
  ];
  
  return suggestions[Math.floor(Math.random() * suggestions.length)];
};