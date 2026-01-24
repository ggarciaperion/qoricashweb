'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { banksApi } from '@/lib/api/banks';
import {
  X,
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

interface AddBankAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (accounts: any[]) => void;
  userDni: string;
}

export default function AddBankAccountModal({
  isOpen,
  onClose,
  onSuccess,
  userDni,
}: AddBankAccountModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<BankAccountFormData>({
    resolver: zodResolver(bankAccountSchema),
    defaultValues: {
      ownership_confirmed: false,
    },
  });

  const selectedBank = watch('bank_name');
  const selectedCurrency = watch('currency');
  const selectedOrigen = watch('origen');

  const onSubmit = async (data: BankAccountFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await banksApi.addAccount({
        dni: userDni,
        bank_name: data.bank_name,
        account_number: data.account_number,
        account_type: data.account_type,
        currency: data.currency,
        origen: data.origen,
      });

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess(response.bank_accounts || []);
          handleClose();
        }, 1500);
      } else {
        setError(response.message || 'Error al agregar cuenta bancaria');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al agregar cuenta bancaria');
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

  const allBanksList = banksApi.getBanksList();

  // Filtrar bancos según origen seleccionado
  const banksList = selectedOrigen === 'Provincia'
    ? allBanksList.filter(bank => ['BCP', 'INTERBANK'].includes(bank.value))
    : allBanksList;

  const requiresCCI = selectedBank && ['BBVA', 'SCOTIABANK', 'OTROS'].includes(selectedBank);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 overflow-y-auto py-8">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Agregar Cuenta Bancaria</h3>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 transition disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-green-900 font-semibold">¡Cuenta bancaria agregada exitosamente!</p>
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Origen */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Origen de la Cuenta *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className={`relative flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition ${!selectedOrigen ? 'border-gray-300' : selectedOrigen === 'Lima' ? 'border-primary-500 bg-primary-50' : 'border-gray-300'}`}>
                  <input
                    type="radio"
                    value="Lima"
                    {...register('origen')}
                    className="sr-only"
                  />
                  <span className="font-medium">Lima</span>
                </label>
                <label className={`relative flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition ${!selectedOrigen ? 'border-gray-300' : selectedOrigen === 'Provincia' ? 'border-primary-500 bg-primary-50' : 'border-gray-300'}`}>
                  <input
                    type="radio"
                    value="Provincia"
                    {...register('origen')}
                    className="sr-only"
                  />
                  <span className="font-medium">Provincia</span>
                </label>
              </div>
              {errors.origen && (
                <p className="text-red-600 text-sm mt-2">{errors.origen.message}</p>
              )}
            </div>

            {/* Banco */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Banco *
              </label>
              <div className="relative">
                <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  {...register('bank_name')}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                >
                  <option value="">Selecciona un banco</option>
                  {banksList.map((bank) => (
                    <option key={bank.value} value={bank.value}>
                      {bank.label}
                    </option>
                  ))}
                </select>
              </div>
              {errors.bank_name && (
                <p className="text-red-600 text-sm mt-2">{errors.bank_name.message}</p>
              )}
            </div>

            {/* Moneda */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Moneda *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className={`relative flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition ${!selectedCurrency ? 'border-gray-300' : selectedCurrency === 'S/' ? 'border-primary-500 bg-primary-50' : 'border-gray-300'}`}>
                  <input
                    type="radio"
                    value="S/"
                    {...register('currency')}
                    className="sr-only"
                  />
                  <DollarSign className="w-5 h-5 mr-2" />
                  <span className="font-medium">Soles (S/)</span>
                </label>
                <label className={`relative flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition ${!selectedCurrency ? 'border-gray-300' : selectedCurrency === '$' ? 'border-primary-500 bg-primary-50' : 'border-gray-300'}`}>
                  <input
                    type="radio"
                    value="$"
                    {...register('currency')}
                    className="sr-only"
                  />
                  <DollarSign className="w-5 h-5 mr-2" />
                  <span className="font-medium">Dólares ($)</span>
                </label>
              </div>
              {errors.currency && (
                <p className="text-red-600 text-sm mt-2">{errors.currency.message}</p>
              )}
            </div>

            {/* Tipo de Cuenta */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tipo de Cuenta *
              </label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  {...register('account_type')}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                >
                  <option value="">Selecciona tipo de cuenta</option>
                  <option value="Ahorro">Ahorro</option>
                  <option value="Corriente">Corriente</option>
                </select>
              </div>
              {errors.account_type && (
                <p className="text-red-600 text-sm mt-2">{errors.account_type.message}</p>
              )}
            </div>

            {/* Número de Cuenta */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {requiresCCI ? 'Código de Cuenta Interbancario (CCI) *' : 'Número de Cuenta *'}
              </label>
              <div className="relative">
                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  {...register('account_number')}
                  placeholder={requiresCCI ? '20 dígitos' : '13-20 dígitos'}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                />
              </div>
              {requiresCCI && (
                <p className="text-sm text-blue-600 mt-2 flex items-start">
                  <Info className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                  Para {selectedBank}, debes ingresar el CCI de 20 dígitos
                </p>
              )}
              {errors.account_number && (
                <p className="text-red-600 text-sm mt-2">{errors.account_number.message}</p>
              )}
            </div>

            {/* Confirmación de Titularidad */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  {...register('ownership_confirmed')}
                  className="mt-1 w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="ml-3 text-sm text-gray-700">
                  Confirmo que esta cuenta bancaria es de mi titularidad y acepto la responsabilidad de su uso en las operaciones de QoriCash.
                </span>
              </label>
              {errors.ownership_confirmed && (
                <p className="text-red-600 text-sm mt-2 ml-8">{errors.ownership_confirmed.message}</p>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting || success}
            className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium disabled:opacity-50"
          >
            {isSubmitting ? 'Agregando...' : success ? '¡Agregada!' : 'Agregar Cuenta'}
          </button>
        </div>
      </div>
    </div>
  );
}
