import { useEffect } from 'react';

/**
 * TouchRipple — renders a radial ripple at the touch point on mobile devices,
 * replacing the mouse-only CursorGlow effect. Only active on genuine touch
 * devices; the listener is passive so it never blocks scrolling.
 *
 * @returns null — injects DOM nodes directly for performance.
 */
const TouchRipple = () => {
  useEffect(() => {
    // Skip on non-touch environments to avoid unnecessary overhead
    if (!window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const handleTouch = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;

      const ripple = document.createElement('div');
      ripple.className = 'touch-ripple';
      ripple.style.left = `${touch.clientX - 50}px`;
      ripple.style.top = `${touch.clientY - 50}px`;
      document.body.appendChild(ripple);

      const removeRipple = () => {
        if (ripple.isConnected) ripple.remove();
      };

      // Fallback removal in case animationend never fires (e.g., animation blocked)
      const timer = setTimeout(removeRipple, 650);

      ripple.addEventListener('animationend', () => {
        clearTimeout(timer);
        removeRipple();
      }, { once: true });
    };

    document.addEventListener('touchstart', handleTouch, { passive: true });
    return () => document.removeEventListener('touchstart', handleTouch);
  }, []);

  return null;
};

export default TouchRipple;
