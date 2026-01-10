'use client';

import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

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
  const [operationType, setOperationType] = useState<'Compra' | 'Venta'>('Compra');
  const [amountInput, setAmountInput] = useState('');
  const [amountOutput, setAmountOutput] = useState('');
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>(
    initialRates || { compra: 3.750, venta: 3.770 }
  );
  const [isAnimating, setIsAnimating] = useState(false);

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
      <div className="flex rounded-xl overflow-hidden mb-4 shadow-sm">
        <button
          onClick={() => setOperationType('Compra')}
          className={`flex-1 py-3 px-3 font-semibold text-xs transition-all ${
            operationType === 'Compra'
              ? 'bg-secondary text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          Compra: S/ {exchangeRates.compra.toFixed(3)}
        </button>
        <button
          onClick={() => setOperationType('Venta')}
          className={`flex-1 py-3 px-3 font-semibold text-xs transition-all ${
            operationType === 'Venta'
              ? 'bg-secondary text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          Venta: S/ {exchangeRates.venta.toFixed(3)}
        </button>
      </div>

      {/* Calculadora */}
      <div className="space-y-3 mb-4">
        {/* Fila superior: Input */}
        <div className="flex gap-2">
          <div className="flex-1 bg-gray-100 rounded-xl p-3">
            <label className="block text-xs text-gray-700 font-medium mb-1">
              ¿Cuánto envías?
            </label>
            <input
              type="number"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              placeholder="0"
              className="w-full text-2xl font-bold text-gray-900 bg-transparent border-none outline-none placeholder-gray-400"
              step="0.01"
              min="0"
            />
          </div>
          <div className="w-20 bg-secondary rounded-xl p-3 flex items-center justify-center">
            <span className="text-white font-semibold text-xs text-center">
              {inputCurrency === 'USD' ? 'Dólares' : 'Soles'}
            </span>
          </div>
        </div>

        {/* Botón de intercambio */}
        <div className="flex justify-center -my-1 relative z-10">
          <button
            onClick={handleSwapCurrency}
            className={`bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all ${
              isAnimating ? 'rotate-180' : ''
            }`}
            style={{ transition: 'transform 0.3s ease' }}
          >
            <RefreshCw className={`w-4 h-4 text-gray-700 ${isAnimating ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Fila inferior: Output */}
        <div className="flex gap-2">
          <div className="flex-1 bg-gray-100 rounded-xl p-3">
            <label className="block text-xs text-gray-700 font-medium mb-1">
              Entonces recibes
            </label>
            <div className="text-2xl font-bold text-gray-900">
              {amountOutput || '0.00'}
            </div>
          </div>
          <div className="w-20 bg-secondary rounded-xl p-3 flex items-center justify-center">
            <span className="text-white font-semibold text-xs text-center">
              {outputCurrency === 'USD' ? 'Dólares' : 'Soles'}
            </span>
          </div>
        </div>

        {/* Información adicional */}
        {amountOutput && (
          <div className="flex justify-between text-xs text-gray-600 font-medium px-1 pt-1">
            <span>Ahorro estimado: S/ {calculateSavings()}</span>
            <span>TC: {currentRate.toFixed(3)}</span>
          </div>
        )}
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
