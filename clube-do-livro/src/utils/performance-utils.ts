// Utilitários para otimização de performance

/**
 * Debounce function para limitar chamadas de função
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function para limitar execução de função
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Add will-change for better animation performance
 */
export const optimizeAnimation = (element: HTMLElement): void => {
  element.style.willChange = 'transform, opacity';
  
  // Remove will-change after animation
  element.addEventListener('transitionend', () => {
    element.style.willChange = 'auto';
  }, { once: true });
};

/**
 * Use GPU acceleration for transforms
 */
export const enableGPUAcceleration = (element: HTMLElement): void => {
  element.style.transform = 'translateZ(0)';
};