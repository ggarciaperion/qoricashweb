'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/lib/store';
import { banksApi } from '@/lib/api/banks';
import {
  ArrowLeft,
  Building2,
  CreditCard,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Info,
  Landmark,
} from 'lucide-react';

const bankAccountSchema = z.object({
  bank_name: z.string().min(1, 'Selecciona un banco'),
  account_number: z.string().min(13, 'El número de cuenta debe tener al menos 13 dígitos').max(20, 'El número de cuenta debe tener máximo 20 dígitos'),
  account_type: z.enum(['Ahorro', 'Corriente'], { errorMap: () => ({ message: 'Selecciona un tipo de cuenta' }) }),
  currency: z.enum(['S/', '$'], { errorMap: () => ({ message: 'Selecciona una moneda' }) }),
  origen: z.enum(['Lima', 'Provincia'], { errorMap: () => ({ message: 'Selecciona el origen de la cuenta' }) }),
  ownership_confirmed: z.boolean().refine(val => val === true, {
    message: 'Debes confirmar que la cuenta es de tu titularidad'
  }),
});

type BankAccountFormData = z.infer<typeof bankAccountSchema>;

export default function AgregarCuentaPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BankAccountFormData>({
    resolver: zodResolver(bankAccountSchema),
    defaultValues: {
      ownership_confirmed: false,
    },
  });

  const selectedBank = watch('bank_name');
  const selectedCurrency = watch('currency');
  const accountNumber = watch('account_number');
  const selectedOrigen = watch('origen');

  // Verificar autenticación
  if (!isAuthenticated || !user) {
    router.push('/login');
    return null;
  }

  const onSubmit = async (data: BankAccountFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      console.log('📤 Enviando datos:', {
        dni: user.dni,
        bank_name: data.bank_name,
        account_number: data.account_number,
        account_type: data.account_type,
        currency: data.currency,
        origen: data.origen,
      });

      const response = await banksApi.addAccount({
        dni: user.dni,
        bank_name: data.bank_name,
        account_number: data.account_number,
        account_type: data.account_type,
        currency: data.currency,
        origen: data.origen,
      });

      console.log('✅ Respuesta del servidor:', response);

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/dashboard/nueva-operacion');
        }, 2000);
      } else {
        setError(response.message || 'Error al agregar cuenta bancaria');
      }
    } catch (err: any) {
      console.error('❌ Error completo:', err);
      console.error('❌ Error response:', err.response);
      console.error('❌ Error response data:', err.response?.data);
      setError(err.response?.data?.message || err.message || 'Error al agregar cuenta bancaria');
    } finally {
      setIsSubmitting(false);
    }
  };

  const allBanksList = banksApi.getBanksList();

  // Filtrar bancos según origen seleccionado
  const banksList = selectedOrigen === 'Provincia'
    ? allBanksList.filter(bank => ['BCP', 'INTERBANK'].includes(bank.value))
    : allBanksList;

  const requiresCCI = selectedBank && ['BBVA', 'SCOTIABANK', 'OTROS'].includes(selectedBank);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 h-14 flex items-center px-6 sticky top-0 z-10">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-primary transition"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Volver
        </button>
        <div className="ml-auto">
          <img src="/logo-principal.png" alt="QoriCash" className="h-8 w-auto" />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Agregar Cuenta Bancaria</h1>
          <p className="text-gray-600">Registra una nueva cuenta bancaria para realizar operaciones</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-green-900 font-semibold">Cuenta bancaria agregada exitosamente</p>
              <p className="text-green-700 text-sm mt-1">Redirigiendo...</p>
            </div>
          </div>
        )}

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

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Origen - PRIMER CAMPO */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Origen de la Cuenta <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    {...register('origen')}
                    type="radio"
                    value="Lima"
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    disabled={isSubmitting}
                  />
                  <span className="ml-2 text-gray-700">Lima</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    {...register('origen')}
                    type="radio"
                    value="Provincia"
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    disabled={isSubmitting}
                  />
                  <span className="ml-2 text-gray-700">Provincia</span>
                </label>
              </div>
              {errors.origen && (
                <p className="mt-2 text-sm text-red-600">{errors.origen.message}</p>
              )}
              {/* Mensaje informativo para Provincia */}
              {selectedOrigen === 'Provincia' && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800 flex items-start">
                    <Info className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Por el momento, las operaciones con cuentas de provincia se realizan únicamente entre <strong>BCP</strong> e <strong>Interbank</strong>.</span>
                  </p>
                </div>
              )}
            </div>

            {/* Bank Selection */}
            <div>
              <label htmlFor="bank_name" className="block text-sm font-semibold text-gray-700 mb-2">
                Banco
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <select
                  {...register('bank_name')}
                  id="bank_name"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
                    errors.bank_name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting || !selectedOrigen}
                >
                  <option value="">
                    {!selectedOrigen ? 'Primero selecciona el origen' : 'Selecciona un banco'}
                  </option>
                  {banksList.map((bank) => (
                    <option key={bank.value} value={bank.value}>
                      {bank.label}
                    </option>
                  ))}
                </select>
              </div>
              {errors.bank_name && (
                <p className="mt-2 text-sm text-red-600">{errors.bank_name.message}</p>
              )}
            </div>

            {/* Account Type and Currency - Two Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Account Type */}
              <div>
                <label htmlFor="account_type" className="block text-sm font-semibold text-gray-700 mb-2">
                  Tipo de Cuenta
                </label>
                <div className="relative">
                  <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <select
                    {...register('account_type')}
                    id="account_type"
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
                      errors.account_type ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                  >
                    <option value="">Selecciona</option>
                    <option value="Ahorro">Ahorro</option>
                    <option value="Corriente">Corriente</option>
                  </select>
                </div>
                {errors.account_type && (
                  <p className="mt-2 text-sm text-red-600">{errors.account_type.message}</p>
                )}
              </div>

              {/* Currency */}
              <div>
                <label htmlFor="currency" className="block text-sm font-semibold text-gray-700 mb-2">
                  Moneda
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <select
                    {...register('currency')}
                    id="currency"
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
                      errors.currency ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                  >
                    <option value="">Selecciona</option>
                    <option value="S/">Soles (S/)</option>
                    <option value="$">Dólares ($)</option>
                  </select>
                </div>
                {errors.currency && (
                  <p className="mt-2 text-sm text-red-600">{errors.currency.message}</p>
                )}
              </div>
            </div>

            {/* Account Number */}
            <div>
              <label htmlFor="account_number" className="block text-sm font-semibold text-gray-700 mb-2">
                {requiresCCI ? 'Código de Cuenta Interbancario (CCI)' : 'Número de Cuenta'}
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  {...register('account_number')}
                  type="text"
                  id="account_number"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
                    errors.account_number ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder={requiresCCI ? '20 dígitos' : '13-20 dígitos'}
                  maxLength={20}
                  disabled={isSubmitting}
                />
              </div>
              {requiresCCI && (
                <p className="mt-2 text-sm text-blue-600 flex items-start">
                  <Info className="w-4 h-4 mr-1 flex-shrink-0 mt-0.5" />
                  Para {selectedBank} es obligatorio ingresar el CCI de 20 dígitos
                </p>
              )}
              {errors.account_number && (
                <p className="mt-2 text-sm text-red-600">{errors.account_number.message}</p>
              )}
              {accountNumber && accountNumber.length > 0 && (
                <p className="mt-2 text-sm text-gray-500">
                  {accountNumber.length} / 20 dígitos
                </p>
              )}
            </div>

            {/* Ownership Confirmation Checkbox */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <label className="flex items-start cursor-pointer">
                <input
                  {...register('ownership_confirmed')}
                  type="checkbox"
                  className="w-5 h-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-0.5"
                  disabled={isSubmitting}
                />
                <div className="ml-3">
                  <span className="text-sm font-semibold text-gray-900">
                    Confirmo que esta cuenta bancaria es de mi titularidad
                  </span>
                  <p className="text-xs text-gray-600 mt-1">
                    Declaro bajo responsabilidad que soy el titular de la cuenta bancaria que estoy registrando y que la información proporcionada es verídica.
                  </p>
                </div>
              </label>
              {errors.ownership_confirmed && (
                <p className="mt-2 text-sm text-red-600 ml-8">{errors.ownership_confirmed.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 py-3 px-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting || success}
                className="flex-1 bg-primary text-secondary py-3 px-4 rounded-xl font-bold hover:bg-primary-600 transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Guardando...
                  </div>
                ) : success ? (
                  'Guardado'
                ) : (
                  'Guardar Cuenta Bancaria'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start">
            <Info className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900">Información importante</p>
              <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside">
                <li>Puedes registrar hasta 6 cuentas bancarias</li>
                <li>Necesitas al menos una cuenta en Soles (S/) y una en Dólares ($) para operar</li>
                <li>La cuenta debe estar a tu nombre (mismo DNI/RUC registrado)</li>
                <li>Para algunos bancos es obligatorio el CCI de 20 dígitos</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
