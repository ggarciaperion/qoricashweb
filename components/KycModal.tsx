'use client';

import { useState } from 'react';
import { X, Upload, CheckCircle, AlertCircle, FileImage } from 'lucide-react';
import { useAuthStore } from '@/lib/store';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function KycModal({ isOpen, onClose }: Props) {
  const { user, refreshUser } = useAuthStore();
  const isEmpresa = user?.document_type === 'RUC';

  const [dniFront, setDniFront]       = useState<File | null>(null);
  const [dniBack, setDniBack]         = useState<File | null>(null);
  const [rucFicha, setRucFicha]       = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadDone, setUploadDone]   = useState(false);
  const [error, setError]             = useState<string | null>(null);

  const reset = () => {
    setDniFront(null); setDniBack(null); setRucFicha(null);
    setError(null); setUploadDone(false); setIsUploading(false);
  };

  const handleClose = () => {
    if (isUploading) return;
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    if (isEmpresa) {
      if (!rucFicha) { setError('Debes subir la Ficha RUC de tu empresa'); return; }
    } else {
      if (!dniFront || !dniBack) { setError('Debes subir ambas fotos del DNI (anverso y reverso)'); return; }
    }
    if (!user?.dni) { setError('No se pudo obtener el DNI del usuario'); return; }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('dni', user.dni);
      if (isEmpresa) {
        if (rucFicha) formData.append('ruc_ficha', rucFicha);
      } else {
        if (dniFront) formData.append('dni_front', dniFront);
        if (dniBack)  formData.append('dni_back', dniBack);
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://app.qoricash.pe'}/api/client/upload-dni`,
        { method: 'POST', body: formData }
      );
      const data = await res.json();

      if (data.success) {
        await refreshUser();
        setUploadDone(true);
        setTimeout(() => { handleClose(); }, 2500);
      } else {
        setError(data.message || 'Error al subir documentos');
        setIsUploading(false);
      }
    } catch {
      setError('Error al subir documentos. Por favor intenta nuevamente.');
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={handleClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl overflow-hidden"
        style={{ background: '#ffffff', boxShadow: '0 24px 64px rgba(0,0,0,0.28)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ background: '#0A0A0A' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.10)' }}>
              <FileImage className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white leading-tight">Validación de Documentos</h3>
              <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.45)' }}>Proceso único de verificación</p>
            </div>
          </div>
          <button onClick={handleClose} className="w-7 h-7 rounded-lg flex items-center justify-center transition hover:bg-white/10">
            <X className="w-4 h-4 text-white/60" />
          </button>
        </div>

        {/* Success */}
        {uploadDone ? (
          <div className="flex flex-col items-center justify-center gap-4 py-12 px-6 text-center">
            <CheckCircle className="w-14 h-14 text-green-500" />
            <div>
              <p className="text-sm font-black text-gray-900">¡Documentos enviados!</p>
              <p className="text-xs text-gray-400 mt-1">Los revisaremos en breve. Cerrando...</p>
            </div>
          </div>
        ) : (
          <div className="px-5 py-4 space-y-3">
            {/* DNI uploads */}
            {!isEmpresa && (
              <div className="grid grid-cols-2 gap-3">
                {([
                  { id: 'kyc-front', label: 'Anverso', file: dniFront, setter: setDniFront },
                  { id: 'kyc-back',  label: 'Reverso', file: dniBack,  setter: setDniBack  },
                ] as { id: string; label: string; file: File | null; setter: (f: File) => void }[]).map(({ id, label, file, setter }) => (
                  <div key={id}>
                    <p className="text-[11px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">DNI · {label}</p>
                    <input type="file" id={id} accept="image/*" className="hidden"
                      onChange={e => { if (e.target.files?.[0]) setter(e.target.files[0]); }}
                      disabled={isUploading} />
                    <label htmlFor={id}
                      className="flex flex-col items-center justify-center gap-1.5 rounded-xl cursor-pointer overflow-hidden text-center transition-all"
                      style={{ border: file ? '1.5px solid #2563EB' : '1.5px dashed #d1d5db', background: file ? '#f8faff' : '#fafafa', minHeight: 80 }}>
                      {file
                        ? <img src={URL.createObjectURL(file)} alt={label} className="w-full h-full object-cover rounded-xl" style={{ maxHeight: 80 }} />
                        : <><Upload className="w-5 h-5 text-gray-300" /><span className="text-[10px] text-gray-400">Toca para subir</span></>}
                    </label>
                  </div>
                ))}
              </div>
            )}

            {/* RUC upload */}
            {isEmpresa && (
              <div>
                <p className="text-[11px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Ficha RUC</p>
                <input type="file" id="kyc-ruc" accept="image/*,.pdf" className="hidden"
                  onChange={e => { if (e.target.files?.[0]) setRucFicha(e.target.files[0]); }}
                  disabled={isUploading} />
                <label htmlFor="kyc-ruc"
                  className="flex items-center gap-3 rounded-xl cursor-pointer px-4 py-3 transition-all"
                  style={{ border: rucFicha ? '1.5px solid #22c55e' : '1.5px dashed #d1d5db', background: rucFicha ? '#f0fdf4' : '#fafafa' }}>
                  {rucFicha
                    ? <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#2563EB' }} />
                    : <Upload className="w-5 h-5 text-gray-300 flex-shrink-0" />}
                  <span className="text-xs text-gray-500 truncate">{rucFicha ? rucFicha.name : 'PNG, JPG o PDF (máx. 5MB)'}</span>
                </label>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 rounded-lg px-3 py-2.5" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-red-500" />
                <p className="text-xs text-red-700">{error}</p>
              </div>
            )}

            {/* Footer */}
            <div className="flex gap-2.5 pt-1 pb-1">
              <button onClick={handleClose}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition"
                style={{ border: '1px solid #e5e7eb', color: '#4b5563' }}>
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={isUploading || (isEmpresa ? !rucFicha : (!dniFront || !dniBack))}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ background: '#0A0A0A' }}
              >
                {isUploading
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Enviando...</>
                  : <><Upload className="w-4 h-4" />Enviar Documentos</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
