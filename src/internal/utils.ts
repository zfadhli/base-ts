/**
 * Internal utilities — not part of the public API.
 */

/**
 * Returns a greeting for the given name.
 * @internal
 */
export function greet(name: string): string {
  return `Hello, ${name}!`
}

/**
 * Capitalizes the first letter of a string.
 * @internal
 */
export function capitalize(str: string): string {
  if (str.length === 0) return str
  return str[0]?.toUpperCase() + str.slice(1)
}

/**
 * Returns an array of numbers from 0 to end (exclusive).
 * @internal
 */
export function range(end: number): number[] {
  return Array.from({ length: end }, (_, i) => i)
}

/**
 * Returns the sum of two numbers.
 * @internal
 */
export function sum(a: number, b: number): number {
  return a + b
}
