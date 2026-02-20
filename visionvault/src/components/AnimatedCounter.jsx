import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function AnimatedCounter({ value, duration = 0.5 }) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    let start = displayValue;
    const end = value;
    const increment = end > start ? 1 : -1;
    
    if (start === end) return;

    const stepTime = Math.abs(Math.floor((duration * 1000) / (end - start)));
    
    const timer = setInterval(() => {
      start += increment;
      setDisplayValue(start);
      
      if (start === end) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <motion.span
      key={displayValue}
      initial={{ scale: 1.2, color: '#3B82F6' }}
      animate={{ scale: 1, color: '#000000' }}
      transition={{ duration: 0.2 }}
      className="inline-block"
    >
      {displayValue}
    </motion.span>
  );
}

// Counter with animation for stats display
function StatsCounter({ label, count, icon: Icon }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="flex items-center gap-2 px-4 py-2 
        bg-white dark:bg-gray-800 
        rounded-lg shadow-sm"
    >
      {Icon && <Icon className="text-blue-500" />}
      <span className="text-sm text-gray-600 dark:text-gray-400">{label}:</span>
      <AnimatedCounter value={count} />
    </motion.div>
  );
}

export { AnimatedCounter, StatsCounter };