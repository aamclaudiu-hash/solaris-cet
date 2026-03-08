import { useEffect, useRef } from 'react';

const CursorGlow = () => {
  const glowRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -300, y: -300 });
  const targetRef = useRef({ x: -300, y: -300 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const animate = () => {
      const pos = posRef.current;
      const target = targetRef.current;

      // Lerp toward cursor
      pos.x += (target.x - pos.x) * 0.1;
      pos.y += (target.y - pos.y) * 0.1;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${pos.x - 300}px, ${pos.y - 300}px)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="cursor-glow"
      aria-hidden="true"
    />
  );
};

export default CursorGlow;
