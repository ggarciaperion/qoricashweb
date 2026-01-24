'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Tag } from 'lucide-react';
import { useExchangeStore } from '@/lib/store/exchangeStore';
import { useReferralStore } from '@/lib/store/referralStore';

interface ExchangeRates {
  compra: number;
  venta: number;
}

interface CalculatorProps {
  initialRates?: ExchangeRates;
  showContinueButton?: boolean;
  onOperationReady?: (operationType: 'Compra' | 'Venta', amountUSD: string, exchangeRate: number) => void;
}

export default function Calculator({
  initialRates,
  showContinueButton = false,
  onOperationReady
}: CalculatorProps) {
  const { currentRates: liveRates, fetchRates, isConnected } = useExchangeStore();
  const { hasCoupon, setHasCoupon } = useReferralStore();
  const [operationType, setOperationType] = useState<'Compra' | 'Venta'>('Compra');
  const [amountInput, setAmountInput] = useState('');
  const [amountOutput, setAmountOutput] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  // Usar tipos de cambio en tiempo real del store
  const exchangeRates: ExchangeRates = liveRates
    ? {
        compra: liveRates.tipo_compra,
        venta: liveRates.tipo_venta
      }
    : initialRates || { compra: 3.750, venta: 3.770 };

  // Inicializar conexión a tipos de cambio en tiempo real
  useEffect(() => {
    // Fetch initial rates
    fetchRates();

    // Start live rate subscription
    const unsubscribe = useExchangeStore.getState().startRateSubscription();

    return () => {
      unsubscribe();
    };
  }, []);

  const inputCurrency = operationType === 'Compra' ? 'USD' : 'PEN';
  const outputCurrency = operationType === 'Compra' ? 'PEN' : 'USD';

  // Recalculate when input or operation type changes
  useEffect(() => {
    calculateAmount();
  }, [amountInput, operationType, exchangeRates]);

  const calculateAmount = () => {
    if (!amountInput || !exchangeRates) {
      setAmountOutput('');
      return;
    }

    const amount = parseFloat(amountInput);
    if (isNaN(amount) || amount <= 0) {
      setAmountOutput('');
      return;
    }

    if (operationType === 'Compra') {
      // Comprando USD: USD × tipo_compra = PEN
      const pen = (amount * exchangeRates.compra).toFixed(2);
      setAmountOutput(pen);
    } else {
      // Vendiendo USD: PEN ÷ tipo_venta = USD
      const usd = (amount / exchangeRates.venta).toFixed(2);
      setAmountOutput(usd);
    }
  };

  const handleSwapCurrency = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    setOperationType(operationType === 'Compra' ? 'Venta' : 'Compra');
  };

  const handleContinue = () => {
    if (onOperationReady && amountInput && exchangeRates) {
      const rate = operationType === 'Compra' ? exchangeRates.compra : exchangeRates.venta;
      onOperationReady(operationType, amountInput, rate);
    }
  };

  const currentRate = exchangeRates
    ? operationType === 'Compra'
      ? exchangeRates.compra
      : exchangeRates.venta
    : 0;

  const calculateSavings = () => {
    if (!amountOutput || !exchangeRates) return '0.00';
    const amount = parseFloat(amountOutput);
    return (amount * 0.03).toFixed(2);
  };

  return (
    <div className="w-full bg-transparent rounded-2xl p-6">
      {/* Tabs de Compra/Venta */}
      <div className="grid grid-cols-2 gap-2 mb-6 bg-white/40 backdrop-blur-sm p-1.5 rounded-xl shadow-inner">
        <button
          onClick={() => setOperationType('Compra')}
          className={`py-3 px-4 font-bold text-sm rounded-lg transition-all ${
            operationType === 'Compra'
              ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg transform scale-[1.02]'
              : 'text-gray-700 hover:text-gray-900 hover:bg-white/60'
          }`}
        >
          <div className="text-xs font-medium opacity-90 mb-0.5">Compra</div>
          <div className="text-base font-bold">S/ {exchangeRates.compra.toFixed(3)}</div>
        </button>
        <button
          onClick={() => setOperationType('Venta')}
          className={`py-3 px-4 font-bold text-sm rounded-lg transition-all ${
            operationType === 'Venta'
              ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg transform scale-[1.02]'
              : 'text-gray-700 hover:text-gray-900 hover:bg-white/60'
          }`}
        >
          <div className="text-xs font-medium opacity-90 mb-0.5">Venta</div>
          <div className="text-base font-bold">S/ {exchangeRates.venta.toFixed(3)}</div>
        </button>
      </div>

      {/* Calculadora */}
      <div className="space-y-3">
        {/* Fila superior: Input */}
        <div className="flex gap-3">
          <div
            className="flex-1 bg-white/70 backdrop-blur-sm rounded-xl p-4 border-2 border-white/60 hover:border-primary-400 transition-all cursor-text shadow-sm hover:shadow-md"
            onClick={(e) => {
              const input = document.getElementById('amount-input') as HTMLInputElement;
              if (input) {
                input.focus();
                e.preventDefault();
              }
            }}
          >
            <label
              htmlFor="amount-input"
              className="block text-xs text-gray-700 font-bold mb-2 cursor-text pointer-events-none select-none uppercase tracking-wider"
            >
              Envías
            </label>
            <input
              id="amount-input"
              type="number"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              placeholder="0.00"
              className="w-full text-2xl font-bold text-gray-900 bg-transparent border-none outline-none placeholder-gray-400"
              step="0.01"
              min="0"
            />
          </div>
          <div className="w-24 bg-gradient-to-br from-secondary to-secondary-700 rounded-xl p-3 flex flex-col items-center justify-center shadow-lg gap-1.5">
            <span className="text-2xl leading-none">
              {inputCurrency === 'USD' ? '🇺🇸' : '🇵🇪'}
            </span>
            <span className="text-white font-bold text-xs text-center leading-tight">
              {inputCurrency === 'USD' ? 'USD' : 'PEN'}
            </span>
          </div>
        </div>

        {/* Botón de intercambio */}
        <div className="flex justify-center -my-2 relative z-10">
          <button
            onClick={handleSwapCurrency}
            className={`bg-white/90 backdrop-blur-sm border-2 border-white/80 rounded-full p-2.5 shadow-lg hover:shadow-xl hover:border-primary-400 hover:bg-primary-50 transition-all ${
              isAnimating ? 'rotate-180' : ''
            }`}
            style={{ transition: 'transform 0.3s ease' }}
          >
            <RefreshCw className={`w-5 h-5 text-primary-600 ${isAnimating ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Fila inferior: Output */}
        <div className="flex gap-3">
          <div className="flex-1 bg-gradient-to-br from-primary-50/90 to-primary-100/70 backdrop-blur-sm rounded-xl p-4 border-2 border-primary-200 shadow-sm">
            <label className="block text-xs text-primary-800 font-bold mb-2 uppercase tracking-wider">
              Recibes
            </label>
            <div className="text-2xl font-bold text-primary-900">
              {amountOutput || '0.00'}
            </div>
          </div>
          <div className="w-24 bg-gradient-to-br from-secondary to-secondary-700 rounded-xl p-3 flex flex-col items-center justify-center shadow-lg gap-1.5">
            <span className="text-2xl leading-none">
              {outputCurrency === 'USD' ? '🇺🇸' : '🇵🇪'}
            </span>
            <span className="text-white font-bold text-xs text-center leading-tight">
              {outputCurrency === 'USD' ? 'USD' : 'PEN'}
            </span>
          </div>
        </div>

        {/* Información adicional */}
        <div className={`flex justify-between text-xs font-semibold px-1 pt-2 transition-opacity duration-300 ${
          amountOutput ? 'opacity-100' : 'opacity-0'
        }`}>
          <span className="flex items-center gap-1.5 text-green-700 bg-green-50/80 backdrop-blur-sm px-2.5 py-1 rounded-lg">
            <span>💰</span>
            Ahorro: S/ {calculateSavings()}
          </span>
          <span className="bg-white/70 backdrop-blur-sm px-3 py-1 rounded-lg font-bold text-gray-800 border border-white/60">TC: {currentRate.toFixed(3)}</span>
        </div>

        {/* Checkbox Cupón Promocional */}
        <div className="pt-3 border-t border-white/40">
          <label className="flex items-center gap-2.5 cursor-pointer group hover:bg-white/40 p-2.5 rounded-lg transition-all">
            <input
              type="checkbox"
              checked={hasCoupon}
              onChange={(e) => setHasCoupon(e.target.checked)}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
            />
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 group-hover:text-primary-700 transition">
              <Tag className="w-4 h-4" />
              <span>Tengo un cupón promocional</span>
            </div>
          </label>
        </div>
      </div>

      {/* Botón Continuar (opcional) */}
      {showContinueButton && (
        <button
          onClick={handleContinue}
          disabled={!amountInput || !amountOutput}
          className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-md ${
            amountInput && amountOutput
              ? 'bg-success hover:bg-success-600 hover:shadow-lg'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          INICIAR OPERACIÓN
        </button>
      )}
    </div>
  );
}
