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
    <div className="w-full">
      {/* Tabs de Compra/Venta */}
      <div className="flex rounded-xl overflow-hidden mb-6 shadow-sm">
        <button
          onClick={() => setOperationType('Compra')}
          className={`flex-1 py-2 px-2 font-semibold text-base transition-all cursor-pointer ${
            operationType === 'Compra'
              ? 'bg-secondary text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          Compra: S/ {exchangeRates.compra.toFixed(3)}
        </button>
        <button
          onClick={() => setOperationType('Venta')}
          className={`flex-1 py-2 px-2 font-semibold text-base transition-all cursor-pointer ${
            operationType === 'Venta'
              ? 'bg-secondary text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          Venta: S/ {exchangeRates.venta.toFixed(3)}
        </button>
      </div>

      {/* Calculadora */}
      <div className="space-y-4 mb-6">
        {/* Fila superior: Input */}
        <div className="flex gap-2">
          <div
            className="flex-1 bg-gray-100 rounded-xl p-4 cursor-text"
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
              className="block text-base text-gray-700 font-medium mb-2 cursor-text pointer-events-none select-none"
            >
              ¿Cuánto envías?
            </label>
            <input
              id="amount-input"
              type="number"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              placeholder="0"
              className="w-full text-3xl font-bold text-gray-900 bg-transparent border-none outline-none placeholder-gray-400"
              step="0.01"
              min="0"
            />
          </div>
          <div className="w-28 bg-secondary rounded-xl p-4 flex items-center justify-center">
            <span className="text-white font-semibold text-sm text-center">
              {inputCurrency === 'USD' ? 'Dólares' : 'Soles'}
            </span>
          </div>
        </div>

        {/* Botón de intercambio */}
        <div className="flex justify-center -my-2 relative z-10">
          <button
            onClick={handleSwapCurrency}
            className={`bg-white rounded-full p-3 shadow-md hover:shadow-lg transition-all ${
              isAnimating ? 'rotate-180' : ''
            }`}
            style={{ transition: 'transform 0.3s ease' }}
          >
            <RefreshCw className={`w-5 h-5 text-gray-700 ${isAnimating ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Fila inferior: Output */}
        <div className="flex gap-2">
          <div className="flex-1 bg-gray-100 rounded-xl p-4">
            <label className="block text-base text-gray-700 font-medium mb-2">
              Entonces recibes
            </label>
            <div className="text-3xl font-bold text-gray-900">
              {amountOutput || '0.00'}
            </div>
          </div>
          <div className="w-28 bg-secondary rounded-xl p-4 flex items-center justify-center">
            <span className="text-white font-semibold text-base text-center">
              {outputCurrency === 'USD' ? 'Dólares' : 'Soles'}
            </span>
          </div>
        </div>

        {/* Información adicional */}
        <div className={`flex justify-between text-base text-gray-600 font-medium px-1 pt-2 transition-opacity duration-300 ${
          amountOutput ? 'opacity-100' : 'opacity-0'
        }`}>
          <span>Ahorro estimado: S/ {calculateSavings()}</span>
          <span>TC: {currentRate.toFixed(3)}</span>
        </div>

        {/* Checkbox Cupón Promocional */}
        <div className="pt-3 border-t border-gray-200">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={hasCoupon}
              onChange={(e) => setHasCoupon(e.target.checked)}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
            />
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 group-hover:text-primary-600 transition">
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
