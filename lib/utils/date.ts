/**
 * Parsear fecha de forma segura — compatible con Safari/iOS.
 *
 * Safari no acepta el formato Python "2024-01-01 12:00:00" (espacio en lugar de T)
 * ni "2024-01-01T12:00:00" sin zona horaria explícita en versiones antiguas.
 * Esta función normaliza el string antes de crear el objeto Date.
 */
export function parseSafeDate(dateString: string | null | undefined): Date | null {
  if (!dateString) return null;
  // Normalizar: espacio → T, y agregar Z si falta zona horaria
  const normalized = dateString
    .replace(' ', 'T')
    .replace(/(\d{2}:\d{2}:\d{2})$/, '$1Z');
  const d = new Date(normalized);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Formatear fecha para mostrar en la UI, con fallback seguro para Safari.
 */
export function formatSafeDate(
  dateString: string | null | undefined,
  options?: Intl.DateTimeFormatOptions
): string {
  const d = parseSafeDate(dateString);
  if (!d) return '—';
  return d.toLocaleDateString('es-PE', options ?? {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
