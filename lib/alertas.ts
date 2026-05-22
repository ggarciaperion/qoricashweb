import { Redis } from '@upstash/redis';

export interface AlertaTC {
  id: string;
  userId?: number;               // undefined for prospectos (non-registered users)
  email: string;
  nombre: string;
  tipo: 'sobre' | 'bajo';        // 'sobre' = when TC goes above, 'bajo' = when TC goes below
  valor: number;                  // threshold
  moneda: 'compra' | 'venta';    // which rate to compare
  activa: boolean;
  notificada: boolean;
  notificada_at?: string;        // ISO timestamp when email was successfully sent
  tc_disparado?: number;         // TC value that triggered the alert
  fecha: string;
  esProspecto?: boolean;         // true = user was not registered when creating the alert
}

export interface LastCheckInfo {
  at: string;       // ISO timestamp
  compra: number;
  venta: number;
  checked: number;
  triggered: number;
  sent: number;
}

const REDIS_KEY       = 'qoricash:alertas';
const LAST_CHECK_KEY  = 'qoricash:alertas:lastCheck';

function getRedis(): Redis | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return null;
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

export async function getAlertas(): Promise<AlertaTC[]> {
  const redis = getRedis();
  if (!redis) return [];
  try {
    return (await redis.get<AlertaTC[]>(REDIS_KEY)) ?? [];
  } catch {
    return [];
  }
}

export async function getAlertasByUser(userId: number): Promise<AlertaTC[]> {
  const all = await getAlertas();
  return all.filter((a) => a.userId === userId);
}

export async function addAlerta(data: Omit<AlertaTC, 'id' | 'fecha' | 'activa' | 'notificada'>): Promise<AlertaTC> {
  const redis = getRedis();
  const alerta: AlertaTC = {
    ...data,
    id: Date.now().toString(),
    fecha: new Date().toISOString(),
    activa: true,
    notificada: false,
  };
  if (!redis) return alerta;
  const current = await getAlertas();
  await redis.set(REDIS_KEY, [alerta, ...current]);
  return alerta;
}

export async function deleteAlerta(id: string, userId: number): Promise<boolean> {
  const redis = getRedis();
  if (!redis) return false;
  const current = await getAlertas();
  const updated = current.filter((a) => !(a.id === id && a.userId === userId));
  if (updated.length === current.length) return false;
  await redis.set(REDIS_KEY, updated);
  return true;
}

export async function markAlertasNotificadas(
  ids: string[],
  extra?: { notificada_at?: string; tc_disparado?: number }
): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  const current = await getAlertas();
  const updated = current.map((a) =>
    ids.includes(a.id)
      ? {
          ...a,
          activa: false,
          notificada: true,
          notificada_at: extra?.notificada_at ?? new Date().toISOString(),
          ...(extra?.tc_disparado !== undefined ? { tc_disparado: extra.tc_disparado } : {}),
        }
      : a
  );
  await redis.set(REDIS_KEY, updated);
}

export async function updateLastCheck(info: LastCheckInfo): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  await redis.set(LAST_CHECK_KEY, info);
}

export async function getLastCheck(): Promise<LastCheckInfo | null> {
  const redis = getRedis();
  if (!redis) return null;
  try {
    return await redis.get<LastCheckInfo>(LAST_CHECK_KEY);
  } catch {
    return null;
  }
}
