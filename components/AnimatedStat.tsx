'use client';

import { useCountUp } from '@/hooks/useCountUp';

interface AnimatedStatProps {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  label: string;
  duration?: number;
}

export default function AnimatedStat({
  value,
  suffix = '',
  prefix = '',
  decimals = 0,
  label,
  duration = 2000
}: AnimatedStatProps) {
  const { count, elementRef } = useCountUp({
    end: value,
    duration,
    decimals,
    startOnView: true
  });

  const formattedCount = decimals > 0
    ? count.toFixed(decimals)
    : Math.floor(count).toLocaleString('en-US');

  return (
    <div ref={elementRef}>
      <div className="text-2xl font-bold text-primary">
        {prefix}{formattedCount}{suffix}
      </div>
      <div className="text-xs text-gray-600">{label}</div>
    </div>
  );
}
