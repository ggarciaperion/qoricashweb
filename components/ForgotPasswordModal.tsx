'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Mail, CreditCard, CheckCircle, AlertCircle, Key } from 'lucide-react';

// Esquema de validación (simplificado para usar endpoint /api/client/*)
const forgotPasswordSchema = z.object({
  dni: z.string()
    .min(1, 'Ingresa tu número de documento')
    .regex(/^\d+$/, 'Solo números')
    .refine((val) => [8, 9, 11].includes(val.length), {
      message: 'Debe ser DNI (8), CE (9) o RUC (11) dígitos'
    }),
  email: z.string().email('Ingresa un correo electrónico válido'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ForgotPasswordFormData) => Promise<{ success: boolean; message: string }>;
}

export default function ForgotPasswordModal({
  isOpen,
  onClose,
  onSubmit,
}: ForgotPasswordModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const dni = watch('dni');

  const handleFormSubmit = async (data: ForgotPasswordFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await onSubmit(data);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          handleClose();
        }, 3000);
      } else {
        setError(result.message || 'Error al recuperar contraseña');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al recuperar contraseña');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setError(null);
    setSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-primary-500 to-primary-600">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Key className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white">Recuperar Contraseña</h3>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-white/80 hover:text-white transition disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
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
                ¡Contraseña enviada!
              </h4>
              <p className="text-gray-600 mb-4">
                Hemos enviado una contraseña temporal a tu correo electrónico.
              </p>
              <p className="text-sm text-gray-500">
                Revisa tu bandeja de entrada y sigue las instrucciones.
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

              <p className="text-gray-600 mb-6">
                Ingresa tus datos para recibir una contraseña temporal en tu correo electrónico.
              </p>

              <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
                {/* DNI/CE/RUC */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    DNI / CE / RUC *
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      {...register('dni')}
                      placeholder="DNI (8), CE (9) o RUC (11) dígitos"
                      maxLength={11}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                    />
                  </div>
                  {dni && (
                    <p className="text-xs text-gray-500 mt-2">
                      {dni.length} dígitos ingresados
                    </p>
                  )}
                  {errors.dni && (
                    <p className="text-red-600 text-sm mt-2">{errors.dni.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Correo Electrónico *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      {...register('email')}
                      placeholder="correo@ejemplo.com"
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-2">{errors.email.message}</p>
                  )}
                </div>
              </form>
            </>
          )}
        </div>

        {/* Footer */}
        {!success && (
          <div className="flex gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit(handleFormSubmit)}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium disabled:opacity-50"
            >
              {isSubmitting ? 'Enviando...' : 'Recuperar Contraseña'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
