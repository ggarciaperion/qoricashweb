'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Camera, X } from 'lucide-react';

export default function LibroReclamaciones() {
  const [formData, setFormData] = useState({
    tipoDocumento: 'DNI',
    numeroDocumento: '',
    nombres: '',
    apellidos: '',
    razonSocial: '',
    personaContacto: '',
    email: '',
    telefono: '',
    direccion: '',
    tipoSolicitud: 'Reclamo',
    detalle: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [evidenceImage, setEvidenceImage] = useState<File | null>(null);
  const [evidenceImagePreview, setEvidenceImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido');
        return;
      }

      // Validar tamaño (máx 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no debe superar los 5MB');
        return;
      }

      setEvidenceImage(file);

      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setEvidenceImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setEvidenceImage(null);
    setEvidenceImagePreview(null);
  };

  const handleNewComplaint = () => {
    setShowConfirmation(false);
    setEvidenceImage(null);
    setEvidenceImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Preparar FormData para enviar archivos
      const formDataToSend = new FormData();
      formDataToSend.append('tipoDocumento', formData.tipoDocumento);
      formDataToSend.append('numeroDocumento', formData.numeroDocumento);
      formDataToSend.append('nombres', formData.nombres);
      formDataToSend.append('apellidos', formData.apellidos);
      formDataToSend.append('razonSocial', formData.razonSocial);
      formDataToSend.append('personaContacto', formData.personaContacto);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('telefono', formData.telefono);
      formDataToSend.append('direccion', formData.direccion);
      formDataToSend.append('tipoSolicitud', formData.tipoSolicitud);
      formDataToSend.append('detalle', formData.detalle);

      // Si hay imagen, agregarla al FormData
      if (evidenceImage) {
        formDataToSend.append('evidenceImage', evidenceImage);
      }

      // Hacer POST al API
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/web/complaints`, {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();

      if (result.success) {
        // Mostrar mensaje de éxito
        setShowConfirmation(true);

        // Resetear formulario solo si el envío fue exitoso
        setFormData({
          tipoDocumento: 'DNI',
          numeroDocumento: '',
          nombres: '',
          apellidos: '',
          razonSocial: '',
          personaContacto: '',
          email: '',
          telefono: '',
          direccion: '',
          tipoSolicitud: 'Reclamo',
          detalle: ''
        });
        setEvidenceImage(null);
        setEvidenceImagePreview(null);
      } else {
        // Mostrar mensaje de error
        alert(`Error: ${result.message || 'No se pudo enviar el reclamo. Por favor intenta nuevamente.'}`);
      }
    } catch (error) {
      console.error('Error al enviar reclamo:', error);
      alert('Error al enviar el reclamo. Por favor verifica tu conexión e intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine if RUC is selected
  const isRUC = formData.tipoDocumento === 'RUC';

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md shadow-sm z-50">
        <nav className="w-full px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
              <img src="/logo-principal.png" alt="QoriCash" className="h-16 w-auto" />
              <span className="text-3xl font-display font-bold text-gray-900">
                QoriCash
              </span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/sobre-nosotros" className="text-gray-700 hover:text-primary-600 transition">
                Sobre nosotros
              </Link>
              <Link href="/servicios" className="text-gray-700 hover:text-primary-600 transition">
                Servicios
              </Link>
              <a href="/#contacto" className="text-gray-700 hover:text-primary-600 transition">
                Contacto
              </a>
              <Link href="/login" className="text-gray-700 hover:text-primary-600 transition">
                Iniciar Sesión
              </Link>
              <Link href="/crear-cuenta" className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300">
                Crear cuenta
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <div className="pt-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Libro de Reclamaciones
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tu opinión es importante para nosotros. Registra aquí tus reclamos o quejas y nos pondremos en contacto contigo a la brevedad.
          </p>
        </div>

        {/* Confirmation Message */}
        {showConfirmation ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="text-center max-w-2xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                ¡Reclamo enviado correctamente!
              </h2>

              <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
                <p className="text-lg text-green-900 mb-3">
                  Tu reclamo ha sido registrado exitosamente y enviado a nuestro equipo.
                </p>
                <p className="text-green-800">
                  Recibirás una respuesta en tu correo electrónico <strong>{formData.email}</strong> dentro de las próximas <strong>24-48 horas hábiles</strong>.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <p className="text-sm text-gray-700 mb-4">
                  <strong>¿Qué sigue?</strong>
                </p>
                <ul className="text-left text-sm text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Nuestro equipo revisará tu solicitud en el menor tiempo posible</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Recibirás un email de confirmación con el número de tu reclamo</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Te contactaremos para informarte sobre la resolución</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleNewComplaint}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg"
                >
                  Ingresar nuevo reclamo
                </button>
                <Link
                  href="/"
                  className="px-8 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                >
                  Volver al inicio
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Form Card */
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tipo de Documento Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                Tipo de Documento
              </h2>

              <div>
                <label htmlFor="tipoDocumento" className="block text-sm font-medium text-gray-700 mb-2">
                  Selecciona tu tipo de documento <span className="text-red-500">*</span>
                </label>
                <select
                  id="tipoDocumento"
                  name="tipoDocumento"
                  value={formData.tipoDocumento}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white"
                >
                  <option value="DNI">DNI</option>
                  <option value="CE">Carné de Extranjería (CE)</option>
                  <option value="RUC">RUC</option>
                </select>
              </div>

              <div className="mt-4">
                <label htmlFor="numeroDocumento" className="block text-sm font-medium text-gray-700 mb-2">
                  Número de documento <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="numeroDocumento"
                  name="numeroDocumento"
                  value={formData.numeroDocumento}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder={`Ingresa tu ${formData.tipoDocumento}`}
                />
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Datos Personales Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                {isRUC ? 'Datos de la Empresa' : 'Datos Personales'}
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {isRUC ? (
                  <>
                    <div className="md:col-span-2">
                      <label htmlFor="razonSocial" className="block text-sm font-medium text-gray-700 mb-2">
                        Razón Social <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="razonSocial"
                        name="razonSocial"
                        value={formData.razonSocial}
                        onChange={handleChange}
                        required={isRUC}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="Ingresa la razón social"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="personaContacto" className="block text-sm font-medium text-gray-700 mb-2">
                        Persona de Contacto <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="personaContacto"
                        name="personaContacto"
                        value={formData.personaContacto}
                        onChange={handleChange}
                        required={isRUC}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="Ingresa el nombre de la persona de contacto"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label htmlFor="nombres" className="block text-sm font-medium text-gray-700 mb-2">
                        Nombres <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="nombres"
                        name="nombres"
                        value={formData.nombres}
                        onChange={handleChange}
                        required={!isRUC}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="Ingresa tus nombres"
                      />
                    </div>

                    <div>
                      <label htmlFor="apellidos" className="block text-sm font-medium text-gray-700 mb-2">
                        Apellidos <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="apellidos"
                        name="apellidos"
                        value={formData.apellidos}
                        onChange={handleChange}
                        required={!isRUC}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="Ingresa tus apellidos"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Correo Electrónico <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="ejemplo@correo.com"
                  />
                </div>

                <div>
                  <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="999 999 999"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección <span className="text-gray-500 text-xs">(Opcional)</span>
                  </label>
                  <input
                    type="text"
                    id="direccion"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Ingresa tu dirección"
                  />
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Tipo de Solicitud Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                Tipo de Solicitud
              </h2>

              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition-all">
                  <input
                    type="radio"
                    name="tipoSolicitud"
                    value="Reclamo"
                    checked={formData.tipoSolicitud === 'Reclamo'}
                    onChange={handleChange}
                    className="w-5 h-5 text-green-600 focus:ring-green-500"
                  />
                  <div className="ml-4">
                    <span className="block font-semibold text-gray-900">Reclamo</span>
                    <span className="block text-sm text-gray-600">Disconformidad relacionada con nuestros servicios</span>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition-all">
                  <input
                    type="radio"
                    name="tipoSolicitud"
                    value="Queja"
                    checked={formData.tipoSolicitud === 'Queja'}
                    onChange={handleChange}
                    className="w-5 h-5 text-green-600 focus:ring-green-500"
                  />
                  <div className="ml-4">
                    <span className="block font-semibold text-gray-900">Queja</span>
                    <span className="block text-sm text-gray-600">Malestar o descontento respecto a la atención al público</span>
                  </div>
                </label>
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Detalle Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">4</span>
                Detalle de tu {formData.tipoSolicitud}
              </h2>

              <div>
                <label htmlFor="detalle" className="block text-sm font-medium text-gray-700 mb-2">
                  Describe tu {formData.tipoSolicitud.toLowerCase()} <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="detalle"
                  name="detalle"
                  value={formData.detalle}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                  placeholder="Por favor, describe de manera clara y detallada tu reclamo o queja. Incluye toda la información relevante como fechas, números de operación, etc."
                />
                <p className="mt-2 text-sm text-gray-500">
                  Mínimo 20 caracteres. Sé lo más específico posible para poder ayudarte mejor.
                </p>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
              <div className="flex">
                <svg className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-green-800">
                  Al enviar este formulario, tu {formData.tipoSolicitud.toLowerCase()} será registrado en nuestro sistema y
                  enviado automáticamente a nuestro equipo. Te contactaremos dentro de las próximas 24-48 horas hábiles.
                </p>
              </div>
            </div>

            {/* Image Upload Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">5</span>
                Adjuntar Evidencia (Opcional)
              </h2>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                <p className="text-sm text-blue-800">
                  Si tienes capturas de pantalla o fotografías que respalden tu reclamo, puedes adjuntarlas aquí.
                  Formatos permitidos: JPG, PNG. Tamaño máximo: 5MB.
                </p>
              </div>

              <div className="flex flex-col items-center">
                {!evidenceImagePreview ? (
                  <label className="w-full cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-green-500 hover:bg-green-50 transition-all text-center">
                      <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-700 font-medium mb-1">Haz clic para seleccionar una imagen</p>
                      <p className="text-sm text-gray-500">o arrastra y suelta aquí</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="w-full">
                    <div className="relative rounded-xl overflow-hidden border-2 border-green-500">
                      <img
                        src={evidenceImagePreview}
                        alt="Vista previa"
                        className="w-full h-64 object-contain bg-gray-100"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-all shadow-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-sm text-green-700 mt-2 text-center font-medium">
                      ✓ Imagen seleccionada correctamente
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={isSubmitting || isUploadingImage}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-12 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting || isUploadingImage ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isUploadingImage ? 'Subiendo imagen...' : 'Enviando...'}
                  </span>
                ) : (
                  'ENVIAR RECLAMO'
                )}
              </button>
            </div>

            {/* Legal Note */}
            <p className="text-xs text-gray-500 text-center mt-6">
              Al enviar este formulario, aceptas que tus datos personales sean utilizados exclusivamente
              para gestionar tu {formData.tipoSolicitud.toLowerCase()} de acuerdo con nuestra{' '}
              <Link href="/politica-privacidad" className="text-green-600 hover:underline">
                Política de Privacidad
              </Link>.
            </p>
          </form>
        </div>
        )}

        {/* Additional Info */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Tiempo de Respuesta</h3>
                <p className="text-gray-600">
                  Nuestro equipo revisará tu solicitud y te responderá dentro de las próximas 24-48 horas hábiles.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Contacto Directo</h3>
                <p className="text-gray-600">
                  También puedes escribirnos directamente a{' '}
                  <a href="mailto:info@qoricash.pe" className="text-green-600 hover:underline font-medium">
                    info@qoricash.pe
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Same as home page */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="w-full px-6 sm:px-8 lg:px-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Link href="/" className="flex items-center gap-3 mb-4 hover:opacity-80 transition-opacity w-fit">
                <img src="/logo-principal.png" alt="QoriCash" className="h-12 w-auto" />
                <span className="text-2xl font-display font-bold text-white">
                  QoriCash
                </span>
              </Link>
              <p className="text-sm">
                Casa de cambio online líder en Perú. Seguridad, rapidez y los mejores tipos de cambio.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Servicios</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/servicios#compra" className="hover:text-white transition">Compra de dólares</Link></li>
                <li><Link href="/servicios#venta" className="hover:text-white transition">Venta de dólares</Link></li>
                <li><Link href="/servicios#tipo-cambio" className="hover:text-white transition">Tipo de cambio</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/sobre-nosotros" className="hover:text-white transition">Sobre nosotros</Link></li>
                <li><Link href="/terminos-condiciones" className="hover:text-white transition">Términos y condiciones</Link></li>
                <li><Link href="/politica-privacidad" className="hover:text-white transition">Política de privacidad</Link></li>
                <li><Link href="/politica-cookies" className="hover:text-white transition">Política de cookies</Link></li>
                <li><Link href="/libro-reclamaciones" className="hover:text-white transition">Libro de reclamaciones</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contacto</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:info@qoricash.pe" className="hover:text-white transition">
                    info@qoricash.pe
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <a href="https://wa.me/51926011920" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                    926 011 920
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <a href="https://maps.google.com/?q=Av.+Brasil+2790+Int.+504+Pueblo+Libre+Lima" target="_blank" rel="noopener noreferrer" className="hover:text-white transition leading-relaxed">
                    Av. Brasil N° 2790, Int. 504<br />
                    Lima – Lima – Pueblo Libre
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="leading-relaxed">
                    <div>Lunes a viernes: 9:00 a.m. – 6:00 p.m.</div>
                    <div>Sábados: 9:00 a.m. – 1:00 p.m.</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>© 2025 QoriCash. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
