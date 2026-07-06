'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import ChangePasswordModal from '@/components/ChangePasswordModal';
import {
  ArrowLeft, FileText, Mail, MapPin, Lock, Save,
  UserCircle, Building2, CheckCircle, AlertCircle,
} from 'lucide-react';

export default function PerfilPage() {
  const router = useRouter();
  const { user, isAuthenticated, updateUser } = useAuthStore();
  const isEmpresa = user?.document_type === 'RUC';

  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({ phone: '', email: '' });
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({ direccion: '', departamento: '', provincia: '', distrito: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
  }, [isAuthenticated]);

  useEffect(() => {
    if (user) {
      setProfileForm({ phone: user.phone || user.telefono || '', email: user.email || '' });
      setAddressForm({
        direccion:    (user as any).direccion    || '',
        departamento: (user as any).departamento || '',
        provincia:    (user as any).provincia    || '',
        distrito:     (user as any).distrito     || '',
      });
    }
  }, [user]);

  const handleProfileSave = async () => {
    setIsSaving(true);
    setProfileMsg(null);
    try {
      if (user) updateUser({ ...user, phone: profileForm.phone, telefono: profileForm.phone, email: profileForm.email });
      setProfileMsg({ type: 'success', text: 'Perfil actualizado correctamente' });
      setIsEditing(false);
    } catch {
      setProfileMsg({ type: 'error', text: 'Error al actualizar el perfil' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddressSave = async () => {
    if (!user) return;
    setIsSaving(true);
    setProfileMsg(null);
    try {
      const res = await fetch('/api/flask/api/web/update-address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dni: user.dni, ...addressForm }),
      });
      const data = await res.json();
      if (data.success) {
        updateUser({ ...user, ...(addressForm as any) });
        setProfileMsg({ type: 'success', text: 'Dirección actualizada correctamente' });
        setIsEditingAddress(false);
      } else {
        setProfileMsg({ type: 'error', text: data.message || 'Error al actualizar dirección' });
      }
    } catch {
      setProfileMsg({ type: 'error', text: 'Error al actualizar dirección' });
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  const backHref = isEmpresa ? '/dashboard/empresa' : '/dashboard';

  // Empresa styles
  const sectionBg = isEmpresa
    ? { background: 'linear-gradient(135deg, rgba(74,104,132,0.22) 0%, rgba(13,27,42,0.28) 100%)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(143,184,204,0.18)', borderRadius: 16, padding: '14px 14px 10px', boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }
    : { background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(30,41,59,0.08)', borderRadius: 16, padding: '14px 14px 10px', boxShadow: '0 2px 12px rgba(30,41,59,0.06)' };
  const cardBg = isEmpresa
    ? { background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(143,184,204,0.25)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }
    : { background: 'rgba(255,255,255,0.75)', border: '1px solid rgba(30,41,59,0.1)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderRadius: 10, boxShadow: '0 2px 8px rgba(30,41,59,0.06)' };
  const labelColor = isEmpresa ? 'rgba(143,184,204,0.55)' : 'rgba(30,41,59,0.38)';
  const valueColor = isEmpresa ? '#ffffff' : '#1E293B';
  const sectionLabelColor = isEmpresa ? 'rgba(143,184,204,0.6)' : 'rgba(30,41,59,0.4)';
  const inputBorderActive = isEmpresa ? '#8fb8cc' : '#22C55E';
  const cancelBg = isEmpresa ? 'rgba(255,255,255,0.07)' : '#F1F5F9';
  const cancelColor = isEmpresa ? 'rgba(255,255,255,0.6)' : 'rgba(30,41,59,0.6)';

  return (
    <div
      className="min-h-full"
      style={isEmpresa ? { backgroundImage: "url('/xc.webp')", backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
    >
      <main
        className="p-4 sm:p-6 space-y-3 max-w-2xl mx-auto"
        style={{ animation: 'profileSlideIn 0.32s cubic-bezier(0.22,1,0.36,1) both' }}
      >
        <style>{`
          @keyframes profileSlideIn {
            from { opacity: 0; transform: translateY(18px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        {/* Back */}
        <button
          onClick={() => router.push(backHref)}
          className="flex items-center gap-1.5 text-xs font-semibold transition-colors"
          style={{ color: isEmpresa ? '#ffffff' : 'rgba(30,41,59,0.45)' }}
          onMouseEnter={e => (e.currentTarget.style.color = isEmpresa ? 'rgba(255,255,255,0.7)' : '#1E293B')}
          onMouseLeave={e => (e.currentTarget.style.color = isEmpresa ? '#ffffff' : 'rgba(30,41,59,0.45)')}
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Volver al inicio
        </button>

        {/* Header */}
        <div className="rounded-xl flex items-center gap-3 px-4 py-3" style={{ background: 'linear-gradient(135deg, #0D1B2A 0%, #1a3353 100%)' }}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.12)' }}>
            {isEmpresa
              ? <Building2 className="w-4 h-4 text-white/80" />
              : <UserCircle className="w-4 h-4 text-white/80" />}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-black text-white leading-tight truncate">
              {isEmpresa ? user.razon_social : user.apellidos ? `${user.nombres} ${user.apellidos}` : user.nombres}
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{user.document_type} · {user.dni}</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full flex-shrink-0" style={{ background: 'rgba(34,197,94,0.15)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] font-semibold text-green-300">{(user as any).estado || 'Activo'}</span>
          </div>
        </div>

        {/* Alert */}
        {profileMsg && (
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium ${profileMsg.type === 'success' ? 'bg-primary-50 border-primary-200 text-primary-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
            {profileMsg.type === 'success'
              ? <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 text-primary-600" />
              : <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-red-600" />}
            {profileMsg.text}
          </div>
        )}

        {/* Información personal */}
        <div style={sectionBg}>
          <p className="text-[9px] font-bold uppercase tracking-widest mb-2.5 flex items-center gap-1" style={{ color: sectionLabelColor }}>
            <FileText className="w-3 h-3" /> Información Personal
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { label: 'Tipo doc.', value: user.document_type },
              { label: 'Número', value: user.dni },
              ...(isEmpresa
                ? [{ label: 'Razón Social', value: user.razon_social }, { label: 'Contacto', value: (user as any).persona_contacto }]
                : [{ label: 'Nombres', value: user.nombres }, { label: 'Ap. Paterno', value: (user as any).apellido_paterno || user.apellidos }, { label: 'Ap. Materno', value: (user as any).apellido_materno || '-' }]),
            ].map(({ label, value }) => (
              <div key={label} className="px-2.5 py-2" style={cardBg}>
                <p className="text-[8px] font-bold uppercase tracking-wider leading-none mb-0.5" style={{ color: labelColor }}>{label}</p>
                <p className="text-xs font-semibold truncate" style={{ color: valueColor }}>{value || '-'}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contacto */}
        <div style={sectionBg}>
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-[9px] font-bold uppercase tracking-widest flex items-center gap-1" style={{ color: sectionLabelColor }}>
              <Mail className="w-3 h-3" /> Contacto
            </p>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-[10px] font-bold px-2 py-0.5 rounded transition-colors"
                style={{ color: '#ffffff', background: isEmpresa ? 'linear-gradient(135deg, #4A6884, #1a3353)' : '#22C55E', border: isEmpresa ? '1px solid rgba(143,184,204,0.3)' : '1px solid #16A34A' }}
              >
                Editar
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <div className="px-2.5 py-2" style={cardBg}>
              <p className="text-[8px] font-bold uppercase tracking-wider leading-none mb-0.5" style={{ color: labelColor }}>Teléfono</p>
              {isEditing ? (
                <input type="tel" value={profileForm.phone} onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full text-xs font-semibold bg-transparent outline-none border-b" style={{ color: valueColor, borderColor: inputBorderActive }} />
              ) : (
                <p className="text-xs font-semibold truncate" style={{ color: valueColor }}>{user.phone || user.telefono || '-'}</p>
              )}
            </div>
            <div className="px-2.5 py-2" style={cardBg}>
              <p className="text-[8px] font-bold uppercase tracking-wider leading-none mb-0.5" style={{ color: labelColor }}>Correo</p>
              {isEditing ? (
                <input type="email" value={profileForm.email} onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full text-xs font-semibold bg-transparent outline-none border-b" style={{ color: valueColor, borderColor: inputBorderActive }} />
              ) : (
                <p className="text-xs font-semibold truncate" style={{ color: valueColor }}>{user.email || '-'}</p>
              )}
            </div>
          </div>
          {isEditing && (
            <div className="flex gap-1.5 mt-2">
              <button onClick={handleProfileSave} disabled={isSaving}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition disabled:opacity-50"
                style={{ background: isEmpresa ? 'linear-gradient(135deg, #4A6884, #1a3353)' : 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)' }}>
                <Save className="w-3 h-3" />{isSaving ? 'Guardando...' : 'Guardar'}
              </button>
              <button onClick={() => { setIsEditing(false); setProfileForm({ phone: user.phone || user.telefono || '', email: user.email || '' }); }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                style={{ background: cancelBg, color: cancelColor }}>
                Cancelar
              </button>
            </div>
          )}
        </div>

        {/* Seguridad */}
        <div className="flex items-center justify-between" style={sectionBg}>
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: isEmpresa ? 'rgba(143,184,204,0.5)' : 'rgba(30,41,59,0.35)' }} />
            <p className="text-xs font-semibold" style={{ color: valueColor }}>Contraseña</p>
          </div>
          <button
            onClick={() => setIsChangePasswordModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold text-white transition"
            style={{ background: 'linear-gradient(135deg, #0D1B2A 0%, #1a3353 100%)' }}
          >
            <Lock className="w-3 h-3" /> Cambiar
          </button>
        </div>

        {/* Dirección */}
        <div style={sectionBg}>
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-[9px] font-bold uppercase tracking-widest flex items-center gap-1" style={{ color: sectionLabelColor }}>
              <MapPin className="w-3 h-3" /> Dirección
            </p>
            {!isEditingAddress && (
              <button
                onClick={() => setIsEditingAddress(true)}
                className="text-[10px] font-bold px-2 py-0.5 rounded transition-colors"
                style={{ color: '#ffffff', background: isEmpresa ? 'linear-gradient(135deg, #4A6884, #1a3353)' : '#22C55E', border: isEmpresa ? '1px solid rgba(143,184,204,0.3)' : '1px solid #16A34A' }}
              >
                Editar
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {([
              { label: 'Dirección', key: 'direccion', wide: true },
              { label: 'Distrito', key: 'distrito', wide: false },
              { label: 'Provincia', key: 'provincia', wide: false },
              { label: 'Departamento', key: 'departamento', wide: false },
            ] as { label: string; key: keyof typeof addressForm; wide: boolean }[]).map(({ label, key, wide }) => (
              <div key={label} className={`px-2.5 py-2${wide ? ' col-span-2' : ''}`}
                style={{ ...cardBg, border: `1px solid ${isEditingAddress ? (isEmpresa ? '#8fb8cc' : '#86efac') : (isEmpresa ? 'rgba(143,184,204,0.25)' : 'rgba(30,41,59,0.1)')}` }}>
                <p className="text-[8px] font-bold uppercase tracking-wider leading-none mb-0.5" style={{ color: labelColor }}>{label}</p>
                {isEditingAddress ? (
                  <input
                    type="text"
                    value={addressForm[key]}
                    onChange={e => setAddressForm({ ...addressForm, [key]: e.target.value })}
                    placeholder={`Ingresa ${label.toLowerCase()}`}
                    className="w-full text-xs font-semibold bg-transparent outline-none border-b"
                    style={{ color: valueColor, borderColor: inputBorderActive }}
                  />
                ) : (
                  <p className="text-xs font-semibold truncate" style={{ color: (user as any)[key] ? valueColor : (isEmpresa ? 'rgba(143,184,204,0.3)' : 'rgba(30,41,59,0.3)') }}>
                    {(user as any)[key] || 'Sin registrar'}
                  </p>
                )}
              </div>
            ))}
          </div>
          {isEditingAddress && (
            <div className="flex gap-1.5 mt-2">
              <button onClick={handleAddressSave} disabled={isSaving}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition disabled:opacity-50"
                style={{ background: isEmpresa ? 'linear-gradient(135deg, #4A6884, #1a3353)' : 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)' }}>
                <Save className="w-3 h-3" />{isSaving ? 'Guardando...' : 'Guardar'}
              </button>
              <button onClick={() => {
                setIsEditingAddress(false);
                setAddressForm({
                  direccion:    (user as any).direccion    || '',
                  departamento: (user as any).departamento || '',
                  provincia:    (user as any).provincia    || '',
                  distrito:     (user as any).distrito     || '',
                });
              }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                style={{ background: cancelBg, color: cancelColor }}>
                Cancelar
              </button>
            </div>
          )}
        </div>

      </main>

      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
      />
    </div>
  );
}
