'use client';

import { X, AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmButtonClass = 'bg-red-600 hover:bg-red-700 text-white',
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const isDanger = confirmButtonClass.includes('red');

  return (
    <div className="animate-modal-backdrop fixed inset-0 bg-black/65 backdrop-blur-md flex items-center justify-center z-50 px-4">
      <div className="animate-modal-enter bg-white rounded-2xl w-full max-w-md overflow-hidden"
        style={{ boxShadow: '0 32px 64px rgba(0,0,0,0.28), 0 0 0 1px rgba(255,255,255,0.06)' }}>

        {/* Header — dark gradient */}
        <div className="relative flex items-center justify-between px-5 py-4 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0D1B2A 0%, #1a3353 100%)' }}>
          {/* Ambient glows */}
          <div className="absolute -top-6 -left-6 w-28 h-28 rounded-full pointer-events-none"
            style={{ background: isDanger ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)', filter: 'blur(24px)' }} />
          <div className="absolute -bottom-4 right-8 w-20 h-20 rounded-full pointer-events-none"
            style={{ background: isDanger ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.08)', filter: 'blur(20px)' }} />

          <div className="relative flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: isDanger ? 'rgba(239,68,68,0.18)' : 'rgba(245,158,11,0.18)' }}>
              <AlertTriangle className={`w-[18px] h-[18px] ${isDanger ? 'text-red-400' : 'text-amber-400'}`} />
            </div>
            <div>
              <p className="text-white font-extrabold text-sm leading-tight">{title}</p>
              <p className="text-[10px] font-medium mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Esta acción requiere tu confirmación
              </p>
            </div>
          </div>

          <button onClick={onCancel} disabled={isLoading}
            className="relative p-1.5 rounded-lg transition-colors disabled:opacity-50"
            style={{ color: 'rgba(255,255,255,0.4)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.9)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}>
            <X className="w-4.5 h-4.5" style={{ width: '18px', height: '18px' }} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <p className="text-gray-600 text-sm leading-relaxed">{message}</p>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98]"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-60 active:scale-[0.98]"
            style={{
              background: isLoading
                ? '#d1d5db'
                : isDanger
                  ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                  : 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
              boxShadow: isLoading
                ? 'none'
                : isDanger
                  ? '0 4px 14px rgba(239,68,68,0.35)'
                  : '0 4px 14px rgba(34,197,94,0.35)',
            }}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 animate-spin"
                  style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }} />
                Procesando...
              </span>
            ) : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
