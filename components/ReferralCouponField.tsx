'use client';

import { useState } from 'react';
import { Tag, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface ReferralCouponFieldProps {
  showCheckbox?: boolean;
  initialShowField?: boolean;
  operationType?: 'Compra' | 'Venta';
  onCodeChange?: (code: string, isValid: boolean) => void;
  onValidationComplete?: (isValid: boolean, discount: number) => void;
}

export default function ReferralCouponField({
  showCheckbox = true,
  initialShowField = false,
  operationType = 'Compra',
  onCodeChange,
  onValidationComplete
}: ReferralCouponFieldProps) {
  const [showField, setShowField] = useState(initialShowField);
  const [code, setCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validation, setValidation] = useState<{
    isValid: boolean;
    message: string;
  } | null>(null);

  const handleCheckboxChange = (checked: boolean) => {
    setShowField(checked);
    if (!checked) {
      setCode('');
      setValidation(null);
      onCodeChange?.('', false);
      onValidationComplete?.(false, 0);
    }
  };

  const handleCodeChange = (value: string) => {
    const upperValue = value.toUpperCase();
    setCode(upperValue);
    setValidation(null);
    onCodeChange?.(upperValue, false);
  };

  const handleValidate = async () => {
    if (code.length !== 6) {
      setValidation({ isValid: false, message: 'El código debe tener 6 caracteres' });
      onValidationComplete?.(false, 0);
      return;
    }

    setIsValidating(true);

    try {
      // Llamar al API real de validación
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://app.qoricash.pe'}/api/referrals/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          code: code.toUpperCase()
        })
      });

      const data = await response.json();

      if (data.success && data.is_valid) {
        // Código válido
        setValidation({
          isValid: true,
          message: data.message || '¡Código aplicado! Beneficio de 30 pips en el tipo de cambio'
        });
        onValidationComplete?.(true, 0.003);
      } else {
        // Código inválido o ya usado
        setValidation({
          isValid: false,
          message: data.message || 'Código inválido o ya utilizado'
        });
        onValidationComplete?.(false, 0);
      }
    } catch (error) {
      console.error('Error validando código de referido:', error);
      setValidation({
        isValid: false,
        message: 'Error al validar el código. Intenta nuevamente.'
      });
      onValidationComplete?.(false, 0);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Checkbox */}
      {showCheckbox && (
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={showField}
            onChange={(e) => handleCheckboxChange(e.target.checked)}
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
          />
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 group-hover:text-primary-600 transition">
            <Tag className="w-4 h-4" />
            <span>Tengo un cupón promocional</span>
          </div>
        </label>
      )}

      {/* Coupon Field */}
      {showField && (
        <div className="bg-gradient-to-r from-green-50 to-primary-50 border-2 border-primary-300 rounded-xl p-4">
          <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <Tag className="w-4 h-4 text-primary-600" />
            Código de Cupón
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              placeholder="Ej: ABC123"
              maxLength={6}
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition uppercase font-mono text-lg tracking-wider"
              disabled={isValidating || validation?.isValid}
            />
            <button
              onClick={handleValidate}
              disabled={code.length !== 6 || isValidating || validation?.isValid}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isValidating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Validando...
                </>
              ) : validation?.isValid ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Aplicado
                </>
              ) : (
                'Aplicar'
              )}
            </button>
          </div>

          {/* Validation Message */}
          {validation && (
            <div className={`mt-3 p-3 rounded-lg flex items-start gap-2 ${
              validation.isValid
                ? 'bg-green-100 text-green-800 border border-green-300'
                : 'bg-red-100 text-red-800 border border-red-300'
            }`}>
              {validation.isValid ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              )}
              <span className="text-sm font-medium">{validation.message}</span>
            </div>
          )}

          {/* Info Text */}
          {!validation && (
            <p className="mt-3 text-xs text-gray-600">
              Ingresa el código de 6 caracteres que recibiste de un amigo o en una promoción.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
