// Performance optimization utilities

// Preload critical components
export const preloadComponent = (importFn) => {
  return () => {
    const Component = React.lazy(importFn);
    return Component;
  };
};

// Debounce function for search inputs
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function for scroll events
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Memoization helper
export const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
};

// Intersection Observer for lazy loading
export const createIntersectionObserver = (callback, options = {}) => {
  return new IntersectionObserver(callback, {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  });
};

// Performance monitoring
export const measurePerformance = (name, fn) => {
  return (...args) => {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();
    console.log(`${name} took ${end - start} milliseconds`);
    return result;
  };
}; 