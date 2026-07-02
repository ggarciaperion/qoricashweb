'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { useExchangeStore } from '@/lib/store/exchangeStore';
import { useOperationEventStore } from '@/lib/store/operationEventStore';
import { operationsApi } from '@/lib/api/operations';
import { banksApi } from '@/lib/api/banks';
import { parseSafeDate } from '@/lib/utils/date';
import type { Operation, ClientStats } from '@/lib/types';
import AddBankAccountModal from '@/components/AddBankAccountModal';
import ConfirmModal from '@/components/ConfirmModal';
import ChangePasswordModal from '@/components/ChangePasswordModal';
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  HelpCircle,
  X,
  FileText,
  Image as ImageIcon,
  Building2,
  User,
  Activity,
  ArrowRight,
  DollarSign,
  Layers,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Save,
  UserCircle,
  Trash2,
  Plus,
  Lock,
  CheckCircle,
  AlertCircle,
  Shield,
} from 'lucide-react';


/* ─── helpers ─────────────────────────────────────────────────── */
const fmt$ = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtS = (n: number) =>
  n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
/* ─── AnimatedNumber ───────────────────────────────────────────── */
function AnimatedNumber({ target, format }: { target: number; format: (n: number) => string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf: number;
    const t0 = performance.now();
    const dur = 1100;
    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setVal(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return <>{format(val)}</>;
}

const fmtDate = (s: string) =>
  (parseSafeDate(s) ?? new Date()).toLocaleDateString('es-PE', { timeZone: 'America/Lima', day: '2-digit', month: 'short', year: '2-digit' });
const fmtTime = (s: string) =>
  (parseSafeDate(s) ?? new Date()).toLocaleTimeString('es-PE', { timeZone: 'America/Lima', hour: '2-digit', minute: '2-digit' });

/* ─── status config ───────────────────────────────────────────── */
const STATUS: Record<string, { label: string; dot: string; pill: string }> = {
  pendiente:  { label: 'Pendiente',  dot: 'bg-amber-400 animate-pulse', pill: 'bg-amber-50 text-amber-700 border-amber-200'      },
  en_proceso: { label: 'En proceso', dot: 'bg-blue-400 animate-pulse',  pill: 'bg-blue-50 text-blue-700 border-blue-200'         },
  completado: { label: 'Completado', dot: 'bg-primary-500',             pill: 'bg-primary-50 text-primary-700 border-primary-200' },
  cancelado:  { label: 'Cancelado',  dot: 'bg-gray-400',               pill: 'bg-gray-100 text-gray-600 border-gray-200'         },
  rechazado:  { label: 'Rechazado',  dot: 'bg-rose-500',               pill: 'bg-rose-50 text-rose-700 border-rose-200'          },
};

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, updateUser } = useAuthStore();
  const { currentRates, isConnected } = useExchangeStore();
  const { lastEvent } = useOperationEventStore();

  const [operations, setOperations]               = useState<Operation[]>([]);
  const [stats, setStats]                         = useState<ClientStats | null>(null);
  const [isLoading, setIsLoading]                 = useState(true);
  const [activeTab, setActiveTab]                 = useState<'todas' | 'pendientes' | 'completadas'>('todas');
  const [selectedOperation, setSelectedOperation] = useState<any>(null);
  const [isOperationModalOpen, setIsOperationModalOpen] = useState(false);
  const [currentPage, setCurrentPage]             = useState(1);
  const operationsPerPage = 10;

  /* ── Profile panel state ────────────────────────────────────── */
  const [showProfile, setShowProfile]             = useState(false);
  const [isEditing, setIsEditing]                 = useState(false);
  const [profileForm, setProfileForm]             = useState({ phone: '', email: '' });
  const [isSaving, setIsSaving]                   = useState(false);
  const [profileMsg, setProfileMsg]               = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen]     = useState(false);
  const [accountToDelete, setAccountToDelete]             = useState<number | null>(null);
  const [isDeletingAccount, setIsDeletingAccount]         = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [noticias, setNoticias] = useState<any[]>([]);
  const [noticiaIdx, setNoticiaIdx] = useState(0);
  const [tasas, setTasas] = useState<{ sunat: any; sbs: any } | null>(null);

  useEffect(() => {
    if (searchParams.get('perfil') === '1') {
      setShowProfile(true);
      setProfileMsg(null);
      setIsEditing(false);
      router.replace('/dashboard');
    } else if (searchParams.get('home') === '1') {
      setShowProfile(false);
      router.replace('/dashboard');
    }
  }, [searchParams]);

  useEffect(() => {
    fetch('/api/noticias')
      .then(r => r.json())
      .then((data: any[]) => { if (Array.isArray(data)) setNoticias(data); })
      .catch(() => {});
    fetch('/api/tasas')
      .then(r => r.json())
      .then(data => setTasas(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (noticias.length < 2) return;
    const t = setInterval(() => setNoticiaIdx(i => (i + 1) % noticias.length), 4000);
    return () => clearInterval(t);
  }, [noticias.length]);

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    loadData();
  }, [isAuthenticated]);

  /* sync profile form when user changes */
  useEffect(() => {
    if (user) setProfileForm({ phone: user.phone || user.telefono || '', email: user.email || '' });
  }, [user]);

  useEffect(() => { setCurrentPage(1); }, [activeTab]);

  useEffect(() => {
    if (!lastEvent || !isAuthenticated) return;
    loadData();
  }, [lastEvent]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadData = async () => {
    if (!user?.dni) return;
    setIsLoading(true);
    try {
      const [opsRes, statsRes] = await Promise.all([
        operationsApi.getMyOperations(user.dni),
        operationsApi.getStats(user.dni),
      ]);
      const ops = opsRes.success && opsRes.data ? opsRes.data : [];
      const st  = statsRes.success && statsRes.data ? statsRes.data : null;
      setOperations(ops);
      if (st) setStats(st);
    } catch (e) {
      console.error(e);
      setOperations([]);
    }
    finally { setIsLoading(false); }
  };

  const filtered = operations.filter((op) => {
    if (activeTab === 'pendientes')  return op.estado === 'pendiente' || op.estado === 'en_proceso';
    if (activeTab === 'completadas') return op.estado === 'completado';
    return true;
  });
  const totalPages = Math.ceil(filtered.length / operationsPerPage);
  const paginated  = filtered.slice((currentPage - 1) * operationsPerPage, currentPage * operationsPerPage);

  const handleOpClick = (op: Operation) => {
    if (op.estado === 'pendiente') {
      if (op.origen && op.origen !== 'web') { router.push(`/dashboard/operaciones/${op.id}`); return; }
      if (!op.codigo_operacion) { router.push(`/dashboard/operaciones/${op.id}`); return; }
      router.push(`/dashboard/nueva-operacion?operation_id=${op.codigo_operacion}`);
    } else {
      setSelectedOperation(op);
      setIsOperationModalOpen(true);
    }
  };

  /* ── Profile handlers ──────────────────────────────────────── */
  const handleProfileSave = async () => {
    setIsSaving(true);
    setProfileMsg(null);
    try {
      if (user) updateUser({ ...user, phone: profileForm.phone, telefono: profileForm.phone, email: profileForm.email });
      setProfileMsg({ type: 'success', text: 'Perfil actualizado correctamente' });
      setIsEditing(false);
    } catch { setProfileMsg({ type: 'error', text: 'Error al actualizar el perfil' }); }
    finally { setIsSaving(false); }
  };

  const handleAddAccountSuccess = (updatedAccounts: any[]) => {
    if (user) updateUser({ ...user, bank_accounts: updatedAccounts });
    setProfileMsg({ type: 'success', text: 'Cuenta bancaria agregada exitosamente' });
  };

  const handleDeleteAccount = async () => {
    if (!user || accountToDelete === null) return;
    setIsDeletingAccount(true);
    try {
      const response = await banksApi.removeAccount(user.dni, accountToDelete);
      if (response.success) {
        updateUser({ ...user, bank_accounts: response.bank_accounts || [] });
        setProfileMsg({ type: 'success', text: 'Cuenta bancaria eliminada exitosamente' });
        setIsDeleteConfirmOpen(false);
        setAccountToDelete(null);
      } else {
        setProfileMsg({ type: 'error', text: response.message || 'Error al eliminar la cuenta' });
      }
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: err?.message || 'Error al eliminar la cuenta' });
    } finally { setIsDeletingAccount(false); }
  };

  const handlePasswordChange = async (_data: { currentPassword?: string; newPassword: string }) => {
    // TODO: conectar al endpoint real cuando salga de demo
    await new Promise(r => setTimeout(r, 900)); // simula latencia
    setProfileMsg({ type: 'success', text: 'Contraseña actualizada exitosamente' });
    return { success: true, message: 'Contraseña actualizada exitosamente' };
  };

  const displayName =
    user?.document_type === 'RUC'
      ? user?.razon_social || user?.nombres
      : user?.apellidos ? `${user?.nombres} ${user?.apellidos}` : user?.nombres;

  const firstName = user?.nombres?.split(' ')[0];

  /* ── Loading ─────────────────────────────────────────────────── */
  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: '#ffffff' }}>
      <div className="text-center">
        <div className="relative w-12 h-12 mx-auto mb-4">
          <div className="absolute inset-0 rounded-full border-2" style={{ borderColor: 'rgba(30,41,59,0.1)' }} />
          <div className="absolute inset-0 rounded-full border-2 border-t-primary-500 animate-spin" />
        </div>
        <p className="text-sm font-medium" style={{ color: 'rgba(30,41,59,0.35)' }}>Cargando...</p>
      </div>
    </div>
  );

  /* ═══════════════════════════════════════════════════════════════ */
  return (
    <>
      {/* ── PROFILE PANEL ──────────────────────────────────────── */}
      {showProfile && user && (
        <main className="p-4 sm:p-6 space-y-3 max-w-2xl mx-auto" style={{ animation: 'profileSlideIn 0.32s cubic-bezier(0.22,1,0.36,1) both' }}>
          <style>{`
            @keyframes profileSlideIn {
              from { opacity: 0; transform: translateY(18px); }
              to   { opacity: 1; transform: translateY(0); }
            }
          `}</style>
          {/* Back button */}
          <button
            onClick={() => { setShowProfile(false); setIsEditing(false); setProfileMsg(null); }}
            className="flex items-center gap-1.5 text-xs font-semibold transition-colors"
            style={{ color: 'rgba(30,41,59,0.45)' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#1E293B')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(30,41,59,0.45)')}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Volver al inicio
          </button>

          {/* Profile header */}
          <div className="rounded-xl flex items-center gap-3 px-4 py-3" style={{ background: 'linear-gradient(135deg, #0D1B2A 0%, #1a3353 100%)' }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.12)' }}>
              {user.document_type === 'RUC'
                ? <Building2 className="w-4 h-4 text-white/80" />
                : <UserCircle className="w-4 h-4 text-white/80" />}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-black text-white leading-tight truncate">
                {user.document_type === 'RUC' ? user.razon_social : user.apellidos ? `${user.nombres} ${user.apellidos}` : user.nombres}
              </p>
              <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{user.document_type} · {user.dni}</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full flex-shrink-0" style={{ background: 'rgba(34,197,94,0.15)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
              <span className="text-[10px] font-semibold text-primary-300">{user.estado || 'Activo'}</span>
            </div>
          </div>

          {/* Alert message */}
          {profileMsg && (
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium ${profileMsg.type === 'success' ? 'bg-primary-50 border-primary-200 text-primary-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
              {profileMsg.type === 'success' ? <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 text-primary-600" /> : <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-red-600" />}
              {profileMsg.text}
            </div>
          )}

          {/* Personal info */}
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1" style={{ color: 'rgba(30,41,59,0.35)' }}>
              <FileText className="w-3 h-3" /> Información Personal
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { label: 'Tipo doc.', value: user.document_type },
                { label: 'Número', value: user.dni },
                ...(user.document_type === 'RUC'
                  ? [{ label: 'Razón Social', value: user.razon_social }, { label: 'Contacto', value: user.persona_contacto }]
                  : [{ label: 'Nombres', value: user.nombres }, { label: 'Ap. Paterno', value: user.apellido_paterno || user.apellidos }, { label: 'Ap. Materno', value: user.apellido_materno || '-' }]),
              ].map(({ label, value }) => (
                <div key={label} className="rounded-lg px-2.5 py-1.5" style={{ background: '#F8FAFC', border: '1px solid rgba(13,27,42,0.07)' }}>
                  <p className="text-[8px] font-bold uppercase tracking-wider leading-none mb-0.5" style={{ color: 'rgba(30,41,59,0.38)' }}>{label}</p>
                  <p className="text-xs font-semibold truncate" style={{ color: '#1E293B' }}>{value || '-'}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact info */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[9px] font-bold uppercase tracking-widest flex items-center gap-1" style={{ color: 'rgba(30,41,59,0.35)' }}>
                <Mail className="w-3 h-3" /> Contacto
              </p>
              {!isEditing && (
                <button onClick={() => setIsEditing(true)}
                  className="text-[10px] font-bold px-2 py-0.5 rounded transition-colors"
                  style={{ color: '#ffffff', background: '#22C55E', border: '1px solid #16A34A' }}>
                  Editar
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <div className="rounded-lg px-2.5 py-1.5" style={{ background: '#F8FAFC', border: '1px solid rgba(13,27,42,0.07)' }}>
                <p className="text-[8px] font-bold uppercase tracking-wider leading-none mb-0.5" style={{ color: 'rgba(30,41,59,0.38)' }}>Teléfono</p>
                {isEditing ? (
                  <input type="tel" value={profileForm.phone} onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full text-xs font-semibold bg-transparent outline-none border-b" style={{ color: '#1E293B', borderColor: '#22C55E' }} />
                ) : (
                  <p className="text-xs font-semibold truncate" style={{ color: '#1E293B' }}>{user.phone || user.telefono || '-'}</p>
                )}
              </div>
              <div className="rounded-lg px-2.5 py-1.5" style={{ background: '#F8FAFC', border: '1px solid rgba(13,27,42,0.07)' }}>
                <p className="text-[8px] font-bold uppercase tracking-wider leading-none mb-0.5" style={{ color: 'rgba(30,41,59,0.38)' }}>Correo</p>
                {isEditing ? (
                  <input type="email" value={profileForm.email} onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full text-xs font-semibold bg-transparent outline-none border-b" style={{ color: '#1E293B', borderColor: '#22C55E' }} />
                ) : (
                  <p className="text-xs font-semibold truncate" style={{ color: '#1E293B' }}>{user.email || '-'}</p>
                )}
              </div>
            </div>
            {isEditing && (
              <div className="flex gap-1.5 mt-2">
                <button onClick={handleProfileSave} disabled={isSaving}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)' }}>
                  <Save className="w-3 h-3" />{isSaving ? 'Guardando...' : 'Guardar'}
                </button>
                <button onClick={() => { setIsEditing(false); setProfileForm({ phone: user.phone || user.telefono || '', email: user.email || '' }); }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                  style={{ background: '#F1F5F9', color: 'rgba(30,41,59,0.6)' }}>
                  Cancelar
                </button>
              </div>
            )}
          </div>

          {/* Security */}
          <div className="flex items-center justify-between rounded-lg px-3 py-2.5" style={{ background: '#F8FAFC', border: '1px solid rgba(13,27,42,0.07)' }}>
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'rgba(30,41,59,0.35)' }} />
              <p className="text-xs font-semibold" style={{ color: '#1E293B' }}>Contraseña</p>
            </div>
            <button onClick={() => setIsChangePasswordModalOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold text-white transition"
              style={{ background: 'linear-gradient(135deg, #0D1B2A 0%, #1a3353 100%)' }}>
              <Lock className="w-3 h-3" /> Cambiar
            </button>
          </div>

          {/* Address */}
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1" style={{ color: 'rgba(30,41,59,0.35)' }}>
              <MapPin className="w-3 h-3" /> Dirección
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { label: 'Dirección', value: user.direccion, wide: true },
                { label: 'Distrito', value: user.distrito },
                { label: 'Provincia', value: user.provincia },
                { label: 'Departamento', value: user.departamento },
              ].map(({ label, value, wide }) => (
                <div key={label} className={`rounded-lg px-2.5 py-1.5${wide ? ' col-span-2' : ''}`} style={{ background: '#F8FAFC', border: '1px solid rgba(13,27,42,0.07)' }}>
                  <p className="text-[8px] font-bold uppercase tracking-wider leading-none mb-0.5" style={{ color: 'rgba(30,41,59,0.38)' }}>{label}</p>
                  <p className="text-xs font-semibold truncate" style={{ color: '#1E293B' }}>{value || '-'}</p>
                </div>
              ))}
            </div>
          </div>

        </main>
      )}

      {/* ── MAIN DASHBOARD ─────────────────────────────────────── */}
      {!showProfile && <main className="p-4 sm:p-6 space-y-5">


          {/* TC rates strip */}
          <div className="flex items-center justify-center gap-3 px-4 py-3 rounded-2xl" style={{ background: 'rgba(30,41,59,0.03)', border: '1px solid rgba(30,41,59,0.07)' }}>
            <div className="flex items-center gap-1.5 mr-1">
              <span className="relative flex w-2 h-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#ef4444' }} />
                <span className="relative inline-flex w-2 h-2 rounded-full" style={{ background: '#ef4444' }} />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(30,41,59,0.35)' }}>
                Tipo de Cambio <span style={{ color: '#ef4444' }}>live</span>
              </span>
            </div>
            {currentRates ? (
              <>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: '#0369a1' }}>
                  <TrendingDown className="w-3.5 h-3.5 text-white/70" />
                  <span className="text-[10px] font-bold uppercase tracking-wide text-white/70">Compramos</span>
                  <span className="text-sm font-black tabular-nums text-white" style={{ fontFamily: 'var(--font-poppins)' }}>{currentRates.tipo_compra.toFixed(3)}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: '#15803d' }}>
                  <TrendingUp className="w-3.5 h-3.5 text-white/70" />
                  <span className="text-[10px] font-bold uppercase tracking-wide text-white/70">Vendemos</span>
                  <span className="text-sm font-black tabular-nums text-white" style={{ fontFamily: 'var(--font-poppins)' }}>{currentRates.tipo_venta.toFixed(3)}</span>
                </div>
              </>
            ) : (
              <span className="text-xs" style={{ color: 'rgba(30,41,59,0.35)' }}>Cargando...</span>
            )}
          </div>

          {/* Welcome + stats */}
          <div>
            <h1 className="text-xl font-black mb-4" style={{ color: '#1E293B' }}>
              ¡Bienvenido, <span style={{ color: '#22C55E' }}>{firstName}</span>!
            </h1>
            {stats && currentRates && (() => {
              const spreadVal = currentRates.tipo_venta && currentRates.tipo_compra
                ? (currentRates.tipo_venta - currentRates.tipo_compra) * 1000
                : 0;
              const cards = [
                { label: 'Operaciones', target: stats.total_operations, icon: Layers,     bg: '#064E3B', shadow: 'rgba(6,78,59,0.35)',    fmt: (n: number) => Math.round(n).toString()                   },
                { label: 'Vol. Dólares', target: stats.total_dolares,   icon: DollarSign, bg: '#1E3A8A', shadow: 'rgba(30,58,138,0.35)',  fmt: (n: number) => `$${fmt$(n)}`                              },
                { label: 'Vol. Soles',   target: stats.total_soles,     icon: Activity,   bg: '#3B0764', shadow: 'rgba(59,7,100,0.35)',   fmt: (n: number) => `S/${fmtS(n)}`                             },
                { label: 'Spread',       target: spreadVal,             icon: TrendingUp, bg: '#431407', shadow: 'rgba(67,20,7,0.35)',    fmt: (n: number) => spreadVal ? `${n.toFixed(1)} pips` : '—'   },
              ];
              return (
                <div className="flex flex-wrap gap-2 justify-center">
                  {cards.map(({ label, target, icon: Icon, bg, shadow, fmt }) => (
                    <div
                      key={label}
                      className="relative rounded-xl px-3 py-2.5 flex flex-col gap-1.5 transition-all hover:-translate-y-0.5 cursor-default overflow-hidden"
                      style={{ width: 148, background: bg, boxShadow: `0 4px 14px ${shadow}` }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px ${shadow}`; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 14px ${shadow}`; }}
                    >
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.12)' }}>
                        <Icon className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.1em] leading-none mb-0.5" style={{ color: 'rgba(255,255,255,0.55)' }}>{label}</p>
                        <p className="text-sm font-black tabular-nums truncate leading-tight text-white" style={{ fontFamily: 'var(--font-poppins)' }}>
                          <AnimatedNumber target={target} format={fmt} />
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>

          {/* Quick actions */}
          <div style={{ maxWidth: 'calc(4 * 148px + 3 * 8px)', margin: '1.5rem auto 0', width: '100%' }}>

          <div className="flex flex-wrap justify-center gap-3">
              {[
                {
                  icon: RefreshCw,
                  label: 'Cambiar\ndólares',
                  action: () => router.push('/dashboard/nueva-operacion'),
                  primary: true,
                },
                {
                  icon: Building2,
                  label: 'Cuentas\nbancarias',
                  action: () => router.push('/dashboard/cuentas-bancarias'),
                  primary: false,
                },
                {
                  icon: User,
                  label: 'Mi\nperfil',
                  action: () => { setShowProfile(true); setProfileMsg(null); setIsEditing(false); },
                  primary: false,
                },
                {
                  icon: HelpCircle,
                  label: 'Recibir\nayuda',
                  action: () => window.open('https://wa.me/51926011920?text=Hola%2C%20necesito%20ayuda%20con%20mi%20cuenta%20de%20QoriCash.', '_blank'),
                  primary: false,
                },
              ].map(({ icon: Icon, label, action, primary }) => (
                <button
                  key={label}
                  onClick={action}
                  className="flex flex-col items-center gap-2 py-2 px-3 transition-all active:scale-[0.95] group"
                  style={{ outline: 'none' }}
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:-translate-y-1"
                    style={primary
                      ? { background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)', boxShadow: '0 4px 14px rgba(34,197,94,0.30)' }
                      : { background: 'white', border: '1px solid rgba(30,41,59,0.08)', boxShadow: '0 2px 8px rgba(30,41,59,0.06)' }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.boxShadow = primary
                        ? '0 8px 20px rgba(34,197,94,0.45)'
                        : '0 6px 16px rgba(30,41,59,0.14)';
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.boxShadow = primary
                        ? '0 4px 14px rgba(34,197,94,0.30)'
                        : '0 2px 8px rgba(30,41,59,0.06)';
                    }}
                  >
                    <Icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110"
                      style={{ color: primary ? 'white' : 'rgba(30,41,59,0.5)' }} />
                  </div>
                  <span className="text-center text-xs font-semibold leading-tight whitespace-pre-line transition-all duration-200 group-hover:text-green-600 group-hover:-translate-y-1"
                    style={{ color: 'rgba(30,41,59,0.6)' }}>{label}</span>
                </button>
              ))}
          </div>
          </div>

          {/* ── BANCOS PRINCIPALES + NOTICIAS + TASAS ───────────────── */}
          <div className="flex gap-2 items-stretch" style={{ maxWidth: 'calc(4 * 148px + 3 * 8px)', margin: '2rem auto 0', width: '100%' }}>
            {/* Columna izquierda: Logos */}
            <div className="flex flex-col gap-1" style={{ width: '50%' }}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: 'rgba(30,41,59,0.42)' }}>Operaciones inmediatas</p>
              <div className="rounded-xl flex flex-col flex-1 overflow-hidden" style={{ background: '#ffffff', border: '1px solid rgba(13,27,42,0.08)', boxShadow: '0 2px 12px rgba(13,27,42,0.06)' }}>
                {/* Sección principal — operaciones inmediatas */}
                <div className="flex flex-col items-center px-4 pt-5 pb-4">
                  <div className="flex items-center justify-around w-full gap-1">
                    {[
                      { src: '/BCP.png',       alt: 'BCP',       h: 'h-11' },
                      { src: '/Interbank.png', alt: 'Interbank', h: 'h-12' },
                      { src: '/BanBif.png',    alt: 'BanBif',    h: 'h-11' },
                    ].map(({ src, alt, h }) => (
                      <div key={alt} className="flex items-center justify-center rounded-lg p-1.5" style={{ background: '#F8FAFC', flex: 1 }}>
                        <img src={src} alt={alt} className={`${h} w-auto object-contain`} />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 mt-3">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#22C55E' }} />
                    <span className="text-[8px] font-bold" style={{ color: '#16A34A' }}>Acreditación en 10 minutos</span>
                  </div>
                </div>

                {/* Divisor con etiqueta */}
                <div className="relative flex items-center px-4 py-0.5">
                  <div className="flex-1" style={{ height: 1, background: 'rgba(13,27,42,0.07)' }} />
                  <span className="mx-2 text-[7px] font-bold uppercase tracking-[0.14em] px-2 py-0.5 rounded-full" style={{ background: '#F1F5F9', color: 'rgba(13,27,42,0.35)' }}>otros bancos</span>
                  <div className="flex-1" style={{ height: 1, background: 'rgba(13,27,42,0.07)' }} />
                </div>

                {/* Sección interbancaria */}
                <div className="flex flex-col items-center px-4 pt-3 pb-4 flex-1 justify-between">
                  <div className="flex items-center justify-around w-full gap-2 mb-3">
                    {[
                      { src: '/BBVA.png',           alt: 'BBVA'      },
                      { src: '/Scotiabank.png',      alt: 'Scotiabank'},
                      { src: '/Banco Pichincha.png', alt: 'Pichincha' },
                      { src: '/bancosantander.png',  alt: 'Santander' },
                    ].map(({ src, alt }) => (
                      <img key={alt} src={src} alt={alt} className="h-6 w-auto object-contain" style={{ filter: 'grayscale(1)', opacity: 0.4 }} />
                    ))}
                  </div>
                  <div className="rounded-lg px-3 py-2 w-full text-center" style={{ background: '#F8FAFC' }}>
                    <p className="text-[8px] font-black uppercase tracking-[0.1em]" style={{ color: 'rgba(13,27,42,0.55)' }}>
                      o cualquier otro banco
                    </p>
                    <p className="text-[7px] font-semibold mt-0.5" style={{ color: 'rgba(13,27,42,0.35)' }}>
                      Solo Lima · 2 a 24 hrs según horario
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Columna derecha: Noticias + Tasas */}
            <div className="flex flex-col gap-1" style={{ width: '50%' }}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: 'rgba(30,41,59,0.42)' }}>Noticias que mueven el TC</p>
              {/* Carrusel */}
              <div className="rounded-xl overflow-hidden relative" style={{ height: 90 }}>
                {noticias.map((item, i) => (
                  <a key={item.id} href={`/noticias/${item.id}`}
                    className="absolute inset-0 transition-opacity duration-700"
                    style={{ opacity: i === noticiaIdx ? 1 : 0, pointerEvents: i === noticiaIdx ? 'auto' : 'none' }}>
                    {item.imagen && <img src={item.imagen} alt={item.titulo} className="absolute inset-0 w-full h-full object-cover" />}
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.25) 60%, transparent 100%)' }} />
                    <div className="absolute bottom-0 left-0 right-0 px-2 pb-5 pt-2">
                      <span className="text-[7px] font-bold uppercase tracking-wide block mb-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>
                        {item.categoria} · {item.fuente}
                      </span>
                      <p className="text-[9px] font-semibold leading-tight text-white" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {item.titulo}
                      </p>
                    </div>
                  </a>
                ))}
                <div className="absolute bottom-1.5 left-0 right-0 flex justify-center items-center gap-1">
                  {[-1, 0, 1].map(offset => {
                    const isActive = offset === 0;
                    return (
                      <button key={offset}
                        onClick={() => setNoticiaIdx((noticiaIdx + offset + noticias.length) % noticias.length)}
                        className="rounded-full transition-all"
                        style={{ width: isActive ? 12 : 5, height: 5, background: isActive ? 'white' : 'rgba(255,255,255,0.4)' }} />
                    );
                  })}
                </div>
              </div>
              {/* Tasas */}
              <div className="rounded-xl px-4 flex-1 flex flex-col justify-between py-4" style={{ background: '#0D1B2A' }}>
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] mb-3" style={{ color: 'rgba(255,255,255,0.35)' }}>Referencia del mercado</p>
                <div className="flex flex-col flex-1 justify-around">
                  {[
                    { logo: '/sunat.png',        label: 'SUNAT',    compra: tasas?.sunat?.compra,       venta: tasas?.sunat?.venta        },
                    { logo: '/sbs.png',           label: 'SBS',      compra: tasas?.sbs?.compra,         venta: tasas?.sbs?.venta          },
                    { logo: '/logo-principal.png', label: 'QoriCash', compra: currentRates?.tipo_compra, venta: currentRates?.tipo_venta   },
                  ].map(({ logo, label, compra, venta }) => (
                    <div key={label} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5" style={{ minWidth: 72 }}>
                        <img src={logo} alt={label} className="w-4 h-4 object-contain rounded-sm" />
                        <span className="text-[10px] font-bold text-white">{label}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] font-semibold" style={{ color: 'rgba(255,255,255,0.45)' }}>
                          Compra <span className="font-black text-[10px] text-white">{compra ? `S/ ${Number(compra).toFixed(3)}` : '—'}</span>
                        </span>
                        <span className="text-[9px] font-semibold" style={{ color: 'rgba(255,255,255,0.45)' }}>
                          Venta <span className="font-black text-[10px] text-white">{venta ? `S/ ${Number(venta).toFixed(3)}` : '—'}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>



      </main>}

      {/* ── PROFILE MODALS ────────────────────────────────────────── */}
      {user && <>
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
          onCancel={() => { setIsDeleteConfirmOpen(false); setAccountToDelete(null); }}
          isLoading={isDeletingAccount}
        />
        <ChangePasswordModal
          isOpen={isChangePasswordModalOpen}
          onClose={() => setIsChangePasswordModalOpen(false)}
          onSubmit={handlePasswordChange}
          requireCurrentPassword={true}
          canClose={true}
        />
      </>}

      {/* ── OPERATION DETAIL MODAL ────────────────────────────────── */}
      {isOperationModalOpen && selectedOperation && (
        <div
          className="animate-modal-backdrop fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-md p-4"
          onClick={() => setIsOperationModalOpen(false)}
        >
          <div
            className="animate-modal-slide-up bg-white rounded-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto"
            style={{ boxShadow: '0 32px 64px rgba(0,0,0,0.28), 0 0 0 1px rgba(255,255,255,0.06)' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="relative flex items-center justify-between px-5 py-4 overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #0D1B2A 0%, #1a3353 100%)' }}
            >
              <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full pointer-events-none"
                style={{ background: selectedOperation.tipo === 'compra' ? 'rgba(34,197,94,0.12)' : 'rgba(59,130,246,0.12)', filter: 'blur(24px)' }} />
              <div className="absolute -bottom-6 right-10 w-20 h-20 rounded-full pointer-events-none"
                style={{ background: selectedOperation.tipo === 'compra' ? 'rgba(34,197,94,0.08)' : 'rgba(59,130,246,0.08)', filter: 'blur(20px)' }} />

              <div className="relative flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: selectedOperation.tipo === 'compra' ? 'rgba(34,197,94,0.2)' : 'rgba(59,130,246,0.2)' }}
                >
                  {selectedOperation.tipo === 'compra'
                    ? <TrendingDown className="w-[18px] h-[18px] text-primary-400" />
                    : <TrendingUp className="w-[18px] h-[18px] text-blue-400" />}
                </div>
                <div>
                  <p className="text-white font-extrabold text-sm leading-tight">
                    {selectedOperation.tipo === 'compra' ? 'QoriCash Compra' : 'QoriCash Vende'}
                  </p>
                  <p className="text-[10px] font-mono font-medium mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    {selectedOperation.codigo_operacion || selectedOperation.operation_id || `#${selectedOperation.id}`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOperationModalOpen(false)}
                className="relative p-1.5 rounded-lg transition-colors"
                style={{ color: 'rgba(255,255,255,0.4)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.9)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
              >
                <X className="w-[18px] h-[18px]" />
              </button>
            </div>

            <div className="p-5 space-y-3">

              {/* Estado + fecha */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl p-3.5" style={{ background: '#F8FAFC', border: '1px solid rgba(13,27,42,0.07)' }}>
                  <p className="text-[9px] uppercase tracking-widest font-bold mb-2" style={{ color: 'rgba(13,27,42,0.4)' }}>Estado</p>
                  {(() => {
                    const sc = STATUS[selectedOperation.estado] ?? STATUS.pendiente;
                    return (
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold ${sc.pill}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />{sc.label}
                      </div>
                    );
                  })()}
                </div>
                <div className="rounded-xl p-3.5" style={{ background: '#F8FAFC', border: '1px solid rgba(13,27,42,0.07)' }}>
                  <p className="text-[9px] uppercase tracking-widest font-bold mb-2" style={{ color: 'rgba(13,27,42,0.4)' }}>Fecha</p>
                  <p className="text-sm font-bold leading-tight" style={{ color: '#1E293B' }}>
                    {(parseSafeDate(selectedOperation.fecha_creacion) ?? new Date()).toLocaleString('es-PE', { timeZone: 'America/Lima', dateStyle: 'short', timeStyle: 'short' })}
                  </p>
                </div>
              </div>

              {/* Montos */}
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(13,27,42,0.08)' }}>
                <div className="px-4 py-2.5 border-b" style={{ background: '#F8FAFC', borderColor: 'rgba(13,27,42,0.06)' }}>
                  <p className="text-[9px] uppercase tracking-widest font-bold" style={{ color: 'rgba(13,27,42,0.4)' }}>Resumen de operación</p>
                </div>
                <div className="grid grid-cols-3 divide-x p-1" style={{ divideColor: 'rgba(13,27,42,0.06)' }}>
                  <div className="flex flex-col items-center px-2 py-4 gap-1.5">
                    <p className="text-[9px] uppercase tracking-widest font-bold text-rose-400">Usted paga</p>
                    <div className="rounded-xl px-3 py-2.5 text-center w-full" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)' }}>
                      <p className="text-lg font-black font-mono text-rose-600 leading-none">
                        {selectedOperation.tipo === 'compra'
                          ? `$${fmt$(selectedOperation.monto_dolares ?? 0)}`
                          : `S/${fmtS(selectedOperation.monto_soles ?? 0)}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center px-2 py-4 gap-1.5">
                    <p className="text-[9px] uppercase tracking-widest font-bold text-amber-500">T.C.</p>
                    <div className="rounded-xl px-3 py-2.5 text-center w-full" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)' }}>
                      <p className="text-lg font-black font-mono text-amber-600 leading-none">
                        {(selectedOperation.tipo_cambio ?? 0).toFixed(3)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center px-2 py-4 gap-1.5">
                    <p className="text-[9px] uppercase tracking-widest font-bold text-primary-500">Usted recibe</p>
                    <div className="rounded-xl px-3 py-2.5 text-center w-full" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)' }}>
                      <p className="text-lg font-black font-mono text-primary-600 leading-none">
                        {selectedOperation.tipo === 'compra'
                          ? `S/${fmtS(selectedOperation.monto_soles ?? 0)}`
                          : `$${fmt$(selectedOperation.monto_dolares ?? 0)}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cuentas */}
              {(selectedOperation.source_account || selectedOperation.destination_account) && (
                <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(13,27,42,0.08)' }}>
                  <div className="px-4 py-2.5 border-b flex items-center gap-2" style={{ background: '#F8FAFC', borderColor: 'rgba(13,27,42,0.06)' }}>
                    <Building2 className="w-3.5 h-3.5" style={{ color: 'rgba(13,27,42,0.35)' }} />
                    <p className="text-[9px] uppercase tracking-widest font-bold" style={{ color: 'rgba(13,27,42,0.4)' }}>Cuentas bancarias</p>
                  </div>
                  <div className="p-3 space-y-2">
                    {selectedOperation.source_account && (
                      <div className="rounded-lg px-3 py-2.5" style={{ background: '#F8FAFC', border: '1px solid rgba(13,27,42,0.06)' }}>
                        <p className="text-[9px] uppercase tracking-widest font-semibold mb-1" style={{ color: 'rgba(13,27,42,0.35)' }}>Cuenta origen</p>
                        <p className="text-sm font-semibold" style={{ color: '#1E293B' }}>{selectedOperation.source_account}</p>
                        {selectedOperation.source_bank && <p className="text-xs mt-0.5" style={{ color: 'rgba(30,41,59,0.35)' }}>{selectedOperation.source_bank}</p>}
                      </div>
                    )}
                    {selectedOperation.destination_account && (
                      <div className="rounded-lg px-3 py-2.5" style={{ background: '#F8FAFC', border: '1px solid rgba(13,27,42,0.06)' }}>
                        <p className="text-[9px] uppercase tracking-widest font-semibold mb-1" style={{ color: 'rgba(13,27,42,0.35)' }}>Cuenta destino</p>
                        <p className="text-sm font-semibold" style={{ color: '#1E293B' }}>{selectedOperation.destination_account}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Documentos */}
              {selectedOperation.estado?.toLowerCase() === 'completado' && (
                <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(13,27,42,0.08)' }}>
                  <div className="px-4 py-2.5 border-b flex items-center gap-2" style={{ background: '#F8FAFC', borderColor: 'rgba(13,27,42,0.06)' }}>
                    <FileText className="w-3.5 h-3.5" style={{ color: 'rgba(13,27,42,0.35)' }} />
                    <p className="text-[9px] uppercase tracking-widest font-bold" style={{ color: 'rgba(13,27,42,0.4)' }}>Documentos</p>
                  </div>
                  <div className="p-3 space-y-2">
                    {selectedOperation.payment_proof_url && (
                      <div className="rounded-lg p-3" style={{ background: '#F8FAFC', border: '1px solid rgba(13,27,42,0.06)' }}>
                        <p className="text-[9px] uppercase tracking-widest font-semibold mb-2" style={{ color: 'rgba(13,27,42,0.35)' }}>Comprobante cliente</p>
                        <div className="flex items-center gap-3">
                          <img src={selectedOperation.payment_proof_url} alt="Comprobante"
                            className="w-16 h-16 object-cover rounded-xl cursor-pointer hover:opacity-80 transition"
                            style={{ border: '1px solid rgba(13,27,42,0.08)' }}
                            onClick={() => window.open(selectedOperation.payment_proof_url, '_blank')} />
                          <a href={selectedOperation.payment_proof_url} target="_blank" rel="noopener noreferrer"
                            className="text-xs text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1.5 transition-colors">
                            <ImageIcon className="w-3.5 h-3.5" />Ver completo
                          </a>
                        </div>
                      </div>
                    )}
                    {Array.isArray(selectedOperation.operator_proofs) && selectedOperation.operator_proofs.map((proof: any, idx: number) =>
                      proof.comprobante_url ? (
                        <div key={idx} className="rounded-lg p-3" style={{ background: '#F8FAFC', border: '1px solid rgba(13,27,42,0.06)' }}>
                          <p className="text-[9px] uppercase tracking-widest font-semibold mb-2" style={{ color: 'rgba(13,27,42,0.35)' }}>Comprobante operador</p>
                          <div className="flex items-center gap-3">
                            <img src={proof.comprobante_url} alt="Comprobante operador"
                              className="w-16 h-16 object-cover rounded-xl cursor-pointer hover:opacity-80 transition"
                              style={{ border: '1px solid rgba(13,27,42,0.08)' }}
                              onClick={() => window.open(proof.comprobante_url, '_blank')} />
                            <a href={proof.comprobante_url} target="_blank" rel="noopener noreferrer"
                              className="text-xs text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1.5 transition-colors">
                              <ImageIcon className="w-3.5 h-3.5" />Ver completo
                            </a>
                          </div>
                        </div>
                      ) : null
                    )}
                    {Array.isArray(selectedOperation.invoices) && selectedOperation.invoices.map((inv: any, idx: number) =>
                      inv.nubefact_enlace_pdf ? (
                        <div key={idx} className="rounded-lg px-3 py-2.5 flex items-center justify-between" style={{ background: '#F8FAFC', border: '1px solid rgba(13,27,42,0.06)' }}>
                          <p className="text-xs font-semibold" style={{ color: 'rgba(30,41,59,0.65)' }}>{inv.invoice_type === '01' ? 'Factura' : 'Boleta'}{inv.invoice_number ? ` ${inv.invoice_number}` : ''}</p>
                          <a href={inv.nubefact_enlace_pdf} target="_blank" rel="noopener noreferrer"
                            className="text-xs text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1.5 transition-colors">
                            <FileText className="w-3.5 h-3.5" />Ver PDF
                          </a>
                        </div>
                      ) : null
                    )}
                  </div>
                </div>
              )}

              {/* Ver detalles */}
              <button
                onClick={() => { setIsOperationModalOpen(false); router.push(`/dashboard/operaciones/${selectedOperation.id}`); }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #0D1B2A 0%, #1a3353 100%)', color: 'rgba(255,255,255,0.85)', boxShadow: '0 4px 14px rgba(13,27,42,0.25)' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'white'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(13,27,42,0.35)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(13,27,42,0.25)'; }}
              >
                Ver detalles completos <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
