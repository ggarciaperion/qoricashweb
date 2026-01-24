'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { banksApi } from '@/lib/api/banks';
import AddBankAccountModal from '@/components/AddBankAccountModal';
import ConfirmModal from '@/components/ConfirmModal';
import ChangePasswordModal from '@/components/ChangePasswordModal';
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
  UserCircle,
  Trash2,
  Plus,
  Lock,
  CheckCircle,
  Calendar
} from 'lucide-react';

export default function PerfilPage() {
  const router = useRouter();
  const { user, isAuthenticated, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Estados para modales de cuentas bancarias
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<number | null>(null);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // Estados para cambio de contraseña
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

  // Estado para última operación
  const [lastOperationDate, setLastOperationDate] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user) {
      setFormData({
        phone: user.phone || user.telefono || '',
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
          phone: formData.phone,
          telefono: formData.phone, // Mantener compatibilidad
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

  const handleAddAccountSuccess = (updatedAccounts: any[]) => {
    if (user) {
      updateUser({
        ...user,
        bank_accounts: updatedAccounts,
      });
    }
    setMessage({ type: 'success', text: 'Cuenta bancaria agregada exitosamente' });
  };

  const handleDeleteAccount = async () => {
    if (!user || accountToDelete === null) return;

    setIsDeletingAccount(true);
    try {
      const response = await banksApi.removeAccount(user.dni, accountToDelete);

      if (response.success) {
        // Actualizar el usuario con las cuentas actualizadas
        updateUser({
          ...user,
          bank_accounts: response.bank_accounts || [],
        });
        setMessage({ type: 'success', text: 'Cuenta bancaria eliminada exitosamente' });
        setIsDeleteConfirmOpen(false);
        setAccountToDelete(null);
      } else {
        setMessage({ type: 'error', text: response.message || 'Error al eliminar la cuenta' });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Error al eliminar la cuenta' });
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const handlePasswordChange = async (data: { currentPassword?: string; newPassword: string }) => {
    if (!user) {
      return { success: false, message: 'Usuario no autenticado' };
    }

    try {
      const response = await fetch('/api/client/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          dni: user.dni,
          current_password: data.currentPassword,
          new_password: data.newPassword,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: 'Contraseña actualizada exitosamente' });
        return { success: true, message: 'Contraseña actualizada exitosamente' };
      } else {
        return { success: false, message: result.message || 'Error al cambiar la contraseña' };
      }
    } catch (error: any) {
      return { success: false, message: error.message || 'Error al cambiar la contraseña' };
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
            <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition cursor-pointer">
              <img src="/logo-principal.png" alt="QoriCash" className="h-12 w-auto" />
              <span className="text-2xl font-display font-bold text-gray-900">QoriCash</span>
            </Link>
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
            <div className="flex items-center justify-between">
              {/* User Info */}
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

              {/* Account Status */}
              <div className="text-right">
                <div className="flex items-center justify-end gap-2 mb-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 rounded-full">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-white">
                      {user.estado || 'Activo'}
                    </span>
                  </div>
                </div>
                {lastOperationDate ? (
                  <div className="flex items-center justify-end gap-2 text-primary-100">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Última operación: {lastOperationDate}</span>
                  </div>
                ) : (
                  <p className="text-sm text-primary-100">Sin operaciones recientes</p>
                )}
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
                      <label className="block text-sm font-medium text-gray-600 mb-2">Apellido Paterno</label>
                      <div className="flex items-center px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                        <User className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-gray-900">{user.apellido_paterno || user.apellidos}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">Apellido Materno</label>
                      <div className="flex items-center px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                        <User className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-gray-900">{user.apellido_materno || '-'}</span>
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
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                    />
                  ) : (
                    <div className="flex items-center px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                      <Phone className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-gray-900">{user.phone || user.telefono || '-'}</span>
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
                        phone: user.phone || user.telefono || '',
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

            {/* Seguridad */}
            <div className="border-t border-gray-200 pt-8 mt-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Lock className="w-5 h-5 mr-2 text-primary-600" />
                Seguridad
              </h3>
              <div className="flex items-center justify-between p-6 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Contraseña</h4>
                  <p className="text-sm text-gray-600">
                    Actualiza tu contraseña regularmente para mantener tu cuenta segura
                  </p>
                </div>
                <button
                  onClick={() => setIsChangePasswordModalOpen(true)}
                  className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Cambiar Contraseña
                </button>
              </div>
            </div>

            {/* Dirección */}
            <div className="border-t border-gray-200 pt-8 mt-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-primary-600" />
                Dirección
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-2">Dirección</label>
                  <div className="flex items-center px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                    <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-900">{user.direccion || '-'}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Distrito</label>
                  <div className="flex items-center px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                    <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-900">{user.distrito || '-'}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Provincia</label>
                  <div className="flex items-center px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                    <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-900">{user.provincia || '-'}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Departamento</label>
                  <div className="flex items-center px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                    <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-900">{user.departamento || '-'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cuentas Bancarias */}
            <div className="border-t border-gray-200 pt-8 mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-primary-600" />
                  Cuentas Bancarias
                </h3>
                <button
                  onClick={() => setIsAddAccountModalOpen(true)}
                  className="flex items-center px-4 py-2 text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Cuenta
                </button>
              </div>

              {user.bank_accounts && user.bank_accounts.length > 0 ? (
                <div className="space-y-4">
                  {user.bank_accounts.map((account, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between px-4 py-4 bg-gray-50 rounded-lg border border-gray-200 group hover:border-gray-300 transition"
                    >
                      <div className="flex items-center space-x-4">
                        <CreditCard className="w-6 h-6 text-primary-600" />
                        <div>
                          <p className="font-semibold text-gray-900">
                            {account.bank_name || account.banco || '-'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {account.account_type || 'Cuenta'} - {account.currency || ''} - {account.account_number || account.numero_cuenta || '-'}
                          </p>
                          {account.origen && (
                            <p className="text-xs text-gray-500 mt-1">
                              Origen: {account.origen}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {account.is_primary && (
                          <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
                            Principal
                          </span>
                        )}
                        <button
                          onClick={() => {
                            setAccountToDelete(index);
                            setIsDeleteConfirmOpen(true);
                          }}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition opacity-0 group-hover:opacity-100"
                          title="Eliminar cuenta"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 text-center">
                  <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium mb-2">
                    No tienes cuentas bancarias registradas
                  </p>
                  <p className="text-gray-500 text-sm mb-4">
                    Agrega al menos 2 cuentas bancarias para poder realizar operaciones
                  </p>
                  <button
                    onClick={() => setIsAddAccountModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Cuenta Bancaria
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modales */}
      <AddBankAccountModal
        isOpen={isAddAccountModalOpen}
        onClose={() => setIsAddAccountModalOpen(false)}
        onSuccess={handleAddAccountSuccess}
        userDni={user.dni}
      />

      <ConfirmModal
        isOpen={isDeleteConfirmOpen}
        title="Eliminar Cuenta Bancaria"
        message="¿Estás seguro de que deseas eliminar esta cuenta bancaria? Esta acción no se puede deshacer."
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        confirmButtonClass="bg-red-600 hover:bg-red-700 text-white"
        onConfirm={handleDeleteAccount}
        onCancel={() => {
          setIsDeleteConfirmOpen(false);
          setAccountToDelete(null);
        }}
        isLoading={isDeletingAccount}
      />

      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        onSubmit={handlePasswordChange}
        requireCurrentPassword={true}
        canClose={true}
      />
    </div>
  );
}
