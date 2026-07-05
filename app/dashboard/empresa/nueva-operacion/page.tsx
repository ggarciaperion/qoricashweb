'use client';

import { Suspense } from 'react';
import { NuevaOperacionContent } from '@/app/dashboard/nueva-operacion/page';

export default function EmpresaNuevaOperacionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400" />
      </div>
    }>
      <NuevaOperacionContent />
    </Suspense>
  );
}
