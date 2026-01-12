'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  CreditCard,
  Building2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { getDepartamentos, getProvincias, getDistritos } from '@/lib/ubigeo';
import UbigeoSelect from './UbigeoSelect';

interface RegisterFormProps {
  clientType: 'natural' | 'juridica';
}

export default function RegisterForm({ clientType }: RegisterFormProps) {
  const router = useRouter();
  const errorRef = useRef<HTMLDivElement>(null);

  // Form fields
  const [tipoDocumento, setTipoDocumento] = useState<'DNI' | 'CE'>('DNI');
  const [dni, setDni] = useState('');
  const [ruc, setRuc] = useState('');
  const [nombres, setNombres] = useState('');
  const [apellidoPaterno, setApellidoPaterno] = useState('');
  const [apellidoMaterno, setApellidoMaterno] = useState('');
  const [razonSocial, setRazonSocial] = useState('');
  const [personaContacto, setPersonaContacto] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [provincia, setProvincia] = useState('');
  const [distrito, setDistrito] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [acceptPromotions, setAcceptPromotions] = useState(false);

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Ubigeo data
  const [departamentos, setDepartamentos] = useState<string[]>([]);
  const [provincias, setProvincias] = useState<string[]>([]);
  const [distritos, setDistritos] = useState<string[]>([]);

  // Load departamentos on mount
  useEffect(() => {
    const deps = getDepartamentos();
    setDepartamentos(deps);
  }, []);

  // Update provincias when departamento changes
  useEffect(() => {
    if (departamento) {
      const provs = getProvincias(departamento);
      setProvincias(provs);
      setProvincia('');
      setDistrito('');
      setDistritos([]);
    } else {
      setProvincias([]);
      setProvincia('');
      setDistrito('');
      setDistritos([]);
    }
  }, [departamento]);

  // Update distritos when provincia changes
  useEffect(() => {
    if (departamento && provincia) {
      const dists = getDistritos(departamento, provincia);
      setDistritos(dists);
      setDistrito('');
    } else {
      setDistritos([]);
      setDistrito('');
    }
  }, [provincia, departamento]);

  // Scroll to error message when it appears
  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [error]);

  const validateForm = () => {
    if (clientType === 'natural') {
      const longitudEsperada = tipoDocumento === 'DNI' ? 8 : 9;
      if (!dni || dni.length !== longitudEsperada) {
        setError(`${tipoDocumento} debe tener ${longitudEsperada} dígitos`);
        return false;
      }

      if (!nombres || !apellidoPaterno) {
        setError('Nombres y apellido paterno son obligatorios');
        return false;
      }
    } else {
      if (!ruc || ruc.length !== 11) {
        setError('RUC debe tener 11 dígitos');
        return false;
      }

      if (!razonSocial) {
        setError('Razón social es obligatoria');
        return false;
      }

      if (!personaContacto) {
        setError('Persona de contacto es obligatoria');
        return false;
      }
    }

    if (!email || !email.includes('@')) {
      setError('Email inválido');
      return false;
    }

    if (!telefono) {
      setError('Teléfono es obligatorio');
      return false;
    }

    if (!direccion) {
      setError('Dirección es obligatoria');
      return false;
    }

    if (!departamento) {
      setError('Departamento es obligatorio');
      return false;
    }

    if (!provincia) {
      setError('Provincia es obligatoria');
      return false;
    }

    if (!distrito) {
      setError('Distrito es obligatorio');
      return false;
    }

    if (!password || password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }

    if (!acceptTerms) {
      setError('Debes aceptar los Términos y Condiciones');
      return false;
    }

    if (!acceptPrivacy) {
      setError('Debes aceptar la Política de Privacidad');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const payload: any = {
        tipo_persona: clientType === 'natural' ? 'Natural' : 'Jurídica',
        email,
        telefono,
        direccion,
        departamento,
        provincia,
        distrito,
        password,
        accept_promotions: acceptPromotions,
      };

      if (clientType === 'natural') {
        payload.dni = dni;
        payload.tipo_documento = tipoDocumento;
        payload.nombres = nombres;
        payload.apellido_paterno = apellidoPaterno;
        payload.apellido_materno = apellidoMaterno;
      } else {
        payload.dni = ruc;
        payload.ruc = ruc;
        payload.razon_social = razonSocial;
        payload.persona_contacto = personaContacto;
      }

      // TODO: Replace with actual API endpoint
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/client/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(data.message || 'Error al registrar. Por favor, intenta nuevamente.');
      }
    } catch (err) {
      setError('Error al conectar con el servidor. Por favor, intenta nuevamente.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 border border-gray-100">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">¡Registro Exitoso!</h2>
          <p className="text-gray-600 mb-2">
            Tu cuenta ha sido creada exitosamente.
          </p>
          <p className="text-gray-600 mb-6">
            Recibirás un email de confirmación.
          </p>
          <p className="text-sm text-gray-500">
            Redirigiendo a la página de inicio de sesión...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 border border-gray-100">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-display font-bold text-secondary mb-2">
          Registro - {clientType === 'natural' ? 'Persona Natural' : 'Persona Jurídica'}
        </h2>
        <p className="text-gray-600">Completa tus datos para crear tu cuenta</p>
      </div>

      {/* Error message */}
      {error && (
        <div
          ref={errorRef}
          className="mb-6 p-4 bg-red-100 border-2 border-red-500 rounded-xl flex items-start gap-3 shadow-lg animate-in fade-in slide-in-from-top-2 duration-300"
          role="alert"
        >
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5 animate-pulse" />
          <div>
            <p className="text-sm font-semibold text-red-900 mb-1">Error de validación</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Documento de identidad */}
        {clientType === 'natural' ? (
          <>
            {/* Selector tipo documento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Documento *
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setTipoDocumento('DNI')}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold transition ${
                    tipoDocumento === 'DNI'
                      ? 'bg-primary text-secondary border-2 border-primary'
                      : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-primary'
                  }`}
                >
                  DNI
                </button>
                <button
                  type="button"
                  onClick={() => setTipoDocumento('CE')}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold transition ${
                    tipoDocumento === 'CE'
                      ? 'bg-primary text-secondary border-2 border-primary'
                      : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-primary'
                  }`}
                >
                  Carné de Extranjería
                </button>
              </div>
            </div>

            {/* DNI/CE */}
            <div>
              <label htmlFor="dni" className="block text-sm font-medium text-gray-700 mb-2">
                {tipoDocumento} *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="dni"
                  value={dni}
                  onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
                  maxLength={tipoDocumento === 'DNI' ? 8 : 9}
                  className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  placeholder={tipoDocumento === 'DNI' ? '12345678' : '123456789'}
                />
              </div>
            </div>

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
                  type="text"
                  id="nombres"
                  value={nombres}
                  onChange={(e) => setNombres(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  placeholder="Juan Carlos"
                />
              </div>
            </div>

            {/* Apellidos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="apellidoPaterno" className="block text-sm font-medium text-gray-700 mb-2">
                  Apellido Paterno *
                </label>
                <input
                  type="text"
                  id="apellidoPaterno"
                  value={apellidoPaterno}
                  onChange={(e) => setApellidoPaterno(e.target.value)}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  placeholder="García"
                />
              </div>
              <div>
                <label htmlFor="apellidoMaterno" className="block text-sm font-medium text-gray-700 mb-2">
                  Apellido Materno
                </label>
                <input
                  type="text"
                  id="apellidoMaterno"
                  value={apellidoMaterno}
                  onChange={(e) => setApellidoMaterno(e.target.value)}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  placeholder="López"
                />
              </div>
            </div>
          </>
        ) : (
          <>
            {/* RUC */}
            <div>
              <label htmlFor="ruc" className="block text-sm font-medium text-gray-700 mb-2">
                RUC *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="ruc"
                  value={ruc}
                  onChange={(e) => setRuc(e.target.value.replace(/\D/g, ''))}
                  maxLength={11}
                  className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  placeholder="20123456789"
                />
              </div>
            </div>

            {/* Razón Social */}
            <div>
              <label htmlFor="razonSocial" className="block text-sm font-medium text-gray-700 mb-2">
                Razón Social *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="razonSocial"
                  value={razonSocial}
                  onChange={(e) => setRazonSocial(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  placeholder="EMPRESA SAC"
                />
              </div>
            </div>

            {/* Persona de Contacto */}
            <div>
              <label htmlFor="personaContacto" className="block text-sm font-medium text-gray-700 mb-2">
                Persona de Contacto *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="personaContacto"
                  value={personaContacto}
                  onChange={(e) => setPersonaContacto(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  placeholder="Juan García"
                />
              </div>
            </div>
          </>
        )}

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Correo Electrónico *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              placeholder="tu@email.com"
            />
          </div>
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
              type="text"
              id="telefono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ''))}
              maxLength={9}
              className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              placeholder="987654321"
            />
          </div>
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
              type="text"
              id="direccion"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              placeholder="Av. Principal 123"
            />
          </div>
        </div>

        {/* Ubigeo */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <UbigeoSelect
            label="Departamento"
            options={departamentos}
            value={departamento}
            onChange={setDepartamento}
            placeholder="Selecciona"
          />
          <UbigeoSelect
            label="Provincia"
            options={provincias}
            value={provincia}
            onChange={setProvincia}
            placeholder="Selecciona"
            disabled={!departamento}
          />
          <UbigeoSelect
            label="Distrito"
            options={distritos}
            value={distrito}
            onChange={setDistrito}
            placeholder="Selecciona"
            disabled={!provincia}
          />
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
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              placeholder="Mínimo 8 caracteres"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
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
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              placeholder="Repite tu contraseña"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Checkboxes */}
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="acceptTerms"
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="acceptTerms" className="text-gray-700">
                Acepto los{' '}
                <a href="#" className="text-primary-600 hover:text-primary-500 font-medium">
                  Términos y Condiciones
                </a>{' '}
                *
              </label>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="acceptPrivacy"
                type="checkbox"
                checked={acceptPrivacy}
                onChange={(e) => setAcceptPrivacy(e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="acceptPrivacy" className="text-gray-700">
                Acepto la{' '}
                <a href="#" className="text-primary-600 hover:text-primary-500 font-medium">
                  Política de Privacidad
                </a>{' '}
                *
              </label>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="acceptPromotions"
                type="checkbox"
                checked={acceptPromotions}
                onChange={(e) => setAcceptPromotions(e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="acceptPromotions" className="text-gray-700">
                Deseo recibir promociones y ofertas especiales
              </label>
            </div>
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-secondary py-3 px-4 rounded-xl font-bold hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Creando cuenta...
            </span>
          ) : (
            'Crear Cuenta'
          )}
        </button>

        {/* Login link */}
        <div className="text-center pt-4">
          <p className="text-sm text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <a href="/login" className="text-primary hover:text-primary-600 font-semibold">
              Inicia sesión aquí
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
