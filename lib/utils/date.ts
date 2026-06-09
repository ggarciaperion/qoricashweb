/**
 * Parsear fecha de forma segura — compatible con Safari/iOS.
 *
 * El backend almacena datetimes en hora de Lima (America/Lima, UTC-5) como valores
 * naive (sin offset). Al serializar a JSON quedan como "2024-01-01 12:00:00" o
 * "2024-01-01T12:00:00" sin indicador de zona.
 *
 * Si añadimos "Z" (UTC) estaríamos desfasando 5 horas (Lima 10:00 → UTC 10:00 →
 * Lima display 05:00). Por eso se añade "-05:00" (Peru offset fijo) para que el
 * Date interno sea correcto y todas las funciones de display con
 * timeZone:'America/Lima' muestren la hora peruana exacta.
 *
 * Strings que ya llevan offset (Z, +HH:MM, -HH:MM) NO se modifican.
 */
export function parseSafeDate(dateString: string | null | undefined): Date | null {
  if (!dateString) return null;
  // Normalizar: espacio → T
  const normalized = dateString.replace(' ', 'T');
  // Si ya tiene indicador de zona (Z o ±HH:MM al final), no modificar
  const hasOffset = /[Z]$|[+-]\d{2}:\d{2}$/.test(normalized);
  const withTZ = hasOffset ? normalized : normalized + '-05:00';
  const d = new Date(withTZ);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Formatear fecha para mostrar en la UI, siempre en hora de Lima (America/Lima).
 */
export function formatSafeDate(
  dateString: string | null | undefined,
  options?: Intl.DateTimeFormatOptions
): string {
  const d = parseSafeDate(dateString);
  if (!d) return '—';
  return d.toLocaleDateString('es-PE', options ?? {
    timeZone: 'America/Lima',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
