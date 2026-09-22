/**
 * Tests for exchangeStore.ts reconnect resync + race condition guard.
 *
 * Tests 1-10 + race-condition guard.
 */

import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// ── Hoisted mocks (must run before imports) ──────────────────────────────────

const mocks = vi.hoisted(() => {
  const connectionStatusCallbacks = new Set<(s: any) => void>();
  const exchangeRatesCallbacks    = new Set<(d: any) => void>();
  const getCurrentRates = vi.fn();

  const socketService = {
    connect:    vi.fn(),
    disconnect: vi.fn(),
    isConnected: vi.fn(() => false),
    onExchangeRatesUpdated: vi.fn((cb: (d: any) => void) => {
      exchangeRatesCallbacks.add(cb);
      return () => exchangeRatesCallbacks.delete(cb);
    }),
    onConnectionStatus: vi.fn((cb: (s: any) => void) => {
      connectionStatusCallbacks.add(cb);
      return () => connectionStatusCallbacks.delete(cb);
    }),
  };

  return { connectionStatusCallbacks, exchangeRatesCallbacks, getCurrentRates, socketService };
});

vi.mock('../lib/services/socketService', () => ({
  socketService: mocks.socketService,
}));

vi.mock('../lib/api/exchange', () => ({
  exchangeApi: {
    getCurrentRates: mocks.getCurrentRates,
    calculateExchange: vi.fn(),
    subscribeToRates: vi.fn(),
  },
}));

// ── Import store AFTER mocks are set up ─────────────────────────────────────

import { useExchangeStore } from '../lib/store/exchangeStore';

// ── Helpers ─────────────────────────────────────────────────────────────────

// Microtask-based flush — works with both real and fake timers.
const flushPromises = () =>
  Promise.resolve()
    .then(() => Promise.resolve())
    .then(() => Promise.resolve());

const TC_OLD = {
  id: 0,
  tipo_compra: 3.359,
  tipo_venta: 3.364,
  fecha_actualizacion: '2026-09-21T20:00:00.000Z',
  updated_by: 0,
};
const TC_NEW = {
  id: 0,
  tipo_compra: 3.358,
  tipo_venta: 3.367,
  fecha_actualizacion: '2026-09-22T17:22:47.000Z',
  updated_by: 0,
};
const TC_NEWEST = {
  id: 0,
  tipo_compra: 3.359,
  tipo_venta: 3.368,
  fecha_actualizacion: '2026-09-22T17:35:15.000Z',
  updated_by: 0,
};

// ── Test lifecycle ────────────────────────────────────────────────────────────

let cleanup: (() => void) | null = null;

beforeEach(() => {
  mocks.getCurrentRates.mockResolvedValue({ success: true, data: TC_NEW });

  useExchangeStore.setState({
    currentRates: null,
    isLoading: false,
    error: null,
    lastUpdated: null,
    isConnected: false,
    connectionError: null,
  });
});

afterEach(async () => {
  // Restore real timers first so flushPromises() works regardless of test state.
  vi.useRealTimers();

  if (cleanup) {
    cleanup();
    cleanup = null;
  }
  await flushPromises();
  mocks.connectionStatusCallbacks.clear();
  mocks.exchangeRatesCallbacks.clear();
  vi.clearAllMocks();
});

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('exchangeStore — TC sync', () => {

  // 1
  it('1: initial fetchRates populates currentRates from API', async () => {
    await useExchangeStore.getState().fetchRates();

    expect(mocks.getCurrentRates).toHaveBeenCalledTimes(1);
    expect(useExchangeStore.getState().currentRates?.tipo_compra).toBe(TC_NEW.tipo_compra);
    expect(useExchangeStore.getState().currentRates?.tipo_venta).toBe(TC_NEW.tipo_venta);
    expect(useExchangeStore.getState().isLoading).toBe(false);
    expect(useExchangeStore.getState().error).toBeNull();
  });

  // 2
  it('2: Socket.IO event updates currentRates', () => {
    cleanup = useExchangeStore.getState().startRateSubscription();

    mocks.exchangeRatesCallbacks.forEach(cb =>
      cb({ compra: TC_NEWEST.tipo_compra, venta: TC_NEWEST.tipo_venta, updated_at: TC_NEWEST.fecha_actualizacion })
    );

    const state = useExchangeStore.getState();
    expect(state.currentRates?.tipo_compra).toBe(TC_NEWEST.tipo_compra);
    expect(state.currentRates?.tipo_venta).toBe(TC_NEWEST.tipo_venta);
    expect(state.currentRates?.fecha_actualizacion).toBe(TC_NEWEST.fecha_actualizacion);
  });

  // 3
  it('3: fallback poll runs when Socket.IO is disconnected', async () => {
    vi.useFakeTimers();
    mocks.getCurrentRates.mockResolvedValue({ success: true, data: TC_NEW });

    cleanup = useExchangeStore.getState().startRateSubscription();

    // Flush the initial fetchRates() promise (microtasks, works with fake timers)
    await flushPromises();
    const callsAfterMount = mocks.getCurrentRates.mock.calls.length;

    // Simulate disconnect → poll should now activate
    useExchangeStore.setState({ isConnected: false });

    // Advance 30s to trigger fallback setInterval callback
    await vi.advanceTimersByTimeAsync(30000);
    await flushPromises();

    expect(mocks.getCurrentRates.mock.calls.length).toBeGreaterThan(callsAfterMount);
  });

  // 4
  it('4: reconnect triggers immediate fetchRates', async () => {
    cleanup = useExchangeStore.getState().startRateSubscription();
    await flushPromises();

    vi.clearAllMocks();
    mocks.getCurrentRates.mockResolvedValue({ success: true, data: TC_NEW });

    mocks.connectionStatusCallbacks.forEach(cb => cb({ connected: true, reconnected: true }));
    await flushPromises();

    expect(mocks.getCurrentRates).toHaveBeenCalledTimes(1);
  });

  // 5
  it('5: TC changed during disconnect → widget gets latest TC after reconnect', async () => {
    useExchangeStore.setState({ currentRates: TC_OLD });
    mocks.getCurrentRates.mockResolvedValueOnce({ success: true, data: TC_NEW });

    cleanup = useExchangeStore.getState().startRateSubscription();

    mocks.connectionStatusCallbacks.forEach(cb => cb({ connected: true, reconnected: true }));
    await flushPromises();

    const state = useExchangeStore.getState();
    expect(state.currentRates?.tipo_compra).toBe(TC_NEW.tipo_compra);
    expect(state.currentRates?.tipo_venta).toBe(TC_NEW.tipo_venta);
    expect(state.currentRates?.fecha_actualizacion).toBe(TC_NEW.fecha_actualizacion);
  });

  // 6
  it('6: reconnect does not cause an infinite loop', async () => {
    cleanup = useExchangeStore.getState().startRateSubscription();
    await flushPromises();

    vi.clearAllMocks();
    mocks.getCurrentRates.mockResolvedValue({ success: true, data: TC_NEW });

    mocks.connectionStatusCallbacks.forEach(cb => cb({ connected: true, reconnected: true }));
    await flushPromises();

    // socketService.connect must NOT have been called again (no re-subscribe loop)
    expect(mocks.socketService.connect).not.toHaveBeenCalled();
    // fetchRates called exactly once — not recursively
    expect(mocks.getCurrentRates).toHaveBeenCalledTimes(1);
  });

  // 7
  it('7: initial connect (not reconnect) does not trigger duplicate fetchRates', async () => {
    cleanup = useExchangeStore.getState().startRateSubscription();
    await flushPromises();

    vi.clearAllMocks();
    mocks.getCurrentRates.mockResolvedValue({ success: true, data: TC_NEW });

    // Normal connect event — no reconnected flag
    mocks.connectionStatusCallbacks.forEach(cb => cb({ connected: true }));
    await flushPromises();

    // fetchRates must NOT have been called (only the initial one, already cleared)
    expect(mocks.getCurrentRates).not.toHaveBeenCalled();
  });

  // 8
  it('8: multiple reconnects → exactly one resync each time', async () => {
    cleanup = useExchangeStore.getState().startRateSubscription();
    await flushPromises();

    vi.clearAllMocks();
    mocks.getCurrentRates.mockResolvedValue({ success: true, data: TC_NEW });

    for (let i = 0; i < 3; i++) {
      mocks.connectionStatusCallbacks.forEach(cb => cb({ connected: true, reconnected: true }));
      await flushPromises();
    }

    expect(mocks.getCurrentRates).toHaveBeenCalledTimes(3);
  });

  // 9
  it('9: fetch error during resync preserves last valid TC and keeps socket connected', async () => {
    useExchangeStore.setState({ currentRates: TC_NEW, isConnected: true });
    mocks.getCurrentRates.mockRejectedValueOnce(new Error('Network timeout'));

    cleanup = useExchangeStore.getState().startRateSubscription();

    mocks.connectionStatusCallbacks.forEach(cb => cb({ connected: true, reconnected: true }));
    await flushPromises();

    const state = useExchangeStore.getState();
    expect(state.currentRates?.tipo_compra).toBe(TC_NEW.tipo_compra);
    expect(state.currentRates?.tipo_venta).toBe(TC_NEW.tipo_venta);
    expect(state.isLoading).toBe(false);
    expect(state.isConnected).toBe(true);
  });

  // 10
  it('10: Socket.IO events continue arriving normally after reconnect resync', async () => {
    cleanup = useExchangeStore.getState().startRateSubscription();
    await flushPromises();

    mocks.connectionStatusCallbacks.forEach(cb => cb({ connected: true, reconnected: true }));
    await flushPromises();

    mocks.exchangeRatesCallbacks.forEach(cb =>
      cb({ compra: TC_NEWEST.tipo_compra, venta: TC_NEWEST.tipo_venta, updated_at: TC_NEWEST.fecha_actualizacion })
    );

    const state = useExchangeStore.getState();
    expect(state.currentRates?.tipo_compra).toBe(TC_NEWEST.tipo_compra);
    expect(state.currentRates?.tipo_venta).toBe(TC_NEWEST.tipo_venta);
  });

});

// ── Race condition guard ──────────────────────────────────────────────────────

describe('exchangeStore — race condition guard (timestamp-based)', () => {

  it('fetchRates does not overwrite a more recent Socket.IO TC', async () => {
    useExchangeStore.setState({ currentRates: TC_NEWEST });
    mocks.getCurrentRates.mockResolvedValueOnce({ success: true, data: TC_NEW });

    await useExchangeStore.getState().fetchRates();

    const state = useExchangeStore.getState();
    expect(state.currentRates?.tipo_compra).toBe(TC_NEWEST.tipo_compra);
    expect(state.currentRates?.tipo_venta).toBe(TC_NEWEST.tipo_venta);
    expect(state.currentRates?.fecha_actualizacion).toBe(TC_NEWEST.fecha_actualizacion);
    expect(state.isLoading).toBe(false);
  });

  it('fetchRates applies its data when there is no current TC', async () => {
    expect(useExchangeStore.getState().currentRates).toBeNull();
    mocks.getCurrentRates.mockResolvedValueOnce({ success: true, data: TC_NEW });

    await useExchangeStore.getState().fetchRates();

    expect(useExchangeStore.getState().currentRates?.tipo_compra).toBe(TC_NEW.tipo_compra);
  });

  it('fetchRates applies its data when it is newer than current TC', async () => {
    useExchangeStore.setState({ currentRates: TC_OLD });
    mocks.getCurrentRates.mockResolvedValueOnce({ success: true, data: TC_NEW });

    await useExchangeStore.getState().fetchRates();

    expect(useExchangeStore.getState().currentRates?.fecha_actualizacion).toBe(TC_NEW.fecha_actualizacion);
  });

  it('fetchRates applies equal-timestamp data (idempotent update)', async () => {
    useExchangeStore.setState({ currentRates: TC_NEW });
    mocks.getCurrentRates.mockResolvedValueOnce({ success: true, data: TC_NEW });

    await useExchangeStore.getState().fetchRates();

    expect(useExchangeStore.getState().currentRates?.tipo_compra).toBe(TC_NEW.tipo_compra);
    expect(useExchangeStore.getState().isLoading).toBe(false);
  });

});
