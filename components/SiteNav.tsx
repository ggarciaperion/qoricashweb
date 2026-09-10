import Link from 'next/link';

interface SiteNavProps {
  backHref?: string;
}

export default function SiteNav({ backHref = '/' }: SiteNavProps) {
  return (
    <header
      className="fixed top-0 left-0 right-0 w-full z-50"
      style={{ background: '#ffffff', borderBottom: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}
    >
      <nav className="w-full">
        <div className="max-w-5xl mx-auto flex justify-between items-center h-20 px-6 sm:px-8 lg:px-10">
          {/* Logo */}
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <img src="/vg.png" alt="Qoricash" className="h-16 w-auto" />
          </Link>

          {/* Nav links */}
          <div className="hidden lg:flex items-center gap-8">
            <Link href="/sobre-nosotros" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Nosotros</Link>
            <Link href="/servicios" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Servicios</Link>
          </div>

          {/* Auth buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:block text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/crear-cuenta"
              className="text-sm font-bold text-white rounded-xl px-4 py-2 transition-all hover:brightness-110"
              style={{ background: '#2563EB' }}
            >
              Crear cuenta
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
