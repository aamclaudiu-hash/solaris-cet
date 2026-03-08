import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
  triggerOnMount?: boolean;
}

const AnimatedCounter = ({
  end,
  duration = 2,
  suffix = '',
  prefix = '',
  decimals = 0,
  className = '',
  triggerOnMount = false,
}: AnimatedCounterProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const proxy = useRef({ val: 0 });
  const [isVisible, setIsVisible] = useState(triggerOnMount);

  useEffect(() => {
    if (triggerOnMount) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [triggerOnMount]);

  useEffect(() => {
    if (!isVisible) return;

    const tween = gsap.to(proxy.current, {
      val: end,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        if (ref.current) {
          const val = proxy.current.val;
          ref.current.textContent = `${prefix}${val.toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })}${suffix}`;
        }
      },
    });

    return () => { tween.kill(); };
  }, [isVisible, end, duration, suffix, prefix, decimals]);

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  );
};

export default AnimatedCounter;
