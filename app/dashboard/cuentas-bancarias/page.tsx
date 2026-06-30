'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/lib/store';
import { banksApi } from '@/lib/api/banks';
import AddBankAccountModal from '@/components/modals/AddBankAccountModal';
import { Plus, Trash2, AlertTriangle, Building2 } from 'lucide-react';
import Image from 'next/image';
import type { BankAccount } from '@/lib/types';

const BANK_LOGOS: Record<string, string> = {
  BCP: '/BCP.png',
  INTERBANK: '/Interbank.png',
  PICHINCHA: '/Banco Pichincha.png',
  BANBIF: '/BanBif.png',
  BBVA: '/BBVA.png',
  SCOTIABANK: '/Scotiabank.png',
};

export default function CuentasBancariasPage() {
  const { user } = useAuthStore();
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<{ account: BankAccount; index: number } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const loadAccounts = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await banksApi.getMyAccounts(user.dni);
      if (res.success && res.data) setAccounts(res.data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { loadAccounts(); }, [loadAccounts]);

  const dolares = accounts.filter(a => a.currency === '$');
  const soles   = accounts.filter(a => a.currency === 'S/');

  // ── Delete ──────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget || !user) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const res = await banksApi.removeAccount(user.dni, deleteTarget.index);
      if (res.success) { setDeleteTarget(null); await loadAccounts(); }
      else setDeleteError(res.message || 'Error al eliminar la cuenta');
    } catch (e: any) {
      setDeleteError(e.message || 'Error al eliminar la cuenta');
    } finally {
      setIsDeleting(false);
    }
  };

  // ── Account Card ────────────────────────────────────────
  const AccountCard = ({ account, originalIndex }: { account: BankAccount; originalIndex: number }) => {
    const logo = BANK_LOGOS[account.bank_name?.toUpperCase() ?? ''];
    return (
      <div style={{
        background: '#fff', border: '1px solid #e5e7eb',
        borderRadius: 12, padding: '14px 16px',
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        {/* Logo */}
        <div style={{
          width: 48, height: 48, borderRadius: 10,
          background: '#f8fafc', border: '1px solid #e5e7eb',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          {logo
            ? <Image src={logo} alt={account.bank_name} width={36} height={28} style={{ objectFit: 'contain' }} />
            : <Building2 size={22} color="#94a3b8" />
          }
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: '#1E293B' }}>{account.bank_name}</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
            {account.account_type ?? 'Ahorro'}
          </div>
          <div style={{ fontSize: 12, color: '#374151', marginTop: 3, fontFamily: 'monospace', letterSpacing: 0.5 }}>
            {account.account_number}
          </div>
          {account.origen && (
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{account.origen}</div>
          )}
        </div>

        {/* Delete */}
        <button
          onClick={() => setDeleteTarget({ account, index: originalIndex })}
          style={{
            padding: 8, borderRadius: 8, flexShrink: 0,
            border: '1px solid #fee2e2', background: '#fff5f5',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#fee2e2')}
          onMouseLeave={e => (e.currentTarget.style.background = '#fff5f5')}
        >
          <Trash2 size={14} color="#ef4444" />
        </button>
      </div>
    );
  };

  // ── Currency Section ────────────────────────────────────
  const CurrencySection = ({ label, symbol, list }: { label: string; symbol: string; list: BankAccount[] }) => (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          background: symbol === '$' ? 'rgba(22,163,74,0.10)' : 'rgba(30,41,59,0.07)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: symbol === '$' ? '#16A34A' : '#1E293B' }}>{symbol}</span>
        </div>
        <span style={{ fontWeight: 700, fontSize: 14, color: '#1E293B' }}>{label}</span>
        <span style={{ fontSize: 11, color: '#94a3b8', background: '#f1f5f9', borderRadius: 20, padding: '2px 8px', fontWeight: 600 }}>
          {list.length}
        </span>
      </div>
      {list.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '20px 16px', color: '#94a3b8',
          fontSize: 13, background: '#f8fafc', borderRadius: 10, border: '1.5px dashed #e2e8f0',
        }}>
          No tienes cuentas en {label.toLowerCase()} registradas
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {list.map(acc => (
            <AccountCard key={acc.id ?? acc.account_number} account={acc} originalIndex={accounts.indexOf(acc)} />
          ))}
        </div>
      )}
    </div>
  );

  // ── Render ──────────────────────────────────────────────
  return (
    <>
      <div style={{ padding: '28px 24px', maxWidth: 860, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: '#1E293B', margin: 0 }}>Cuentas Bancarias</h1>
            <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>Administra tus cuentas registradas</p>
          </div>
          <button
            onClick={() => setAddModalOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: '#1E293B', color: '#fff', border: 'none',
              borderRadius: 10, padding: '9px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#334155')}
            onMouseLeave={e => (e.currentTarget.style.background = '#1E293B')}
          >
            <Plus size={15} />
            Añadir
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 56 }}>
            <div className="animate-spin" style={{ width: 28, height: 28, border: '3px solid #e5e7eb', borderTopColor: '#22C55E', borderRadius: '50%' }} />
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <CurrencySection label="Dólares" symbol="$"  list={dolares} />
            <CurrencySection label="Soles"   symbol="S/" list={soles} />
          </div>
        )}
      </div>

      {/* ── Add modal ───────────────────────────────────── */}
      {user && (
        <AddBankAccountModal
          isOpen={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          onSuccess={() => { setAddModalOpen(false); loadAccounts(); }}
          dni={user.dni}
        />
      )}

      {/* ── Delete confirm modal ─────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => { if (!isDeleting) { setDeleteTarget(null); setDeleteError(null); } }} />
          <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: '32px 24px', maxWidth: 340, width: '100%', position: 'relative', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.18)' }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#fef2f2', border: '4px solid #fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <AlertTriangle size={26} color="#ef4444" />
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: '#1E293B', margin: '0 0 8px' }}>¿Eliminar cuenta?</h3>
              <p style={{ fontSize: 13, color: '#374151', margin: '0 0 4px', fontWeight: 600 }}>
                {deleteTarget.account.bank_name} · {deleteTarget.account.currency}
              </p>
              <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 4px', fontFamily: 'monospace' }}>
                {deleteTarget.account.account_number}
              </p>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 24px' }}>Esta acción no se puede deshacer.</p>
              {deleteError && (
                <div style={{ marginBottom: 16, padding: '8px 12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, fontSize: 12, color: '#dc2626' }}>
                  {deleteError}
                </div>
              )}
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => { setDeleteTarget(null); setDeleteError(null); }}
                  disabled={isDeleting}
                  style={{ flex: 1, padding: '11px', borderRadius: 10, border: '1px solid #e5e7eb', background: '#fff', fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  style={{ flex: 1, padding: '11px', borderRadius: 10, border: 'none', background: '#ef4444', fontSize: 13, fontWeight: 700, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, opacity: isDeleting ? 0.7 : 1 }}
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin" style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
                      Eliminando...
                    </>
                  ) : 'Sí, eliminar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
