'use client';

import { ReactNode, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { useExchangeStore } from '@/lib/store/exchangeStore';
import {
  User,
  TrendingUp,
  HelpCircle,
  LogOut,
  ChevronDown,
  Gift,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { currentRates } = useExchangeStore();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-menu-container')) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    setLoggingOut(true);
    await new Promise((r) => setTimeout(r, 1100));
    logout();
    router.push('/login');
  };

  return (
    <>
    {loggingOut && createPortal(
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white animate-fade-in">
        <div className="flex flex-col items-center gap-5">
          <img
            src="/logo-principal.png"
            alt="QoriCash"
            className="h-16 w-auto animate-logo-exit"
          />
          <div className="flex flex-col items-center gap-2">
            <p className="text-secondary font-bold text-sm tracking-wide animate-slide-up-fade">
              Cerrando sesión...
            </p>
            <div className="flex gap-1.5 animate-slide-up-fade">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-primary-600 animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        </div>
      </div>,
      document.body
    )}
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center space-x-2 group">
                <img src="/logo-principal.png" alt="QoriCash" className="h-12 w-auto" />
                <span className="text-xl font-bold text-gray-900 group-hover:text-secondary transition">
                  QoriCash
                </span>
              </Link>
            </div>

            {/* Exchange Rates */}
            {currentRates && (
              <div className="flex items-center gap-2 text-sm">
                {/* Live dot */}
                <div className="hidden sm:flex items-center gap-1.5 mr-1">
                  <div className="relative flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div className="absolute w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
                  </div>
                  <span className="text-xs font-medium text-gray-400">En vivo</span>
                </div>
                {/* Compra */}
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-green-50 border border-green-100 rounded-lg">
                  <span className="hidden md:inline text-gray-500 text-xs">Compra</span>
                  <span className="font-bold text-green-600 text-sm">S/ {currentRates.tipo_compra?.toFixed(3)}</span>
                </div>
                {/* Venta */}
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 border border-blue-100 rounded-lg">
                  <span className="hidden md:inline text-gray-500 text-xs">Venta</span>
                  <span className="font-bold text-blue-600 text-sm">S/ {currentRates.tipo_venta?.toFixed(3)}</span>
                </div>
              </div>
            )}

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="relative user-menu-container">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-secondary transition group"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden sm:inline-block text-sm font-medium">
                    {user?.razon_social
                      ? user?.razon_social
                      : user?.apellidos ? `${user?.nombres} ${user?.apellidos}` : user?.nombres}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-dropdown">
                    <Link
                      href="/perfil"
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-secondary/5 hover:text-secondary transition"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="w-5 h-5 mr-3" />
                      Mi Perfil
                    </Link>
                    <Link
                      href="/dashboard"
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-secondary/5 hover:text-secondary transition"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <TrendingUp className="w-5 h-5 mr-3" />
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/promociones"
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-secondary/5 hover:text-secondary transition"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Gift className="w-5 h-5 mr-3" />
                      Promociones
                    </Link>
                    <a
                      href="https://wa.me/51960826862"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-secondary/5 hover:text-secondary transition"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <HelpCircle className="w-5 h-5 mr-3" />
                      Soporte
                    </a>
                    <div className="border-t border-gray-200 my-2"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 transition"
                    >
                      <LogOut className="w-5 h-5 mr-3" />
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main>{children}</main>
    </div>
    </>
  );
}
