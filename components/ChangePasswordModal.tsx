'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Shield } from 'lucide-react';

// Esquema de validación para cambio obligatorio (sin contraseña actual)
const mandatoryPasswordSchema = z.object({
  new_password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una minúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número'),
  confirm_password: z.string().min(1, 'Confirma tu contraseña'),
}).refine((data) => data.new_password === data.confirm_password, {
  message: 'Las contraseñas no coinciden',
  path: ['confirm_password'],
});

// Esquema de validación para cambio voluntario (con contraseña actual)
const voluntaryPasswordSchema = z.object({
  current_password: z.string().min(1, 'Ingresa tu contraseña actual'),
  new_password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una minúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número'),
  confirm_password: z.string().min(1, 'Confirma tu contraseña'),
}).refine((data) => data.new_password === data.confirm_password, {
  message: 'Las contraseñas no coinciden',
  path: ['confirm_password'],
});

type MandatoryPasswordFormData = z.infer<typeof mandatoryPasswordSchema>;
type VoluntaryPasswordFormData = z.infer<typeof voluntaryPasswordSchema>;

interface ChangePasswordModalProps {
  isOpen: boolean;
  onSubmit: (data: { currentPassword?: string; newPassword: string }) => Promise<{ success: boolean; message: string }>;
  onClose?: () => void;
  requireCurrentPassword?: boolean;
  canClose?: boolean;
}

export default function ChangePasswordModal({
  isOpen,
  onSubmit,
  onClose,
  requireCurrentPassword = false,
  canClose = false,
}: ChangePasswordModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<MandatoryPasswordFormData | VoluntaryPasswordFormData>({
    resolver: zodResolver(requireCurrentPassword ? voluntaryPasswordSchema : mandatoryPasswordSchema),
  });

  const newPassword = watch('new_password');

  const handleFormSubmit = async (data: MandatoryPasswordFormData | VoluntaryPasswordFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const submitData = {
        newPassword: data.new_password,
        ...(requireCurrentPassword && 'current_password' in data && { currentPassword: data.current_password }),
      };

      const result = await onSubmit(submitData);

      if (result.success) {
        setSuccess(true);
        // Auto-close after 2 seconds if it's a voluntary change
        if (requireCurrentPassword && onClose) {
          setTimeout(() => {
            onClose();
            setSuccess(false);
          }, 2000);
        }
      } else {
        setError(result.message || 'Error al cambiar contraseña');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al cambiar contraseña');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validaciones de fortaleza de contraseña
  const passwordStrength = {
    hasMinLength: newPassword?.length >= 8,
    hasUppercase: /[A-Z]/.test(newPassword || ''),
    hasLowercase: /[a-z]/.test(newPassword || ''),
    hasNumber: /[0-9]/.test(newPassword || ''),
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-orange-500 to-orange-600">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white">
                {requireCurrentPassword ? 'Cambiar Contraseña' : 'Cambio de Contraseña Obligatorio'}
              </h3>
              <p className="text-sm text-white/90">
                {requireCurrentPassword
                  ? 'Actualiza tu contraseña de forma segura'
                  : 'Por seguridad, debes cambiar tu contraseña'}
              </p>
            </div>
            {canClose && onClose && (
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition"
                type="button"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          {/* Success Message */}
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                ¡Contraseña actualizada!
              </h4>
              <p className="text-gray-600">
                Tu contraseña ha sido cambiada exitosamente. Redirigiendo...
              </p>
            </div>
          ) : (
            <>
              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-900 font-semibold">Error</p>
                    <p className="text-red-700 text-sm mt-1">{error}</p>
                  </div>
                </div>
              )}

              {!requireCurrentPassword && (
                <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                  <p className="text-sm text-orange-800">
                    <strong>Importante:</strong> Estás usando una contraseña temporal. Por seguridad, debes establecer una nueva contraseña antes de continuar.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
                {/* Contraseña Actual (solo para cambio voluntario) */}
                {requireCurrentPassword && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Contraseña Actual *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        {...register('current_password' as any)}
                        placeholder="Tu contraseña actual"
                        className="w-full pl-12 pr-12 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.current_password && (
                      <p className="text-red-600 text-sm mt-2">{(errors as any).current_password.message}</p>
                    )}
                  </div>
                )}

                {/* Nueva Contraseña */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nueva Contraseña *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      {...register('new_password')}
                      placeholder="Mínimo 8 caracteres"
                      className="w-full pl-12 pr-12 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.new_password && (
                    <p className="text-red-600 text-sm mt-2">{errors.new_password.message}</p>
                  )}

                  {/* Indicadores de fortaleza */}
                  {newPassword && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs font-semibold text-gray-600">Requisitos de contraseña:</p>
                      <ul className="space-y-1 text-xs">
                        <li className={`flex items-center ${passwordStrength.hasMinLength ? 'text-green-600' : 'text-gray-500'}`}>
                          <CheckCircle className={`w-3 h-3 mr-2 ${passwordStrength.hasMinLength ? 'text-green-600' : 'text-gray-400'}`} />
                          Mínimo 8 caracteres
                        </li>
                        <li className={`flex items-center ${passwordStrength.hasUppercase ? 'text-green-600' : 'text-gray-500'}`}>
                          <CheckCircle className={`w-3 h-3 mr-2 ${passwordStrength.hasUppercase ? 'text-green-600' : 'text-gray-400'}`} />
                          Al menos una mayúscula
                        </li>
                        <li className={`flex items-center ${passwordStrength.hasLowercase ? 'text-green-600' : 'text-gray-500'}`}>
                          <CheckCircle className={`w-3 h-3 mr-2 ${passwordStrength.hasLowercase ? 'text-green-600' : 'text-gray-400'}`} />
                          Al menos una minúscula
                        </li>
                        <li className={`flex items-center ${passwordStrength.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                          <CheckCircle className={`w-3 h-3 mr-2 ${passwordStrength.hasNumber ? 'text-green-600' : 'text-gray-400'}`} />
                          Al menos un número
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* Confirmar Contraseña */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirmar Contraseña *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      {...register('confirm_password')}
                      placeholder="Repite tu contraseña"
                      className="w-full pl-12 pr-12 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirm_password && (
                    <p className="text-red-600 text-sm mt-2">{errors.confirm_password.message}</p>
                  )}
                </div>
              </form>
            </>
          )}
        </div>

        {/* Footer */}
        {!success && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <button
              onClick={handleSubmit(handleFormSubmit)}
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium disabled:opacity-50"
            >
              {isSubmitting ? 'Cambiando contraseña...' : 'Cambiar Contraseña'}
            </button>
            {!canClose && (
              <p className="text-xs text-center text-gray-500 mt-3">
                No podrás continuar sin cambiar tu contraseña
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
