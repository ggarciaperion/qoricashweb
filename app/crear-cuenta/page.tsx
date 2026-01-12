'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, User, Building2, CheckCircle2, AlertCircle } from 'lucide-react';
import { getDepartamentos, getProvincias, getDistritos } from '@/lib/ubigeo';

type TipoPersona = 'natural' | 'juridica';
type TipoDocumento = 'DNI' | 'CE' | 'RUC';

export default function CrearCuentaPage() {
  const router = useRouter();
  const errorRef = useRef<HTMLDivElement>(null);

  // Estado del flujo
  const [paso, setPaso] = useState(1);
  const [tipoPersona, setTipoPersona] = useState<TipoPersona>('natural');

  // Datos del formulario
  const [formData, setFormData] = useState({
    // Documento
    tipoDocumento: 'DNI' as TipoDocumento,
    dni: '',

    // Persona Natural
    nombres: '',
    apellidoPaterno: '',
    apellidoMaterno: '',

    // Persona Jurídica
    razonSocial: '',
    personaContacto: '',

    // Contacto
    email: '',
    telefono: '',

    // Ubicación
    direccion: '',
    departamento: '',
    provincia: '',
    distrito: '',

    // Seguridad
    password: '',
    confirmPassword: '',

    // Términos
    acceptTerms: false,
    acceptPrivacy: false,
    acceptPromotions: false,
  });

  // Ubigeo
  const [departamentos, setDepartamentos] = useState<string[]>([]);
  const [provincias, setProvincias] = useState<string[]>([]);
  const [distritos, setDistritos] = useState<string[]>([]);

  // Estado UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Cargar departamentos
  useEffect(() => {
    setDepartamentos(getDepartamentos());
  }, []);

  // Actualizar provincias
  useEffect(() => {
    if (formData.departamento) {
      setProvincias(getProvincias(formData.departamento));
      setFormData(prev => ({ ...prev, provincia: '', distrito: '' }));
      setDistritos([]);
    }
  }, [formData.departamento]);

  // Actualizar distritos
  useEffect(() => {
    if (formData.departamento && formData.provincia) {
      setDistritos(getDistritos(formData.departamento, formData.provincia));
      setFormData(prev => ({ ...prev, distrito: '' }));
    }
  }, [formData.provincia]);

  // Scroll a error
  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [error]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const validarPaso1 = () => {
    const longitudEsperada =
      formData.tipoDocumento === 'DNI' ? 8 :
      formData.tipoDocumento === 'CE' ? 9 : 11;

    if (!formData.dni || formData.dni.length !== longitudEsperada) {
      setError(`${formData.tipoDocumento} debe tener ${longitudEsperada} dígitos`);
      return false;
    }

    if (tipoPersona === 'natural') {
      if (!formData.nombres || !formData.apellidoPaterno) {
        setError('Nombres y apellido paterno son obligatorios');
        return false;
      }
    } else {
      if (!formData.razonSocial || !formData.personaContacto) {
        setError('Razón social y persona de contacto son obligatorios');
        return false;
      }
    }

    return true;
  };

  const validarPaso2 = () => {
    if (!formData.email || !formData.email.includes('@')) {
      setError('Email inválido');
      return false;
    }

    if (!formData.telefono || formData.telefono.length !== 9) {
      setError('Teléfono debe tener 9 dígitos');
      return false;
    }

    if (!formData.direccion || !formData.departamento || !formData.provincia || !formData.distrito) {
      setError('Complete todos los campos de ubicación');
      return false;
    }

    return true;
  };

  const validarPaso3 = () => {
    if (!formData.password || formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }

    if (!formData.acceptTerms || !formData.acceptPrivacy) {
      setError('Debes aceptar los Términos y Condiciones y la Política de Privacidad');
      return false;
    }

    return true;
  };

  const siguientePaso = () => {
    if (paso === 1 && !validarPaso1()) return;
    if (paso === 2 && !validarPaso2()) return;
    setPaso(paso + 1);
  };

  const anteriorPaso = () => {
    setPaso(paso - 1);
    setError('');
  };

  const handleSubmit = async () => {
    if (!validarPaso3()) return;

    setLoading(true);
    setError('');

    try {
      const payload = {
        tipo_persona: tipoPersona === 'natural' ? 'Natural' : 'Jurídica',
        tipo_documento: formData.tipoDocumento,
        dni: formData.dni,
        email: formData.email,
        telefono: formData.telefono,
        direccion: formData.direccion,
        departamento: formData.departamento,
        provincia: formData.provincia,
        distrito: formData.distrito,
        password: formData.password,
        accept_promotions: formData.acceptPromotions,
        ...(tipoPersona === 'natural' ? {
          nombres: formData.nombres,
          apellido_paterno: formData.apellidoPaterno,
          apellido_materno: formData.apellidoMaterno,
        } : {
          razon_social: formData.razonSocial,
          persona_contacto: formData.personaContacto,
        })
      };

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => router.push('/login'), 3000);
      } else {
        setError(data.message || 'Error al registrar. Intenta nuevamente.');
      }
    } catch (err: any) {
      setError(err.message || 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">¡Cuenta Creada!</h2>
          <p className="text-gray-600 mb-2">Tu registro se completó exitosamente.</p>
          <p className="text-gray-600 mb-6">Revisa tu email para más información.</p>
          <p className="text-sm text-gray-500">Redirigiendo al login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <img src="/logo-principal.png" alt="QoriCash" className="h-10 w-auto" />
            <a href="/login" className="text-sm text-gray-600 hover:text-primary transition">
              ¿Ya tienes cuenta? <span className="font-semibold text-primary">Inicia sesión</span>
            </a>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Título */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">Crear Cuenta</h1>
          <p className="text-lg text-gray-600">Únete a QoriCash en 3 simples pasos</p>
        </div>

        {/* Indicador de pasos */}
        <div className="flex items-center justify-center mb-12">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition ${
                paso >= num ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {num}
              </div>
              {num < 3 && (
                <div className={`w-20 h-1 mx-2 transition ${
                  paso > num ? 'bg-primary' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Card del formulario */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          {/* Mensaje de error */}
          {error && (
            <div ref={errorRef} className="mb-6 p-4 bg-red-100 border-2 border-red-500 rounded-xl flex items-start gap-3 shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5 animate-pulse" />
              <div>
                <p className="text-sm font-semibold text-red-900 mb-1">Error de validación</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* PASO 1: Selección de tipo y datos básicos */}
          {paso === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Paso 1: Información Básica</h3>

              {/* Tipo de persona */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Tipo de Persona</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setTipoPersona('natural');
                      setFormData(prev => ({ ...prev, tipoDocumento: 'DNI' }));
                    }}
                    className={`p-6 rounded-xl border-2 transition ${
                      tipoPersona === 'natural'
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    <User className={`w-8 h-8 mx-auto mb-2 ${tipoPersona === 'natural' ? 'text-primary' : 'text-gray-400'}`} />
                    <p className="font-semibold text-gray-900">Persona Natural</p>
                    <p className="text-sm text-gray-500 mt-1">DNI o CE</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTipoPersona('juridica');
                      setFormData(prev => ({ ...prev, tipoDocumento: 'RUC' }));
                    }}
                    className={`p-6 rounded-xl border-2 transition ${
                      tipoPersona === 'juridica'
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    <Building2 className={`w-8 h-8 mx-auto mb-2 ${tipoPersona === 'juridica' ? 'text-primary' : 'text-gray-400'}`} />
                    <p className="font-semibold text-gray-900">Persona Jurídica</p>
                    <p className="text-sm text-gray-500 mt-1">RUC</p>
                  </button>
                </div>
              </div>

              {/* Tipo de documento (solo para Natural) */}
              {tipoPersona === 'natural' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Documento</label>
                  <div className="grid grid-cols-2 gap-4">
                    {(['DNI', 'CE'] as TipoDocumento[]).map((tipo) => (
                      <button
                        key={tipo}
                        type="button"
                        onClick={() => handleChange('tipoDocumento', tipo)}
                        className={`py-3 px-4 rounded-xl font-semibold transition ${
                          formData.tipoDocumento === tipo
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {tipo === 'DNI' ? 'DNI' : 'Carné de Extranjería'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Número de documento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {formData.tipoDocumento} *
                </label>
                <input
                  type="text"
                  value={formData.dni}
                  onChange={(e) => handleChange('dni', e.target.value.replace(/\D/g, ''))}
                  maxLength={formData.tipoDocumento === 'DNI' ? 8 : formData.tipoDocumento === 'CE' ? 9 : 11}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  placeholder={formData.tipoDocumento === 'DNI' ? '12345678' : formData.tipoDocumento === 'CE' ? '123456789' : '20123456789'}
                />
              </div>

              {/* Campos según tipo de persona */}
              {tipoPersona === 'natural' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombres *</label>
                    <input
                      type="text"
                      value={formData.nombres}
                      onChange={(e) => handleChange('nombres', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition"
                      placeholder="Juan Carlos"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Apellido Paterno *</label>
                      <input
                        type="text"
                        value={formData.apellidoPaterno}
                        onChange={(e) => handleChange('apellidoPaterno', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition"
                        placeholder="García"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Apellido Materno</label>
                      <input
                        type="text"
                        value={formData.apellidoMaterno}
                        onChange={(e) => handleChange('apellidoMaterno', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition"
                        placeholder="López"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Razón Social *</label>
                    <input
                      type="text"
                      value={formData.razonSocial}
                      onChange={(e) => handleChange('razonSocial', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition"
                      placeholder="EMPRESA SAC"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Persona de Contacto *</label>
                    <input
                      type="text"
                      value={formData.personaContacto}
                      onChange={(e) => handleChange('personaContacto', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition"
                      placeholder="Juan García"
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={siguientePaso}
                  className="inline-flex items-center bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-600 transition shadow-md hover:shadow-lg group"
                >
                  Siguiente
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition" />
                </button>
              </div>
            </div>
          )}

          {/* PASO 2: Contacto y ubicación */}
          {paso === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Paso 2: Contacto y Ubicación</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono *</label>
                <input
                  type="text"
                  value={formData.telefono}
                  onChange={(e) => handleChange('telefono', e.target.value.replace(/\D/g, ''))}
                  maxLength={9}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  placeholder="987654321"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dirección *</label>
                <input
                  type="text"
                  value={formData.direccion}
                  onChange={(e) => handleChange('direccion', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  placeholder="Av. Principal 123"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Departamento *</label>
                  <select
                    value={formData.departamento}
                    onChange={(e) => handleChange('departamento', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  >
                    <option value="">Selecciona</option>
                    {departamentos.map(dep => (
                      <option key={dep} value={dep}>{dep}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Provincia *</label>
                  <select
                    value={formData.provincia}
                    onChange={(e) => handleChange('provincia', e.target.value)}
                    disabled={!formData.departamento}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition disabled:bg-gray-100"
                  >
                    <option value="">Selecciona</option>
                    {provincias.map(prov => (
                      <option key={prov} value={prov}>{prov}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Distrito *</label>
                  <select
                    value={formData.distrito}
                    onChange={(e) => handleChange('distrito', e.target.value)}
                    disabled={!formData.provincia}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition disabled:bg-gray-100"
                  >
                    <option value="">Selecciona</option>
                    {distritos.map(dist => (
                      <option key={dist} value={dist}>{dist}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={anteriorPaso}
                  className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition"
                >
                  Anterior
                </button>
                <button
                  type="button"
                  onClick={siguientePaso}
                  className="inline-flex items-center bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-600 transition shadow-md hover:shadow-lg group"
                >
                  Siguiente
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition" />
                </button>
              </div>
            </div>
          )}

          {/* PASO 3: Seguridad y términos */}
          {paso === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Paso 3: Seguridad</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña *</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  placeholder="Mínimo 8 caracteres"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Contraseña *</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  placeholder="Repite tu contraseña"
                />
              </div>

              <div className="space-y-3 pt-4">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={formData.acceptTerms}
                    onChange={(e) => handleChange('acceptTerms', e.target.checked)}
                    className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    Acepto los <a href="#" className="text-primary font-medium hover:underline">Términos y Condiciones</a> *
                  </span>
                </label>

                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={formData.acceptPrivacy}
                    onChange={(e) => handleChange('acceptPrivacy', e.target.checked)}
                    className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    Acepto la <a href="#" className="text-primary font-medium hover:underline">Política de Privacidad</a> *
                  </span>
                </label>

                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={formData.acceptPromotions}
                    onChange={(e) => handleChange('acceptPromotions', e.target.checked)}
                    className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    Deseo recibir promociones y ofertas especiales
                  </span>
                </label>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={anteriorPaso}
                  className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition"
                >
                  Anterior
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-600 transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Creando cuenta...
                    </span>
                  ) : (
                    'Crear Cuenta'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
