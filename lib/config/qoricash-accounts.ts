/**
 * Cuentas bancarias oficiales de QoriCash SAC — Fuente única de verdad.
 * RUC: 20615113698
 *
 * Para actualizar las cuentas, modificar SOLO este archivo.
 * Todos los demás módulos (nueva-operacion, etc.) importan desde aquí.
 */

export const QORICASH_RUC = '20615113698';
export const QORICASH_TITULAR = 'QoriCash SAC';

export interface QoricashAccount {
  banco: string;
  tipo: string;
  numero: string;
  cci: string;
  titular: string;
  ruc: string;
  useCCI?: boolean;
}

// Estructura: { 'BANCO': { '$' | 'S/': QoricashAccount } }
export const QORICASH_ACCOUNTS: Record<string, Record<string, QoricashAccount>> = {
  BCP: {
    $: {
      banco: 'BCP',
      tipo: 'Cuenta Corriente USD',
      numero: '1917357790119',
      cci: '00219100735779011959',
      titular: QORICASH_TITULAR,
      ruc: QORICASH_RUC,
    },
    'S/': {
      banco: 'BCP',
      tipo: 'Cuenta Corriente S/',
      numero: '1937353150041',
      cci: '00219300735315004118',
      titular: QORICASH_TITULAR,
      ruc: QORICASH_RUC,
    },
  },
  INTERBANK: {
    $: {
      banco: 'Interbank',
      tipo: 'Cuenta Corriente USD',
      numero: '200-3007757589',
      cci: '00320000300775758939',
      titular: QORICASH_TITULAR,
      ruc: QORICASH_RUC,
    },
    'S/': {
      banco: 'Interbank',
      tipo: 'Cuenta Corriente S/',
      numero: '200-3007757571',
      cci: '00320000300775757137',
      titular: QORICASH_TITULAR,
      ruc: QORICASH_RUC,
    },
  },
};

/**
 * Bancos de clientes que no tienen cuenta directa en QoriCash.
 * Para estos se usa el CCI de Interbank como fallback.
 */
export const FALLBACK_BANKS = ['BBVA', 'SCOTIABANK', 'PICHINCHA', 'BANBIF', 'OTROS'];

const FALLBACK: Record<string, QoricashAccount> = {
  $: {
    banco: 'Interbank (CCI)',
    tipo: 'Cuenta Corriente USD',
    numero: '',
    cci: '00320000300775758939',
    titular: QORICASH_TITULAR,
    ruc: QORICASH_RUC,
    useCCI: true,
  },
  'S/': {
    banco: 'Interbank (CCI)',
    tipo: 'Cuenta Corriente S/',
    numero: '',
    cci: '00320000300775757137',
    titular: QORICASH_TITULAR,
    ruc: QORICASH_RUC,
    useCCI: true,
  },
};

/**
 * Retorna la cuenta de QoriCash a la que el cliente debe transferir.
 *
 * @param clientBank - Banco normalizado del cliente (ej: 'BCP', 'BBVA')
 * @param currency   - Moneda: '$' para dólares, 'S/' para soles
 */
export function getQoricashAccount(
  clientBank: string,
  currency: string
): QoricashAccount | null {
  if (FALLBACK_BANKS.includes(clientBank)) {
    return FALLBACK[currency] ?? null;
  }
  return QORICASH_ACCOUNTS[clientBank]?.[currency] ?? null;
}
