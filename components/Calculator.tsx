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
    <div className="w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-5">
      {/* Tabs de Compra/Venta */}
      <div className="grid grid-cols-2 gap-2 mb-5 bg-gray-50 p-1.5 rounded-xl">
        <button
          onClick={() => setOperationType('Compra')}
          className={`py-2.5 px-3 font-bold text-sm rounded-lg transition-all ${
            operationType === 'Compra'
              ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md'
              : 'text-gray-600 hover:text-gray-900 hover:bg-white'
          }`}
        >
          <div className="text-xs font-medium opacity-90 mb-0.5">Compra</div>
          <div className="text-base font-bold">S/ {exchangeRates.compra.toFixed(3)}</div>
        </button>
        <button
          onClick={() => setOperationType('Venta')}
          className={`py-2.5 px-3 font-bold text-sm rounded-lg transition-all ${
            operationType === 'Venta'
              ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md'
              : 'text-gray-600 hover:text-gray-900 hover:bg-white'
          }`}
        >
          <div className="text-xs font-medium opacity-90 mb-0.5">Venta</div>
          <div className="text-base font-bold">S/ {exchangeRates.venta.toFixed(3)}</div>
        </button>
      </div>

      {/* Calculadora */}
      <div className="space-y-3">
        {/* Fila superior: Input */}
        <div className="flex gap-2">
          <div
            className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-3 border border-gray-200 hover:border-primary-300 transition-colors cursor-text"
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
              className="block text-xs text-gray-600 font-semibold mb-1.5 cursor-text pointer-events-none select-none uppercase tracking-wide"
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
          <div className="w-20 bg-gradient-to-br from-secondary to-secondary-700 rounded-xl p-3 flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-xs text-center leading-tight">
              {inputCurrency === 'USD' ? 'USD' : 'PEN'}
            </span>
          </div>
        </div>

        {/* Botón de intercambio */}
        <div className="flex justify-center -my-1.5 relative z-10">
          <button
            onClick={handleSwapCurrency}
            className={`bg-white border-2 border-gray-200 rounded-full p-2 shadow-md hover:shadow-lg hover:border-primary-400 hover:bg-primary-50 transition-all ${
              isAnimating ? 'rotate-180' : ''
            }`}
            style={{ transition: 'transform 0.3s ease' }}
          >
            <RefreshCw className={`w-4 h-4 text-primary-600 ${isAnimating ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Fila inferior: Output */}
        <div className="flex gap-2">
          <div className="flex-1 bg-gradient-to-br from-primary-50 to-primary-100/30 rounded-xl p-3 border border-primary-200">
            <label className="block text-xs text-primary-700 font-semibold mb-1.5 uppercase tracking-wide">
              Recibes
            </label>
            <div className="text-2xl font-bold text-primary-900">
              {amountOutput || '0.00'}
            </div>
          </div>
          <div className="w-20 bg-gradient-to-br from-secondary to-secondary-700 rounded-xl p-3 flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-xs text-center leading-tight">
              {outputCurrency === 'USD' ? 'USD' : 'PEN'}
            </span>
          </div>
        </div>

        {/* Información adicional */}
        <div className={`flex justify-between text-xs text-gray-600 font-medium px-1 pt-1 transition-opacity duration-300 ${
          amountOutput ? 'opacity-100' : 'opacity-0'
        }`}>
          <span className="flex items-center gap-1">
            <span className="text-green-600">💰</span>
            Ahorro: S/ {calculateSavings()}
          </span>
          <span className="bg-gray-100 px-2 py-0.5 rounded-md font-bold">TC: {currentRate.toFixed(3)}</span>
        </div>

        {/* Checkbox Cupón Promocional */}
        <div className="pt-2 border-t border-gray-200">
          <label className="flex items-center gap-2 cursor-pointer group hover:bg-gray-50 p-2 rounded-lg transition-colors">
            <input
              type="checkbox"
              checked={hasCoupon}
              onChange={(e) => setHasCoupon(e.target.checked)}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
            />
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 group-hover:text-primary-600 transition">
              <Tag className="w-3.5 h-3.5" />
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
