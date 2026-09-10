import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Qoricash Corporate | Tipo de Cambio para Empresas - Cambio de Divisas Corporativo',
  description: 'Soluciones de cambio de divisas para empresas en Perú. Tipo de cambio competitivo, liquidación en menos de 15 minutos, sin comisiones. Operaciones desde $5,000.',
  keywords: 'cambio divisas empresas, tipo de cambio corporativo, casa de cambio empresas peru, forex empresas, cambio dolares empresas',
  openGraph: {
    title: 'Qoricash Corporate - Cambio de Divisas para Empresas',
    description: 'Tipo de cambio competitivo para empresas peruanas. Sin comisiones, liquidación en 15 minutos.',
    type: 'website',
    images: [{ url: '/logo-principal.png' }],
  },
};

export default function EmpresaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="empresa-page" style={{ position: 'relative', minHeight: '100vh', background: '#F8FAFC' }}>
      {children}
    </div>
  );
}
