import React, { useRef, useEffect, useState, useCallback } from 'react';

/**
 * Virtual scrolling component for large lists
 * Only renders visible items for better performance
 */
const VirtualList = ({
  items = [],
  itemHeight = 60,
  containerHeight = 600,
  renderItem,
  overscan = 3,
  className = '',
}) => {
  const containerRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);

  // Calculate visible range
  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.ceil((scrollTop + containerHeight) / itemHeight);

  // Add overscan for smooth scrolling
  const start = Math.max(0, visibleStart - overscan);
  const end = Math.min(items.length, visibleEnd + overscan);

  const visibleItems = items.slice(start, end);

  // Total height of all items
  const totalHeight = items.length * itemHeight;

  // Offset for positioning visible items
  const offsetY = start * itemHeight;

  // Handle scroll
  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  // Scroll to specific index
  const scrollToIndex = useCallback((index) => {
    if (containerRef.current) {
      containerRef.current.scrollTop = index * itemHeight;
    }
  }, [itemHeight]);

  // Scroll to top
  const scrollToTop = useCallback(() => {
    scrollToIndex(0);
  }, [scrollToIndex]);

  if (items.length === 0) {
    return (
      <div 
        className={`flex items-center justify-center text-neutral-500 ${className}`}
        style={{ height: containerHeight }}
      >
        No items to display
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => {
            const actualIndex = start + index;
            return (
              <div
                key={item.id || actualIndex}
                style={{ height: itemHeight }}
                className="border-b border-neutral-100 last:border-0"
              >
                {renderItem(item, actualIndex)}
              </div>
            );
          })}
        </div>
      </div>

      {/* Scroll to top button */}
      {scrollTop > containerHeight && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 right-6 p-3 bg-[#FFC107] text-white rounded-full shadow-lg hover:bg-[#FFB300] transition-all"
          title="Scroll to top"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default VirtualList;

