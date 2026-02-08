import { useEffect, useCallback, useState } from 'react';

type KeyHandler = (event: KeyboardEvent) => void;

interface UseKeyboardNavigationOptions {
  onEscape?: KeyHandler;
  onEnter?: KeyHandler;
  onArrowUp?: KeyHandler;
  onArrowDown?: KeyHandler;
  onArrowLeft?: KeyHandler;
  onArrowRight?: KeyHandler;
  onTab?: KeyHandler;
  onShiftTab?: KeyHandler;
  onSpace?: KeyHandler;
  onKey?: (key: string) => void;
  enabled?: boolean;
  preventDefault?: boolean;
}

export const useKeyboardNavigation = ({
  onEscape,
  onEnter,
  onArrowUp,
  onArrowDown,
  onArrowLeft,
  onArrowRight,
  onTab,
  onShiftTab,
  onSpace,
  onKey,
  enabled = true,
  preventDefault = true,
}: UseKeyboardNavigationOptions = {}) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    const { key, shiftKey } = event;

    switch (key) {
      case 'Escape':
        if (onEscape) {
          if (preventDefault) event.preventDefault();
          onEscape(event);
        }
        break;

      case 'Enter':
        if (onEnter) {
          if (preventDefault) event.preventDefault();
          onEnter(event);
        }
        break;

      case 'ArrowUp':
        if (onArrowUp) {
          if (preventDefault) event.preventDefault();
          onArrowUp(event);
        }
        break;

      case 'ArrowDown':
        if (onArrowDown) {
          if (preventDefault) event.preventDefault();
          onArrowDown(event);
        }
        break;

      case 'ArrowLeft':
        if (onArrowLeft) {
          if (preventDefault) event.preventDefault();
          onArrowLeft(event);
        }
        break;

      case 'ArrowRight':
        if (onArrowRight) {
          if (preventDefault) event.preventDefault();
          onArrowRight(event);
        }
        break;

      case 'Tab':
        if (shiftKey && onShiftTab) {
          if (preventDefault) event.preventDefault();
          onShiftTab(event);
        } else if (!shiftKey && onTab) {
          if (preventDefault) event.preventDefault();
          onTab(event);
        }
        break;

      case ' ':
        if (onSpace) {
          if (preventDefault) event.preventDefault();
          onSpace(event);
        }
        break;

      default:
        if (onKey && key.length === 1) {
          if (preventDefault) event.preventDefault();
          onKey(key);
        }
        break;
    }
  }, [
    enabled,
    preventDefault,
    onEscape,
    onEnter,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onTab,
    onShiftTab,
    onSpace,
    onKey,
  ]);

  useEffect(() => {
    if (enabled) {
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [enabled, handleKeyDown]);
};

// Helper hook for navigating through lists with arrow keys
export const useListNavigation = <T>(
  items: T[],
  onSelect: (item: T, index: number) => void,
  initialIndex = -1
) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(initialIndex);

  useKeyboardNavigation({
    onArrowUp: () => {
      if (items.length > 0) {
        const newIndex = selectedIndex <= 0 ? items.length - 1 : selectedIndex - 1;
        setSelectedIndex(newIndex);
        onSelect(items[newIndex], newIndex);
      }
    },
    onArrowDown: () => {
      if (items.length > 0) {
        const newIndex = selectedIndex >= items.length - 1 ? 0 : selectedIndex + 1;
        setSelectedIndex(newIndex);
        onSelect(items[newIndex], newIndex);
      }
    },
    onEnter: () => {
      if (selectedIndex >= 0 && selectedIndex < items.length) {
        onSelect(items[selectedIndex], selectedIndex);
      }
    },
  });

  return { selectedIndex, setSelectedIndex };
};