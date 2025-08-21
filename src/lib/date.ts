/**
 * Format date from ISO string to MM/DD/YY format
 */
export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2);
  return `${month}/${day}/${year}`;
}

/**
 * Format date from ISO string to MM/DD/YY format for display
 */
export function formatDisplayDate(isoDate: string): string {
  return isoDate.slice(5).replace("-", "/");
}

/**
 * Get today's date in ISO format (YYYY-MM-DD)
 */
export function getTodayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Convert date from ISO format to MM/DD/YY format
 */
export function isoToDisplayDate(isoDate: string): string {
  return isoDate.replace(/-/g, "/");
}
