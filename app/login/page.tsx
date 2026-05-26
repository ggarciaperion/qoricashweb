'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LogIn, CreditCard, Lock, ArrowLeft, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { authApi } from '@/lib/api/auth';
import ForgotPasswordModal from '@/components/ForgotPasswordModal';
import ChangePasswordModal from '@/components/ChangePasswordModal';
import type { ForgotPasswordRequest } from '@/lib/types';

const loginSchema = z.object({
  dni: z.string().min(8, 'Ingresa un DNI válido').max(12, 'DNI inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Modals state
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [pendingLoginDni, setPendingLoginDni] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    console.log('📝 [LoginPage] Form submitted with DNI:', data.dni);
    setIsLoading(true);
    clearError();

    try {
      console.log('📝 [LoginPage] Calling login function...');

      // Call the login API directly to check for requires_password_change
      const response = await authApi.login({ dni: data.dni, password: data.password });
      console.log('📝 [LoginPage] Login response:', response);

      if (response.success && response.client) {
        // Check if password change is required
        if (response.requires_password_change) {
          console.log('🔐 [LoginPage] Password change required');
          setPendingLoginDni(data.dni);
          setIsChangePasswordModalOpen(true);
          setIsLoading(false);
          return;
        }

        // No password change required - proceed with normal login
        console.log('✅ [LoginPage] Login successful! Redirecting...');

        // Update the auth store
        const success = await login({ dni: data.dni, password: data.password });

        if (success) {
          console.log('🔄 [LoginPage] Redirecting to /dashboard');
          router.push('/dashboard');
        } else {
          console.log('❌ [LoginPage] Login failed after password check');
          // Error will be displayed from store's error state
        }
      } else {
        // Login failed - use the store's login function to set error properly
        console.log('❌ [LoginPage] Login failed:', response.message);
        await login({ dni: data.dni, password: data.password });
      }
    } catch (error: any) {
      console.error('❌ [LoginPage] Error en login:', error);
      // Try to login via store to set proper error message
      await login({ dni: data.dni, password: data.password });
    } finally {
      setIsLoading(false);
      console.log('📝 [LoginPage] Loading finished');
    }
  };

  // Handle forgot password submission
  const handleForgotPassword = async (data: ForgotPasswordRequest) => {
    try {
      const result = await authApi.forgotPassword(data);
      return result;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Error al recuperar contraseña'
      };
    }
  };

  // Handle password change submission
  const handleChangePassword = async (data: { currentPassword?: string; newPassword: string }) => {
    try {
      const result = await authApi.changePasswordWeb({
        dni: pendingLoginDni,
        new_password: data.newPassword
      });

      if (result.success) {
        // Close modal
        setIsChangePasswordModalOpen(false);

        // Now login with the new password
        const loginSuccess = await login({
          dni: pendingLoginDni,
          password: data.newPassword
        });

        if (loginSuccess) {
          router.push('/dashboard');
        }
      }

      return result;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Error al cambiar contraseña'
      };
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-100 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gold-50 rounded-full blur-3xl opacity-25"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-primary-50 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Back to home */}
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-primary-600 transition mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition" />
          Volver al inicio
        </Link>

        {/* Login card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-8 sm:p-10 border border-gray-100/80">
          {/* Logo and title */}
          <div className="text-center mb-8">
            <img src="/logo-principal.png" alt="QoriCash" className="h-12 w-auto mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-gray-700 mt-1">Accede a tu cuenta</h1>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-xl flex items-start gap-3 shadow-sm animate-in fade-in duration-300">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100/80 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-red-800 mb-0.5">Error de autenticación</p>
                <p className="text-sm text-red-700/90">{error}</p>
              </div>
            </div>
          )}

          {/* Login form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* DNI field */}
            <div>
              <label htmlFor="dni" className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                DNI / CE / RUC
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('dni')}
                  type="text"
                  id="dni"
                  className={`block w-full pl-12 pr-4 py-3.5 border rounded-xl focus:ring-2 focus:outline-none transition ${
                    errors.dni ? 'border-red-200 bg-red-50/20 focus:ring-red-400/20 focus:border-red-400' : 'border-gray-200 bg-gray-50/50 focus:bg-white focus:border-primary-400 focus:ring-primary-400/20'
                  }`}
                  placeholder="12345678"
                  disabled={isLoading}
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  onPaste={(e) => {
                    const pastedText = e.clipboardData.getData('text');
                    if (!/^\d+$/.test(pastedText)) {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
              {errors.dni && (
                <p className="mt-2 text-sm text-red-600">{errors.dni.message}</p>
              )}
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className={`block w-full pl-12 pr-12 py-3.5 border rounded-xl focus:ring-2 focus:outline-none transition ${
                    errors.password ? 'border-red-200 bg-red-50/20 focus:ring-red-400/20 focus:border-red-400' : 'border-gray-200 bg-gray-50/50 focus:bg-white focus:border-primary-400 focus:ring-primary-400/20'
                  }`}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Recuérdame
                </label>
              </div>
              <div className="text-sm">
                <button
                  type="button"
                  onClick={() => setIsForgotPasswordModalOpen(true)}
                  className="text-primary hover:text-primary-600 font-medium"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center btn-primary-gradient text-white py-3.5 px-4 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2 group-hover:translate-x-1 transition" />
                  Iniciar Sesión
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/70 backdrop-blur-sm text-gray-500">¿No tienes una cuenta?</span>
            </div>
          </div>

          {/* Register link */}
          <div className="mt-6 text-center">
            <Link
              href="/crear-cuenta"
              className="inline-flex items-center justify-center w-full border border-primary-300 text-primary-600 py-3 px-4 rounded-xl font-semibold hover:bg-primary-50 hover:border-primary transition-all duration-200"
            >
              Crear cuenta gratis
            </Link>
          </div>
        </div>

        {/* Security note */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          <span>Conexión cifrada SSL · Datos protegidos</span>
        </div>
      </div>

      {/* Modals */}
      <ForgotPasswordModal
        isOpen={isForgotPasswordModalOpen}
        onClose={() => setIsForgotPasswordModalOpen(false)}
        onSubmit={handleForgotPassword}
      />

      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onSubmit={handleChangePassword}
        canClose={false}
      />
    </main>
  );
}
