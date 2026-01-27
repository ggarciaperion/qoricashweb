'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { operationsApi } from '@/lib/api/operations';
import type { Operation } from '@/lib/types';
import {
  ArrowLeft,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  XCircle,
  Building2,
  CreditCard,
  Calendar,
  User,
  FileText,
  Upload,
  Download,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

// Generate static params for static export
// Return empty array since this is a dynamic user-specific page
export function generateStaticParams() {
  return [];
}

export default function OperacionDetallesPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useAuthStore();

  const [operation, setOperation] = useState<Operation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const operationId = params.id ? parseInt(params.id as string) : null;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (operationId) {
      loadOperation();
    }
  }, [isAuthenticated, operationId]);

  const loadOperation = async () => {
    if (!operationId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await operationsApi.getOperation(operationId);

      if (response.success && response.data) {
        setOperation(response.data);
      } else {
        setError(response.message || 'Operación no encontrada');
      }
    } catch (error: any) {
      console.error('Error loading operation:', error);
      setError(error.response?.data?.message || 'Error al cargar la operación');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !operationId) return;

    const file = e.target.files[0];

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('El archivo no puede superar los 5MB');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setError('Solo se permiten archivos JPG, PNG o PDF');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const response = await operationsApi.uploadProof(operationId, file);

      if (response.success) {
        setUploadSuccess(true);
        await loadOperation(); // Reload to get updated comprobante_url

        setTimeout(() => setUploadSuccess(false), 3000);
      } else {
        setError(response.message || 'Error al subir el comprobante');
      }
    } catch (error: any) {
      console.error('Error uploading proof:', error);
      setError(error.response?.data?.message || 'Error al subir el comprobante');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelOperation = async () => {
    if (!operationId) return;

    const confirmed = window.confirm(
      '¿Estás seguro de que quieres cancelar esta operación?'
    );

    if (!confirmed) return;

    try {
      const response = await operationsApi.cancelOperation(operationId);

      if (response.success) {
        await loadOperation(); // Reload to get updated status
      } else {
        setError(response.message || 'Error al cancelar la operación');
      }
    } catch (error: any) {
      console.error('Error canceling operation:', error);
      setError(error.response?.data?.message || 'Error al cancelar la operación');
    }
  };

  const getStatusBadge = (estado: string) => {
    const badges = {
      pendiente: {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: Clock,
        label: 'Pendiente',
      },
      en_proceso: {
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: RefreshCw,
        label: 'En Proceso',
      },
      completado: {
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle2,
        label: 'Completado',
      },
      cancelado: {
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: XCircle,
        label: 'Cancelado',
      },
      rechazado: {
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: XCircle,
        label: 'Rechazado',
      },
    };

    const badge = badges[estado as keyof typeof badges] || badges.pendiente;
    const Icon = badge.icon;

    return (
      <div
        className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold border-2 ${badge.color}`}
      >
        <Icon className="w-4 h-4 mr-2" />
        {badge.label}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando operación...</p>
        </div>
      </div>
    );
  }

  if (error && !operation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 text-center mb-2">Error</h2>
          <p className="text-gray-600 text-center mb-6">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-600 transition"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!operation) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => router.push('/dashboard')}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="font-medium">Volver al Dashboard</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page title */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-display font-bold text-gray-900">
              Operación #{operation.id}
            </h1>
            {getStatusBadge(operation.estado)}
          </div>
          <p className="text-gray-600">Detalles de tu operación de cambio</p>
        </div>

        {/* Success message */}
        {uploadSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-start">
            <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-green-800 text-sm">Comprobante subido exitosamente</p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Operation type card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  operation.tipo === 'compra'
                    ? 'bg-green-100'
                    : 'bg-blue-100'
                }`}
              >
                {operation.tipo === 'compra' ? (
                  <TrendingDown className="w-8 h-8 text-green-600" />
                ) : (
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                )}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {operation.tipo === 'compra' ? 'Compra de Dólares' : 'Venta de Dólares'}
                </h3>
                <p className="text-gray-600">
                  Tipo de cambio: S/ {operation.tipo_cambio.toFixed(3)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Amount details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-green-800">Monto en Soles</span>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-900">
              S/ {operation.monto_soles.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-blue-800">Monto en Dólares</span>
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-900">
              $ {operation.monto_dolares.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Bank account info */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Building2 className="w-5 h-5 mr-2 text-primary" />
            Información Bancaria
          </h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <CreditCard className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Banco</p>
                <p className="font-semibold text-gray-900">{operation.banco_cliente}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Número de Cuenta</p>
                <p className="font-semibold text-gray-900">{operation.cuenta_cliente}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-primary" />
            Historial
          </h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div className="ml-4">
                <p className="font-semibold text-gray-900">Operación creada</p>
                <p className="text-sm text-gray-600">{formatDate(operation.fecha_creacion)}</p>
              </div>
            </div>

            {operation.fecha_actualizacion !== operation.fecha_creacion && (
              <div className="flex items-start">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <RefreshCw className="w-5 h-5 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-gray-900">Última actualización</p>
                  <p className="text-sm text-gray-600">
                    {formatDate(operation.fecha_actualizacion)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Upload proof section */}
        {operation.estado === 'pendiente' && !operation.comprobante_url && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Upload className="w-5 h-5 mr-2 text-primary" />
              Subir Comprobante de Pago
            </h3>
            <p className="text-gray-600 mb-4">
              Por favor, sube tu comprobante de pago (transferencia o depósito) para que podamos
              procesar tu operación.
            </p>
            <label className="block">
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg,application/pdf"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
              />
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary cursor-pointer transition">
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <RefreshCw className="w-12 h-12 text-primary animate-spin mb-3" />
                    <p className="text-gray-600">Subiendo archivo...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="w-12 h-12 text-gray-400 mb-3" />
                    <p className="text-gray-900 font-semibold mb-1">
                      Haz clic para seleccionar un archivo
                    </p>
                    <p className="text-sm text-gray-600">JPG, PNG o PDF (máx. 5MB)</p>
                  </div>
                )}
              </div>
            </label>
          </div>
        )}

        {/* Proof uploaded */}
        {operation.comprobante_url && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <CheckCircle2 className="w-5 h-5 mr-2 text-green-600" />
              Comprobante de Pago
            </h3>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <p className="font-semibold text-green-900">Comprobante subido</p>
                  <p className="text-sm text-green-700">Tu comprobante está siendo procesado</p>
                </div>
              </div>
              <a
                href={operation.comprobante_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-green-700 hover:text-green-900 font-semibold"
              >
                <Download className="w-5 h-5 mr-1" />
                Ver
              </a>
            </div>
          </div>
        )}

        {/* Notes */}
        {operation.notas && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-primary" />
              Notas
            </h3>
            <p className="text-gray-700">{operation.notas}</p>
          </div>
        )}

        {/* Actions */}
        {operation.estado === 'pendiente' && (
          <div className="flex gap-4">
            <button
              onClick={handleCancelOperation}
              className="flex-1 bg-white text-red-600 border-2 border-red-200 py-3 rounded-xl font-bold hover:bg-red-50 transition"
            >
              Cancelar Operación
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
