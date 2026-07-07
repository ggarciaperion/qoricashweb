'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Ticket, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useExchangeStore } from '@/lib/store/exchangeStore';
import { useReferralStore } from '@/lib/store/referralStore';

interface ExchangeRates {
  compra: number;
  venta: number;
}

interface CalculatorProps {
  initialRates?: ExchangeRates;
  showContinueButton?: boolean;
  hideHeader?: boolean;
  compact?: boolean;
  dark?: boolean;
  darkTheme?: boolean; // paleta oscura empresa, pero muestra todos los inputs
  onOperationReady?: (operationType: 'Compra' | 'Venta', amountUSD: string, exchangeRate: number) => void;
}

const PIPS = 0.003; // 30 pips = 0.003

export default function Calculator({
  initialRates,
  showContinueButton = false,
  hideHeader = false,
  compact = false,
  dark = false,
  darkTheme = false,
  onOperationReady
}: CalculatorProps) {
  // d = controla paleta de colores; dark = además oculta inputs y muestra CTA
  const d = dark || darkTheme;
  const { currentRates: liveRates, fetchRates } = useExchangeStore();
  const { hasCoupon, setHasCoupon, setReferralCode, clearReferral } = useReferralStore();

  const [operationType, setOperationType] = useState<'Compra' | 'Venta'>('Compra');
  const [amountInput, setAmountInput]   = useState('');
  const [amountOutput, setAmountOutput] = useState('');
  const [isAnimating, setIsAnimating]   = useState(false);

  // ── Cupón ─────────────────────────────────────────────────────────────────
  const [couponOpen,    setCouponOpen]    = useState(false);
  const [couponCode,    setCouponCode]    = useState('');
  const [couponStatus,  setCouponStatus]  = useState<'idle' | 'loading' | 'valid' | 'invalid'>('idle');
  const [couponMessage, setCouponMessage] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  // ── Tasas ─────────────────────────────────────────────────────────────────
  const ratesReady = liveRates !== null && liveRates !== undefined;
  const baseRates: ExchangeRates = ratesReady
    ? { compra: liveRates!.tipo_compra, venta: liveRates!.tipo_venta }
    : initialRates ?? { compra: 0, venta: 0 };

  // Tasas efectivas — con mejora si hay cupón válido aplicado
  const effectiveRates: ExchangeRates = couponApplied
    ? { compra: baseRates.compra + PIPS, venta: baseRates.venta - PIPS }
    : baseRates;

  useEffect(() => {
    fetchRates();
    const unsubscribe = useExchangeStore.getState().startRateSubscription();
    return () => { unsubscribe(); };
  }, []);

  const inputCurrency  = operationType === 'Compra' ? 'USD' : 'PEN';
  const outputCurrency = operationType === 'Compra' ? 'PEN' : 'USD';

  const formatWithCommas = (val: string) => {
    if (!val) return '';
    const [int, dec] = val.split('.');
    return int.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (dec !== undefined ? '.' + dec : '');
  };

  useEffect(() => { calculateAmount(); }, [amountInput, operationType, baseRates, couponApplied]);

  const calculateAmount = () => {
    if (!amountInput || !effectiveRates) { setAmountOutput(''); return; }
    const amount = parseFloat(amountInput);
    if (isNaN(amount) || amount <= 0)    { setAmountOutput(''); return; }
    if (operationType === 'Compra') {
      setAmountOutput((amount * effectiveRates.compra).toFixed(2));
    } else {
      setAmountOutput((amount / effectiveRates.venta).toFixed(2));
    }
  };

  const handleSwapCurrency = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    setOperationType(operationType === 'Compra' ? 'Venta' : 'Compra');
  };

  const handleContinue = () => {
    if (onOperationReady && amountInput && effectiveRates) {
      const rate = operationType === 'Compra' ? effectiveRates.compra : effectiveRates.venta;
      onOperationReady(operationType, amountInput, rate);
    }
  };

  const currentRate = operationType === 'Compra' ? effectiveRates.compra : effectiveRates.venta;

  // ── Badge lateral ─────────────────────────────────────────────────────────
  // Diferencial fijo respecto al TC de QoriCash.
  // Los bancos compran el dólar más barato y lo venden más caro.
  const BANK_SPREAD = 0.08; // 8 pips de diferencia vs banco promedio

  const getBadge = () => {
    const hasRates = baseRates.compra > 0 && baseRates.venta > 0;
    if (!hasRates) {
      return { label: 'Ahorrás hasta', value: '8%', sub: 'vs bancos' };
    }
    if (operationType === 'Compra') {
      const usdAmt = parseFloat(amountInput);
      if (isNaN(usdAmt) || usdAmt <= 0) return { label: 'Ahorrás hasta', value: '8%', sub: 'vs bancos' };
      const savings = BANK_SPREAD * usdAmt;
      return { label: 'Recibes', value: `S/ ${savings.toFixed(2)}`, sub: 'más vs bancos' };
    } else {
      const usdAmt = parseFloat(amountOutput);
      if (isNaN(usdAmt) || usdAmt <= 0) return { label: 'Ahorrás hasta', value: '8%', sub: 'vs bancos' };
      const savings = BANK_SPREAD * usdAmt;
      return { label: 'Pagás', value: `S/ ${savings.toFixed(2)}`, sub: 'menos vs bancos' };
    }
  };

  const badge = getBadge();

  // ── Cupón: input handler ──────────────────────────────────────────────────
  const handleCouponInput = (raw: string) => {
    // Solo A-Z y 0-9, auto-uppercase, sin espacios ni especiales ni emojis
    const filtered = raw.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setCouponCode(filtered);
    if (couponStatus !== 'idle') {
      setCouponStatus('idle');
      setCouponMessage('');
    }
  };

  // Códigos válidos localmente (demo / pruebas)
  const LOCAL_VALID_CODES = ['QORI2026', 'VIPCLIENTE', 'PROMO30'];

  const handleApplyCoupon = async () => {
    if (!couponCode || couponStatus === 'loading') return;
    setCouponStatus('loading');
    setCouponMessage('');

    // Validación local para códigos de demo — evita depender del backend
    if (LOCAL_VALID_CODES.includes(couponCode)) {
      await new Promise((r) => setTimeout(r, 600)); // feedback visual de carga
      setCouponStatus('valid');
      setCouponMessage('¡Cupón aplicado! Tasa mejorada en 30 pips');
      setCouponApplied(true);
      setHasCoupon(true);
      setReferralCode(couponCode);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://app.qoricash.pe'}/api/referrals/validate`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ code: couponCode }),
        }
      );
      const data = await res.json();
      if (data.success && data.is_valid) {
        setCouponStatus('valid');
        setCouponMessage(data.message || '¡Cupón aplicado! Tasa mejorada en 30 pips');
        setCouponApplied(true);
        setHasCoupon(true);
        setReferralCode(couponCode);
      } else {
        setCouponStatus('invalid');
        setCouponMessage(data.message || 'Código inválido o ya utilizado');
        setCouponApplied(false);
      }
    } catch {
      setCouponStatus('invalid');
      setCouponMessage('Error al validar. Intenta nuevamente.');
    }
  };

  const handleRemoveCoupon = () => {
    setCouponApplied(false);
    setCouponCode('');
    setCouponStatus('idle');
    setCouponMessage('');
    clearReferral();
  };

  return (
    <div className="relative w-full">

      {/* Badge dinámico lateral — solo lg+, oculto en modo compacto */}
      <div className={`${compact || d ? 'hidden' : 'hidden lg:flex'} absolute z-20 flex-col items-center justify-center text-center text-white rounded-2xl px-3 py-2.5 transition-all duration-500`}
        style={{
          top: '50%', transform: 'translateY(-50%)',
          right: '-96px',
          background: d ? 'linear-gradient(135deg, #8fb8cc 0%, #4A6884 55%, #1e3a50 100%)' : '#22C55E',
          boxShadow: d ? '0 6px 20px rgba(74,104,132,0.4)' : '0 6px 20px rgba(34,197,94,0.3)',
          width: '86px',
          fontSize: '10px',
        }}
      >
        <div className="font-bold tracking-wide uppercase opacity-80 leading-tight mb-0.5" style={{ fontSize: '8px' }}>{badge.label}</div>
        <div className="font-black leading-tight" style={{ fontSize: badge.value.startsWith('S/') ? '11px' : '18px' }}>{badge.value}</div>
        <div className="font-semibold opacity-75 mt-0.5 leading-tight" style={{ fontSize: '8px' }}>{badge.sub}</div>
      </div>

      <div className={`w-full bg-transparent ${compact ? 'p-2 pt-1.5' : 'p-3 pt-2 md:p-6 md:pt-4'}`}>

        {/* Header */}
        <div className={`flex items-center justify-between px-1 ${hideHeader ? 'hidden' : ''} ${compact ? 'mb-1.5' : 'mb-2 md:mb-3'}`}>
          <p className="text-xs font-semibold" style={{ color: d ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.65)' }}>Tipos de cambio en tiempo real</p>
          <div className="flex items-center text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm"
            style={d
              ? { color: '#8fb8cc' }
              : { color: '#16a34a' }}>
            <div className="relative flex items-center mr-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: d ? '#4A6884' : '#22c55e' }} />
              <div className="absolute w-1.5 h-1.5 rounded-full animate-ping" style={{ background: d ? '#4A6884' : '#22c55e' }} />
            </div>
            En vivo
          </div>
        </div>

        {/* Tabs Compra / Venta */}
        <div className={`rounded-xl ${compact ? 'mb-2' : 'mb-3 md:mb-6'}`}
          style={{ background: d ? 'rgba(255,255,255,0.06)' : 'transparent', boxShadow: d ? 'inset 0 1px 0 rgba(255,255,255,0.06)' : 'none' }}>
        <div className="relative grid grid-cols-2 backdrop-blur-sm p-1.5 rounded-xl"
          style={{ background: d ? 'transparent' : 'rgba(255,255,255,0.4)', boxShadow: d ? 'none' : 'inset 0 2px 4px rgba(0,0,0,0.06)' }}>

          {/* Pill deslizante */}
          <div
            className="absolute top-1.5 bottom-1.5 rounded-lg pointer-events-none"
            style={{
              width: 'calc(50% - 6px)',
              left: operationType === 'Compra' ? '6px' : 'calc(50% + 0px)',
              background: d ? 'linear-gradient(135deg, #8fb8cc 0%, #4A6884 55%, #1e3a50 100%)' : 'linear-gradient(135deg, #22C55E 0%, #16a34a 100%)',
              boxShadow: d ? '0 4px 14px rgba(74,104,132,0.4)' : '0 4px 14px rgba(34,197,94,0.35)',
              transition: 'left 0.38s cubic-bezier(0.34, 1.45, 0.64, 1)',
            }}
          />

          {/* Botón Compra */}
          <button
            onClick={() => setOperationType('Compra')}
            className={`relative z-10 font-bold text-sm rounded-lg select-none ${compact ? 'py-2 px-3' : 'py-3 px-4'}`}
            style={{ transition: 'color 0.22s ease' }}
          >
            <div className="text-xs font-medium mb-0.5"
              style={{ color: operationType === 'Compra' ? 'rgba(255,255,255,0.85)' : d ? 'rgba(255,255,255,0.4)' : 'rgba(55,65,81,0.7)', transition: 'color 0.22s ease' }}>
              Qoricash compra
            </div>
            {ratesReady ? (
              <div className="flex flex-col items-center">
                {couponApplied && (
                  <span className="text-[10px] tabular-nums leading-none"
                    style={{
                      textDecoration: 'line-through',
                      color: operationType === 'Compra' ? 'rgba(255,255,255,0.5)' : 'rgba(55,65,81,0.35)',
                      transition: 'color 0.22s ease',
                    }}>
                    S/ {baseRates.compra.toFixed(3)}
                  </span>
                )}
                <span className="text-base font-bold tabular-nums leading-tight"
                  style={{ color: operationType === 'Compra' ? '#fff' : d ? 'rgba(255,255,255,0.65)' : '#374151', transition: 'color 0.22s ease' }}>
                  S/ {effectiveRates.compra.toFixed(3)}
                </span>
              </div>
            ) : (
              <div className="h-5 w-16 rounded bg-current opacity-20 animate-pulse mx-auto mt-0.5" />
            )}
          </button>

          {/* Botón Venta */}
          <button
            onClick={() => setOperationType('Venta')}
            className={`relative z-10 font-bold text-sm rounded-lg select-none ${compact ? 'py-2 px-3' : 'py-3 px-4'}`}
            style={{ transition: 'color 0.22s ease' }}
          >
            <div className="text-xs font-medium mb-0.5"
              style={{ color: operationType === 'Venta' ? 'rgba(255,255,255,0.85)' : d ? 'rgba(255,255,255,0.4)' : 'rgba(55,65,81,0.7)', transition: 'color 0.22s ease' }}>
              Qoricash vende
            </div>
            {ratesReady ? (
              <div className="flex flex-col items-center">
                {couponApplied && (
                  <span className="text-[10px] tabular-nums leading-none"
                    style={{
                      textDecoration: 'line-through',
                      color: operationType === 'Venta' ? 'rgba(255,255,255,0.5)' : 'rgba(55,65,81,0.35)',
                      transition: 'color 0.22s ease',
                    }}>
                    S/ {baseRates.venta.toFixed(3)}
                  </span>
                )}
                <span className="text-base font-bold tabular-nums leading-tight"
                  style={{ color: operationType === 'Venta' ? '#fff' : d ? 'rgba(255,255,255,0.65)' : '#374151', transition: 'color 0.22s ease' }}>
                  S/ {effectiveRates.venta.toFixed(3)}
                </span>
              </div>
            ) : (
              <div className="h-5 w-16 rounded bg-current opacity-20 animate-pulse mx-auto mt-0.5" />
            )}
          </button>
        </div>
        {dark && (
          <button
            onClick={() => onOperationReady?.('Compra', '', 0)}
            className="iniciar-op-btn w-full rounded-b-xl font-semibold py-3 text-sm tracking-widest uppercase relative overflow-hidden"
            style={{ color: 'rgba(143,184,204,0.7)', borderTop: '1px solid rgba(143,184,204,0.12)' }}
          >
            <span className="iniciar-op-gradient absolute inset-0 rounded-b-xl pointer-events-none"
              style={{ background: 'linear-gradient(135deg, #8fb8cc 0%, #4A6884 55%, #1e3a50 100%)', opacity: 0 }} />
            <span className="iniciar-op-shimmer absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(120deg, transparent 20%, rgba(255,255,255,0.22) 50%, transparent 80%)', transform: 'translateX(-100%)' }} />
            <span className="relative z-10">INICIAR OPERACIÓN</span>
          </button>
        )}
        </div>

        {dark ? (
          /* ── Card CTA empresa ── */
          <a
            href="https://wa.me/51910624404?text=Hola%2C%20quiero%20cotizar%20con%20un%20ejecutivo%20especializado."
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col justify-between mt-4 rounded-2xl"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(143,184,204,0.25)',
              padding: '28px 24px',
              minHeight: '180px',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease, background 0.3s ease',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = 'translateY(-3px)';
              el.style.boxShadow = '0 12px 32px rgba(74,104,132,0.3)';
              el.style.borderColor = 'rgba(143,184,204,0.55)';
              el.style.background = 'rgba(255,255,255,0.10)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = 'translateY(0)';
              el.style.boxShadow = 'none';
              el.style.borderColor = 'rgba(143,184,204,0.25)';
              el.style.background = 'rgba(255,255,255,0.06)';
            }}
          >
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-3" style={{ color: '#8fb8cc' }}>
                Operaciones corporativas
              </p>
              <p className="font-black text-white leading-snug" style={{ fontSize: 'clamp(1.05rem, 2.2vw, 1.35rem)' }}>
                Importes mayores a $ 5mil cotiza con un trader <span style={{ background: 'linear-gradient(135deg, #8fb8cc 0%, #4A6884 55%, #1e3a50 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>especializado</span> para obtener mejor <span style={{ background: 'linear-gradient(135deg, #8fb8cc 0%, #4A6884 55%, #1e3a50 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>rentabilidad</span>
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold"
                style={{ background: 'rgba(143,184,204,0.15)', border: '1px solid rgba(143,184,204,0.3)', color: '#8fb8cc' }}>
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Cotizar con un ejecutivo
              </div>
              <span className="text-white/40 text-lg">→</span>
            </div>
          </a>
        ) : (
          <>
        {/* Calculadora */}
        <div className="space-y-0">

          {/* Input — Envías */}
          <div
            className={`backdrop-blur-sm rounded-xl border-2 transition-all cursor-text relative z-10 ${compact ? 'p-2' : 'p-3'} ${d ? 'hover:border-[rgba(143,184,204,0.5)]' : 'hover:border-primary-400'}`}
            style={d
              ? { background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: 'rgba(143,184,204,0.2)', boxShadow: '0 1px 8px rgba(0,0,0,0.1)' }
              : { background: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.6)', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
            onClick={(e) => {
              const input = document.getElementById('amount-input') as HTMLInputElement;
              if (input) { input.focus(); e.preventDefault(); }
            }}
          >
            <div className={`flex items-center justify-between ${compact ? 'mb-1' : 'mb-2'}`}>
              <label htmlFor="amount-input"
                className="text-xs font-bold cursor-text pointer-events-none select-none uppercase tracking-wider"
                style={{ color: d ? 'rgba(143,184,204,0.7)' : '#374151' }}>
                Envías
              </label>
              <div className="flex items-center gap-2">
                <span style={{ fontSize: '1.2em', lineHeight: 1 }}>{inputCurrency === 'USD' ? '🇺🇸' : '🇵🇪'}</span>
                <span className="font-bold text-xs" style={{ color: d ? 'rgba(255,255,255,0.7)' : '#1F2937' }}>{inputCurrency}</span>
              </div>
            </div>
            <input
              id="amount-input"
              type="text"
              inputMode="decimal"
              value={formatWithCommas(amountInput)}
              onChange={(e) => {
                const raw = e.target.value.replace(/,/g, '');
                if (/^\d*\.?\d*$/.test(raw)) setAmountInput(raw);
              }}
              placeholder="0.00"
              className={`w-full font-bold bg-transparent border-none outline-none ${compact ? 'text-lg' : 'text-xl'} placeholder-gray-400`}
              style={{ color: d ? '#ffffff' : '#111827' }}
            />
          </div>

          {/* Botón intercambio */}
          <div className={`flex justify-center relative z-20 ${compact ? '-my-4' : '-my-5'}`}>
            <button
              onClick={handleSwapCurrency}
              className={`backdrop-blur-sm border-2 rounded-full p-2.5 transition-all hover:border-primary-400 ${isAnimating ? 'rotate-180' : ''}`}
              style={{
                background: 'rgba(255,255,255,0.9)',
                borderColor: 'rgba(255,255,255,0.8)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease',
              }}
            >
              <RefreshCw className={`w-5 h-5 text-primary-500 ${isAnimating ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Output — Recibes */}
          <div className={`backdrop-blur-sm rounded-xl relative z-10 ${compact ? 'p-2' : 'p-3'}`}
            style={d
              ? { background: 'linear-gradient(135deg, rgba(74,104,132,0.25), rgba(26,51,83,0.3))', border: '1px solid rgba(143,184,204,0.2)', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }
              : { background: 'linear-gradient(135deg, rgba(240,253,244,0.9), rgba(220,252,231,0.7))', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div className={`flex items-center justify-between ${compact ? 'mb-1' : 'mb-2'}`}>
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: d ? 'rgba(143,184,204,0.7)' : '#166534' }}>Recibes</label>
              <div className="flex items-center gap-2">
                <span style={{ fontSize: '1.2em', lineHeight: 1 }}>{outputCurrency === 'USD' ? '🇺🇸' : '🇵🇪'}</span>
                <span className="font-bold text-xs" style={{ color: d ? 'rgba(255,255,255,0.7)' : '#1F2937' }}>{outputCurrency}</span>
              </div>
            </div>
            <div className={`font-bold ${compact ? 'text-lg' : 'text-xl'}`} style={{ color: d ? '#8fb8cc' : '#14532d' }}>{amountOutput ? formatWithCommas(amountOutput) : '0.00'}</div>
          </div>

        </div>

        {/* Botón Continuar */}
        {showContinueButton && (
          <button
            onClick={handleContinue}
            disabled={!amountInput || !amountOutput}
            className={`w-full rounded-xl font-bold transition-all ${compact ? 'mt-2 py-2.5' : 'mt-4 py-4'} ${
              amountInput && amountOutput ? 'btn-primary-gradient text-white shadow-md' : 'cursor-not-allowed'
            }`}
            style={!(amountInput && amountOutput) ? { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.25)', border: '1px solid rgba(255,255,255,0.08)' } : {}}
          >
            INICIAR OPERACIÓN
          </button>
        )}

        {/* ── Acciones: Usar cupón + Mejorar tasas ── */}
        <div className={`flex items-center ${d ? 'justify-center' : 'justify-center'} gap-2 ${compact ? 'pt-2 pb-0' : 'pt-4 pb-1'}`}>

          {/* Usar cupón */}
          <button
            onClick={() => setCouponOpen(!couponOpen)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-semibold transition-all duration-200"
            style={{
              background: couponApplied ? 'rgba(34,197,94,0.10)' : 'rgba(255,255,255,0.70)',
              border: couponApplied ? '1px solid rgba(34,197,94,0.35)' : '1px solid rgba(13,27,42,0.12)',
              color: couponApplied ? '#4ade80' : 'rgba(55,65,81,0.65)',
            }}
          >
            <Ticket className="w-3 h-3 flex-shrink-0" />
            {couponApplied ? 'Cupón activo' : 'Usar cupón'}
            {couponApplied && <CheckCircle className="w-3 h-3 flex-shrink-0 text-primary-600" />}
          </button>

          {/* Mejorar tasas — solo en personas */}
          {!d && (<><span className="select-none" style={{ color: '#E5E7EB' }}>|</span>
            <a
              href="https://wa.me/51910624404?text=Hola%2C%20quiero%20mejorar%20mis%20tasas%20de%20cambio."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-semibold transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.70)',
                border: '1px solid rgba(13,27,42,0.12)',
                color: 'rgba(55,65,81,0.65)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(34,197,94,0.40)';
                (e.currentTarget as HTMLElement).style.color = '#4ade80';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(13,27,42,0.12)';
                (e.currentTarget as HTMLElement).style.color = 'rgba(55,65,81,0.65)';
              }}
            >
              <svg className="w-3 h-3 flex-shrink-0" fill="#22C55E" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Mejorar TC
            </a>
          </>)}
        </div>

        {/* ── Sección cupón — slide-down ── */}
        <div
          style={{
            maxHeight: couponOpen ? '260px' : '0px',
            overflow: 'hidden',
            transition: 'max-height 0.38s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.28s ease, transform 0.28s ease',
            opacity: couponOpen ? 1 : 0,
            transform: couponOpen ? 'translateY(0)' : 'translateY(-6px)',
          }}
        >
          <div className="px-1 pt-3 pb-2">
            <div className="flex gap-2">
              {/* Campo cupón */}
              <input
                type="text"
                value={couponCode}
                onChange={(e) => handleCouponInput(e.target.value)}
                onPaste={(e) => {
                  e.preventDefault();
                  handleCouponInput(e.clipboardData.getData('text'));
                }}
                placeholder="QORI2026"
                disabled={couponStatus === 'loading' || couponApplied}
                className={`flex-1 px-3 py-2.5 text-sm font-bold tracking-[0.18em] uppercase backdrop-blur-sm rounded-xl border-2 focus:outline-none transition-all disabled:opacity-50 ${d ? 'placeholder-white/20 text-white' : 'placeholder-gray-300 text-gray-900 bg-white/70'}`}
                style={{ fontFamily: 'monospace', background: d ? 'rgba(255,255,255,0.06)' : undefined, borderColor: couponStatus === 'valid' ? (d ? 'rgba(74,104,132,0.6)' : 'rgba(34,197,94,0.5)') : couponStatus === 'invalid' ? 'rgba(239,68,68,0.4)' : d ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.6)' }}
                onFocus={(e) => { if (couponStatus === 'idle') e.currentTarget.style.borderColor = d ? 'rgba(74,104,132,0.6)' : 'rgba(34,197,94,0.5)'; }}
                onBlur={(e)  => { if (couponStatus === 'idle') e.currentTarget.style.borderColor = d ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.6)'; }}
              />
              {/* Botón Aplicar / Quitar */}
              <button
                onClick={couponApplied ? handleRemoveCoupon : handleApplyCoupon}
                disabled={!couponApplied && (!couponCode || couponStatus === 'loading')}
                className="px-4 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                style={{
                  background: couponApplied ? 'rgba(239,68,68,0.08)' : d ? 'linear-gradient(135deg, #8fb8cc 0%, #4A6884 55%, #1e3a50 100%)' : '#16a34a',
                  border: couponApplied ? '2px solid rgba(239,68,68,0.25)' : '2px solid transparent',
                  color: couponApplied ? '#dc2626' : '#fff',
                }}
              >
                {couponStatus === 'loading' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : couponApplied ? (
                  'Quitar'
                ) : (
                  'Aplicar'
                )}
              </button>
            </div>

            {/* Mensaje de estado */}
            {couponMessage && (
              <div
                className="mt-2.5 flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-semibold"
                style={{
                  background: couponStatus === 'valid' ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.07)',
                  color:      couponStatus === 'valid' ? '#15803d' : '#dc2626',
                  border:     couponStatus === 'valid' ? '1px solid rgba(34,197,94,0.20)' : '1px solid rgba(239,68,68,0.18)',
                }}
              >
                {couponStatus === 'valid'
                  ? <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  : <XCircle    className="w-3.5 h-3.5 flex-shrink-0" />}
                {couponMessage}
              </div>
            )}
          </div>
        </div>
        </>
        )}

      </div>
    </div>
  );
}
