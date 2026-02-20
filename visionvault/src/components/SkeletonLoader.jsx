function SkeletonLoader() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, index) => (
        <div 
          key={index}
          className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg animate-pulse"
        >
          {/* Image Skeleton */}
          <div className="w-full h-48 bg-gray-300 dark:bg-gray-700"></div>
          
          {/* Content Skeleton */}
          <div className="p-4">
            <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2 mb-3"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-5/6"></div>
            
            {/* Tags Skeleton */}
            <div className="flex gap-2 mt-3">
              <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded-full w-16"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded-full w-20"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SkeletonLoader;