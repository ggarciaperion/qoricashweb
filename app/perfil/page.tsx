'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import {
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  CreditCard,
  ArrowLeft,
  Save,
  Building2,
  UserCircle
} from 'lucide-react';

export default function PerfilPage() {
  const router = useRouter();
  const { user, isAuthenticated, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    telefono: '',
    email: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user) {
      setFormData({
        telefono: user.telefono || '',
        email: user.email || '',
      });
    }
  }, [isAuthenticated, user, router]);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      // TODO: Llamar al API para actualizar los datos
      // await userApi.updateProfile(formData);

      // Por ahora solo actualizamos el store local
      if (user) {
        updateUser({
          ...user,
          telefono: formData.telefono,
          email: formData.email,
        });
      }

      setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
      setIsEditing(false);
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al actualizar el perfil' });
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return null;
  }

  const isRUC = user.document_type === 'RUC';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center text-primary-600 hover:text-primary-700 transition">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver al Dashboard
            </Link>
            <div className="flex items-center gap-4">
              <img src="/logo-principal.png" alt="QoriCash" className="h-12 w-auto" />
              <span className="text-2xl font-display font-bold text-gray-900">QoriCash</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Mi Perfil</h1>
          <p className="text-gray-600">Administra tu información personal y de contacto</p>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {message.text}
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                {isRUC ? (
                  <Building2 className="w-10 h-10 text-primary-600" />
                ) : (
                  <UserCircle className="w-10 h-10 text-primary-600" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {isRUC ? user.razon_social : user.apellidos ? `${user.nombres} ${user.apellidos}` : user.nombres}
                </h2>
                <p className="text-primary-100">
                  {user.document_type} - {user.dni}
                </p>
              </div>
            </div>
          </div>

          {/* Information Section */}
          <div className="p-8">
            {/* Read-only Information */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-primary-600" />
                Información Personal
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Tipo de Documento</label>
                  <div className="flex items-center px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                    <FileText className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-900">{user.document_type}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Número de Documento</label>
                  <div className="flex items-center px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                    <CreditCard className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-900">{user.dni}</span>
                  </div>
                </div>
                {isRUC ? (
                  <>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-600 mb-2">Razón Social</label>
                      <div className="flex items-center px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                        <Building2 className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-gray-900">{user.razon_social}</span>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-600 mb-2">Persona de Contacto</label>
                      <div className="flex items-center px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                        <User className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-gray-900">{user.persona_contacto}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">Nombres</label>
                      <div className="flex items-center px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                        <User className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-gray-900">{user.nombres}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">Apellidos</label>
                      <div className="flex items-center px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                        <User className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-gray-900">{user.apellidos}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Editable Information */}
            <div className="border-t border-gray-200 pt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-primary-600" />
                  Información de Contacto
                </h3>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition"
                  >
                    Editar
                  </button>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Teléfono</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                    />
                  ) : (
                    <div className="flex items-center px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                      <Phone className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-gray-900">{user.telefono}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Correo Electrónico</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                    />
                  ) : (
                    <div className="flex items-center px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                      <Mail className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-gray-900">{user.email}</span>
                    </div>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        telefono: user.telefono || '',
                        email: user.email || '',
                      });
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>

            {/* Dirección */}
            <div className="border-t border-gray-200 pt-8 mt-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-primary-600" />
                Dirección
              </h3>
              <div className="flex items-center px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                <span className="text-gray-900">{user.direccion}</span>
              </div>
            </div>

            {/* Cuentas Bancarias */}
            <div className="border-t border-gray-200 pt-8 mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-primary-600" />
                  Cuentas Bancarias
                </h3>
                <Link
                  href="/dashboard/agregar-cuenta"
                  className="px-4 py-2 text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition"
                >
                  Gestionar Cuentas
                </Link>
              </div>
              <p className="text-gray-600 text-sm">
                Para agregar, editar o eliminar tus cuentas bancarias, haz clic en "Gestionar Cuentas"
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
