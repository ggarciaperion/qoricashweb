import { useEffect, useRef, useState } from 'react';

interface UseCountUpOptions {
  end: number;
  duration?: number;
  decimals?: number;
  startOnView?: boolean;
}

export function useCountUp({
  end,
  duration = 2000,
  decimals = 0,
  startOnView = true
}: UseCountUpOptions) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!startOnView) {
      animateCount();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animateCount();
        } else {
          if (rafRef.current) cancelAnimationFrame(rafRef.current);
          setCount(0);
        }
      },
      { threshold: 0.3 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [startOnView]);

  const animateCount = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const startTime = Date.now();

    const updateCount = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(end * easeProgress);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(updateCount);
      } else {
        setCount(end);
      }
    };

    rafRef.current = requestAnimationFrame(updateCount);
  };

  return { count, elementRef };
}
