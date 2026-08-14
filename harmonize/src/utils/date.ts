/**
 * Helpers de data no fuso LOCAL da clínica.
 *
 * `new Date().toISOString().split('T')[0]` devolve a data em UTC. No Brasil
 * (UTC-3) isso vira o dia seguinte a partir das 21h, fazendo a agenda "pular"
 * de dia no fim do expediente. Todas as datas do app são strings YYYY-MM-DD
 * que representam o dia civil local, então a conversão precisa ser local.
 */

/** Converte um Date para a string YYYY-MM-DD do dia civil local. */
export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Data de hoje (local) como YYYY-MM-DD. */
export function todayISO(): string {
  return toISODate(new Date());
}

/** Hoje deslocado por N dias (local), como YYYY-MM-DD. */
export function addDaysISO(days: number, from: Date = new Date()): string {
  const d = new Date(from);
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

/**
 * Converte YYYY-MM-DD em Date no fuso local (meia-noite local).
 *
 * `new Date('2026-03-10')` é interpretado como UTC pelo JS e volta um dia
 * atrás quando lido com getDate() em fusos negativos.
 */
export function parseISODate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

/** Início (YYYY-MM-01) e fim do mês da data informada, em datas locais. */
export function monthBounds(reference: Date = new Date()): { start: string; end: string } {
  const start = new Date(reference.getFullYear(), reference.getMonth(), 1);
  const end = new Date(reference.getFullYear(), reference.getMonth() + 1, 0);
  return { start: toISODate(start), end: toISODate(end) };
}

/** Verifica se uma data YYYY-MM-DD cai no mês/ano de referência. */
export function isSameMonth(iso: string, reference: Date = new Date()): boolean {
  if (!iso) return false;
  const { start, end } = monthBounds(reference);
  return iso >= start && iso <= end;
}
