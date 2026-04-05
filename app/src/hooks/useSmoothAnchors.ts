import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

/**
 * Intercepts any click on links staring with `#` and animates the scroll using GSAP,
 * ensuring high-performance smooth animations across all devices, overriding native snap behaviors.
 */
export function useSmoothAnchors() {
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      let anchor = target.tagName.toLowerCase() === 'a' ? (target as HTMLAnchorElement) : target.closest('a');

      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || !href.startsWith('#') || href === '#') return;

      const destElement = document.querySelector(href);
      if (destElement) {
        e.preventDefault();
        
        // Let's use GSAP scrollTo config
        gsap.to(window, {
          duration: 1,
          scrollTo: {
            y: destElement as HTMLElement,
            offsetY: 80, // Accounts for header height
            autoKill: true,
          },
          ease: "power3.inOut"
        });

        // Update URL hash without jumping
        if (window.history.pushState) {
          window.history.pushState(null, '', href);
        } else {
          window.location.hash = href;
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);
}
