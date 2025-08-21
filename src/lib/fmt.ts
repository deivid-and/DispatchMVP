/**
 * Format currency with commas and dollar sign
 */
export function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString()}`;
}

/**
 * Format RPM (Rate Per Mile) to 2 decimal places
 */
export function formatRPM(rpm: number): string {
  return `$${rpm.toFixed(2)}`;
}

/**
 * Format miles with commas
 */
export function formatMiles(miles: number): string {
  return miles.toLocaleString();
}
