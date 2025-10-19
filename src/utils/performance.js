/**
 * Performance monitoring utilities
 * Tracks Core Web Vitals and custom metrics
 */

// Core Web Vitals thresholds (in milliseconds)
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },  // Largest Contentful Paint
  FID: { good: 100, poor: 300 },    // First Input Delay
  CLS: { good: 0.1, poor: 0.25 },   // Cumulative Layout Shift
  FCP: { good: 1800, poor: 3000 },  // First Contentful Paint
  TTFB: { good: 800, poor: 1800 },  // Time to First Byte
};

/**
 * Measure and log Core Web Vitals
 */
export const measureWebVitals = (onReport) => {
  if (typeof window === 'undefined' || !window.performance) return;

  // LCP - Largest Contentful Paint
  const observeLCP = () => {
    try {
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        const lcp = lastEntry.renderTime || lastEntry.loadTime;
        
        onReport?.({
          name: 'LCP',
          value: lcp,
          rating: getRating(lcp, THRESHOLDS.LCP),
          entries
        });
      });
      
      observer.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {
      console.warn('LCP observation not supported');
    }
  };

  // FID - First Input Delay
  const observeFID = () => {
    try {
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry) => {
          const fid = entry.processingStart - entry.startTime;
          
          onReport?.({
            name: 'FID',
            value: fid,
            rating: getRating(fid, THRESHOLDS.FID),
            entries: [entry]
          });
        });
      });
      
      observer.observe({ type: 'first-input', buffered: true });
    } catch (e) {
      console.warn('FID observation not supported');
    }
  };

  // CLS - Cumulative Layout Shift
  const observeCLS = () => {
    try {
      let clsValue = 0;
      let clsEntries = [];

      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            clsEntries.push(entry);
          }
        });

        onReport?.({
          name: 'CLS',
          value: clsValue,
          rating: getRating(clsValue, THRESHOLDS.CLS),
          entries: clsEntries
        });
      });
      
      observer.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      console.warn('CLS observation not supported');
    }
  };

  // FCP - First Contentful Paint
  const observeFCP = () => {
    try {
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            onReport?.({
              name: 'FCP',
              value: entry.startTime,
              rating: getRating(entry.startTime, THRESHOLDS.FCP),
              entries: [entry]
            });
          }
        });
      });
      
      observer.observe({ type: 'paint', buffered: true });
    } catch (e) {
      console.warn('FCP observation not supported');
    }
  };

  // TTFB - Time to First Byte
  const measureTTFB = () => {
    try {
      const navigation = performance.getEntriesByType('navigation')[0];
      if (navigation) {
        const ttfb = navigation.responseStart - navigation.requestStart;
        
        onReport?.({
          name: 'TTFB',
          value: ttfb,
          rating: getRating(ttfb, THRESHOLDS.TTFB),
          entries: [navigation]
        });
      }
    } catch (e) {
      console.warn('TTFB measurement not supported');
    }
  };

  // Initialize all observers
  observeLCP();
  observeFID();
  observeCLS();
  observeFCP();
  measureTTFB();
};

/**
 * Get rating based on threshold
 */
const getRating = (value, threshold) => {
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
};

/**
 * Measure component render time
 */
export const measureRender = (componentName, callback) => {
  const start = performance.now();
  const result = callback();
  const end = performance.now();
  const duration = end - start;

  if (duration > 16) { // Longer than 1 frame (60fps)
    console.warn(`⚠️ Slow render: ${componentName} took ${duration.toFixed(2)}ms`);
  }

  return result;
};

/**
 * Measure API call performance
 */
export const measureAPICall = async (apiName, apiCall) => {
  const start = performance.now();
  
  try {
    const result = await apiCall();
    const end = performance.now();
    const duration = end - start;

    if (import.meta.env.DEV) {
      console.log(`📊 API: ${apiName} - ${duration.toFixed(2)}ms`);
    }

    // Log slow API calls
    if (duration > 3000) {
      console.warn(`⚠️ Slow API: ${apiName} took ${duration.toFixed(2)}ms`);
    }

    return result;
  } catch (error) {
    const end = performance.now();
    const duration = end - start;
    console.error(`❌ API Error: ${apiName} failed after ${duration.toFixed(2)}ms`, error);
    throw error;
  }
};

/**
 * Report performance metrics to console (dev mode)
 */
export const reportMetrics = (metric) => {
  if (import.meta.env.DEV) {
    const emoji = metric.rating === 'good' ? '✅' : metric.rating === 'needs-improvement' ? '⚠️' : '❌';
    console.log(`${emoji} ${metric.name}: ${metric.value.toFixed(2)}ms (${metric.rating})`);
  }
};

/**
 * Get current performance metrics
 */
export const getPerformanceMetrics = () => {
  if (typeof window === 'undefined' || !window.performance) return null;

  const navigation = performance.getEntriesByType('navigation')[0];
  const paint = performance.getEntriesByType('paint');

  return {
    // Navigation timing
    domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart,
    loadComplete: navigation?.loadEventEnd - navigation?.loadEventStart,
    
    // Paint timing
    firstPaint: paint.find(p => p.name === 'first-paint')?.startTime,
    firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime,
    
    // Resource timing
    resources: performance.getEntriesByType('resource').length,
    
    // Memory (if available)
    memory: (performance as any).memory ? {
      usedJSHeapSize: ((performance as any).memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
      totalJSHeapSize: ((performance as any).memory.totalJSHeapSize / 1048576).toFixed(2) + ' MB',
    } : null
  };
};

/**
 * Monitor long tasks (tasks > 50ms)
 */
export const monitorLongTasks = (onLongTask) => {
  if (typeof window === 'undefined') return;

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
          onLongTask?.(entry);
          console.warn(`⚠️ Long task detected: ${entry.duration.toFixed(2)}ms`);
        }
      }
    });

    observer.observe({ entryTypes: ['longtask'] });
  } catch (e) {
    console.warn('Long task monitoring not supported');
  }
};

/**
 * Debounce function for performance
 */
export const debounce = (func, wait = 300) => {
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

/**
 * Throttle function for performance
 */
export const throttle = (func, limit = 100) => {
  let inThrottle;
  
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Lazy load image with intersection observer
 */
export const lazyLoadImage = (imgElement, src) => {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          imgElement.src = src;
          observer.unobserve(imgElement);
        }
      });
    });

    observer.observe(imgElement);
  } else {
    // Fallback for browsers without IntersectionObserver
    imgElement.src = src;
  }
};

/**
 * Prefetch route data
 */
export const prefetchRoute = (queryClient, queryKey, queryFn) => {
  return queryClient.prefetchQuery({
    queryKey,
    queryFn,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export default {
  measureWebVitals,
  measureRender,
  measureAPICall,
  reportMetrics,
  getPerformanceMetrics,
  monitorLongTasks,
  debounce,
  throttle,
  lazyLoadImage,
  prefetchRoute
};

