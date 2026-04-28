'use client';

import { Clock, X, CheckCircle } from 'lucide-react';

interface OffHoursModalProps {
  isOpen: boolean;
  nextBusinessDay: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function OffHoursModal({
  isOpen,
  nextBusinessDay,
  onConfirm,
  onCancel,
}: OffHoursModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Fuera de horario de atención</h3>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-4">
          <p className="text-gray-700">
            Actualmente estamos fuera de nuestro horario de atención:
          </p>
          <div className="bg-gray-50 rounded-xl p-4 space-y-1 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Lunes a Viernes</span>
              <span className="font-medium text-gray-800">9:00 am – 6:00 pm</span>
            </div>
            <div className="flex justify-between">
              <span>Sábados</span>
              <span className="font-medium text-gray-800">9:00 am – 1:00 pm</span>
            </div>
          </div>
          <p className="text-gray-700">
            Puedes registrar tu operación ahora, pero será atendida a primera hora del{' '}
            <span className="font-semibold text-gray-900">{nextBusinessDay}</span>.
          </p>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-primary-700 text-white rounded-lg hover:opacity-90 transition font-medium flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Entendido, continuar
          </button>
        </div>
      </div>
    </div>
  );
}
