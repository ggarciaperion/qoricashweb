'use client';

import { usePathname } from 'next/navigation';
import MarketTicker from './MarketTicker';

export default function HomeOnlyTicker() {
  const pathname = usePathname();
  if (pathname !== '/') return null;
  return (
    <>
      <MarketTicker />
      <div style={{ height: '40px' }} />
    </>
  );
}
