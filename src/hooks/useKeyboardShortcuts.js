import { useEffect, useCallback } from 'react';

/**
 * Custom hook for keyboard shortcuts
 * Enables power users to navigate faster
 * 
 * @param {Object} shortcuts - Object mapping keys to callbacks
 * @param {boolean} enabled - Whether shortcuts are enabled
 * 
 * @example
 * useKeyboardShortcuts({
 *   'ctrl+k': () => openSearch(),
 *   'n': () => createNew(),
 *   'esc': () => closeModal()
 * });
 */
const useKeyboardShortcuts = (shortcuts, enabled = true) => {
  const handleKeyDown = useCallback((event) => {
    if (!enabled) return;

    // Don't trigger if user is typing in an input
    const activeElement = document.activeElement;
    const isInput = activeElement?.tagName === 'INPUT' || 
                    activeElement?.tagName === 'TEXTAREA' ||
                    activeElement?.isContentEditable;

    // Build key combination string
    const keys = [];
    if (event.ctrlKey || event.metaKey) keys.push('ctrl');
    if (event.shiftKey) keys.push('shift');
    if (event.altKey) keys.push('alt');
    
    // Add the actual key (lowercase)
    const key = event.key.toLowerCase();
    if (!['control', 'shift', 'alt', 'meta'].includes(key)) {
      keys.push(key);
    }

    const combination = keys.join('+');

    // Check if combination matches any shortcut
    Object.entries(shortcuts).forEach(([shortcut, callback]) => {
      const normalizedShortcut = shortcut.toLowerCase().replace(/\s/g, '');
      
      if (combination === normalizedShortcut) {
        // For modifier-only shortcuts, always execute
        // For letter shortcuts, skip if typing in input (except Escape)
        if (keys.length > 1 || key === 'escape' || !isInput) {
          event.preventDefault();
          callback(event);
        }
      }
    });
  }, [shortcuts, enabled]);

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, enabled]);
};

/**
 * Hook for global app shortcuts
 * Provides common navigation shortcuts
 */
export const useGlobalShortcuts = (navigate, options = {}) => {
  const {
    onSearch,
    onCreate,
    onSettings,
    enabled = true
  } = options;

  useKeyboardShortcuts({
    // Navigation
    'ctrl+shift+d': () => navigate('/dashboard'),
    'ctrl+shift+u': () => navigate('/urls'),
    'ctrl+shift+a': () => navigate('/analytics'),
    'ctrl+shift+s': () => navigate('/settings'),
    
    // Actions
    'ctrl+k': onSearch,
    'n': onCreate,
    'ctrl+,': onSettings,
    
    // Common
    'esc': () => {
      // Close any open modals/dropdowns
      const event = new CustomEvent('close-all');
      window.dispatchEvent(event);
    }
  }, enabled);
};

export default useKeyboardShortcuts;

