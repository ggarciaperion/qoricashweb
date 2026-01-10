'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  UserPlus,
  Mail,
  Lock,
  ArrowLeft,
  Eye,
  EyeOff,
  User,
  Phone,
  CreditCard,
  Building2,
  MapPin,
  CheckCircle2
} from 'lucide-react';

const registroSchema = z.object({
  nombres: z.string().min(2, 'Los nombres son requeridos'),
  apellidos: z.string().min(2, 'Los apellidos son requeridos'),
  dni: z.string()
    .min(8, 'El DNI debe tener 8 dígitos')
    .max(8, 'El DNI debe tener 8 dígitos')
    .regex(/^\d+$/, 'El DNI solo debe contener números'),
  telefono: z.string()
    .min(9, 'El teléfono debe tener 9 dígitos')
    .max(9, 'El teléfono debe tener 9 dígitos')
    .regex(/^\d+$/, 'El teléfono solo debe contener números'),
  email: z.string().email('Ingresa un correo electrónico válido'),
  direccion: z.string().min(5, 'La dirección es requerida'),
  banco: z.string().min(1, 'Selecciona un banco'),
  cuentaBancaria: z.string().min(13, 'La cuenta debe tener al menos 13 dígitos'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'Debes aceptar los términos y condiciones',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

type RegistroFormData = z.infer<typeof registroSchema>;

const bancos = [
  { value: '', label: 'Selecciona tu banco' },
  { value: 'BCP', label: 'BCP - Banco de Crédito del Perú' },
  { value: 'BBVA', label: 'BBVA' },
  { value: 'INTERBANK', label: 'Interbank' },
  { value: 'SCOTIABANK', label: 'Scotiabank' },
  { value: 'BANBIF', label: 'BanBif' },
  { value: 'PICHINCHA', label: 'Banco Pichincha' },
  { value: 'OTROS', label: 'Otros' },
];

export default function RegistroPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegistroFormData>({
    resolver: zodResolver(registroSchema),
    defaultValues: {
      acceptTerms: false,
    },
  });

  const selectedBanco = watch('banco');

  const onSubmit = async (data: RegistroFormData) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      // TODO: Integrate with Flask API
      console.log('Registro attempt:', data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // TODO: Handle registration and redirect
      // router.push('/login');

      setErrorMessage('Funcionalidad en desarrollo');
    } catch (error) {
      setErrorMessage('Error al registrar. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const getCuentaPlaceholder = () => {
    if (['BBVA', 'SCOTIABANK', 'OTROS'].includes(selectedBanco)) {
      return 'CCI - 20 dígitos';
    } else if (['BCP', 'INTERBANK'].includes(selectedBanco)) {
      return 'Número de cuenta (13-14 dígitos)';
    }
    return 'Número de cuenta o CCI';
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gold-100 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="relative max-w-2xl mx-auto">
        {/* Back to home */}
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-primary-600 transition mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition" />
          Volver al inicio
        </Link>

        {/* Registration card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 border border-gray-100">
          {/* Logo and title */}
          <div className="text-center mb-8">
            <img src="/logo-principal.png" alt="QoriCash" className="h-12 w-auto mx-auto mb-4" />
            <h1 className="text-2xl font-display font-bold text-secondary mb-2">
              Crear Cuenta
            </h1>
            <p className="text-gray-600">Completa tus datos para registrarte en QoriCash</p>
          </div>

          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-primary">
                Paso {currentStep} de 2
              </span>
              <span className="text-sm text-gray-500">{currentStep === 1 ? 'Datos personales' : 'Datos bancarios'}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary to-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 2) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Error message */}
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {errorMessage}
            </div>
          )}

          {/* Registration form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: Personal information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                {/* Nombres */}
                <div>
                  <label htmlFor="nombres" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombres *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...register('nombres')}
                      type="text"
                      id="nombres"
                      className={`block w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
                        errors.nombres ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Juan Carlos"
                    />
                  </div>
                  {errors.nombres && (
                    <p className="mt-2 text-sm text-red-600">{errors.nombres.message}</p>
                  )}
                </div>

                {/* Apellidos */}
                <div>
                  <label htmlFor="apellidos" className="block text-sm font-medium text-gray-700 mb-2">
                    Apellidos *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...register('apellidos')}
                      type="text"
                      id="apellidos"
                      className={`block w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
                        errors.apellidos ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="García López"
                    />
                  </div>
                  {errors.apellidos && (
                    <p className="mt-2 text-sm text-red-600">{errors.apellidos.message}</p>
                  )}
                </div>

                {/* DNI and Teléfono in grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* DNI */}
                  <div>
                    <label htmlFor="dni" className="block text-sm font-medium text-gray-700 mb-2">
                      DNI *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <CreditCard className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        {...register('dni')}
                        type="text"
                        id="dni"
                        maxLength={8}
                        className={`block w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
                          errors.dni ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="12345678"
                      />
                    </div>
                    {errors.dni && (
                      <p className="mt-2 text-sm text-red-600">{errors.dni.message}</p>
                    )}
                  </div>

                  {/* Teléfono */}
                  <div>
                    <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        {...register('telefono')}
                        type="text"
                        id="telefono"
                        maxLength={9}
                        className={`block w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
                          errors.telefono ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="987654321"
                      />
                    </div>
                    {errors.telefono && (
                      <p className="mt-2 text-sm text-red-600">{errors.telefono.message}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Correo electrónico *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...register('email')}
                      type="email"
                      id="email"
                      className={`block w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
                        errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="tu@email.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                {/* Dirección */}
                <div>
                  <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...register('direccion')}
                      type="text"
                      id="direccion"
                      className={`block w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
                        errors.direccion ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Av. Principal 123, Miraflores, Lima"
                    />
                  </div>
                  {errors.direccion && (
                    <p className="mt-2 text-sm text-red-600">{errors.direccion.message}</p>
                  )}
                </div>

                {/* Next button */}
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="w-full bg-primary text-secondary py-3 px-4 rounded-xl font-bold hover:bg-primary-600 transition shadow-md hover:shadow-lg"
                >
                  Continuar a Datos Bancarios
                </button>
              </div>
            )}

            {/* Step 2: Banking information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                {/* Banco */}
                <div>
                  <label htmlFor="banco" className="block text-sm font-medium text-gray-700 mb-2">
                    Banco *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Building2 className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      {...register('banco')}
                      id="banco"
                      className={`block w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition appearance-none ${
                        errors.banco ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    >
                      {bancos.map((banco) => (
                        <option key={banco.value} value={banco.value}>
                          {banco.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.banco && (
                    <p className="mt-2 text-sm text-red-600">{errors.banco.message}</p>
                  )}
                </div>

                {/* Cuenta Bancaria */}
                <div>
                  <label htmlFor="cuentaBancaria" className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Cuenta o CCI *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <CreditCard className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...register('cuentaBancaria')}
                      type="text"
                      id="cuentaBancaria"
                      className={`block w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
                        errors.cuentaBancaria ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder={getCuentaPlaceholder()}
                    />
                  </div>
                  {errors.cuentaBancaria && (
                    <p className="mt-2 text-sm text-red-600">{errors.cuentaBancaria.message}</p>
                  )}
                  {selectedBanco && (
                    <p className="mt-2 text-xs text-gray-500">
                      {['BBVA', 'SCOTIABANK', 'OTROS'].includes(selectedBanco)
                        ? 'Para este banco debes ingresar tu CCI de 20 dígitos'
                        : 'Ingresa tu número de cuenta bancaria'}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      className={`block w-full pl-12 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
                        errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="••••••••"
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

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar Contraseña *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...register('confirmPassword')}
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      className={`block w-full pl-12 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
                        errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>

                {/* Terms and conditions */}
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      {...register('acceptTerms')}
                      id="acceptTerms"
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="acceptTerms" className="text-gray-700">
                      Acepto los{' '}
                      <a href="#" className="text-primary-600 hover:text-primary-500 font-medium">
                        términos y condiciones
                      </a>{' '}
                      y la{' '}
                      <a href="#" className="text-primary-600 hover:text-primary-500 font-medium">
                        política de privacidad
                      </a>
                    </label>
                    {errors.acceptTerms && (
                      <p className="mt-1 text-sm text-red-600">{errors.acceptTerms.message}</p>
                    )}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-50 transition"
                  >
                    Volver
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center bg-primary text-secondary py-3 px-4 rounded-xl font-bold hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Creando cuenta...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-5 h-5 mr-2" />
                        Crear Cuenta
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Login link */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Link href="/login" className="text-primary hover:text-primary-600 font-semibold">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: CheckCircle2, text: 'Proceso 100% online' },
            { icon: CheckCircle2, text: 'Aprobación en minutos' },
            { icon: CheckCircle2, text: 'Sin costos ocultos' },
          ].map((benefit, index) => (
            <div
              key={index}
              className="flex items-center bg-white rounded-xl p-4 shadow-sm border border-gray-100"
            >
              <benefit.icon className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
              <span className="text-sm text-gray-700">{benefit.text}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
