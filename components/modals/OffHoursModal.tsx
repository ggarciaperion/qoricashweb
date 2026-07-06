'use client';

import { Clock, X, CheckCircle } from 'lucide-react';

interface OffHoursModalProps {
  isOpen: boolean;
  nextBusinessDay: string;
  onConfirm: () => void;
  onCancel: () => void;
  isEmpresa?: boolean;
}

export default function OffHoursModal({
  isOpen,
  nextBusinessDay,
  onConfirm,
  onCancel,
  isEmpresa = false,
}: OffHoursModalProps) {
  if (!isOpen) return null;

  return (
    <div className="animate-modal-backdrop fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 px-4"
      style={{ background: isEmpresa ? 'rgba(13,27,42,0.85)' : 'rgba(0,0,0,0.65)' }}>
      <div className="animate-modal-enter rounded-2xl w-full max-w-md overflow-hidden"
        style={isEmpresa
          ? { background: 'linear-gradient(135deg, rgba(13,27,42,0.97) 0%, rgba(26,51,83,0.97) 100%)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', border: '1px solid rgba(143,184,204,0.15)', boxShadow: '0 32px 64px rgba(0,0,0,0.4)' }
          : { background: '#fff', boxShadow: '0 32px 64px rgba(0,0,0,0.28), 0 0 0 1px rgba(255,255,255,0.06)' }}>

        {/* Header — dark gradient */}
        <div className="relative flex items-center justify-between px-5 py-4 overflow-hidden"
          style={{ background: isEmpresa ? 'rgba(74,104,132,0.4)' : 'linear-gradient(135deg, #0D1B2A 0%, #1a3353 100%)' }}>
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
          <p className="text-sm leading-relaxed" style={{ color: isEmpresa ? 'rgba(255,255,255,0.75)' : '#4b5563' }}>
            Actualmente estamos fuera de nuestro horario de atención:
          </p>

          <div className="rounded-xl overflow-hidden" style={{ border: isEmpresa ? '1px solid rgba(143,184,204,0.2)' : '1px solid rgba(13,27,42,0.08)' }}>
            <div className="px-4 py-2.5" style={isEmpresa
              ? { background: 'rgba(74,104,132,0.25)', borderBottom: '1px solid rgba(143,184,204,0.15)' }
              : { background: '#F8FAFC', borderBottom: '1px solid rgba(13,27,42,0.06)' }}>
              <p className="text-[9px] uppercase tracking-widest font-bold" style={{ color: isEmpresa ? 'rgba(143,184,204,0.7)' : 'rgba(13,27,42,0.4)' }}>Horario de atención</p>
            </div>
            <div className="px-4 py-3 space-y-2.5" style={{ background: isEmpresa ? 'rgba(255,255,255,0.03)' : 'transparent' }}>
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: isEmpresa ? 'rgba(143,184,204,0.7)' : '#6b7280' }}>Lunes a Viernes</span>
                <span className="text-sm font-bold" style={{ color: isEmpresa ? '#ffffff' : '#1f2937' }}>9:00 am – 6:00 pm</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: isEmpresa ? 'rgba(143,184,204,0.7)' : '#6b7280' }}>Sábados</span>
                <span className="text-sm font-bold" style={{ color: isEmpresa ? '#ffffff' : '#1f2937' }}>9:00 am – 1:00 pm</span>
              </div>
            </div>
          </div>

          <p className="text-sm leading-relaxed" style={{ color: isEmpresa ? 'rgba(255,255,255,0.75)' : '#4b5563' }}>
            Puedes registrar tu operación ahora, pero será atendida a primera hora del{' '}
            <span className="font-bold" style={{ color: isEmpresa ? '#ffffff' : '#111827' }}>{nextBusinessDay}</span>.
          </p>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onCancel}
            className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold transition-all active:scale-[0.98]"
            style={isEmpresa
              ? { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(143,184,204,0.2)', color: '#ffffff' }
              : { border: '1px solid #e5e7eb', color: '#4b5563' }}>
            Cancelar
          </button>
          <button onClick={onConfirm}
            className="flex-1 px-4 py-3 rounded-xl text-sm font-bold text-white transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            style={isEmpresa
              ? { background: 'linear-gradient(135deg, #4A6884, #1a3353)', boxShadow: '0 4px 14px rgba(74,104,132,0.4)' }
              : { background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)', boxShadow: '0 4px 14px rgba(34,197,94,0.35)' }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}>
            <CheckCircle className="w-4 h-4" />
            Entendido, continuar
          </button>
        </div>
      </div>
    </div>
  );
}
