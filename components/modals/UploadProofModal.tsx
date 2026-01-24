'use client';

import { useState } from 'react';
import {
  X,
  Upload,
  FileImage,
  Send,
  RefreshCw,
  AlertCircle,
  Mail,
  MessageCircle,
} from 'lucide-react';

interface UploadProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (files: File[], voucherCode: string) => Promise<void>;
  operationCode?: string;
}

export default function UploadProofModal({
  isOpen,
  onClose,
  onSubmit,
  operationCode,
}: UploadProofModalProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [voucherCode, setVoucherCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const remainingSlots = 4 - uploadedFiles.length;
      const filesToAdd = newFiles.slice(0, remainingSlots);
      setUploadedFiles([...uploadedFiles, ...filesToAdd]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(uploadedFiles, voucherCode);
      // Reset and close on success
      setUploadedFiles([]);
      setVoucherCode('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al enviar comprobante');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setUploadedFiles([]);
      setVoucherCode('');
      setError(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Agregar Comprobante</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Info Text */}
          <p className="text-sm text-gray-600">
            Adjunta tu comprobante de transferencia para que podamos verificar tu operación.
          </p>

          {operationCode && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>Operación:</strong> {operationCode}
              </p>
            </div>
          )}

          {/* File Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Comprobante de Transferencia
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-secondary transition">
              <input
                type="file"
                id="file-upload"
                accept="image/*,application/pdf"
                multiple
                onChange={handleFileChange}
                className="hidden"
                disabled={isSubmitting || uploadedFiles.length >= 4}
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="w-12 h-12 text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-700">
                  {uploadedFiles.length >= 4
                    ? 'Máximo de archivos alcanzado'
                    : 'Haz clic para seleccionar archivos'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, PDF ({uploadedFiles.length}/4 archivos)
                </p>
              </label>
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="mt-3 space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200"
                  >
                    <div className="flex items-center gap-2">
                      <FileImage className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-700 truncate max-w-xs">
                        {file.name}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="text-red-500 hover:text-red-700 transition"
                      disabled={isSubmitting}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Voucher Code */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Código / Número de operación
            </label>
            <input
              type="text"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
              placeholder="Ej: 123456789"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-1">
              Ingresa el número de operación o código de tu comprobante de transferencia
            </p>
          </div>

          {/* Alternative Channels */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-gray-700 mb-2">
              <strong>También puedes enviar tu comprobante a:</strong>
            </p>
            <div className="space-y-2">
              <a
                href="mailto:info@qoricash.pe"
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition"
              >
                <Mail className="w-4 h-4" />
                info@qoricash.pe
              </a>
              <a
                href="https://wa.me/51940825008"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-green-600 hover:text-green-800 transition"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800 flex items-start">
                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-secondary to-secondary-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-secondary-700 hover:to-secondary-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
