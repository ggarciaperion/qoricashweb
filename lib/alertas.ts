import { Redis } from '@upstash/redis';

export interface AlertaTC {
  id: string;
  userId: number;
  email: string;
  nombre: string;
  tipo: 'sobre' | 'bajo';        // 'sobre' = when TC goes above, 'bajo' = when TC goes below
  valor: number;                  // threshold
  moneda: 'compra' | 'venta';    // which rate to compare
  activa: boolean;
  notificada: boolean;
  fecha: string;
}

const REDIS_KEY = 'qoricash:alertas';

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

export async function markAlertasNotificadas(ids: string[]): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  const current = await getAlertas();
  const updated = current.map((a) =>
    ids.includes(a.id) ? { ...a, activa: false, notificada: true } : a
  );
  await redis.set(REDIS_KEY, updated);
}
