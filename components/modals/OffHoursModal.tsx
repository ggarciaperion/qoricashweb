'use client';

import { Clock, ArrowRight, X } from 'lucide-react';

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
}: OffHoursModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="animate-modal-backdrop fixed inset-0 flex items-end sm:items-center justify-center z-50 px-4 pb-5 sm:pb-0"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
    >
      <div
        className="animate-modal-slide-up w-full max-w-sm rounded-2xl overflow-hidden"
        style={{
          background: '#ffffff',
          boxShadow: '0 32px 64px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.05)',
        }}
      >
        {/* Header */}
        <div className="relative px-5 pt-5 pb-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors"
            style={{ color: 'rgba(0,0,0,0.28)' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#0D1117')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(0,0,0,0.28)')}
          >
            <X className="w-4 h-4" />
          </button>

          {/* Badge */}
          <span
            className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full mb-3"
            style={{ background: 'rgba(0,0,0,0.06)', color: '#374151', border: '1px solid rgba(0,0,0,0.08)' }}
          >
            <Clock className="w-3 h-3" />
            Fuera de horario
          </span>

          <h2 className="text-lg font-black leading-tight" style={{ color: '#0D1117' }}>
            Tu operación se registrará
          </h2>
          <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
            Actualmente estamos fuera de horario de atención
          </p>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-3">

          {/* Horario card */}
          <div
            className="rounded-xl overflow-hidden"
            style={{ border: '1px solid rgba(0,0,0,0.07)' }}
          >
            <div className="px-4 py-2" style={{ background: '#F8FAFC', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#9CA3AF' }}>
                Horario de atención
              </p>
            </div>
            <div className="px-4 py-3 space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: '#6B7280' }}>Lunes – Viernes</span>
                <span className="text-sm font-bold" style={{ color: '#0D1117' }}>9:00 am – 6:00 pm</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: '#6B7280' }}>Sábados</span>
                <span className="text-sm font-bold" style={{ color: '#0D1117' }}>9:00 am – 1:00 pm</span>
              </div>
            </div>
          </div>

          {/* Info row */}
          <div
            className="rounded-xl px-4 py-3 flex items-start gap-3"
            style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}
          >
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: '#0D1117' }}
            >
              <span className="text-white font-black leading-none" style={{ fontSize: 11 }}>i</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#374151' }}>
              Puedes registrar tu operación ahora. Será atendida a primera hora del{' '}
              <span className="font-bold" style={{ color: '#0D1117' }}>{nextBusinessDay}</span>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2.5 px-5 pb-5">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold transition-all active:scale-[0.97]"
            style={{ border: '1px solid rgba(0,0,0,0.1)', color: '#4B5563' }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 rounded-xl text-sm font-bold text-white transition-all active:scale-[0.97] flex items-center justify-center gap-2"
            style={{ background: '#0D1B2A', boxShadow: '0 4px 14px rgba(13,27,42,0.22)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#1a2f47'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#0D1B2A'; }}
          >
            Continuar
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
