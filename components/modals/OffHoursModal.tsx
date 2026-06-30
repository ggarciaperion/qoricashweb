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
    <div className="animate-modal-backdrop fixed inset-0 bg-black/65 backdrop-blur-md flex items-center justify-center z-50 px-4">
      <div className="animate-modal-enter bg-white rounded-2xl w-full max-w-md overflow-hidden"
        style={{ boxShadow: '0 32px 64px rgba(0,0,0,0.28), 0 0 0 1px rgba(255,255,255,0.06)' }}>

        {/* Header — dark gradient */}
        <div className="relative flex items-center justify-between px-5 py-4 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0D1B2A 0%, #1a3353 100%)' }}>
          <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full pointer-events-none"
            style={{ background: 'rgba(245,158,11,0.10)', filter: 'blur(24px)' }} />
          <div className="absolute -bottom-6 right-10 w-20 h-20 rounded-full pointer-events-none"
            style={{ background: 'rgba(245,158,11,0.06)', filter: 'blur(20px)' }} />

          <div className="relative flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(245,158,11,0.18)' }}>
              <Clock className="w-[18px] h-[18px] text-amber-400" />
            </div>
            <div>
              <p className="text-white font-extrabold text-sm leading-tight">Fuera de horario</p>
              <p className="text-[10px] font-medium mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Tu operación será atendida el próximo día hábil
              </p>
            </div>
          </div>
          <button onClick={onCancel}
            className="relative p-1.5 rounded-lg transition-colors"
            style={{ color: 'rgba(255,255,255,0.4)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.9)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}>
            <X style={{ width: '18px', height: '18px' }} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <p className="text-gray-600 text-sm leading-relaxed">
            Actualmente estamos fuera de nuestro horario de atención:
          </p>

          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(13,27,42,0.08)' }}>
            <div className="px-4 py-2.5" style={{ background: '#F8FAFC', borderBottom: '1px solid rgba(13,27,42,0.06)' }}>
              <p className="text-[9px] uppercase tracking-widest font-bold" style={{ color: 'rgba(13,27,42,0.4)' }}>Horario de atención</p>
            </div>
            <div className="px-4 py-3 space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Lunes a Viernes</span>
                <span className="text-sm font-bold text-gray-800">9:00 am – 6:00 pm</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Sábados</span>
                <span className="text-sm font-bold text-gray-800">9:00 am – 1:00 pm</span>
              </div>
            </div>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed">
            Puedes registrar tu operación ahora, pero será atendida a primera hora del{' '}
            <span className="font-bold text-gray-900">{nextBusinessDay}</span>.
          </p>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onCancel}
            className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold transition-all hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98]">
            Cancelar
          </button>
          <button onClick={onConfirm}
            className="flex-1 px-4 py-3 rounded-xl text-sm font-bold text-white transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
              boxShadow: '0 4px 14px rgba(34,197,94,0.35)',
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(34,197,94,0.45)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 14px rgba(34,197,94,0.35)'; }}>
            <CheckCircle className="w-4 h-4" />
            Entendido, continuar
          </button>
        </div>
      </div>
    </div>
  );
}
