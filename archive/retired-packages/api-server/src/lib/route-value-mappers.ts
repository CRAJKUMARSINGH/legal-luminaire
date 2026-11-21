/**
 * route-value-mappers.ts
 *
 * Utility helpers that normalise values coming in from request bodies
 * before they are written to the database.
 *
 * Drizzle's SQLite/Postgres date columns expect a plain "YYYY-MM-DD" string,
 * and numeric columns backed by TEXT (for precision) expect a string.
 * These helpers coerce the various shapes the Zod parsers may produce.
 */

/**
 * Accepts a Date object, an ISO string, or undefined/null.
 * Returns a "YYYY-MM-DD" string, or undefined when the input is absent.
 */
export function toDateOnlyString(
  value: Date | string | null | undefined
): string | undefined {
  if (value === null || value === undefined) return undefined;
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  // Already a string — strip any time component if present
  return (value as string).slice(0, 10);
}

/**
 * Accepts a number, a numeric string, or undefined/null.
 * Returns a plain string representation, or undefined when the input is absent.
 */
export function toNumericString(
  value: number | string | null | undefined
): string | undefined {
  if (value === null || value === undefined) return undefined;
  return String(value);
}
